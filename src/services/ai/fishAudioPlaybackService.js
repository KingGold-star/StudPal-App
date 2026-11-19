// src/services/ai/fishAudioPlaybackService.js
import { Platform } from 'react-native';
import { supabase, isSupabaseConfigured, SUPABASE_URL, SUPABASE_ANON_KEY } from '../../lib/supabaseClient.js';
import { settingsService } from '../settings/settingsService.js';

let ExpoAudio = null;
try {
  const expoAv = require('expo-av');
  ExpoAudio = expoAv?.Audio || null;
} catch (e) {
  console.log('[StudPalVoice] expo-av not available:', e?.message);
}

let ExpoSpeech = null;
try {
  ExpoSpeech = require('expo-speech');
} catch (e) {
  console.log('[StudPalVoice] expo-speech not available:', e?.message);
}

let ExpoFileSystem = null;
try {
  ExpoFileSystem = require('expo-file-system/legacy');
  if (!ExpoFileSystem?.writeAsStringAsync) {
    ExpoFileSystem = require('expo-file-system');
  }
} catch (e) {
  try {
    ExpoFileSystem = require('expo-file-system');
  } catch (e2) {
    console.log('[StudPalVoice] expo-file-system not available:', e2?.message);
  }
}

// ── Realistic Female Voice Selector ──────────────────────────────────────────
/**
 * Intelligently scores and selects the highest-fidelity, most realistic
 * female voice available on the device or browser.
 *
 * Prioritizes:
 * 1. Microsoft Natural / Neural female voices (Jenny, Aria, Sonia, Libby, Michelle) - Windows / Edge
 * 2. Google High-Quality Network / Female voices (Google US/UK Female, en-us-x-sfg) - Android / Chrome
 * 3. Apple Enhanced Female voices (Samantha Enhanced, Karen, Victoria, Ava, Nora) - iOS / macOS
 * 4. Explicitly filters out and penalizes robotic/male voices (David, Mark, Guy, Alex, etc.)
 */
export function findBestRealisticFemaleVoice(voices) {
  if (!voices || !Array.isArray(voices) || voices.length === 0) return null;

  const scored = voices.map((v) => {
    const name = (v.name || '').toLowerCase();
    const lang = (v.lang || v.language || '').toLowerCase();
    const id = (v.identifier || '').toLowerCase();
    let score = 0;

    // Must be English (or preferred language)
    if (lang.startsWith('en')) {
      score += 15;
      if (lang === 'en-us' || lang === 'en_us') score += 5;
      else if (lang === 'en-gb' || lang === 'en_gb') score += 4;
    } else {
      score -= 80;
    }

    // High quality / neural markers (Azure / Edge / Online Neural)
    if (
      name.includes('natural') ||
      name.includes('neural') ||
      name.includes('online (natural)') ||
      id.includes('natural') ||
      id.includes('neural')
    ) {
      score += 65;
    }

    // Premier ultra-realistic human female voices
    if (name.includes('jenny')) score += 55;
    else if (name.includes('aria')) score += 50;
    else if (name.includes('samantha')) score += 45;
    else if (name.includes('karen')) score += 42;
    else if (name.includes('victoria')) score += 40;
    else if (name.includes('libby')) score += 40;
    else if (name.includes('sonia')) score += 40;
    else if (name.includes('michelle')) score += 38;
    else if (name.includes('ana')) score += 38;
    else if (name.includes('ava')) score += 38;
    else if (name.includes('zira')) score += 35;
    else if (name.includes('moira')) score += 35;
    else if (name.includes('tessa')) score += 35;
    else if (name.includes('nora')) score += 35;
    else if (name.includes('fiona')) score += 30;

    // Google Neural / Cloud TTS Female voices
    if (name.includes('google')) {
      if (name.includes('female') || name.includes('uk english female')) score += 48;
      else if (name.includes('us english') || name.includes('english (united states)')) score += 35;
    }

    // Android Google TTS neural network female voices
    if (id.includes('sfg') || id.includes('tpd') || id.includes('rjs') || id.includes('iol')) {
      score += 48;
    }

    // Explicit female gender marker
    if (name.includes('female') || id.includes('female') || v.gender === 'female') {
      score += 30;
    }

    // Expo-speech enhanced quality
    if (v.quality === 'Enhanced' || v.quality === 'SuperHigh' || v.quality === 300) {
      score += 30;
    }

    // Strongly penalize and reject male voices
    if (
      (name.includes('male') && !name.includes('female')) ||
      name.includes('david') ||
      name.includes('mark') ||
      name.includes('george') ||
      name.includes('guy') ||
      name.includes('james') ||
      name.includes('stefan') ||
      name.includes('daniel') ||
      name.includes('alex') ||
      name.includes('brian') ||
      name.includes('richard') ||
      name.includes('steffan') ||
      name.includes('fred') ||
      v.gender === 'male'
    ) {
      score -= 150;
    }

    return { voice: v, score };
  });

  scored.sort((a, b) => b.score - a.score);
  if (scored[0]?.score > 0) {
    return scored[0].voice;
  }
  return voices.find((v) => (v.lang || v.language || '').toLowerCase().startsWith('en')) || voices[0];
}

