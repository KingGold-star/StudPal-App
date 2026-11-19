// supabase/functions/generate-speech/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { decode, encode } from 'https://deno.land/std@0.177.0/encoding/base64.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// High-speed In-Memory Edge Cache for instant response (~10ms)
const edgeAudioCache = new Map<string, { audioBase64: string; mimeType: string }>();
const MAX_CACHE_ENTRIES = 250;

// Helper to replace LaTeX fractions with nested braces into natural speech
function replaceFractions(str: string): string {
  let result = str;
  let iterations = 0;
  while (iterations < 25) {
    iterations++;
    let fracIdx = result.indexOf('\\frac{');
    let prefixLen = 6;
    if (fracIdx === -1) {
      fracIdx = result.indexOf('frac{');
      prefixLen = 5;
    }
    if (fracIdx === -1) break;

    const startNum = fracIdx + prefixLen - 1;
    let depth = 1;
    let endNum = -1;
    for (let i = startNum + 1; i < result.length; i++) {
      if (result[i] === '{') depth++;
      else if (result[i] === '}') {
        depth--;
        if (depth === 0) { endNum = i; break; }
      }
    }
    if (endNum === -1) break;

    let startDenom = -1;
    for (let i = endNum + 1; i < result.length; i++) {
      if (result[i] === '{') { startDenom = i; break; }
      if (!/\s/.test(result[i])) break;
    }
    if (startDenom === -1) break;

    depth = 1;
    let endDenom = -1;
    for (let i = startDenom + 1; i < result.length; i++) {
      if (result[i] === '{') depth++;
      else if (result[i] === '}') {
        depth--;
        if (depth === 0) { endDenom = i; break; }
      }
    }
    if (endDenom === -1) break;

    const numerator = result.substring(startNum + 1, endNum).trim();
    const denominator = result.substring(startDenom + 1, endDenom).trim();

    // Natural fraction pronunciation for common numbers
    let spokenFraction = `${numerator} over ${denominator}`;
    if (numerator === '1' && denominator === '2') spokenFraction = 'one half';
    else if (numerator === '1' && denominator === '3') spokenFraction = 'one third';
    else if (numerator === '1' && denominator === '4') spokenFraction = 'one quarter';
    else if (numerator === '2' && denominator === '3') spokenFraction = 'two thirds';
    else if (numerator === '3' && denominator === '4') spokenFraction = 'three quarters';
    else if (numerator === 'dy' && denominator === 'dx') spokenFraction = 'd y by d x';
    else if (numerator === 'd' && denominator === 'dx') spokenFraction = 'the derivative with respect to x of';

    result = result.substring(0, fracIdx) + ` ${spokenFraction} ` + result.substring(endDenom + 1);
  }
  return result;
}