// ── Pure JavaScript WAV Header & PCM Helpers ─────────────────────────────────

function createWavHeader(dataLength, sampleRate = 24000, numChannels = 1, bitsPerSample = 16) {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  // RIFF identifier
  view.setUint32(0, 0x52494646, false); // 'RIFF'
  view.setUint32(4, 36 + dataLength, true); // chunkSize
  view.setUint32(8, 0x57415645, false); // 'WAVE'

  // fmt subchunk
  view.setUint32(12, 0x666d7420, false); // 'fmt '
  view.setUint32(16, 16, true); // subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // audioFormat (1 = PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true); // byteRate
  view.setUint16(32, numChannels * (bitsPerSample / 8), true); // blockAlign
  view.setUint16(34, bitsPerSample, true);

  // data subchunk
  view.setUint32(36, 0x64617461, false); // 'data'
  view.setUint32(40, dataLength, true);

  return new Uint8Array(buffer);
}

const B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function base64ToUint8Array(base64) {
  if (typeof atob === 'function') {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  let len = base64.length;
  let validLen = len;
  if (base64[len - 1] === '=') validLen--;
  if (base64[len - 2] === '=') validLen--;
  const byteLength = (validLen * 3) >> 2;
  const bytes = new Uint8Array(byteLength);
  let p = 0;
  for (let i = 0; i < len; i += 4) {
    const enc1 = B64_CHARS.indexOf(base64[i]);
    const enc2 = B64_CHARS.indexOf(base64[i + 1]);
    const enc3 = B64_CHARS.indexOf(base64[i + 2]);
    const enc4 = B64_CHARS.indexOf(base64[i + 3]);
    bytes[p++] = (enc1 << 2) | (enc2 >> 4);
    if (enc3 !== -1 && base64[i + 2] !== '=') bytes[p++] = ((enc2 & 15) << 4) | (enc3 >> 2);
    if (enc4 !== -1 && base64[i + 3] !== '=') bytes[p++] = ((enc3 & 3) << 6) | (enc4 & 63);
  }
  return bytes;
}

function uint8ArrayToBase64(bytes) {
  if (typeof btoa === 'function') {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  let base64 = '';
  const byteLength = bytes.byteLength;
  const byteRemainder = byteLength % 3;
  const mainLength = byteLength - byteRemainder;
  for (let i = 0; i < mainLength; i += 3) {
    const chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    base64 += B64_CHARS[(chunk >> 18) & 63] + B64_CHARS[(chunk >> 12) & 63] + B64_CHARS[(chunk >> 6) & 63] + B64_CHARS[chunk & 63];
  }
  if (byteRemainder === 1) {
    const chunk = bytes[mainLength];
    base64 += B64_CHARS[(chunk >> 2) & 63] + B64_CHARS[(chunk << 4) & 63] + '==';
  } else if (byteRemainder === 2) {
    const chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
    base64 += B64_CHARS[(chunk >> 10) & 63] + B64_CHARS[(chunk >> 4) & 63] + B64_CHARS[(chunk << 2) & 63] + '=';
  }
  return base64;
}

function addWavHeader(pcmBase64, sampleRate = 24000, numChannels = 1) {
  const pcmBytes = base64ToUint8Array(pcmBase64);
  const validPcmLength = pcmBytes.length - (pcmBytes.length % 2);
  const header = createWavHeader(validPcmLength, sampleRate, numChannels, 16);
  const wavBytes = new Uint8Array(44 + validPcmLength);
  wavBytes.set(header, 0);
  wavBytes.set(pcmBytes.subarray(0, validPcmLength), 44);
  return uint8ArrayToBase64(wavBytes);
}

// ── Fraction Replacement Helper ─────────────────────────────────────────────

function replaceFractions(str) {
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

// ── Text Sanitizer for Natural Spoken Dialogue ──────────────────────────────

export function sanitizeForRealisticSpeech(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';

  let text = rawText;

  // 1. Remove intro voice badges
  text = text.replace(/^🎙️[^\n]+\n\n?/, '');

  // 2. Remove code blocks entirely
  text = text.replace(/```[\s\S]*?```/g, ' ');

  // 2b. Remove internal reasoning and markup
  text = text.replace(/<think[\s\S]*?<\/think>/gi, ' ');
  text = text.replace(/<thought[\s\S]*?<\/thought>/gi, ' ');
  text = text.replace(/<reasoning[\s\S]*?<\/reasoning>/gi, ' ');
  text = text.replace(/<reflection[\s\S]*?<\/reflection>/gi, ' ');
  text = text.replace(/<analysis[\s\S]*?<\/analysis>/gi, ' ');
  text = text.replace(/<\/?[a-zA-Z][a-zA-Z0-9_\-:]*(?:\s+[^>]*)?>/g, ' ');

  // 2c. Remove TL;DR blockquotes from speech
  text = text.replace(/^>\s*(?:\*\*)?TL;?DR:?(?:\*\*)?[\s\S]*?(?:\n\n|\n(?=[^>])|$)/gim, ' ');
  text = text.replace(/^(?:\*\*)?TL;?DR:?(?:\*\*)?[^\n]*(?:\n\n|\n|$)/gim, ' ');

  // 3. Remove inline code backticks
  text = text.replace(/`([^`]+)`/g, '$1');

  // 4. Markdown links [title](url) -> title
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 5. Transform Markdown Headings into conversational sentences with breath pauses
  text = text.replace(/#{1,6}\s*([^\n]+)/g, '$1.\n');

  // 6. Transform bold and italics into clean words without breaking subscripts
  text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '$1');
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*\n]+)\*/g, '$1');
  text = text.replace(/\b___([^_]+)___\b/g, '$1');
  text = text.replace(/\b__([^_]+)__\b/g, '$1');
  text = text.replace(/\b_([a-zA-Z\s]{2,})_\b/g, '$1');

  // 7. LaTeX Fractions (before stripping braces)
  text = replaceFractions(text);

  // Common standalone numeric fractions
  text = text.replace(/\b1\/2\b/g, 'one half');
  text = text.replace(/\b1\/3\b/g, 'one third');
  text = text.replace(/\b1\/4\b/g, 'one quarter');
  text = text.replace(/\b2\/3\b/g, 'two thirds');
  text = text.replace(/\b3\/4\b/g, 'three quarters');
  text = text.replace(/\b1\/5\b/g, 'one fifth');

  // 8. Calculus & Derivatives
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

  // Integrals & Limits
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

  // 9. Absolute Value & Norms
  text = text.replace(/\\left\|([^|]+)\\right\|/g, ' the absolute value of $1 ');
  text = text.replace(/\|([a-zA-Z0-9\s\+\-\*\/\^]+)\|/g, ' the absolute value of $1 ');

  // 10. Square roots
  text = text.replace(/\\sqrt\[3\]\{([^}]+)\}/g, ' the cube root of $1 ');
  text = text.replace(/\\sqrt\[([^\]]+)\]\{([^}]+)\}/g, ' the $1 root of $2 ');
  text = text.replace(/\\sqrt\{([^}]+)\}/g, ' the square root of $1 ');

  // 11. LaTeX formatting commands with braces
  const cmdWithBraces = ['mathbf', 'boldsymbol', 'mathrm', 'text', 'textbf', 'textit', 'mathit', 'operatorname', 'underline', 'boxed', 'overbrace', 'underbrace'];
  cmdWithBraces.forEach(cmd => {
    const reg = new RegExp(`\\\\${cmd}\\{([^}]+)\\}`, 'g');
    text = text.replace(reg, '$1');
  });

  // 12. Vector notations
  text = text.replace(/\\vec\{([^}]+)\}/g, ' vector $1 ');
  text = text.replace(/\\hat\{\\?i(?:math)?\}|\\hat\{i\}/g, ' i hat ');
  text = text.replace(/\\hat\{\\?j(?:math)?\}|\\hat\{j\}/g, ' j hat ');
  text = text.replace(/\\hat\{k\}|\\hat\{k\}/g, ' k hat ');
  text = text.replace(/\\hat\{([^}]+)\}/g, ' $1 hat ');
  text = text.replace(/\\ddot\{([^}]+)\}/g, ' second derivative of $1 ');
  text = text.replace(/\\dot\{([^}]+)\}/g, ' derivative of $1 ');
  text = text.replace(/\\bar\{([^}]+)\}/g, ' average $1 ');

  // 13. LaTeX Environments
  text = text.replace(/\\begin\{[^}]+\}/g, ' ');
  text = text.replace(/\\end\{[^}]+\}/g, ' ');
  text = text.replace(/\\\\/g, '.\n');
  text = text.replace(/\\&/g, ' and ');
  text = text.replace(/\\left[\(\[\{]/g, '(');
  text = text.replace(/\\right[\)\]\}]/g, ')');
  text = text.replace(/\\left\./g, '');
  text = text.replace(/\\right\./g, '');

  // 14. Powers & Exponents
  text = text.replace(/10\^\{?-([0-9]+)\}?/g, '10 to the power of negative $1');
  text = text.replace(/([a-zA-Z0-9\)])\^\{?-([0-9a-zA-Z]+)\}?/g, '$1 to the power of negative $2');
  text = text.replace(/([a-zA-Z0-9\)])\^2\b/g, '$1 squared');
  text = text.replace(/([a-zA-Z0-9\)])\^3\b/g, '$1 cubed');
  text = text.replace(/([a-zA-Z0-9\)])\^\{?([a-zA-Z0-9\+\-]+)\}?/g, '$1 to the power of $2');

  // 15. Subscripts
  text = text.replace(/([a-zA-Z])_\{0\}/g, '$1 zero');
  text = text.replace(/([a-zA-Z])_\{net\}/gi, '$1 net');
  text = text.replace(/([a-zA-Z])_\{avg\}/gi, '$1 average');
  text = text.replace(/([a-zA-Z])_\{max\}/gi, '$1 maximum');
  text = text.replace(/([a-zA-Z])_\{min\}/gi, '$1 minimum');
  text = text.replace(/([a-zA-Z])_\{init(?:ial)?\}/gi, '$1 initial');
  text = text.replace(/([a-zA-Z])_\{final\}/gi, '$1 final');
  text = text.replace(/([a-zA-Z])_\{total\}/gi, '$1 total');
  text = text.replace(/([a-zA-Z])_\{([0-9a-zA-Z]+)\}/g, '$1 $2');
  text = text.replace(/([a-zA-Z])_([0-9]+)/g, '$1 $2');

  // 16. Trigonometric and Transcendentals
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

  // 17. Greek letters & symbols
  text = text.replace(/\\alpha\b|α/g, ' alpha ');
  text = text.replace(/\\beta\b|β/g, ' beta ');
  text = text.replace(/\\gamma\b|γ/g, ' gamma ');
  text = text.replace(/\\Gamma\b|Γ/g, ' capital gamma ');
  text = text.replace(/\\delta\b|δ/g, ' delta ');
  text = text.replace(/\\Delta\b|Δ/g, ' delta ');
  text = text.replace(/\\epsilon\b|\\varepsilon\b|ε/g, ' epsilon ');
  text = text.replace(/\\theta\b|\\vartheta\b|θ/g, ' theta ');
  text = text.replace(/\\Theta\b|Θ/g, ' capital theta ');
  text = text.replace(/\\lambda\b|λ/g, ' lambda ');
  text = text.replace(/\\mu\b|μ/g, ' micro ');
  text = text.replace(/\\pi\b|π/g, ' pi ');
  text = text.replace(/\\rho\b|ρ/g, ' rho ');
  text = text.replace(/\\sigma\b|σ/g, ' sigma ');
  text = text.replace(/\\Sigma\b|Σ/g, ' capital sigma ');
  text = text.replace(/\\tau\b|τ/g, ' tau ');
  text = text.replace(/\\phi\b|\\varphi\b|φ/g, ' phi ');
  text = text.replace(/\\omega\b|ω/g, ' omega ');
  text = text.replace(/\\Omega\b|Ω/g, ' ohms ');

  // 18. Logic, Sets, & Directional Arrows
  text = text.replace(/\\therefore|∴/g, ' therefore ');
  text = text.replace(/\\because|∵/g, ' because ');
  text = text.replace(/\\forall|∀/g, ' for all ');
  text = text.replace(/\\exists|∃/g, ' there exists ');
  text = text.replace(/\\notin|∉/g, ' is not in ');
  text = text.replace(/\\in\b|∈/g, ' in ');
  text = text.replace(/-(?:\\infty|∞)/g, ' negative infinity ');
  text = text.replace(/\\infty|∞/g, ' infinity ');
  text = text.replace(/\\(?:to|rightarrow|longrightarrow)|→/g, ' approaches ');

  // 19. Mathematical Operators & Relations
  text = text.replace(/\\(?:cdot|times)|×|·/g, ' times ');
  text = text.replace(/\\div|÷/g, ' divided by ');
  text = text.replace(/\\pm|±/g, ' plus or minus ');
  text = text.replace(/\\mp|∓/g, ' minus or plus ');
  text = text.replace(/\\neq|\\ne|≠/g, ' is not equal to ');
  text = text.replace(/\\le|\\leq|≤/g, ' is less than or equal to ');
  text = text.replace(/\\ge|\\geq|≥/g, ' is greater than or equal to ');
  text = text.replace(/\\approx|≈/g, ' is approximately ');

  // Negative numbers in front of digits
  text = text.replace(/(^|[\s\(\[\{=,\+\*\/<])-(?=\d)/g, '$1negative ');

  // Arithmetic between numbers only
  text = text.replace(/(\d+)\s*\+\s*(\d+)/g, '$1 plus $2');
  text = text.replace(/(\d+)\s*-\s*(\d+)/g, '$1 minus $2');
  text = text.replace(/(\d+)\s*\*\s*(\d+)/g, '$1 times $2');
  text = text.replace(/(\d+)\s*\/\s*(\d+)/g, '$1 over $2');

  // Math equations with '='
  text = text.replace(/(\b[a-zA-Z0-9\)])\s*=\s*([a-zA-Z0-9\-]+)/g, '$1 equals $2');

  // 20. Scientific Units & Abbreviations
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
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*J\b/g, '$1 joules');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*kJ\b/gi, '$1 kilojoules');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*W\b/g, '$1 watts');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*kW\b/gi, '$1 kilowatts');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*Pa\b/gi, '$1 pascals');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*kPa\b/gi, '$1 kilopascals');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*atm\b/gi, '$1 atmospheres');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*V\b/g, '$1 volts');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*°C\b/gi, '$1 degrees Celsius');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*°F\b/gi, '$1 degrees Fahrenheit');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*%\b/g, '$1 percent');
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*(?:°|\\circ)\b/g, '$1 degrees');

  // Conversational abbreviations
  text = text.replace(/\be\.g\.,?\s*/gi, 'for example, ');
  text = text.replace(/\bi\.e\.,?\s*/gi, 'that is, ');
  text = text.replace(/\betc\.\b/gi, 'and so on.');
  text = text.replace(/\bvs\.?\b/gi, 'versus');

  // 21. Strip remaining unrecognized LaTeX commands
  text = text.replace(/\\[a-zA-Z]+/g, ' ');

  // 22. Strip all remaining LaTeX enclosing symbols
  text = text.replace(/[\$\{\}\\\^~|]/g, ' ');

  // 23. Transform bullet points and numbered lists into clean spoken pauses
  text = text.replace(/^\s*[\*\-•]\s*([^\n]+)/gm, '$1. ');
  text = text.replace(/^\s*\d+\.\s*([^\n]+)/gm, '$1. ');

  // 24. Strip emojis that cause clicks or artifacts in TTS
  text = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

  // 25. Clean up stray asterisks and markdown punctuation
  text = text.replace(/\*/g, '');
  text = text.replace(/:\s*(\n|$)/g, ': ');
  text = text.replace(/\.\s*\.+/g, '.');
  text = text.replace(/,\s*,+/g, ',');
  text = text.replace(/\s+/g, ' ').trim();

  // 26. Ensure clean sentence termination
  if (text.length > 0 && !/[\.\?\!]$/.test(text)) {
    text += '.';
  }

  return text;
}

// ── StudPal Ultra-Realistic Speech Playback Service ──────────────────────────

class StudPalAudioPlaybackService {
  constructor() {
    this.currentSound = null;
    this.currentlyPlayingId = null;
    this.currentTempFileUri = null;
    this.playbackState = 'idle'; // 'idle' | 'loading' | 'playing'
    this.listeners = new Set();
    this.audioCache = new Map();
    this.isWebSpeaking = false;
    this.currentWebUtterance = null;
    this.webKeepAliveTimer = null;
    this.isExpoSpeaking = false;
  }

  // Subscribe to playback state changes
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  _notify(state, msgId = null, extra = {}) {
    this.playbackState = state;
    this.currentlyPlayingId = msgId;
    this.listeners.forEach((cb) => {
      try {
        cb({ state, msgId, ...extra });
      } catch (err) {
        console.error('[StudPalVoice] Listener error:', err);
      }
    });
  }

  async _preparePlayableUri(base64Data, mimeType = 'audio/wav') {
    if (!base64Data) return null;

    // Native iOS & Android: Write to cache file
    if (Platform.OS !== 'web' && ExpoFileSystem?.writeAsStringAsync) {
      try {
        const cacheDir = ExpoFileSystem.cacheDirectory || ExpoFileSystem.documentDirectory;
        if (cacheDir) {
          const extension = mimeType.includes('mpeg') || mimeType.includes('mp3') ? 'mp3' : 'wav';
          const fileUri = `${cacheDir}studpal_voice_${Date.now()}_${Math.floor(Math.random() * 1000)}.${extension}`;

          await ExpoFileSystem.writeAsStringAsync(fileUri, base64Data, {
            encoding: ExpoFileSystem.EncodingType?.Base64 || 'base64',
          });

          return fileUri;
        }
      } catch (err) {
        console.warn('[StudPalVoice] Failed writing temporary audio file:', err);
      }
    }

    // Web browser: Blob URL
    if (Platform.OS === 'web' && typeof atob !== 'undefined' && typeof Blob !== 'undefined' && typeof URL !== 'undefined') {
      try {
        const bytes = base64ToUint8Array(base64Data);
        const blob = new Blob([bytes], { type: mimeType });
        return URL.createObjectURL(blob);
      } catch (err) {
        console.warn('[StudPalVoice] Failed creating blob URL:', err);
      }
    }

    return `data:${mimeType};base64,${base64Data}`;
  }

  /**
   * Direct Google Gemini 2.0 Flash Audio Generation (Aoede - Flagship Female Voice)
   */
  async _fetchGeminiSpeech(spokenText, apiKey, voice = 'Aoede') {
    if (!apiKey || !spokenText) return null;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = {
      systemInstruction: {
        parts: [
          {
            text: 'You are an accurate, high-quality text-to-speech narrator. Your ONLY job is to read the provided text aloud verbatim with a natural, clear, warm, engaging female voice. Do NOT answer any questions in the text. Do NOT add commentary, introductions, or continuations. Do NOT hallucinate. Read ONLY the exact text provided word-for-word.',
          },
        ],
      },
      contents: [{ parts: [{ text: spokenText }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voice || 'Aoede',
            },
          },
        },
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[StudPalVoice] Gemini speech API returned ${res.status}:`, errText);
      return null;
    }

    const data = await res.json();
    const inlineAudio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    if (inlineAudio?.data) {
      const wavBase64 = addWavHeader(inlineAudio.data, 24000, 1);
      return await this._preparePlayableUri(wavBase64, 'audio/wav');
    }

    return null;
  }

  /**
   * Web Speech Synthesis with Realistic Female Voice Selection (Jenny, Aria, Google Female, Samantha)
   */
  async _playWithWebSpeech(msgId, spokenText) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return false;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    let voices = synth.getVoices();
    if (!voices || voices.length === 0) {
      await new Promise((res) => {
        let done = false;
        const handler = () => {
          if (!done) {
            done = true;
            synth.removeEventListener('voiceschanged', handler);
            res();
          }
        };
        synth.addEventListener('voiceschanged', handler);
        setTimeout(() => {
          if (!done) {
            done = true;
            res();
          }
        }, 150);
      });
      voices = synth.getVoices();
    }

    const femaleVoice = findBestRealisticFemaleVoice(voices);

    // Sentence-level chunking prevents Chrome 15s freeze bug while speaking naturally
    const sentenceRegex = /[^.!?]+[.!?]+|[^.!?]+$/g;
    const sentences = spokenText.match(sentenceRegex) || [spokenText];
    const cleanedSentences = sentences.map((s) => s.trim()).filter((s) => s.length > 0);

    if (cleanedSentences.length === 0) {
      this._notify('idle', null);
      return true;
    }

    this.isWebSpeaking = true;
    this._notify('playing', msgId);

    // Keep-alive timer for Chrome SpeechSynthesis 15s bug
    if (this.webKeepAliveTimer) clearInterval(this.webKeepAliveTimer);
    this.webKeepAliveTimer = setInterval(() => {
      if (this.isWebSpeaking && synth.speaking) {
        synth.pause();
        synth.resume();
      } else {
        clearInterval(this.webKeepAliveTimer);
        this.webKeepAliveTimer = null;
      }
    }, 10000);

    let currentIndex = 0;

    const speakNext = () => {
      if (!this.isWebSpeaking || currentIndex >= cleanedSentences.length) {
        if (this.webKeepAliveTimer) {
          clearInterval(this.webKeepAliveTimer);
          this.webKeepAliveTimer = null;
        }
        this.isWebSpeaking = false;
        this.currentWebUtterance = null;
        this._notify('idle', null);
        return;
      }

      const textChunk = cleanedSentences[currentIndex];
      currentIndex++;

      const utterance = new SpeechSynthesisUtterance(textChunk);
      this.currentWebUtterance = utterance;

      if (femaleVoice) {
        utterance.voice = femaleVoice;
        utterance.lang = femaleVoice.lang || 'en-US';
      } else {
        utterance.lang = 'en-US';
      }

      utterance.pitch = 1.04; // Natural human female register
      utterance.rate = 0.96; // Calm, articulate, clear cadence

      utterance.onend = () => {
        if (this.isWebSpeaking) {
          speakNext();
        }
      };

      utterance.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') {
          return;
        }
        console.warn('[StudPalVoice] Speech utterance warning:', e?.error);
        if (this.isWebSpeaking) {
          speakNext();
        }
      };

      synth.speak(utterance);
    };

    speakNext();
    return true;
  }

  /**
   * Native Expo Speech (iOS & Android) with Enhanced Female Voice Selection
   */
  async _playWithExpoSpeech(msgId, spokenText) {
    if (!ExpoSpeech || typeof ExpoSpeech.speak !== 'function') {
      return false;
    }

    try {
      if (ExpoAudio) {
        try {
          await ExpoAudio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
          });
        } catch (e) {}
      }

      const voices = await ExpoSpeech.getAvailableVoicesAsync().catch(() => []);
      const femaleVoice = findBestRealisticFemaleVoice(voices);

      this.isExpoSpeaking = true;
      this._notify('playing', msgId);

      ExpoSpeech.speak(spokenText, {
        language: femaleVoice?.language || 'en-US',
        voice: femaleVoice?.identifier || femaleVoice?.name,
        pitch: 1.04,
        rate: 0.96,
        onStart: () => {
          this.isExpoSpeaking = true;
          this._notify('playing', msgId);
        },
        onDone: () => {
          this.isExpoSpeaking = false;
          this._notify('idle', null);
        },
        onStopped: () => {
          this.isExpoSpeaking = false;
          this._notify('idle', null);
        },
        onError: (err) => {
          console.warn('[StudPalVoice] ExpoSpeech error:', err);
          this.isExpoSpeaking = false;
          this._notify('idle', null);
        },
      });

      return true;
    } catch (err) {
      console.warn('[StudPalVoice] ExpoSpeech failed:', err);
      return false;
    }
  }

  /**
   * Play generated audio URI via ExpoAudio (Native) or HTMLAudioElement (Web)
   */
  async _playAudioFile(playableUri, msgId) {
    if (ExpoAudio) {
      try {
        await ExpoAudio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        });
      } catch (e) {}

      if (typeof playableUri === 'string' && playableUri.startsWith('file:')) {
        this.currentTempFileUri = playableUri;
      }

      const { sound } = await ExpoAudio.Sound.createAsync(
        { uri: playableUri },
        { shouldPlay: true, volume: 1.0 },
        (status) => {
          if (status.didJustFinish) {
            this._notify('idle', null);
            setTimeout(() => this._cleanupSound(), 150);
          }
        }
      );

      this.currentSound = sound;
      await sound.setVolumeAsync(1.0);
      await sound.playAsync();
      this._notify('playing', msgId);
    } else if (typeof Audio !== 'undefined') {
      const htmlAudio = new Audio(playableUri);
      htmlAudio.volume = 1.0;
      htmlAudio.onended = () => {
        this._notify('idle', null);
        setTimeout(() => this._cleanupSound(), 150);
      };
      htmlAudio.onerror = (e) => {
        console.warn('[StudPalVoice] HTMLAudio playback error:', e);
        this._cleanupSound();
        this._notify('idle', null);
      };
      await htmlAudio.play();
      this.currentSound = htmlAudio;
      this._notify('playing', msgId);
    }
  }

  /**
   * Silently pre-fetch speech audio into memory cache in background
   */
  async prefetch(text, options = {}) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) return;
    try {
      let apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        apiKey = await settingsService.getSetting('geminiApiKey');
      }
      if (apiKey) {
        const spokenText = sanitizeForRealisticSpeech(text);
        const cacheKey = `${spokenText.trim()}_Aoede`;
        if (!this.audioCache.has(cacheKey)) {
          const playableUri = await this._fetchGeminiSpeech(spokenText, apiKey.trim(), 'Aoede');
          if (playableUri) {
            this.audioCache.set(cacheKey, playableUri);
          }
        }
      }
    } catch (_) {}
  }

  /**
   * Play or toggle speech for an AI response message.
   * Reads out response using a realistic female voice.
   */
  async playOrToggle(msgId, text, options = {}) {
    // If currently playing or loading this exact message, stop it immediately
    if (this.currentlyPlayingId === msgId && (this.playbackState === 'playing' || this.playbackState === 'loading')) {
      await this.stop();
      return;
    }

    // Stop any previously playing speech first
    await this.stop();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return;
    }

    const spokenText = sanitizeForRealisticSpeech(text);
    if (!spokenText || spokenText.trim().length === 0) {
      return;
    }

    this._notify('loading', msgId);

    // 1. Check if Gemini API key is configured for studio-grade Gemini 2.0 Flash 'Aoede' voice
    let apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      try {
        apiKey = await settingsService.getSetting('geminiApiKey');
      } catch (_) {}
    }

    if (apiKey && typeof apiKey === 'string' && apiKey.trim().length > 10) {
      try {
        const cacheKey = `${spokenText.trim()}_Aoede`;
        let playableUri = this.audioCache.get(cacheKey);
        if (!playableUri) {
          playableUri = await this._fetchGeminiSpeech(spokenText, apiKey.trim(), 'Aoede');
          if (playableUri) {
            this.audioCache.set(cacheKey, playableUri);
          }
        }

        if (playableUri) {
          await this._playAudioFile(playableUri, msgId);
          return;
        }
      } catch (geminiErr) {
        console.warn('[StudPalVoice] Gemini voice fallback:', geminiErr?.message);
      }
    }

    // 2. Native Expo Speech (iOS / Android) with Enhanced Female Voice
    if (Platform.OS !== 'web' && ExpoSpeech) {
      const started = await this._playWithExpoSpeech(msgId, spokenText);
      if (started) return;
    }

    // 3. Web Speech Synthesis (Web / Browser / Desktop) with Natural Female Voice
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const started = await this._playWithWebSpeech(msgId, spokenText);
      if (started) return;
    }

    // Fallback attempt on Web Speech if Native failed
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      await this._playWithWebSpeech(msgId, spokenText);
      return;
    }

    // If completely unable to access any voice engine
    this._notify('idle', null, { error: 'No realistic voice synthesizer available on this device.' });
  }

  async stop() {
    // 1. Web Speech Synthesis
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    this.isWebSpeaking = false;
    this.currentWebUtterance = null;
    if (this.webKeepAliveTimer) {
      clearInterval(this.webKeepAliveTimer);
      this.webKeepAliveTimer = null;
    }

    // 2. Expo Speech
    if (ExpoSpeech && typeof ExpoSpeech.stop === 'function') {
      try {
        await ExpoSpeech.stop();
      } catch (e) {}
    }
    this.isExpoSpeaking = false;

    // 3. Sound Audio Object
    this._cleanupSound();

    this._notify('idle', null);
  }

  _cleanupSound() {
    if (this.currentSound) {
      try {
        if (typeof this.currentSound.stopAsync === 'function') {
          this.currentSound.stopAsync().catch(() => {});
        }
        if (typeof this.currentSound.unloadAsync === 'function') {
          this.currentSound.unloadAsync().catch(() => {});
        } else if (typeof this.currentSound.pause === 'function') {
          this.currentSound.pause();
          if (this.currentSound.src) this.currentSound.src = '';
        }
      } catch (e) {}
      this.currentSound = null;
    }

    if (this.currentTempFileUri && ExpoFileSystem?.deleteAsync) {
      try {
        const fileToDel = this.currentTempFileUri;
        setTimeout(() => {
          ExpoFileSystem.deleteAsync(fileToDel, { idempotent: true }).catch(() => {});
        }, 1000);
      } catch (e) {}
      this.currentTempFileUri = null;
    }
  }

  getCurrentlyPlayingId() {
    return this.currentlyPlayingId;
  }

  isPlaying(msgId) {
    return this.currentlyPlayingId === msgId && this.playbackState === 'playing';
  }

  isLoading(msgId) {
    return this.currentlyPlayingId === msgId && this.playbackState === 'loading';
  }
}

export const fishAudioPlaybackService = new StudPalAudioPlaybackService();
export default fishAudioPlaybackService;