// Convert academic formatting, math notations, LaTeX, and acronyms into natural spoken dialogue
// STRICT SAFETY: Never touch normal English words!
function sanitizeForRealisticSpeech(rawText: string): string {
  if (!rawText || typeof rawText !== 'string') return '';

  let text = rawText;

  // 1. Remove intro voice badges
  text = text.replace(/^🎙️[^\n]+\n\n?/, '');

  // 2. Remove code blocks entirely
  text = text.replace(/```[\s\S]*?```/g, ' ');

  // 3. Remove inline code backticks
  text = text.replace(/`([^`]+)`/g, '$1');

  // 4. Markdown links [title](url) -> title
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 5. Transform Markdown Headings into conversational sentences with breath pauses
  text = text.replace(/#{1,6}\s*([^\n]+)/g, '$1.\n');

  // 6. Transform bold and italics into clean words without leaving stray asterisks
  text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '$1');
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*\n]+)\*/g, '$1');
  text = text.replace(/___([^_]+)___/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  text = text.replace(/_([^_\n]+)_/g, '$1');

  // 7. LaTeX Fractions (before stripping braces)
  text = replaceFractions(text);

  // Common standalone numeric fractions (isolated words only)
  text = text.replace(/\b1\/2\b/g, 'one half');
  text = text.replace(/\b1\/3\b/g, 'one third');
  text = text.replace(/\b1\/4\b/g, 'one quarter');
  text = text.replace(/\b2\/3\b/g, 'two thirds');
  text = text.replace(/\b3\/4\b/g, 'three quarters');
  text = text.replace(/\b1\/5\b/g, 'one fifth');

  // 8. Calculus & Derivatives (STRICT LaTeX commands with required backslash)
  text = text.replace(/\\frac\{dy\}\{dx\}|\bdy\/dx\b/g, ' d y by d x ');
  text = text.replace(/\\frac\{df\}\{dx\}|\bdf\/dx\b/g, ' d f by d x ');
  text = text.replace(/\\frac\{d\}\{dx\}/g, ' the derivative with respect to x of ');
  text = text.replace(/\\frac\{\\partial y\}\{\\partial x\}|\b\\partial y\/\\partial x\b/g, ' partial y by partial x ');
  text = text.replace(/\\partial\b/g, ' partial ');
  text = text.replace(/f'''\(x\)/g, 'f triple prime of x');
  text = text.replace(/f''\(x\)|f\^\{\\prime\\prime\}\(x\)/g, 'f double prime of x');
  text = text.replace(/f'\(x\)|f\^\\prime\(x\)/g, 'f prime of x');
  text = text.replace(/y''|y\^\{\\prime\\prime\}/g, 'y double prime');
  text = text.replace(/y'|y\^\\prime/g, 'y prime');

  // Integrals & Limits (STRICT: MUST have backslash!)
  text = text.replace(/\\iint\b/g, ' the double integral of ');
  text = text.replace(/\\oint\b/g, ' the contour integral of ');
  text = text.replace(/\\int_\{([^}]+)\}\^\{([^}]+)\}/g, ' the integral from $1 to $2 of ');
  text = text.replace(/\\int_([0-9a-zA-Z]+)\^([0-9a-zA-Z]+)/g, ' the integral from $1 to $2 of ');
  text = text.replace(/\\int\b/g, ' the integral of ');
  text = text.replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, ' the sum from $1 to $2 of ');
  text = text.replace(/\\sum\b/g, ' the sum of ');
  text = text.replace(/\\prod_\{([^}]+)\}\^\{([^}]+)\}/g, ' the product from $1 to $2 of ');
  text = text.replace(/\\lim_\{([^}]+)\s*(?:\\to|->|\\rightarrow)\s*([^}]+)\}/g, ' the limit as $1 approaches $2 of ');
  text = text.replace(/\\lim\b/g, ' the limit as ');
  text = text.replace(/\\nabla\b/g, ' del ');

  // 9. Absolute Value & Norms: \left| x \right| or |x|
  text = text.replace(/\\left\|([^|]+)\\right\|/g, ' the absolute value of $1 ');
  text = text.replace(/\|([a-zA-Z0-9\s\+\-\*\/\^]+)\|/g, ' the absolute value of $1 ');

  // 10. Square roots: \sqrt{x}, \sqrt[3]{x}
  text = text.replace(/\\sqrt\[3\]\{([^}]+)\}/g, ' the cube root of $1 ');
  text = text.replace(/\\sqrt\[([^\]]+)\]\{([^}]+)\}/g, ' the $1 root of $2 ');
  text = text.replace(/\\sqrt\{([^}]+)\}/g, ' the square root of $1 ');

  // 11. LaTeX formatting commands with braces: extract inner content
  const cmdWithBraces = ['mathbf', 'boldsymbol', 'mathrm', 'text', 'textbf', 'textit', 'mathit', 'operatorname', 'underline', 'boxed', 'overbrace', 'underbrace'];
  cmdWithBraces.forEach(cmd => {
    const reg = new RegExp(`\\\\${cmd}\\{([^}]+)\\}`, 'g');
    text = text.replace(reg, '$1');
  });

  // 12. Vector, hat, dot, bar notations (STRICT backslash)
  text = text.replace(/\\vec\{([^}]+)\}/g, ' vector $1 ');
  text = text.replace(/\\hat\{\\?i(?:math)?\}|\\hat\{i\}/g, ' i hat ');
  text = text.replace(/\\hat\{\\?j(?:math)?\}|\\hat\{j\}/g, ' j hat ');
  text = text.replace(/\\hat\{k\}|\\hat\{k\}/g, ' k hat ');
  text = text.replace(/\\hat\{([^}]+)\}/g, ' $1 hat ');
  text = text.replace(/\\ddot\{([^}]+)\}/g, ' second derivative of $1 ');
  text = text.replace(/\\dot\{([^}]+)\}/g, ' derivative of $1 ');
  text = text.replace(/\\bar\{([^}]+)\}/g, ' average $1 ');

  // 13. LaTeX Environments (\begin{aligned}, \end{aligned}, \begin{cases}, etc.)
  text = text.replace(/\\begin\{[^}]+\}/g, ' ');
  text = text.replace(/\\end\{[^}]+\}/g, ' ');

  // LaTeX line breaks \\ -> period and pause
  text = text.replace(/\\\\/g, '.\n');
  text = text.replace(/\\&/g, ' and ');

  // LaTeX delimiters \left(, \right), \left[, \right], \left\{, \right\}
  text = text.replace(/\\left[\(\[\{]/g, '(');
  text = text.replace(/\\right[\)\]\}]/g, ')');
  text = text.replace(/\\left\./g, '');
  text = text.replace(/\\right\./g, '');

  // 14. Powers & Exponents (Negative and Positive)
  // Scientific notation with negative exponents: 10^{-3} -> "10 to the power of negative 3"
  text = text.replace(/10\^\{?-([0-9]+)\}?/g, '10 to the power of negative $1');
  text = text.replace(/([a-zA-Z0-9\)])\^\{?-([0-9a-zA-Z]+)\}?/g, '$1 to the power of negative $2');
  text = text.replace(/([a-zA-Z0-9\)])\^2\b/g, '$1 squared');
  text = text.replace(/([a-zA-Z0-9\)])\^3\b/g, '$1 cubed');
  text = text.replace(/([a-zA-Z0-9\)])\^\{?([a-zA-Z0-9\+\-]+)\}?/g, '$1 to the power of $2');

  // 15. Subscripts: ONLY when preceded by underscore and inside braces or single digit
  text = text.replace(/([a-zA-Z])_\{0\}/g, '$1 zero');
  text = text.replace(/([a-zA-Z])_\{net\}/gi, '$1 net');
  text = text.replace(/([a-zA-Z])_\{avg\}/gi, '$1 average');
  text = text.replace(/([a-zA-Z])_\{max\}/gi, '$1 maximum');
  text = text.replace(/([a-zA-Z])_\{min\}/gi, '$1 minimum');
  text = text.replace(/([a-zA-Z])_\{init(?:ial)?\}/gi, '$1 initial');
  text = text.replace(/([a-zA-Z])_\{final\}/gi, '$1 final');
  text = text.replace(/([a-zA-Z])_\{total\}/gi, '$1 total');
  text = text.replace(/([a-zA-Z])_\{([0-9a-zA-Z]+)\}/g, '$1 $2');
  text = text.replace(/([a-zA-Z])_([0-9])\b/g, '$1 $2');

  // 16. Trigonometric and Transcendentals (STRICT: MUST have backslash!)
  text = text.replace(/\\sin\^2\s*\(?([^)]+)\)?/g, ' sine squared of $1 ');
  text = text.replace(/\\cos\^2\s*\(?([^)]+)\)?/g, ' cosine squared of $1 ');
  text = text.replace(/\\tan\^2\s*\(?([^)]+)\)?/g, ' tangent squared of $1 ');
  text = text.replace(/\\sin\s*\(?([a-zA-Z0-9θ]+)\)?/g, ' sine of $1 ');
  text = text.replace(/\\cos\s*\(?([a-zA-Z0-9θ]+)\)?/g, ' cosine of $1 ');
  text = text.replace(/\\tan\s*\(?([a-zA-Z0-9θ]+)\)?/g, ' tangent of $1 ');
  text = text.replace(/\\arcsin\b|\\asin\b/g, ' arcsine of ');
  text = text.replace(/\\arccos\b|\\acos\b/g, ' arccosine of ');
  text = text.replace(/\\arctan\b|\\atan\b/g, ' arctangent of ');
  text = text.replace(/\\ln\s*\(?([a-zA-Z0-9]+)\)?/g, ' natural log of $1 ');
  text = text.replace(/\\log_\{?([0-9]+)\}?\s*\(?([a-zA-Z0-9]+)\)?/g, ' log base $1 of $2 ');
  text = text.replace(/\\log\s*\(?([a-zA-Z0-9]+)\)?/g, ' log of $1 ');

  // 17. Greek letters & symbols (STRICT: MUST have backslash or actual Greek Unicode character)
  text = text.replace(/\\alpha\b|α/g, ' alpha ');
  text = text.replace(/\\beta\b|β/g, ' beta ');
  text = text.replace(/\\gamma\b|γ/g, ' gamma ');
  text = text.replace(/\\Gamma\b|Γ/g, ' capital gamma ');
  text = text.replace(/\\delta\b|δ/g, ' delta ');
  text = text.replace(/\\Delta\b|Δ/g, ' delta ');
  text = text.replace(/\\epsilon\b|\\varepsilon\b|ε/g, ' epsilon ');
  text = text.replace(/\\zeta\b|ζ/g, ' zeta ');
  text = text.replace(/\\eta\b|η/g, ' eta ');
  text = text.replace(/\\theta\b|\\vartheta\b|θ/g, ' theta ');
  text = text.replace(/\\Theta\b|Θ/g, ' capital theta ');
  text = text.replace(/\\lambda\b|λ/g, ' lambda ');
  text = text.replace(/\\Lambda\b|Λ/g, ' capital lambda ');
  text = text.replace(/\\mu\b|μ/g, ' micro ');
  text = text.replace(/\\nu\b|ν/g, ' nu ');
  text = text.replace(/\\xi\b|ξ/g, ' xi ');
  text = text.replace(/\\pi\b|π/g, ' pi ');
  text = text.replace(/\\Pi\b|Π/g, ' capital pi ');
  text = text.replace(/\\rho\b|ρ/g, ' rho ');
  text = text.replace(/\\sigma\b|σ/g, ' sigma ');
  text = text.replace(/\\Sigma\b|Σ/g, ' capital sigma ');
  text = text.replace(/\\tau\b|τ/g, ' tau ');
  text = text.replace(/\\phi\b|\\varphi\b|φ/g, ' phi ');
  text = text.replace(/\\Phi\b|Φ/g, ' capital phi ');
  text = text.replace(/\\chi\b|χ/g, ' chi ');
  text = text.replace(/\\psi\b|ψ/g, ' psi ');
  text = text.replace(/\\Psi\b|Ψ/g, ' capital psi ');
  text = text.replace(/\\omega\b|ω/g, ' omega ');
  text = text.replace(/\\Omega\b|Ω/g, ' ohms ');

  // 18. Logic, Sets, & Directional Arrows (STRICT: MUST have backslash or actual Unicode symbol!)
  text = text.replace(/\\(?:implies|Longrightarrow)/g, ' which implies that ');
  text = text.replace(/\\(?:iff|Longleftrightarrow)/g, ' if and only if ');
  text = text.replace(/\\therefore|∴/g, ' therefore ');
  text = text.replace(/\\because|∵/g, ' because ');
  text = text.replace(/\\forall|∀/g, ' for all ');
  text = text.replace(/\\exists|∃/g, ' there exists ');
  text = text.replace(/\\notin|∉/g, ' is not in ');
  text = text.replace(/\\in\b|∈/g, ' in ');
  text = text.replace(/\\subset\b|⊂/g, ' is a subset of ');
  text = text.replace(/\\subseteq\b|⊆/g, ' is a subset of or equal to ');
  text = text.replace(/\\cup\b|∪/g, ' union ');
  text = text.replace(/\\cap\b|∩/g, ' intersection ');
  text = text.replace(/\\emptyset\b|∅/g, ' the empty set ');
  text = text.replace(/-(?:\\infty|∞)/g, ' negative infinity ');
  text = text.replace(/\\infty|∞/g, ' infinity ');
  text = text.replace(/\\(?:to|rightarrow|longrightarrow)|→/g, ' approaches ');
  text = text.replace(/\\(?:leftarrow|longleftarrow)|←/g, ' is from ');

  // 19. Mathematical Operators & Relations (STRICT backslash or unicode!)
  text = text.replace(/\\(?:cdot|times)|×|·/g, ' times ');
  text = text.replace(/\\div|÷/g, ' divided by ');
  text = text.replace(/\\pm|±/g, ' plus or minus ');
  text = text.replace(/\\mp|∓/g, ' minus or plus ');
  text = text.replace(/\\neq|\\ne|≠/g, ' is not equal to ');
  text = text.replace(/\\le|\\leq|≤/g, ' is less than or equal to ');
  text = text.replace(/\\ge|\\geq|≥/g, ' is greater than or equal to ');
  text = text.replace(/\\ll|≪/g, ' is much less than ');
  text = text.replace(/\\gg|≫/g, ' is much greater than ');
  text = text.replace(/\\approx|≈/g, ' is approximately ');
  text = text.replace(/\\equiv|≡/g, ' is identically equal to ');
  text = text.replace(/\\cong|≅/g, ' is congruent to ');
  text = text.replace(/\\propto|∝/g, ' is proportional to ');

  // Negative numbers: ONLY when '-' is directly in front of digits (e.g. -5, -10.2)
  text = text.replace(/(^|[\s\(\[\{=,\+\*\/<])-(?=\d)/g, '$1negative ');

  // Arithmetic between numbers only: 5 + 3 -> 5 plus 3, 10 - 4 -> 10 minus 4, 8 * 2 -> 8 times 2
  text = text.replace(/(\d+)\s*\+\s*(\d+)/g, '$1 plus $2');
  text = text.replace(/(\d+)\s*-\s*(\d+)/g, '$1 minus $2');
  text = text.replace(/(\d+)\s*\*\s*(\d+)/g, '$1 times $2');
  text = text.replace(/(\d+)\s*\/\s*(\d+)/g, '$1 over $2');

  // Math equations with '=': ONLY between variables/numbers (e.g. F = ma, x = 5)
  text = text.replace(/(\b[a-zA-Z0-9\)])\s*=\s*([a-zA-Z0-9\-]+)/g, '$1 equals $2');

  // 20. Scientific Units & Abbreviations (strictly attached to digits!)
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*m\/s\^2\b/gi, '$1 meters per second squared');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*m\/s\b/gi, '$1 meters per second');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*km\/h\b/gi, '$1 kilometers per hour');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*kg\b/gi, '$1 kilograms');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*mg\b/gi, '$1 milligrams');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*g\b/gi, '$1 grams');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*cm\b/gi, '$1 centimeters');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*mm\b/gi, '$1 millimeters');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*km\b/gi, '$1 kilometers');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*Hz\b/gi, '$1 hertz');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*kHz\b/gi, '$1 kilohertz');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*MHz\b/gi, '$1 megahertz');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*GHz\b/gi, '$1 gigahertz');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*N\b/g, '$1 newtons');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*kN\b/gi, '$1 kilonewtons');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*J\b/g, '$1 joules');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*kJ\b/gi, '$1 kilojoules');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*W\b/g, '$1 watts');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*kW\b/gi, '$1 kilowatts');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*Pa\b/gi, '$1 pascals');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*kPa\b/gi, '$1 kilopascals');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*atm\b/gi, '$1 atmospheres');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*V\b/g, '$1 volts');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*mV\b/gi, '$1 millivolts');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*°C\b/gi, '$1 degrees Celsius');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*°F\b/gi, '$1 degrees Fahrenheit');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*%\b/g, '$1 percent');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*(?:°|\\circ)\b/g, '$1 degrees');
  text = text.replace(/\\angle\s*([a-zA-Z0-9]+)/g, 'angle $1');

  // Conversational abbreviations
  text = text.replace(/\be\.g\.,?\s*/gi, 'for example, ');
  text = text.replace(/\bi\.e\.,?\s*/gi, 'that is, ');
  text = text.replace(/\betc\.\b/gi, 'and so on.');
  text = text.replace(/\bvs\.?\b/gi, 'versus');

  // 21. Strip any remaining unrecognized LaTeX commands (e.g. \displaystyle, \quad, \qquad, \hspace)
  text = text.replace(/\\[a-zA-Z]+/g, ' ');

  // 22. Strip all remaining LaTeX enclosing and markdown symbols: $, \, {, }, ^, ~, |
  text = text.replace(/[\$\{\}\\\^~|]/g, ' ');

  // 23. Transform bullet points and numbered lists into clean spoken pauses
  text = text.replace(/^\s*[\*\-•]\s*([^\n]+)/gm, '$1. ');
  text = text.replace(/^\s*\d+\.\s*([^\n]+)/gm, '$1. ');

  // 24. Strip emojis that cause clicks or artifacts in TTS
  text = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

  // 25. Clean up any leftover asterisks from markdown
  text = text.replace(/\*/g, '');

  // 26. Normalize colon endings to conversational pauses
  text = text.replace(/:\s*(\n|$)/g, ': ');

  // 27. Normalize punctuation and spacing
  text = text.replace(/\.\s*\.+/g, '.');
  text = text.replace(/,\s*,+/g, ',');
  text = text.replace(/\s+/g, ' ').trim();

  // 28. Ensure sentence ends with period for natural pitch decay
  if (text.length > 0 && !/[\.\?\!]$/.test(text)) {
    text += '.';
  }

  return text;
}

// High-performance native memory WAV container encapsulation with tail taper and silence cushion
function addWavHeader(pcmBase64: string, sampleRate = 24000, numChannels = 1): string {
  const rawPcm = decode(pcmBase64);
  const validPcmLength = rawPcm.length - (rawPcm.length % 2);
  const totalSamples = validPcmLength / 2;

  // 1. Apply smooth cosine fade-out to tail samples to prevent abrupt DC-offset jump
  if (totalSamples > 100) {
    const pcmView = new DataView(rawPcm.buffer, rawPcm.byteOffset, validPcmLength);
    const fadeSamples = Math.min(2400, Math.floor(totalSamples / 2));
    const startIndex = totalSamples - fadeSamples;

    for (let i = 0; i < fadeSamples; i++) {
      const byteIdx = (startIndex + i) * 2;
      const sample = pcmView.getInt16(byteIdx, true);
      const t = i / fadeSamples;
      const factor = 0.5 * (1 + Math.cos(Math.PI * t));
      pcmView.setInt16(byteIdx, Math.round(sample * factor), true);
    }
    pcmView.setInt16((totalSamples - 1) * 2, 0, true);
  }

  // 2. Append 120ms cushion of pure digital silence (2880 samples = 5760 bytes)
  const silenceBytes = 2880 * 2;
  const cushionedDataSize = validPcmLength + silenceBytes;

  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // "RIFF"
  view.setUint8(0, 0x52); // R
  view.setUint8(1, 0x49); // I
  view.setUint8(2, 0x46); // F
  view.setUint8(3, 0x46); // F
  view.setUint32(4, 36 + cushionedDataSize, true);

  // "WAVE"
  view.setUint8(8, 0x57);  // W
  view.setUint8(9, 0x41);  // A
  view.setUint8(10, 0x56); // V
  view.setUint8(11, 0x45); // E

  // "fmt "
  view.setUint8(12, 0x66); // f
  view.setUint8(13, 0x6D); // m
  view.setUint8(14, 0x74); // t
  view.setUint8(15, 0x20); // ' '
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);

  // "data"
  view.setUint8(36, 0x64); // d
  view.setUint8(37, 0x61); // a
  view.setUint8(38, 0x74); // t
  view.setUint8(39, 0x61); // a
  view.setUint32(40, cushionedDataSize, true);

  const fullBytes = new Uint8Array(44 + cushionedDataSize);
  fullBytes.set(new Uint8Array(header), 0);
  fullBytes.set(rawPcm.subarray(0, validPcmLength), 44);
  // Appended silence bytes remain zero automatically

  return encode(fullBytes);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY is not configured in Supabase secrets' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Flexible authentication: decode user ID from JWT without blocking network calls
    const authHeader = req.headers.get('Authorization') || req.headers.get('apikey') || '';
    let userId: string | null = null;

    if (authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.slice(7);
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          userId = payload.sub || null;
        }
      } catch {}
    }

    let text = '';
    let voice = 'Aoede';
    let returnBinary = false;
    let maxChars = 2500;

    if (req.method === 'GET') {
      const url = new URL(req.url);
      text = url.searchParams.get('text') || '';
      voice = url.searchParams.get('voice') || 'Aoede';
      returnBinary = url.searchParams.get('format') === 'binary';
      if (url.searchParams.has('maxChars')) {
        maxChars = parseInt(url.searchParams.get('maxChars') || '2500', 10);
      }
    } else {
      const body = await req.json().catch(() => ({}));
      text = body.text || '';
      voice = body.voice || 'Aoede';
      returnBinary = body.format === 'binary';
      if (typeof body.maxChars === 'number') {
        maxChars = body.maxChars;
      }
    }

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Text to speak is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const chosenVoice = voice || 'Aoede';

    // Conversational high-yield speech optimization:
    // Extract up to maxChars (default 380 chars) ending on a clean sentence period for lightning-fast TTS synthesis
    let spokenText = sanitizeForRealisticSpeech(text);
    if (maxChars > 0 && spokenText.length > maxChars) {
      const truncated = spokenText.slice(0, maxChars);
      const lastSentenceEnd = Math.max(
        truncated.lastIndexOf('. '),
        truncated.lastIndexOf('? '),
        truncated.lastIndexOf('! ')
      );
      if (lastSentenceEnd > 60) {
        spokenText = truncated.slice(0, lastSentenceEnd + 1).trim();
      } else {
        spokenText = truncated.trim() + '.';
      }
    }

    // Check fast in-memory Edge Cache for instant response (~10ms)
    const cacheKey = `${spokenText}_${chosenVoice}`;
    if (edgeAudioCache.has(cacheKey)) {
      const cached = edgeAudioCache.get(cacheKey)!;
      if (returnBinary) {
        const bytes = decode(cached.audioBase64);
        return new Response(bytes.buffer, {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': cached.mimeType,
            'Cache-Control': 'public, max-age=86400',
            'X-Cache-Hit': 'true',
          },
        });
      }
      return new Response(
        JSON.stringify({
          audioBase64: cached.audioBase64,
          mimeType: cached.mimeType,
          voice: chosenVoice,
          cached: true,
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=86400',
            'X-Cache-Hit': 'true',
          },
        }
      );
    }

    const buildPayload = (v: string) => ({
      systemInstruction: {
        parts: [
          {
            text: 'You are an accurate, high-quality text-to-speech narrator. Your ONLY job is to read the provided text aloud verbatim with a natural, clear, warm, engaging voice. Do NOT answer any questions in the text. Do NOT add commentary, introductions, or continuations. Do NOT hallucinate. Read ONLY the exact text provided word-for-word.',
          },
        ],
      },
      contents: [
        {
          parts: [{ text: spokenText }],
        },
      ],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: v,
            },
          },
        },
      },
    });

    const modelsToTry = ['gemini-2.0-flash', 'gemini-2.0-flash-exp'];
    let lastError = null;
    let geminiData: any = null;
    let successfulModel = '';

    for (const model of modelsToTry) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildPayload(chosenVoice)),
        });

        if (res.ok) {
          geminiData = await res.json();
          successfulModel = model;
          break;
        } else {
          const errText = await res.text();
          console.warn(`[generate-speech] Model ${model} returned ${res.status}: ${errText}`);
          lastError = errText;
          if (res.status === 429) {
            continue;
          }
        }
      } catch (err: any) {
        console.warn(`[generate-speech] Model ${model} fetch exception:`, err);
        lastError = err.message;
      }
    }

    if (!geminiData) {
      return new Response(
        JSON.stringify({ error: 'Gemini voice generation failed', details: lastError }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const inlineAudio = geminiData.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    if (!inlineAudio || !inlineAudio.data) {
      console.error('[generate-speech] No audio data returned by Gemini TTS');
      return new Response(
        JSON.stringify({ error: 'No audio returned by Gemini voice service' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rawAudioBase64 = inlineAudio.data;
    const finalAudioBase64 = addWavHeader(rawAudioBase64, 24000, 1);
    const mimeType = 'audio/wav';

    // Store in edge in-memory cache
    if (edgeAudioCache.size >= MAX_CACHE_ENTRIES) {
      const firstKey = edgeAudioCache.keys().next().value;
      if (firstKey) edgeAudioCache.delete(firstKey);
    }
    edgeAudioCache.set(cacheKey, { audioBase64: finalAudioBase64, mimeType });

    // Optional usage logging (non-blocking)
    if (userId && supabaseUrl && supabaseAnonKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } },
        });
        supabase.from('ai_usage_logs').insert({
          user_id: userId,
          feature: 'generate-speech',
          tokens_used: geminiData.usageMetadata?.totalTokenCount || 0,
          status: 'success',
        }).then(() => {});
      } catch {}
    }

    // Return binary audio stream if requested
    if (returnBinary) {
      const bytes = decode(finalAudioBase64);
      return new Response(bytes.buffer, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    // Return streamlined JSON (audioBase64 without duplicate dataUri)
    return new Response(
      JSON.stringify({
        audioBase64: finalAudioBase64,
        mimeType,
        voice: chosenVoice,
        modelUsed: successfulModel,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=86400',
        },
      }
    );
  } catch (err: any) {
    console.error('[generate-speech] Unhandled error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error generating voice audio.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
