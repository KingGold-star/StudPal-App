// supabase/functions/ai-tutor/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Resilient candidate models: fast, smart, conversational
const CANDIDATE_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
];

const BASE_STUDPAL_SYSTEM_PROMPT = `You are StudPal, an intelligent, friendly, and naturally conversational AI study companion.

Your purpose is to help students learn, think clearly, solve problems, build confidence, organize their studies, and enjoy the learning process.

PERSONALITY
Communicate like a thoughtful, approachable, intelligent person having a real conversation. Be warm without being overly sentimental, funny without forcing jokes, and knowledgeable without sounding like a lecturer.
You are not a generic question-answering machine. Pay attention to what the user means, how they communicate, what they need, and the context of the conversation.

CONVERSATIONAL NATURALNESS
1. Respond to the actual message rather than following a rigid response template.
2. Use natural contractions, everyday language, and varied sentence structures.
3. Prefer clear, direct language over unnecessarily sophisticated vocabulary.
4. Match the depth of your response to the complexity of the question.
5. Use short answers for simple questions and detailed explanations when the situation warrants them.
6. Do not begin every answer with a greeting, acknowledgment, compliment, or enthusiastic phrase.
7. Do not repeat the user's question unless clarification or restatement is useful.
8. Do not end every message with a follow-up question.
9. Avoid generic closing statements and unnecessary offers of additional assistance.
10. Allow conversations to flow naturally from one message to the next.

CONTEXTUAL AWARENESS
Use the available conversation history to understand references, remember relevant details within the conversation, and avoid asking for information already supplied.
Recognize whether the user is asking a new question, continuing an earlier topic, correcting a previous answer, making a joke, sharing news, expressing frustration, or simply chatting.
Respond appropriately to the user's actual intent.
If the user corrects you, acknowledge the correction briefly and update your reasoning. Do not become defensive or repeat the same mistake.
Do not assume the user's emotions or intentions without sufficient evidence.

NATURAL EMOTIONAL EXPRESSION
When the user shares good news, respond with genuine-seeming conversational enthusiasm appropriate to the occasion.
When the user is confused, slow down and explain differently.
When the user is frustrated, acknowledge the difficulty without giving a long emotional speech.
When the user is tired, do not automatically turn the conversation into a productivity lecture.
When the user jokes, recognize the humor and respond naturally when appropriate.
When the user wants a direct answer, give it without unnecessary encouragement or commentary.
Avoid canned empathy such as repeatedly saying "I understand how you feel." Demonstrate understanding through relevant, specific responses.

HUMOR AND PLAYFULNESS
Use light humor, witty observations, and occasional playful language when they fit the context.
Never force a joke into a serious discussion.
Do not overuse slang, internet expressions, emojis, exclamation marks, or exaggerated reactions.
Adapt naturally to the user's communication style without imitating them excessively or stereotyping their language.

ACADEMIC TEACHING
When tutoring, act like an excellent private tutor who explains difficult ideas simply.
Identify the likely source of confusion, break complicated concepts into manageable steps, use relevant examples, and check the reasoning before presenting an answer.
Do not automatically turn casual conversation into a lesson.
Do not oversimplify advanced questions when the user needs technical depth.
For mathematical problems, prioritize correctness, logical reasoning, and clear working. Never sacrifice accuracy for conversational style. Format formulas cleanly using LaTeX ($...$).

RESPONSE LENGTH
Use the minimum length needed to answer well.
A simple greeting may need only a few words (e.g., "Hey! What's up?"). A direct factual question may need only a single word or short phrase (e.g. "Tokyo."). A difficult mathematics problem may require a complete step-by-step explanation.
Do not pad responses with introductions, repetitive summaries, generic conclusions, or unnecessary disclaimers.

FOLLOW-UP QUESTIONS
Ask a question only when it meaningfully advances the conversation, resolves an important ambiguity, or helps the user reach their goal.
When the answer is already clear, answer directly instead of asking unnecessary questions.

HONESTY AND REASONING
Never invent facts, claim to have performed actions you have not performed, or pretend certainty when uncertain.
Distinguish established facts from assumptions.
If a question is ambiguous, use context to interpret it when reasonable. Otherwise, ask a concise clarifying question.
Do not claim human emotions, memories, experiences, or personal relationships that you do not actually possess.

NATURALNESS TEST
Before responding, silently evaluate:
- What does the user actually want?
- What tone fits this moment?
- What information is necessary?
- What would make this response feel conversational rather than scripted?
LIVE INTERNET ACCESS, MULTI-WEBSITE RESEARCH & SOURCE-SYNTHESIZED ANSWERS
The required research workflow is: RESEARCH → READ → ANALYZE → SYNTHESIZE → ANSWER → CITE.
- ANSWER DIRECTLY IN CHAT: Do NOT merely provide a brief intro followed by a list of links, leaving the user to do the research themselves. Users must NEVER have to open several links to obtain the answer StudPal should have provided. Retrieve the information, analyze it across sources, and provide the comprehensive answer directly in the chat!
- Dynamically use web research whenever:
  * The student asks for current events, latest scientific discoveries, fresh news, or up-to-date information.
  * Fact-checking academic theories, papers, statistics, dates, or official documentation.
  * Researching real-world entities, historical events, books, institutions, or technologies.
  * The student explicitly asks you to research, search, look up, or browse online.
  * Asking about current rankings (e.g. world's richest people in 2026), statistics, or comparisons (e.g. solar energy vs biomass in Nigeria).
- SYNTHESIS & INLINE CITATION RULES:
  * FOR CURRENT RANKINGS & STATISTICS: Provide the actual ranked list with names, net worths, ranking positions, and publication/update dates directly in the chat. Explain any discrepancies or differences in reporting dates.
  * FOR EDUCATIONAL EXPLANATIONS: Provide a coherent, detailed educational explanation organized with headings and terminology. The final answer must be useful even if the user never clicks a link.
  * FOR COMPARISONS: Directly compare options across concrete technical, economic, geographical criteria, advantages, and trade-offs.
  * FOR SOURCE-SPECIFIC INQUIRIES (when a URL is provided): Inspect the retrieved webpage content and summarize the actual findings. If access fails, disclose it honestly. Never invent article contents.
  * CITATIONS: Attach citations directly next to the factual claims, figures, and statements they substantiate using Markdown links (e.g. [Forbes](URL) or [Nature](URL)). Never invent citations or cite sources that do not support the claim.
  * AVOID UNANNOTATED LINK DUMPS: Do NOT dump a long, unannotated list of links at the end of every response as a substitute for answering.
  * MANDATORY REQUIREMENT: PUBLICLY ACCESSIBLE SOURCES ONLY (NO LOGIN, NO PAYWALL):
    StudPal strictly enforces a no-login, no-paywall source accessibility policy for all research:
    1. ZERO-RESTRICTION CITATIONS: Every source cited and attached for students must be freely accessible to an ordinary user without creating an account, signing in, paying, using institutional/university accounts, or requesting special permissions.
    2. REJECT RESTRICTED ARTICLES & ABSTRACT-ONLY PREVIEWS: Do NOT cite articles where only the title or abstract is visible while the full text requires payment or institutional login. Never rely on an inaccessible source's claims as though its full text had been verified.
    3. CITE LEGITIMATE OPEN ALTERNATIVES: When researching topics where commercial publishers use paywalls, cite legitimate open-access alternatives:
       - PubMed Central (PMC), arXiv, bioRxiv, medRxiv
       - Peer-reviewed open-access journals (PLOS, DOAJ, Frontiers, BioMed Central)
       - Open educational resources (Nature Scitable, Khan Academy, OpenStax, NCBI Bookshelf)
       - Official public datasets and government repositories (.gov, .gov.ng, World Bank, WHO, UN, IRENA)
       - Reputable open news outlets without login barriers (BBC, AP News, NPR, The Conversation)
    4. NEVER cite unauthorized or pirated copies to circumvent paywalls.
    5. HONEST REPORTING: If sufficient open-access sources cannot be found for a niche claim, tell the user that the available public evidence is limited rather than filling the answer with restricted links.

QUIZZES AND PRACTICE TESTS
When asked to quiz the user, test their knowledge, or generate practice questions, present the questions and multiple-choice options ONLY. NEVER include the answers, answer keys, or explanations in the same message. Always prompt the student to submit their answers first (e.g. "Reply with your answers and I'll grade them!").

HUMAN-READABLE RESPONSES (STRICTLY NO RAW XML, JSON, OR MACHINE TAGS IN CHAT)
- Respond in natural, conversational language appropriate for a thoughtful, friendly educational companion.
- Use plain text and standard Markdown (such as **bold** and bullet points) when helpful.
- NEVER expose raw XML tags, JSON objects, YAML, internal schemas, tool payloads, or implementation details to users in ordinary chat responses.
- Do not wrap ordinary explanations in code blocks.
- Do not invent structured outputs when the user has requested a normal explanation.
- For creative requests, provide understandable descriptions, ideas, visual concepts, composition suggestions, colors, styles, and other relevant information.
- If the user asks for a prompt to use in an external image-generation tool (e.g. Midjourney, DALL-E), provide a polished, copyable text prompt in plain text without XML or JSON.
- Ask a clarifying question only when necessary.

INTENT CLASSIFICATION AND HANDLING
Before generating a response, classify the user's latest message using the conversation context:
- IMAGE_CREATION: The user wants an image created or generated.
- IMAGE_PROMPT_REQUEST: The user wants a detailed image-generation prompt for ChatGPT, Midjourney, DALL-E, or an external image generator.
- INFORMATION_REQUEST: The user wants an explanation, facts, or guidance.
- IMAGE_EXPLANATION: The user wants to understand an existing image or diagram.
- EDUCATIONAL_DIAGRAM: The user wants an educational diagram or visual representation.
- EXPLICIT_CODE_REQUEST: The user explicitly asks for code or markup.
- MEMORY_RECALL: The user asks what you remember or for a recap.
- SOURCE_SPECIFIC: The user provides a URL or asks about a specific article/website.
- CURRENT_INFORMATION: The user asks for current rankings, statistics, or up-to-date facts.
- DEEP_RESEARCH: The user asks for a comparison, multi-source investigation, or cross-referencing.
- WEB_RESEARCH: The user explicitly asks to search/research the web.
- GENERAL_ANSWER: Simple conversational or math queries answerable directly without research.
- OTHER: Any other request.

Use this classification to guide response generation, not as content displayed to the user.

RULES FOR EACH INTENT:
1. IMAGE_CREATION (The user requests an image, drawing, or visual representation):
   StudPal cannot generate images directly.
   - State the limitation naturally and briefly in 1 to 2 sentences.
   - Do NOT pretend an image or diagram was created.
   - Do NOT invent an image, diagram, illustration, preview, or technical breakdown of an imaginary diagram as a substitute without explaining the limitation.
   - Offer ONE useful alternative when appropriate, such as explaining the subject, providing a text-based educational overview, or helping the user write an image-generation prompt for another tool.
   - Keep the response PROPORTIONAL to the request. A short request must NEVER trigger a long technical essay or unsolicited list of anatomical structures.
   - Example:
     User: "Create an image of a penis."
     Good response: "I can't generate images directly, but I can explain the anatomy or help you write a prompt for an educational anatomical illustration."
     User: "Create an image of a futuristic city."
     Good response: "I can't generate images directly, but I can help you develop the idea or write a prompt for an external image generator. What kind of atmosphere are you envisioning?"
   - Do NOT automatically produce a list of anatomical structures or diagram layers unless the user asks for that information.
   - Never output SVG, XML, CSS, HTML, canvas, ASCII art, or drawing source code.

2. IMAGE_PROMPT_REQUEST (The user asks for a prompt for an external image generator such as ChatGPT, DALL-E, Midjourney, etc.):
   - A follow-up request for an image prompt MUST override any previous image-generation refusal. Do NOT repeat that you cannot generate images!
   - Resolve the subject from the conversation history (e.g. if the user previously asked for an image of the human heart, and now says "Give me a prompt to give to ChatGPT to create the image", the subject is the human heart).
   - Do NOT ask the user to restate an already known subject.
   - Do NOT lecture on anatomy or give a generic explanation instead of the prompt.
   - Generate a complete, polished, highly specific image-generation prompt tailored to the subject.
   - NEVER include conversational request phrases such as "give to chatGPT", "give to chatgpt to", or request boilerplate. The prompt must describe ONLY visual details.
   - Include: subject, purpose, composition/camera angle/framing, visual details and textures, artistic style (photorealistic, 3D medical render, cinematic concept art, textbook diagram, etc.), lighting, color palette, background, and accuracy/annotations when relevant.
   - Format:
     1. Brief intro: One short sentence stating the prompt is ready to copy and use.
     2. Image prompt block: Formatted strictly as:
        > **Prompt:** "[Complete detailed image prompt]"
     3. Optional refinement: One short sentence offering to tweak the style, perspective, or details.
   - If the subject genuinely cannot be determined from either the current prompt or previous messages, ask one concise clarifying question.
   - NEVER output XML, SVG, HTML, CSS, or JSON.

3. INFORMATION_REQUEST (The user wants an explanation, facts, or guidance):
   - If the user asks for information about a subject (including anatomy, physiology, or how things work), provide a direct, useful explanation in plain language.
   - Never default to XML, SVG, HTML, CSS, JSON, source code, or diagram markup.
   - Never describe imaginary output as though an actual image has been generated.
   - Use technical terminology only when it improves the explanation, and explain unfamiliar terms where necessary.
   - Do NOT confuse an image-generation request with a request to explain the subject.
     If the user asks "Explain the anatomy of the penis" or "Explain how the heart works", answer directly with clear educational prose. Do NOT refuse or say "I can't generate images" when no image was requested!
   - Respect educational context and provide appropriate, non-graphic anatomy explanations when relevant.
   - If the user asks for a prompt to use in an external image-generation tool (e.g. Midjourney, DALL-E), provide a polished, copyable text prompt in plain text without XML, JSON, or code blocks.

4. EDUCATIONAL_DIAGRAM (The user asks for an educational diagram description or structure):
   - When a user asks for an educational diagram (e.g. "Describe an anatomical cross-section diagram", "What should this diagram look like?"):
   - Provide a clear, natural-language educational description in plain English.
   - Describe the layout, orientation, key structures, layers, distinct colors, labels, and functions in clear prose and bullet points.
   - Example:
     User: "Describe an anatomical cross-section diagram."
     Response: "The diagram should show a clearly labelled cross-section, with each major structure identified and explained. Use distinct colours to differentiate the layers, and include a legend to help students understand their functions."
   - Do NOT output SVG, XML, CSS, HTML, or code unless explicitly requested.

5. EXPLICIT_CODE_REQUEST (The user explicitly asks for code or markup):
   - If the user explicitly requests code or technical markup (e.g., "Write SVG code for an anatomical diagram", "Show me the XML structure for this data"), provide valid, well-structured code inside a markdown code block.

6. PRESERVE CONVERSATIONAL CONTEXT:
   - Use previous messages to understand follow-ups, but prioritize the user's latest explicit intent.
   - Example:
     User: "Create an image of the human heart."
     Assistant: Explains that direct image generation is unavailable and offers an alternative.
     User: "Okay, tell me how it works."
     The second response MUST explain how the heart works in normal prose. It must NOT output diagram code or repeat the image-generation refusal!

When the student submits their answers (e.g., "1A, 2B, 3C" or "A, B, C") or asks to check their results:
- Grade each question individually (e.g. "Question 1: ✅ Correct", "Question 2: ❌ Incorrect - the correct choice was B").
- State the overall score clearly (e.g. "Score: 2/3 (67%)").
- Provide clear, intuitive explanations for each question so the student learns from any mistakes.
- Maintain an encouraging and constructive tone.

DYNAMIC CONTEXTUAL FOLLOW-UP SUGGESTIONS
At the very end of your response, output a single line with 3 to 4 concise, context-aware follow-up prompts or natural next questions the student might ask based on this conversation, formatted strictly as:
SUGGESTIONS: ["Follow-up 1", "Follow-up 2", "Follow-up 3"]
Keep each suggestion short (2 to 6 words) so it works as a quick tap chip. Never mention this format in your main explanation text.

Your final response should feel relevant, natural, intelligent, and appropriately expressive—not like a template generated by a machine.`;

/**
 * Safely converts unexpected SVG/XML/CSS/diagram code into natural human-readable prose
 */
function convertMarkupToReadableExplanation(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';

  // 1. Extract any natural prose already present before or after the code block
  let outsideProse = raw
    .replace(/```(?:xml|svg|html)?\s*[\s\S]*?```/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<diagram[\s\S]*?<\/diagram>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();

  // 2. Extract meaningful text, labels, and components from inside the markup
  const extractedItems: string[] = [];

  // Extract <component name="...">...</component>
  const compMatches = raw.matchAll(/<component(?:\s+name="([^"]+)")?[^>]*>([\s\S]*?)<\/component>/gi);
  for (const m of compMatches) {
    const name = m[1]?.trim();
    const content = m[2]?.replace(/<[^>]+>/g, '').trim();
    if (content) {
      extractedItems.push(name ? `**${name}:** ${content}` : content);
    }
  }

  // Extract <text...>...</text> and <tspan...>...</tspan> from SVG
  const textMatches = raw.matchAll(/<(?:text|tspan)[^>]*>([\s\S]*?)<\/(?:text|tspan)>/gi);
  for (const m of textMatches) {
    const textContent = m[1]?.replace(/<[^>]+>/g, '').trim();
    if (textContent && textContent.length > 1 && !/^\d+(?:\.\d+)?$/.test(textContent) && !/^(M|L|C|Z|V|H)\s*-?\d+/i.test(textContent)) {
      if (!extractedItems.includes(textContent)) {
        extractedItems.push(textContent);
      }
    }
  }

  // Extract <title>...</title> and <desc>...</desc>
  const titleMatch = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descMatch = raw.match(/<desc[^>]*>([\s\S]*?)<\/desc>/i);
  const diagramTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
  const diagramDesc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';

  // Extract <step title="...">...</step> or <item title="...">...</item>
  const stepMatches = raw.matchAll(/<(?:step|item)(?:\s+title="([^"]+)")?[^>]*>([\s\S]*?)<\/(?:step|item)>/gi);
  for (const m of stepMatches) {
    const title = m[1]?.trim();
    const content = m[2]?.replace(/<[^>]+>/g, '').trim();
    if (content) {
      extractedItems.push(title ? `**${title}:** ${content}` : content);
    }
  }

  // Build the human-readable explanation
  let explanation = '';
  if (outsideProse && outsideProse.length > 20) {
    explanation = outsideProse;
  }

  if (diagramTitle) {
    explanation += explanation ? `\n\n### ${diagramTitle}\n` : `### ${diagramTitle}\n`;
  }
  if (diagramDesc) {
    explanation += `\n${diagramDesc}\n`;
  }

  if (extractedItems.length > 0) {
    explanation += `\n\n**Key Structures & Diagram Labels:**\n`;
    extractedItems.forEach((item) => {
      explanation += `- ${item}\n`;
    });
    explanation += `\nEach structure should be clearly delineated with distinct colors, leader lines, and an indexed legend to help clarify their roles and biological functions.`;
  }

  if (explanation.trim().length > 30) {
    return explanation.trim();
  }

  // Fallback for unexpected markup without explicit text
  if (/cross-section|anatomical/i.test(raw)) {
    return "The diagram should show a clearly labelled cross-section, with each major structure identified and explained. Use distinct colours to differentiate the layers, and include a legend to help students understand their functions.";
  }
  return "I'm ready to help explain this concept! What specific aspect would you like to break down step-by-step?";
}

/**
 * Validates whether an extracted string is an invalid subject candidate
 * (e.g., meta-instructions, tool names, conversational boilerplate, or pronouns).
 */
function isInvalidSubject(candidate: string | null | undefined): boolean {
  if (!candidate || typeof candidate !== 'string') return true;
  const trimmed = candidate.trim().toLowerCase();
  if (trimmed.length < 2) return true;

  // 1. External tool or platform mentions
  if (/\b(?:chatgpt|midjourney|dall-e|stable\s+diffusion|ai\s+generator|image\s+generator)\b/i.test(trimmed)) {
    return true;
  }

  // 2. Request, instructional, or prompt phrasing
  if (/\b(?:give\s+to|to\s+give|write\s+a\s+prompt|give\s+me\s+a\s+prompt|create\s+the\s+image|make\s+the\s+image|generate\s+the\s+image|create\s+this\s+image|generate\s+this\s+image|i\s+can\s+use|can\s+use|to\s+use|use\s+to|use\s+instead|instead\s+of)\b/i.test(trimmed)) {
    return true;
  }

  // 3. Pure pronouns, placeholders, or meta terms
  if (/^(?:the|this|that|an?)\s+(?:image|picture|drawing|photo|illustration|diagram|graphic|one|it|subject|topic|scene)|^(?:image|picture|drawing|photo|illustration|diagram|graphic|one|it|this|that|something|what\s+we\s+discussed|the\s+image\s+we\s+(?:were\s+)?discussing|the\s+subject\s+we\s+discussed|the\s+one\s+we\s+discussed|this\s+image|that\s+image|this\s+picture|the\s+picture|this\s+drawing|the\s+drawing|prompt|image\s+prompt|detailed\s+prompt)$/i.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Extracts and resolves the visual subject for an image prompt request
 * using both the current prompt and recent conversation history
 */
function extractImageSubjectFromContext(rawQuery: string, conversationHistory: any[] = []): string | null {
  if (!rawQuery || typeof rawQuery !== 'string') return null;

  // 1. Check for explicit subject in current query
  let explicitCandidate: string | null = null;

  // Strip leading request boilerplate e.g. "Give me a prompt to give to ChatGPT to create an image of..."
  const cleanedQuery = rawQuery
    .replace(/^(?:can you|could you|please|hey studpal|studpal|hey nia|nia)?\s*(?:give|write|help|create|generate|provide|show|craft|draft|compose)\s+(?:me\s+)?(?:a\s+|the\s+)?(?:detailed\s+|good\s+|copyable\s+)?(?:image(?:\s+generation)?\s+)?prompt\s*(?:to\s+give\s+(?:to\s+)?(?:chatgpt|midjourney|dall-e|an?\s+ai\s+generator|an?\s+ai\s+image\s+generator)?\s*)?(?:to\s+(?:use|create|generate|make|render)|for\s+(?:chatgpt|midjourney|dall-e|stable\s+diffusion|an?\s+ai\s+image\s+generator|an?\s+ai\s+generator)|(?:that\s+)?i\s+can\s+use\s+(?:to\s+(?:generate|create|make)\s*)?)?\s*(?:an?|the|this|that)?\s*(?:image|picture|photo|illustration|graphic|art|scientific\s+diagram|diagram|schematic)?\s*(?:of|about|for|to|depicting|showing)?\s*/i, '')
    .replace(/[?.,!]+$/, '')
    .trim();

  if (cleanedQuery && !isInvalidSubject(cleanedQuery)) {
    const c = cleanedQuery
      .replace(/\s+(?:for|to\s+give\s+to|using|in)\s+(?:chatgpt|midjourney|dall-e|stable\s+diffusion|an?\s+ai\s+image\s+generator|an?\s+ai\s+generator).*$/i, '')
      .trim();
    if (!isInvalidSubject(c)) {
      explicitCandidate = c;
    }
  }

  // Also check if explicit subject was introduced by "for <subject>" or "of <subject>" in original query
  if (!explicitCandidate || isInvalidSubject(explicitCandidate)) {
    const prepMatch = rawQuery.match(/(?:\bfor|\bof|\babout|\bshowing|\bdepicting|\bfeaturing)\s+(?!chatgpt|midjourney|dall-e|an?\s+ai\s+generator|an?\s+image\s+generator|the\s+image|this\s+image|an?\s+image|a\s+picture|the\s+picture|this\s+picture)([^?.!,]+)/i);
    if (prepMatch && prepMatch[1]) {
      let candidate = prepMatch[1].trim();
      candidate = candidate
        .replace(/\s+(?:for|to\s+give\s+to|using|in)\s+(?:chatgpt|midjourney|dall-e|stable\s+diffusion|an?\s+ai\s+image\s+generator|an?\s+ai\s+generator).*$/i, '')
        .trim();
      if (!isInvalidSubject(candidate)) {
        explicitCandidate = candidate;
      }
    }
  }

  if (explicitCandidate && !isInvalidSubject(explicitCandidate)) {
    return explicitCandidate;
  }

  // 2. Resolve anaphoric references from conversationHistory (scanning latest turns first)
  if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
    const reversed = [...conversationHistory].reverse();

    for (const msg of reversed) {
      const text = typeof msg === 'string' ? msg : msg?.text || '';
      if (!text || typeof text !== 'string') continue;

      // Check for prior diagram request: e.g. "Describe an anatomical cross-section diagram of the kidney"
      const specificDiagMatch = text.match(/(?:\bdiagram of|\bcross-section of|\bcross section of|\billustration of|\bstructure of)\s+([^?.!,]+)/i);
      if (specificDiagMatch && specificDiagMatch[1]) {
        const candidate = specificDiagMatch[1].trim();
        if (!isInvalidSubject(candidate)) {
          return candidate;
        }
      }

      // Check for prior image creation request: e.g. "Create an image of the human heart"
      const imageMatch = text.match(/(?:create|generate|draw|make|paint|render|sketch|produce)\s+(?:me\s+)?(?:an?\s+)?(?:image|picture|drawing|photo|illustration|graphic|art|diagram)?\s*(?:of|about|for)\s+([^?.!,]+)/i);
      if (imageMatch && imageMatch[1] && imageMatch[1].trim().length > 1) {
        const candidate = imageMatch[1].trim();
        if (!isInvalidSubject(candidate)) {
          return candidate;
        }
      }

      // Check for general describe diagram
      const genDiagMatch = text.match(/(?:describe)\s+(?:an?\s+)?(?:[a-zA-Z0-9_\-\s]+)?(?:diagram|cross-section|cross section|illustration)\s+(?:of|for|about)\s+([^?.!,]+)/i);
      if (genDiagMatch && genDiagMatch[1]) {
        const candidate = genDiagMatch[1].trim();
        if (!isInvalidSubject(candidate)) {
          return candidate;
        }
      }

      // Check for prior subject inquiry: e.g. "Explain the anatomy of the penis", "Explain how the heart works"
      const infoMatch = text.match(/(?:explain|break down|tell me about|how does|what is)\s+(?:how\s+)?(?:the\s+)?(?:anatomy of\s+)?([^?.!,]+?)(?:\s+works|\s+work|\s+functions|\?|$)/i);
      if (infoMatch && infoMatch[1] && infoMatch[1].trim().length > 1) {
        let candidate = infoMatch[1].trim();
        candidate = candidate.replace(/^(?:how\s+)?(?:the\s+)?/i, '').trim();
        if (!isInvalidSubject(candidate)) {
          return candidate;
        }
      }

      // Check for study / topic inquiries: e.g. "study photosynthesis", "learn about the water cycle", "focus on plant cell"
      const topicMatch = text.match(/(?:study|learn about|understand|talking about|topic is|focus on)\s+(?:the\s+)?([^?.!,]+)/i);
      if (topicMatch && topicMatch[1] && topicMatch[1].trim().length > 1) {
        let candidate = topicMatch[1].trim();
        candidate = candidate.replace(/^(?:the\s+|an?\s+)/i, '').trim();
        if (!isInvalidSubject(candidate)) {
          return candidate;
        }
      }
    }
  }

  return null;
}

export const USER_INTENTS = {
  IMAGE_CREATION: 'IMAGE_CREATION',
  INFORMATION_REQUEST: 'INFORMATION_REQUEST',
  IMAGE_EXPLANATION: 'IMAGE_EXPLANATION',
  EDUCATIONAL_DIAGRAM: 'EDUCATIONAL_DIAGRAM',
  IMAGE_PROMPT_REQUEST: 'IMAGE_PROMPT_REQUEST',
  EXPLICIT_CODE_REQUEST: 'EXPLICIT_CODE_REQUEST',
  MEMORY_RECALL: 'MEMORY_RECALL',
  SOURCE_SPECIFIC: 'SOURCE_SPECIFIC',
  CURRENT_INFORMATION: 'CURRENT_INFORMATION',
  DEEP_RESEARCH: 'DEEP_RESEARCH',
  WEB_RESEARCH: 'WEB_RESEARCH',
  GENERAL_ANSWER: 'GENERAL_ANSWER',
  OTHER: 'OTHER',
};

/**
 * Classifies the student's latest message intent
 */
function classifyUserIntent(rawQuery: string, conversationHistory: any[] = []): string {
  if (!rawQuery || typeof rawQuery !== 'string') return 'OTHER';
  const lower = rawQuery.trim().toLowerCase();

  // 1. Explicit Code Request
  const isExplicitCode =
    /(?:write|show|give|create|generate|provide|produce)\s+(?:me\s+)?(?:the\s+)?(?:raw\s+)?(?:svg|xml|html|css|json|python|javascript|typescript|c\+\+|sql|code)\b/i.test(lower) ||
    /(?:svg|xml|html|css|json|sql)\s+(?:code|structure|markup|snippet)/i.test(lower) ||
    /\b(?:source\s+code|programming\s+code|raw\s+code)\b/i.test(lower);

  if (isExplicitCode) return 'EXPLICIT_CODE_REQUEST';

  // 2. Source-Specific Request: user supplies a URL or asks to read/inspect/summarize a specific link
  const hasUrl = /https?:\/\/[^\s<>"'{}|\\^`\[\]]+/i.test(rawQuery) ||
    /(?:summarize|analyze|inspect|read|findings of)\s+(?:this|the)\s+(?:article|website|page|url|link|paper|doc)\b/i.test(lower);

  if (hasUrl) return 'SOURCE_SPECIFIC';

  // 3. Educational Diagram Request
  const isEducationalDiagram =
    /(?:describe|structure of|layout of|how should|how to structure|how to design|what should)\s+(?:an?\s+)?(?:[a-zA-Z0-9_\-\s]+)?(?:diagram|cross-section|cross section|flowchart|infographic|schematic)\b/i.test(lower) ||
    /(?:what should|how should)\s+(?:the|this|an?)\s+(?:diagram|image|illustration)\s+(?:look like|include|show)\b/i.test(lower);

  if (isEducationalDiagram) return 'EDUCATIONAL_DIAGRAM';

  // 4. Image Prompt Request: user asks for an image-generation prompt (e.g. for ChatGPT, Midjourney, DALL-E)
  const isImagePromptRequest =
    /(?:give|write|help|create|generate|provide|show|craft|draft|compose)\s+(?:me\s+)?(?:a\s+|the\s+)?(?:detailed\s+|good\s+|copyable\s+)?(?:image(?:\s+generation)?\s+)?prompt\b/i.test(lower) ||
    /prompt\s+(?:to\s+give|for|to\s+use|i\s+can\s+use|to\s+create|to\s+generate|to\s+make)\b/i.test(lower) ||
    /(?:prompt\s+for\s+(?:an?\s+)?(?:ai\s+)?(?:image\s+generator|chatgpt|dall-e|midjourney|stable\s+diffusion))/i.test(lower) ||
    /(?:write\s+(?:the|a)\s+prompt\s+for\s+(?:the|this|that|our)\s+(?:image|picture|diagram|subject|topic))/i.test(lower) ||
    /(?:give\s+me\s+(?:a|the)\s+prompt\s+to\s+use\s+instead)/i.test(lower) ||
    /(?:prompt\s+to\s+create\s+(?:the|this|that)\s+(?:image|picture|diagram))/i.test(lower) ||
    /(?:image\s+prompt|prompt\s+for\s+(?:an?\s+)?(?:image|picture|scientific\s+diagram|diagram)|prompt\s+for\s+this\s+picture)/i.test(lower) ||
    /(?:help\s+me\s+(?:create|write|draft|make)\s+(?:a\s+)?(?:detailed\s+)?image\s+prompt)/i.test(lower) ||
    /(?:can\s+you\s+write\s+(?:a|the)\s+prompt|prompt\s+i\s+can\s+(?:give|feed|copy|use))/i.test(lower);

  if (isImagePromptRequest) return 'IMAGE_PROMPT_REQUEST';

  // 5. Memory Recall: user asks about past discussions, previous questions, or what StudPal remembers
  const isMemoryRecall =
    /(?:do you remember|what do you remember|remember me|remember what|can you recall|do you recall|what did (?:i|we) (?:discuss|talk about|ask|do)|what was (?:my|the) (?:last|previous) (?:question|prompt|topic|discussion)|what were we talking about|what have we covered|recap our (?:session|chat|discussion)|summarize (?:what we|our conversation)|tell me what (?:i|we) (?:asked|said|did))\b/i.test(lower);

  if (isMemoryRecall) return 'MEMORY_RECALL';

  // 6. Image Explanation
  const isImageExplanation =
    /(?:explain|break down|analyze|interpret|what does|what is)\s+(?:this|the|attached)\s+(?:image|diagram|chart|figure|photo|picture)\b/i.test(lower);

  if (isImageExplanation) return 'IMAGE_EXPLANATION';

  // 7. Image Creation Request
  const isAskingForPrompt = /(?:prompt\s+for|prompt\s+to|midjourney|dall-e|stable diffusion)/i.test(lower);
  const isImageCreation =
    !isAskingForPrompt &&
    (/(?:create|generate|draw|make|paint|render|sketch|produce)\s+(?:me\s+)?(?:an?\s+)?(?:image|picture|drawing|photo|illustration|graphic|art)\b/i.test(lower) ||
      /^(?:draw|paint|sketch)\s+(?:me\s+)?(?:an?\s+)?/i.test(lower) ||
      /(?:can you|could you|please)\s+(?:draw|paint|sketch|create an image|generate an image|make a picture)\b/i.test(lower));

  if (isImageCreation) return 'IMAGE_CREATION';

  // 8. Casual Conversation & Help Requests (No research needed)
  const isCasualConversation =
    /^(?:i\s+need\s+(?:ur|your|some)?\s*help|help\s*me|can\s+you\s+help\s*(?:me)?|help|need\s+help|assist\s+me|i\s+have\s+a\s+question|are\s+you\s+there|what\s+can\s+you\s+do|how\s+are\s+you)\b/i.test(lower) ||
    /^(?:hi|hello|hey|hey studpal|hello studpal|hi studpal|sup|whats up|howdy|thank you|thanks|good morning|good evening|good afternoon|ok|okay|cool|awesome|got it|sounds good)\b/i.test(lower);

  if (isCasualConversation) return 'CASUAL_CONVERSATION';

  // 9. General Simple Calculation (No web research needed)
  const isGeneralSimple =
    /^(?:what is\s+|calculate\s+|solve\s+)?\d+\s*[\+\-\*\/]\s*\d+\s*\??$/i.test(lower);

  if (isGeneralSimple) return 'GENERAL_ANSWER';

  // 9. Current Information Request (Rankings, Net Worths, Billionaires, Latest Events)
  const isCurrentInfo =
    /(?:richest (?:people|person|man|men|woman|women)|billionaires?|net worth|wealthiest|who are the richest|list (?:the )?(?:world'?s? )?richest|ranking of|top \d+ richest|latest news|current news|today'?s? news|who won|election results?|stock price of|in 2025|in 2026|current president|current prime minister|current population|inflation rate in)/i.test(lower);

  if (isCurrentInfo) return 'CURRENT_INFORMATION';

  // 10. Deep Research / Comparison across multiple sources
  const isDeepResearch =
    /(?:compare|comparison between|versus|\bvs\b|pros and cons of|which is better for|trade-offs? between|cross-reference|multi-source|investigate the impact)/i.test(lower);

  if (isDeepResearch) return 'DEEP_RESEARCH';

  // 11. Explicit Web Research & Citation Requests
  const isWebResearch =
    /(?:search (?:the web|online|google|internet)|look up online|browse online|find online|research (?:online|on the web)|provide (?:reliable\s+)?sources|with citations|cite (?:your\s+)?sources)/i.test(lower);

  if (isWebResearch) return 'WEB_RESEARCH';

  // 12. Information Request
  const isInfo =
    /(?:explain|how does|how do|what is|what are|why is|why does|tell me|teach me|describe|walk me through|solve|calculate|give me|help me with|how can|how to)\b/i.test(lower) ||
    /(?:how it works|how they work|tell me how|tell me about|more details|overview of)/i.test(lower) ||
    isAskingForPrompt;

  if (isInfo) return 'INFORMATION_REQUEST';

  return 'OTHER';
}

/**
 * Safely converts model output to human-readable responses
 * Parses unexpected XML/JSON, unwraps content fields, and strips internal thoughts
 * If conversion completely fails, shows a user-friendly message rather than raw markup
 */
function convertToHumanReadable(raw: string, mode: string = 'general', isExplicitCode: boolean = false): {
  text: string;
  thoughtProcess: string | null;
  latexFormula: string | null;
  steps: any[] | null;
  example: string | null;
} {
  if (!raw || typeof raw !== 'string') {
    return {
      text: "I'm ready to help! What would you like to explore next?",
      thoughtProcess: null,
      latexFormula: null,
      steps: null,
      example: null,
    };
  }

  let text = raw.trim();

  // Extract internal reasoning / thinking tags before removing them (<think>...</think>, <thought>...</thought>, etc.)
  let thoughtProcess: string | null = null;
  const thinkMatch = text.match(/<(?:think|thought|reasoning)>([\s\S]*?)<\/(?:think|thought|reasoning)>/i);
  if (thinkMatch && thinkMatch[1] && thinkMatch[1].trim().length > 0) {
    thoughtProcess = thinkMatch[1].trim();
  }

  // 1. Remove internal reasoning / thinking tags completely (<think>...</think>, <thought>...</thought>, etc.)
  text = text.replace(/<think[\s\S]*?<\/think>/gi, '');
  text = text.replace(/<thought[\s\S]*?<\/thought>/gi, '');
  text = text.replace(/<reasoning[\s\S]*?<\/reasoning>/gi, '');
  text = text.replace(/<reflection[\s\S]*?<\/reflection>/gi, '');
  text = text.replace(/<analysis[\s\S]*?<\/analysis>/gi, '');

  // 2. Intelligently convert unexpected XML / SVG / CSS diagram code blocks into readable explanations
  // (Do NOT convert if the user explicitly asked for code!)
  if (!isExplicitCode && /```(?:xml|svg|html)|<(?:\?xml|svg|diagram|canvas|component)/i.test(text)) {
    text = convertMarkupToReadableExplanation(text);
  }

  // 3. Detect and safely convert unexpected JSON output in normal chat
  let jsonString = '';
  const jsonCodeMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonCodeMatch && (jsonCodeMatch[1].trim().startsWith('{') || jsonCodeMatch[1].trim().startsWith('['))) {
    jsonString = jsonCodeMatch[1].trim();
  } else if ((text.startsWith('{') && text.endsWith('}')) || (text.startsWith('[') && text.endsWith(']'))) {
    jsonString = text;
  }

  if (jsonString) {
    try {
      const parsed = JSON.parse(jsonString);

      // Quiz structure conversion
      if (Array.isArray(parsed.questions)) {
        const title = parsed.title || 'Academic Quiz';
        let formatted = `Here is your **${title}**! 🎯\n\n`;
        parsed.questions.forEach((q: any, i: number) => {
          formatted += `### Question ${i + 1}\n${q.question}\n\n`;
          if (Array.isArray(q.options)) {
            q.options.forEach((opt: string, optIdx: number) => {
              const letter = String.fromCharCode(65 + optIdx);
              formatted += `- **${letter})** ${opt}\n`;
            });
          }
          if (i < parsed.questions.length - 1) formatted += `\n---\n\n`;
        });
        formatted += `\n\n---\n\n💬 **Reply with your answers** (e.g. **1A, 2B, 3B**) and I'll grade them and break down each question for you!`;
        return { text: formatted.trim(), thoughtProcess, latexFormula: null, steps: null, example: null };
      }

      // Flashcards structure conversion
      if (Array.isArray(parsed.cards)) {
        let formatted = `### Revision Flashcards 🗂️\n\n`;
        parsed.cards.forEach((card: any, i: number) => {
          formatted += `**Card ${i + 1}**\n- **Front:** ${card.front || ''}\n- **Back:** ${card.back || ''}\n\n`;
        });
        return { text: formatted.trim(), thoughtProcess, latexFormula: null, steps: null, example: null };
      }

      // Study plan structure conversion
      if (parsed.study_plan || parsed.plan || parsed.schedule || parsed.weeks) {
        const planData = parsed.study_plan || parsed.plan || parsed.schedule || parsed.weeks;
        let formatted = `### Your Study Plan 📅\n\n`;
        if (typeof planData === 'string') {
          formatted += planData;
        } else if (Array.isArray(planData)) {
          planData.forEach((item: any, i: number) => {
            if (typeof item === 'string') {
              formatted += `- ${item}\n`;
            } else if (item.phase || item.day || item.week || item.title) {
              const header = item.phase || item.day || item.week || item.title || `Phase ${i + 1}`;
              formatted += `#### ${header}\n`;
              if (item.focus) formatted += `- **Focus:** ${item.focus}\n`;
              if (item.tasks && Array.isArray(item.tasks)) {
                item.tasks.forEach((t: string) => { formatted += `  * ${t}\n`; });
              }
              if (item.milestone) formatted += `- **Milestone:** ${item.milestone}\n`;
              formatted += `\n`;
            }
          });
        }
        return { text: formatted.trim(), thoughtProcess, latexFormula: null, steps: null, example: null };
      }

      // Extract text content from JSON
      const extractedText = parsed.text || parsed.response || parsed.message || parsed.answer ||
        parsed.explanation || parsed.content || parsed.description || parsed.prompt || parsed.summary || parsed.result;

      if (typeof extractedText === 'string' && extractedText.trim().length > 0) {
        text = extractedText.trim();
      } else if (Array.isArray(parsed)) {
        text = parsed.map((item: any) => typeof item === 'string' ? `- ${item}` : `- ${JSON.stringify(item)}`).join('\n');
      }
    } catch (_) {}
  }

  // 4. Detect and convert XML markup
  if (/<\/?([a-zA-Z][a-zA-Z0-9_\-:]*)(?:\s+[^>]*)?>/.test(text)) {
    // Unwrap top-level response/message/content/diagram wrappers
    text = text.replace(/<\/?(?:response|output|answer|explanation|message|result|content|diagram|canvas|illustration|root|city|image|scene)[^>]*>/gi, '');

    // Transform structured XML components/items into clean readable Markdown
    text = text.replace(/<component(?:\s+name="([^"]+)")?[^>]*>([\s\S]*?)<\/component>/gi, (_match, name, content) => {
      return name ? `\n- **${name}:** ${content.trim()}` : `\n- ${content.trim()}`;
    });
    text = text.replace(/<step(?:\s+title="([^"]+)")?[^>]*>([\s\S]*?)<\/step>/gi, (_match, title, content) => {
      return title ? `\n- **${title}:** ${content.trim()}` : `\n- ${content.trim()}`;
    });
    text = text.replace(/<item(?:\s+title="([^"]+)")?[^>]*>([\s\S]*?)<\/item>/gi, (_match, title, content) => {
      return title ? `\n- **${title}:** ${content.trim()}` : `\n- ${content.trim()}`;
    });

    // Replace generic tag wrappers by keeping inner content
    text = text.replace(/<description[^>]*>([\s\S]*?)<\/description>/gi, '$1\n');
    text = text.replace(/<prompt[^>]*>([\s\S]*?)<\/prompt>/gi, '$1\n');
    text = text.replace(/<label[^>]*>([\s\S]*?)<\/label>/gi, ' (**Label:** $1)');

    // Strip any residual XML tags, but safely preserve mathematical inequalities like x < 5 or a > b
    text = text.replace(/<\/?[a-zA-Z][a-zA-Z0-9_\-:]*(?:\s+[^>]*)?>/g, '');

    // Decode common XML entities
    text = text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  // 5. Final fallback sanity check: never display raw machine markup if conversion fails
  text = text.replace(/\n{3,}/g, '\n\n').trim();
  if (!text || text.length === 0 || /^[\s{\[<]+$/.test(text)) {
    text = "I'm ready to help with your question! Could you please ask that once more or share a few more details?";
  }

  // 6. Check for standalone LaTeX formulas in $...$ or $$...$$
  let extractedFormula: string | null = null;
  const mathMatch = text.match(/\$\$([^$]+)\$\$/) || text.match(/\$([^$]+)\$/);
  if (mathMatch && mathMatch[1] && mathMatch[1].length > 3) {
    extractedFormula = mathMatch[1].trim();
  }

  return {
    text,
    thoughtProcess,
    latexFormula: extractedFormula,
    steps: null,
    example: null,
  };
}

interface WebpageExtractionResult {
  success: boolean;
  isAccessible: boolean;
  isPaywalled?: boolean;
  isAbstractOnly?: boolean;
  isPdf?: boolean;
  accessReason?: string;
  title: string;
  url: string;
  domain: string;
  content: string;
  error?: string;
  retrievedAt: string;
}

const PAYWALL_INDICATOR_PATTERNS = [
  /(?:subscribe|subscription)\s+(?:to\s+(?:continue|read|access)|required|only|plan|options)/i,
  /(?:for\s+subscribers\s+only|subscriber-only\s+content|become\s+a\s+(?:member|subscriber))/i,
  /(?:purchase|buy|rent)\s+(?:this\s+)?(?:article|issue|document|chapter|access|pdf)/i,
  /(?:paywall|metered\s+(?:paywall|access)|reached\s+your\s+(?:monthly\s+)?(?:free\s+)?(?:article\s+)?limit|remaining\s+free\s+articles)/i,
  /(?:unlock\s+(?:this\s+)?(?:article|full\s+access)|premium\s+access\s+required)/i,
  /(?:sign\s*in|log\s*in)\s+(?:to\s+(?:read|continue|view|access)|with\s+your\s+institution|via\s+your\s+institution)/i,
  /(?:institutional\s+login|access\s+through\s+your\s+institution|shibboleth|openathens)/i,
  /(?:create\s+(?:a\s+free\s+)?account\s+to\s+(?:continue|read|view|access))/i,
  /(?:already\s+a\s+subscriber\?\s*(?:log|sign)\s*in)/i,
  /(?:to\s+view\s+the\s+full\s+text,\s*(?:please\s*)?(?:sign\s*in|subscribe))/i,
];

const ABSTRACT_ONLY_PATTERNS = [
  /(?:abstract\s+only|preview\s+only|view\s+access\s+options|access\s+options)/i,
  /(?:to\s+read\s+the\s+full\s+article\s+please\s+(?:log\s*in|sign\s*in|subscribe))/i,
  /(?:full\s+text\s+(?:is\s+)?restricted|rent\s+on\s+deepdyve)/i,
  /(?:this\s+content\s+is\s+only\s+available\s+to\s+(?:members|subscribers|registered\s+users))/i,
  /(?:purchase\s+instant\s+access|get\s+access)/i,
];

const KNOWN_PAYWALLED_DOMAINS = [
  'sciencedirect.com',
  'ieeexplore.ieee.org',
  'link.springer.com',
  'onlinelibrary.wiley.com',
  'tandfonline.com',
  'jstor.org',
  'wsj.com',
  'ft.com',
  'economist.com',
  'barrons.com',
  'nytimes.com',
  'washingtonpost.com',
];

const KNOWN_OPEN_ACCESS_DOMAINS = [
  'ncbi.nlm.nih.gov',
  'arxiv.org',
  'biorxiv.org',
  'medrxiv.org',
  'plos.org',
  'plosone.org',
  'nature.com/scitable',
  'doaj.org',
  'frontiersin.org',
  'biomedcentral.com',
  'khanacademy.org',
  'openstax.org',
  'wikipedia.org',
  'wikimedia.org',
  'worldbank.org',
  'who.int',
  'un.org',
  'unesco.org',
  'irena.org',
  'iea.org',
  'gov',
  'gov.ng',
  'gov.uk',
  'europa.eu',
];

/**
 * Fetches and extracts clean, readable text from a URL for genuine source inspection.
 * Enforces strict no-login, no-paywall accessibility verification.
 * Strips HTML, scripts, styles, navigation, headers, footers, and advertising.
 */
async function fetchAndExtractWebpage(rawUrl: string): Promise<WebpageExtractionResult> {
  const timestamp = new Date().toISOString();
  let normalizedUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  let domain = 'web';
  try {
    domain = new URL(normalizedUrl).hostname.replace(/^www\./, '');
  } catch (_) {}

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7500);

    // Verify accessibility as an unauthenticated external user (no credentials or institutional headers)
    const response = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf;q=0.8,*/*;q=0.5',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    const isPdf = normalizedUrl.toLowerCase().endsWith('.pdf') || contentType.includes('application/pdf');

    if (!response.ok) {
      const isHttpPaywall = [401, 402, 403, 451].includes(response.status);
      return {
        success: false,
        isAccessible: false,
        isPaywalled: isHttpPaywall,
        isAbstractOnly: false,
        accessReason: isHttpPaywall
          ? `HTTP status ${response.status} (Authentication, subscription, or payment required)`
          : `HTTP status ${response.status}`,
        title: domain,
        url: normalizedUrl,
        domain,
        content: '',
        error: isHttpPaywall
          ? `Access restricted: HTTP ${response.status} indicates this content requires payment, subscription, or login.`
          : `HTTP status ${response.status} (${response.statusText || 'Access denied or blocked'})`,
        retrievedAt: timestamp,
      };
    }

    // Direct PDF Verification: confirm public accessibility without authentication
    if (isPdf) {
      return {
        success: true,
        isAccessible: true,
        isPaywalled: false,
        isAbstractOnly: false,
        isPdf: true,
        title: `${domain} (Public PDF Document)`,
        url: normalizedUrl,
        domain,
        content: `[Publicly Accessible PDF Document retrieved successfully from ${normalizedUrl}. File is freely readable without authentication.]`,
        retrievedAt: timestamp,
      };
    }

    const html = await response.text();

    // Extract title
    let title = domain;
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
    }

    // Strip scripts, styles, noscript, svg, navigation, footer, header, comments
    let cleanText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '')
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
      .replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Strict Paywall, Subscription & Login Indicator Detection
    let isPaywalled = false;
    let isAbstractOnly = false;
    let accessReason = '';

    for (const pattern of PAYWALL_INDICATOR_PATTERNS) {
      if (pattern.test(html) || pattern.test(cleanText)) {
        isPaywalled = true;
        accessReason = 'Subscription, paywall, or account login prompt detected in page content.';
        break;
      }
    }

    // Check for abstract-only restricted previews
    if (!isPaywalled) {
      for (const pattern of ABSTRACT_ONLY_PATTERNS) {
        if (pattern.test(html) || pattern.test(cleanText)) {
          if (cleanText.length < 2500 || /abstract\s+only|view\s+options|purchase\s+instant\s+access/i.test(cleanText)) {
            isAbstractOnly = true;
            accessReason = 'Only abstract or partial preview is visible; full text requires payment or institutional access.';
            break;
          }
        }
      }
    }

    // Check known commercial paywalled publisher domains without explicit open-access licensing
    const isKnownPaywallDomain = KNOWN_PAYWALLED_DOMAINS.some(d => domain.includes(d));
    const hasOpenAccessProof = /open\s*access|cc\s*by|creative\s*commons|freely\s*available|public\s*domain/i.test(html);
    if (isKnownPaywallDomain && !hasOpenAccessProof) {
      isPaywalled = true;
      accessReason = `Domain ${domain} is a commercial subscription publisher and page does not indicate open-access licensing.`;
    }

    if (isPaywalled || isAbstractOnly) {
      return {
        success: false,
        isAccessible: false,
        isPaywalled,
        isAbstractOnly,
        accessReason,
        title,
        url: normalizedUrl,
        domain,
        content: cleanText.slice(0, 1000),
        error: isPaywalled
          ? `Paywall / Login Requirement: This source is restricted (${accessReason}). In accordance with StudPal's strict public accessibility policy, this source cannot be cited.`
          : `Restricted Abstract Only: ${accessReason}. In accordance with StudPal's strict public accessibility policy, abstract-only sources cannot be cited as verified full text.`,
        retrievedAt: timestamp,
      };
    }

    if (cleanText.length > 5500) {
      cleanText = cleanText.slice(0, 5500) + '... [Webpage content truncated for optimal synthesis]';
    }

    if (cleanText.length < 40) {
      return {
        success: false,
        isAccessible: false,
        title,
        url: normalizedUrl,
        domain,
        content: '',
        error: 'Webpage returned insufficient text content (it may require JavaScript to render or is protected by a login wall).',
        retrievedAt: timestamp,
      };
    }

    return {
      success: true,
      isAccessible: true,
      isPaywalled: false,
      isAbstractOnly: false,
      title,
      url: normalizedUrl,
      domain,
      content: cleanText,
      retrievedAt: timestamp,
    };
  } catch (err: any) {
    const isAbort = err?.name === 'AbortError' || err?.message?.includes('aborted');
    return {
      success: false,
      isAccessible: false,
      title: domain,
      url: normalizedUrl,
      domain,
      content: '',
      error: isAbort ? 'Request timed out after 7.5 seconds.' : (err?.message || 'Network error accessing webpage.'),
      retrievedAt: timestamp,
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight
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

    // Instant JWT claim extraction for usage logging (0ms local decode, zero network round-trip)
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.slice(7);
        const payloadBase64 = token.split('.')[1];
        if (payloadBase64) {
          const payloadJson = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
          userId = payloadJson.sub || null;
        }
      } catch (_) {
        // Guest or unauthenticated user is permitted
      }
    }

    // Parse request body
    const body = await req.json();
    const {
      prompt,
      conversationHistory = [],
      mode = 'general', // 'general' | 'explanation' | 'study_plan' | 'quiz' | 'flashcards' | 'math'
      persona = 'all_round',
      teachingStyle = 'socratic',
      depth = 'balanced',
      academicLevel = 'undergraduate',
      customInstructions = '',
      language = 'en',
      brainContext = '',
      stream = false,
    } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (prompt.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Prompt exceeds maximum length of 5000 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let systemInstruction = BASE_STUDPAL_SYSTEM_PROMPT;
    systemInstruction += `\nStudent Academic Level: ${academicLevel}\nLanguage: ${language}`;

    // Persona behavioral guides
    const PERSONA_GUIDES: Record<string, string> = {
      all_round: 'Persona: Balanced, versatile, warm, and highly adaptive AI study companion.',
      advisor: 'Persona: Strategic mentor. Focus on big-picture clarity, study roadmaps, milestone planning, and long-term academic excellence.',
      librarian: 'Persona: Academic researcher and curator. Provide structured breakdowns, cite foundational concepts, and reference domain terminology accurately.',
      tutor: 'Persona: Patient, methodical private tutor. Break problems down from first principles, identify root misconceptions, and check student comprehension.',
      editor: 'Persona: Sharp, articulate editor. Prioritize conciseness, structural coherence, precise terminology, and clear logical flow.',
      roommate: 'Persona: Friendly, clever study buddy. Use approachable everyday analogies, light banter, and stress-free explanations.',
      encouraging: 'Persona: Enthusiastic coach. Celebrate curiosity, foster growth mindset, and build learning confidence.',
    };
    if (PERSONA_GUIDES[persona]) {
      systemInstruction += `\n${PERSONA_GUIDES[persona]}`;
    }

    // Teaching style guides
    const TEACHING_STYLE_GUIDES: Record<string, string> = {
      socratic: 'Teaching Style: Socratic. Ask insightful guiding questions and provide subtle clues to help the student think through the problem.',
      direct: 'Teaching Style: Direct & crisp. Provide immediate, unambiguous explanations without unnecessary preamble.',
      analogical: 'Teaching Style: Analogical. Use vivid real-world analogies to make abstract or complex concepts intuitive.',
      step_by_step: 'Teaching Style: Step-by-step. Break explanations into numbered, logical phases with actionable takeaways.',
    };
    if (TEACHING_STYLE_GUIDES[teachingStyle]) {
      systemInstruction += `\n${TEACHING_STYLE_GUIDES[teachingStyle]}`;
    }

    // Depth guides
    const DEPTH_GUIDES: Record<string, string> = {
      fast: 'Detail Level: Fast & concise. Focus on the core answer in 1-2 tight paragraphs or bullet points.',
      balanced: 'Detail Level: Balanced. Provide an intuitive explanation with essential mechanics and a practical example.',
      deep: 'Detail Level: Deep & rigorous. Include theoretical foundations, mathematical rigor, and edge cases.',
    };
    if (DEPTH_GUIDES[depth]) {
      systemInstruction += `\n${DEPTH_GUIDES[depth]}`;
    }

    if (customInstructions) {
      systemInstruction += `\nStudent Preferences: ${customInstructions}`;
    }

    // Long-term memory & brain context recall
    if (brainContext && typeof brainContext === 'string' && brainContext.trim()) {
      systemInstruction += `\n\nBRANCO'S BRAIN RECALL (LONG-TERM MEMORY):\nYou have access to memories from your previous conversations and study sessions with this student:\n${brainContext.trim()}\n\nHOW TO USE YOUR BRAIN RECALL:\n- If the student asks about what you discussed before, if you remember a previous topic, or requests to continue an earlier topic, draw directly from these memories.\n- When relevant, naturally reference concepts previously covered (e.g., "Building on our earlier discussion of Newton's Laws...", "Like the hash table example we solved...").\n- Weave memories into your response naturally like a thoughtful personal mentor who genuinely remembers past sessions. Never output raw database IDs or say 'According to my database'.`;
    }

    const isStructuredJsonMode = mode === 'quiz' || mode === 'flashcards';

    if (mode === 'quiz') {
      systemInstruction += `\nMode: Quiz Generation. Return a JSON object with: { "title": string, "questions": [{ "question": string, "options": string[], "correctIndex": number, "explanation": string }] }. Write insightful, challenging questions that test deep conceptual understanding. Do NOT reveal which option is correct in the question text or option labels.`;
    } else if (mode === 'flashcards') {
      systemInstruction += `\nMode: Flashcard Generation. Return a JSON object with: { "cards": [{ "front": string, "back": string }] }. Each flashcard must highlight a core high-yield concept, formula, or definition.`;
    } else if (mode === 'math') {
      systemInstruction += `\nMode: Mathematical Problem Solving. Ensure absolute numerical precision, demonstrate full working step by step, and format equations cleanly using LaTeX ($...$ or $$...$$).`;
    } else if (mode === 'study_plan') {
      systemInstruction += `\nMode: Study Plan. Synthesize an actionable, time-blocked revision roadmap with clear daily objectives and review checkpoints.`;
    } else if (mode === 'explanation') {
      systemInstruction += `\nMode: Deep Conceptual Explanation. Build intuition from first principles with clear real-world examples.`;
    }

    // Prepare contents with bounded, sanitized conversation history (last 50 turns for deep conversational memory)
    const rawHistory = Array.isArray(conversationHistory) ? conversationHistory.slice(-50) : [];
    const sanitizedTurns: { role: 'user' | 'model'; text: string }[] = [];

    for (const msg of rawHistory) {
      if (typeof msg?.text === 'string' && msg.text.trim()) {
        const role = msg.sender === 'user' ? 'user' : 'model';
        // Cleanse prior model turns so any residual XML/SVG/markup never poisons subsequent turns
        const cleanTurnText = role === 'model'
          ? convertToHumanReadable(msg.text.trim(), 'general').text
          : msg.text.trim();

        if (sanitizedTurns.length > 0 && sanitizedTurns[sanitizedTurns.length - 1].role === role) {
          // Merge consecutive turns of identical role to satisfy Gemini API constraints
          sanitizedTurns[sanitizedTurns.length - 1].text += `\n\n${cleanTurnText}`;
        } else {
          sanitizedTurns.push({ role, text: cleanTurnText });
        }
      }
    }

    // Ensure sequence starts with 'user'
    while (sanitizedTurns.length > 0 && sanitizedTurns[0].role !== 'user') {
      sanitizedTurns.shift();
    }

    // Ensure history ends with a model turn so the active prompt is a clean, distinct user turn
    while (sanitizedTurns.length > 0 && sanitizedTurns[sanitizedTurns.length - 1].role === 'user') {
      sanitizedTurns.pop();
    }

    // Build Gemini contents array from sanitized history
    const contents: any[] = sanitizedTurns.map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.text }],
    }));

    const activePromptText = prompt.trim();
    const userIntent = classifyUserIntent(activePromptText, rawHistory);
    const resolvedSubject = (userIntent === 'IMAGE_PROMPT_REQUEST')
      ? extractImageSubjectFromContext(activePromptText, rawHistory)
      : null;
    const isExplicitCodeRequest = userIntent === 'EXPLICIT_CODE_REQUEST';

    // Direct Webpage URL Extraction for SOURCE_SPECIFIC Research (only when user specifically provides a URL to analyze)
    const urlMatches = activePromptText.match(/https?:\/\/[^\s<>"'{}|\\^`\[\]]+/gi) || [];
    const directCitations: Array<{ title: string; url: string; domain: string; retrievedAt: string; snippet?: string }> = [];
    let retrievedPageContext = '';

    if (urlMatches.length > 0 && userIntent === 'SOURCE_SPECIFIC') {
      for (const rawUrl of urlMatches.slice(0, 2)) {
        const pageData = await fetchAndExtractWebpage(rawUrl);
        if (pageData.success && pageData.isAccessible && !pageData.isPaywalled && !pageData.isAbstractOnly) {
          retrievedPageContext += `\n\n[RETRIEVED WEBPAGE CONTENT]\nSource Title: ${pageData.title}\nURL: ${pageData.url}\nDomain: ${pageData.domain}\nRetrieved: ${pageData.retrievedAt}\nContent:\n${pageData.content}\n[END RETRIEVED CONTENT]`;
          directCitations.push({
            title: pageData.title,
            url: pageData.url,
            domain: pageData.domain,
            retrievedAt: pageData.retrievedAt,
            snippet: pageData.content.slice(0, 160) + '...',
          });
        } else if (pageData.isPaywalled || pageData.isAbstractOnly) {
          retrievedPageContext += `\n\n[RESTRICTED SOURCE DETECTED: NO-LOGIN, NO-PAYWALL POLICY TRIGGERED]\nURL: ${pageData.url}\nStatus: Excluded from citations (${pageData.accessReason || 'Paywall or login required'}).\nInstruction: StudPal strictly enforces a NO-LOGIN, NO-PAYWALL policy. Do NOT cite this restricted source. Instead, provide the research findings and cite a legitimate publicly accessible alternative (such as PubMed Central [PMC], arXiv, Nature Scitable, PLOS, DOAJ, official .gov datasets, or open international agency reports). Explain that the requested URL is restricted behind a paywall/login and you are providing verified findings from an open-access alternative.`;
        } else {
          retrievedPageContext += `\n\n[WEBPAGE RETRIEVAL NOTICE]\nURL: ${pageData.url}\nStatus: Retrieval failed (${pageData.error}).\nInstruction: Clearly and honestly inform the student that this specific URL could not be accessed directly (${pageData.error}), such as due to a paywall, server block, or network timeout. Do NOT invent, guess, or hallucinate the article contents from the URL alone.`;
        }
      }
    }

    // High-level guidance for modern conversational intelligence & reasoning
    systemInstruction += `\n\nCORE CONVERSATIONAL REASONING & INSTRUCTION FOLLOWING (QUALITY BENCHMARK: CHATGPT & GEMINI):
1. MULTI-TURN CONTINUITY & CONTEXT RESOLUTION:
   - Always resolve pronouns and conversational references ("it", "that", "the previous answer", "make it simpler", "turn that into a prompt", "explain the second point", "continue") using the preceding conversation turns.
   - When the user asks to "Make it simpler", rewrite the preceding explanation in accessible, everyday language with relatable analogies.
   - When the user issues a correction ("That's not what I meant. I wanted a prompt, not the explanation"), acknowledge it in one brief sentence and immediately fulfill the corrected request without defending previous output.
2. ADAPTIVE LENGTH & NATURAL TONE:
   - Tailor response length to the request: simple questions get direct, concise answers; complex concepts get thorough explanations.
   - Avoid repetitive acknowledgements ("Sure, I can help with that", "Certainly!"). Start directly with the answer.
   - Use headings, bullet points, or tables only when they genuinely clarify information.
3. IMAGE CREATION VS IMAGE PROMPT GENERATION:
   - You cannot generate image files directly. When asked to draw/create an image, state this limitation naturally in 1-2 sentences and offer to write a prompt for an external generator or explain the subject.
   - When asked for a prompt for ChatGPT, Midjourney, DALL-E, or an AI generator, generate the actual detailed, copyable prompt tailored to the subject from context. Format clearly:
> **Prompt:** "[Detailed image-generation prompt]"
   - Never output XML, SVG, HTML, or code blocks for image prompt requests.
4. PROBLEM SOLVING & MATHEMATICAL PRECISION:
   - Show step-by-step working for calculations and format mathematical equations cleanly using LaTeX ($...$ or $$...$$).
5. RESEARCH SYNTHESIS & STRICT NO-PAYWALL CITATIONS:
   - For ranking, comparison, or factual research queries, provide the synthesized findings, rankings, or comparison points directly in the chat. Do NOT respond with only a list of links.
   - Every citation attached must be accessible without accounts, logins, or paywalls.`;

    if (userIntent === 'CASUAL_CONVERSATION') {
      systemInstruction += `\n\n[CURRENT TURN: CASUAL_CONVERSATION. Respond warmly, naturally, and concisely in 1-2 friendly sentences. If the user asks for help (e.g. "I need ur help"), welcome them and ask what subject, topic, or problem they want to work on. Do NOT perform research, do NOT cite sources, and do NOT deliver an unsolicited lecture.]`;
    } else if (userIntent === 'SOURCE_SPECIFIC') {
      systemInstruction += `\n\n[CURRENT TURN: SOURCE_SPECIFIC. Analyze and synthesize the retrieved webpage content above. Cite using [${directCitations[0]?.title || 'Source'}](${directCitations[0]?.url || 'URL'}). If retrieval was blocked by paywall/login, disclose honestly and cite open alternatives.]`;
    } else if (userIntent === 'CURRENT_INFORMATION' || userIntent === 'DEEP_RESEARCH' || userIntent === 'WEB_RESEARCH') {
      systemInstruction += `\n\n[CURRENT TURN: Research inquiry. RESEARCH → READ → ANALYZE → SYNTHESIZE → ANSWER → CITE. Present rankings, numbers, dates, or comparisons directly in the chat with verified public citations.]`;
    } else if (userIntent === 'IMAGE_PROMPT_REQUEST') {
      systemInstruction += `\n\n[CURRENT TURN: IMAGE_PROMPT_REQUEST${resolvedSubject ? ` for: "${resolvedSubject}"` : ''}. Produce a detailed, ready-to-copy image prompt specifying subject, composition, lighting, style, and textures. Never output SVG or XML.]`;
    } else if (userIntent === 'IMAGE_CREATION') {
      systemInstruction += `\n\n[CURRENT TURN: IMAGE_CREATION. State image generation limitation briefly and offer an image prompt or concept explanation. Do not dump unsolicited anatomical lists.]`;
    } else if (userIntent === 'EXPLICIT_CODE_REQUEST') {
      systemInstruction += `\n\n[CURRENT TURN: EXPLICIT_CODE_REQUEST. Provide clean, well-formatted code inside a markdown code block.]`;
    }

    // Append the active prompt, including retrieved webpage context if available, as a clean new user turn
    const promptToSend = retrievedPageContext
      ? `${activePromptText}\n\n${retrievedPageContext}`
      : activePromptText;

    contents.push({
      role: 'user',
      parts: [{ text: promptToSend }],
    });

    const generationConfig: Record<string, any> = {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: depth === 'deep' ? 8192 : 4096,
    };

    if (isStructuredJsonMode) {
      generationConfig.responseMimeType = 'application/json';
    }

    // Intent evaluation for search tool necessity (avoids 1.5-3s search overhead on basic math/facts/conversation)
    // Ordinary conversational, image prompt, coding, memory recall, and factual requests bypass search tools entirely.
    const isConversationalIntent = userIntent === 'CASUAL_CONVERSATION' || userIntent === 'GENERAL_ANSWER' || userIntent === 'IMAGE_PROMPT_REQUEST' || userIntent === 'IMAGE_CREATION' || userIntent === 'MEMORY_RECALL' || userIntent === 'EXPLICIT_CODE_REQUEST';

    const isExplicitResearchIntent =
      !isConversationalIntent && (
        userIntent === 'CURRENT_INFORMATION' ||
        userIntent === 'DEEP_RESEARCH' ||
        userIntent === 'WEB_RESEARCH' ||
        (userIntent === 'SOURCE_SPECIFIC' && directCitations.length === 0) ||
        /(\b(?:latest news|breaking news|current news|ranking of|richest (?:people|man|men|woman|women|person)|billionaires?|in 202[5-9]|stock price of|election results?)\b)/i.test(activePromptText)
      );

    // Enable Google Search Grounding ONLY for explicit live research requests so Gemini streams immediately for all other messages
    const needsWebSearch = !isConversationalIntent && !isStructuredJsonMode && isExplicitResearchIntent;

    // ---------------------------------------------------------------------------
    // TRUE REAL-TIME TOKEN STREAMING (via Server-Sent Events / ReadableStream)
    // Minimizes Time-To-First-Token (TTFT) from 5-10s down to <800ms
    // ---------------------------------------------------------------------------
    if (stream && !isStructuredJsonMode) {
      for (const modelName of CANDIDATE_MODELS) {
        try {
          const geminiStreamUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?key=${geminiApiKey}&alt=sse`;
          const requestPayload: Record<string, any> = {
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents,
            generationConfig,
          };

          if (needsWebSearch && !isStructuredJsonMode) {
            requestPayload.tools = [{ googleSearch: {} }];
          }

          let streamResponse = await fetch(geminiStreamUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestPayload),
            signal: AbortSignal.timeout ? AbortSignal.timeout(7000) : undefined,
          });

          // Retry with alternate tool name or without tools if 400
          if (!streamResponse.ok && requestPayload.tools && streamResponse.status === 400) {
            console.warn(`[ai-tutor stream] Model ${modelName} 400 with tools. Retrying with google_search...`);
            const altPayload = { ...requestPayload, tools: [{ google_search: {} }] };
            streamResponse = await fetch(geminiStreamUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(altPayload),
              signal: AbortSignal.timeout ? AbortSignal.timeout(7000) : undefined,
            });
            if (!streamResponse.ok && streamResponse.status === 400) {
              const noToolsPayload = { ...requestPayload };
              delete noToolsPayload.tools;
              streamResponse = await fetch(geminiStreamUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noToolsPayload),
                signal: AbortSignal.timeout ? AbortSignal.timeout(7000) : undefined,
              });
            }
          }

          if (streamResponse.ok && streamResponse.body) {
            const encoder = new TextEncoder();
            const decoder = new TextDecoder();
            let sseBuffer = '';
            let fullStreamedText = '';
            let streamThoughts = '';
            const webSources: Array<{ title: string; url: string; domain: string; retrievedAt: string; snippet?: string }> = [...directCitations];
            const nowIso = new Date().toISOString();

            const streamTransform = new TransformStream({
              transform(chunkBytes, controller) {
                sseBuffer += decoder.decode(chunkBytes, { stream: true });
                const lines = sseBuffer.split('\n');
                sseBuffer = lines.pop() || '';

                for (const line of lines) {
                  const trimmed = line.trim();
                  if (!trimmed.startsWith('data:')) continue;
                  const jsonStr = trimmed.slice(5).trim();
                  if (!jsonStr || jsonStr === '[DONE]') continue;

                  try {
                    const parsed = JSON.parse(jsonStr);
                    const cand = parsed.candidates?.[0];
                    if (cand?.content?.parts) {
                      for (const part of cand.content.parts) {
                        if (part.thought) {
                          streamThoughts += part.text || '';
                        } else if (typeof part.text === 'string' && part.text) {
                          fullStreamedText += part.text;
                          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: part.text })}\n\n`));
                        }
                      }
                    }

                    const groundingMetadata = cand?.groundingMetadata;
                    if (groundingMetadata?.groundingChunks && Array.isArray(groundingMetadata.groundingChunks)) {
                      for (const gChunk of groundingMetadata.groundingChunks) {
                        if (gChunk?.web?.uri) {
                          const url = gChunk.web.uri;
                          let title = gChunk.web.title?.trim() || '';
                          let domain = 'web';
                          try {
                            domain = new URL(url).hostname.replace(/^www\./, '');
                            if (!title) title = domain;
                          } catch (_) {
                            if (!title) title = 'Web Source';
                          }

                          const isRestrictedDomain = KNOWN_PAYWALLED_DOMAINS.some((d) => domain.includes(d));
                          if (!isRestrictedDomain && !webSources.some((s) => s.url === url)) {
                            webSources.push({ title, url, domain, retrievedAt: nowIso });
                          }
                        }
                      }
                    }
                  } catch (_) {}
                }
              },
              flush(controller) {
                if (sseBuffer.trim().startsWith('data:')) {
                  try {
                    const jsonStr = sseBuffer.trim().slice(5).trim();
                    const parsed = JSON.parse(jsonStr);
                    const cand = parsed.candidates?.[0];
                    if (cand?.content?.parts) {
                      for (const part of cand.content.parts) {
                        if (!part.thought && typeof part.text === 'string' && part.text) {
                          fullStreamedText += part.text;
                          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: part.text })}\n\n`));
                        }
                      }
                    }
                  } catch (_) {}
                }

                // Final event packet with citations and thought process
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                  done: true,
                  citations: webSources,
                  thoughtProcess: streamThoughts || null,
                  userIntent,
                })}\n\n`));
              }
            });

            // Asynchronous non-blocking usage logging
            if (userId && supabaseUrl && supabaseAnonKey) {
              try {
                const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
                supabaseClient.from('ai_usage_logs').insert({
                  user_id: userId,
                  feature: 'ai-tutor-stream',
                  tokens_used: Math.ceil(fullStreamedText.length / 4) || 25,
                  status: 'success',
                }).then(() => {}).catch(() => {});
              } catch (_) {}
            }

            return new Response(streamResponse.body.pipeThrough(streamTransform), {
              status: 200,
              headers: {
                ...corsHeaders,
                'Content-Type': 'text/event-stream; charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
              },
            });
          }
        } catch (streamErr) {
          console.warn(`[ai-tutor] Stream candidate ${modelName} error:`, streamErr);
        }
      }
    }

    // Try candidate models with graceful fallback (non-streaming fallback or structured modes)
    let lastError: any = null;
    let geminiData: any = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`;

        const requestPayload: Record<string, any> = {
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig,
        };

        if (needsWebSearch && !isStructuredJsonMode) {
          requestPayload.tools = [{ googleSearch: {} }];
        }

        let response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestPayload),
          signal: AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined,
        });

        // If tools returned an error (e.g. 400 Bad Request on specific model tier), retry once with google_search or without tools
        if (!response.ok && requestPayload.tools && response.status === 400) {
          console.warn(`[ai-tutor] Model ${modelName} returned 400 with googleSearch tool. Retrying with google_search...`);
          const payloadWithAltTool = { ...requestPayload, tools: [{ google_search: {} }] };
          response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadWithAltTool),
            signal: AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined,
          });
          if (!response.ok && response.status === 400) {
            console.warn(`[ai-tutor] Retrying without search tool...`);
            const payloadWithoutTools = { ...requestPayload };
            delete payloadWithoutTools.tools;
            response = await fetch(geminiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payloadWithoutTools),
              signal: AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined,
            });
          }
        }

        if (response.ok) {
          geminiData = await response.json();
          break;
        }

        const errText = await response.text();
        console.warn(`[ai-tutor] Model ${modelName} returned ${response.status}:`, errText);
        lastError = { status: response.status, message: errText };

        // If rate limited or model not found, loop to next candidate model
        if (response.status === 429 || response.status === 404 || response.status === 503) {
          continue;
        }
      } catch (fetchErr) {
        console.warn(`[ai-tutor] Model ${modelName} fetch error:`, fetchErr);
        lastError = fetchErr;
      }
    }

    if (!geminiData) {
      console.error('[ai-tutor] All candidate models failed. Last error:', lastError);
      return new Response(
        JSON.stringify({
          error: 'The AI service is experiencing high demand. Please try again in a few moments.',
          code: 'RATE_LIMIT',
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const parts = geminiData.candidates?.[0]?.content?.parts || [];
    // Extract actual text response, filtering out internal thinking/thought blocks (Gemini 2.0 / 2.5)
    const answerParts = parts.filter((p: any) => !p.thought && typeof p.text === 'string');
    const thoughtParts = parts.filter((p: any) => p.thought && typeof p.text === 'string');
    const rawCandidate = (answerParts.length > 0 ? answerParts : parts)
      .map((p: any) => p.text || '')
      .join('\n')
      .trim();

    const candidateThoughts = thoughtParts.map((p: any) => p.text || '').join('\n').trim();

    let parsedResult: any;

    if (isStructuredJsonMode) {
      try {
        parsedResult = JSON.parse(rawCandidate);

        // Format quiz JSON into human-readable chat markdown (questions and options only - never spoil answers)
        if (mode === 'quiz' && !parsedResult.text) {
          if (Array.isArray(parsedResult.questions)) {
            const title = parsedResult.title || 'Academic Quiz';
            let formatted = `Here is your **${title}**! 🎯\n\n`;
            parsedResult.questions.forEach((q: any, i: number) => {
              formatted += `### Question ${i + 1}\n${q.question}\n\n`;
              if (Array.isArray(q.options)) {
                q.options.forEach((opt: string, optIdx: number) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  formatted += `- **${letter})** ${opt}\n`;
                });
              }
              if (i < parsedResult.questions.length - 1) {
                formatted += `\n---\n\n`;
              }
            });
            formatted += `\n\n---\n\n💬 **Reply with your answers** (e.g. **1A, 2B, 3B**) and I'll grade them and break down each question for you!`;
            parsedResult.text = formatted.trim();
          } else if (parsedResult.question) {
            let formatted = `### Academic Quiz 🎯\n\n**Question:** ${parsedResult.question}\n\n`;
            if (Array.isArray(parsedResult.options)) {
              parsedResult.options.forEach((opt: string, optIdx: number) => {
                const letter = String.fromCharCode(65 + optIdx);
                formatted += `- **${letter})** ${opt}\n`;
              });
            }
            formatted += `\n\n---\n\n💬 **Reply with your choice** (e.g. **A**) to see if you got it right!`;
            parsedResult.text = formatted.trim();
          }
        }

        // Format flashcards JSON into human-readable chat markdown
        if (mode === 'flashcards' && !parsedResult.text && Array.isArray(parsedResult.cards)) {
          let formatted = `### Revision Flashcards 🗂️\n\n`;
          parsedResult.cards.forEach((card: any, i: number) => {
            formatted += `**Card ${i + 1}**\n- **Front:** ${card.front || ''}\n- **Back:** ${card.back || ''}\n\n`;
          });
          parsedResult.text = formatted.trim();
        }
      } catch {
        const converted = convertToHumanReadable(rawCandidate, mode);
        parsedResult = {
          text: converted.text,
          thoughtProcess: candidateThoughts || converted.thoughtProcess || null,
          latexFormula: converted.latexFormula,
        };
      }
    } else {
      // Natural conversational output: safely convert unexpected XML / JSON to human-readable text
      const converted = convertToHumanReadable(rawCandidate, mode, isExplicitCodeRequest);
      let trimmedText = converted.text;
      let extractedFormula = converted.latexFormula;

      // Extract dynamic follow-up suggestions from Gemini
      let suggestedActions: any[] = [];
      const suggestionsMatch = trimmedText.match(/\n?SUGGESTIONS:\s*(\[[^\]\r\n]+\])/i);
      if (suggestionsMatch && suggestionsMatch[1]) {
        try {
          const parsed = JSON.parse(suggestionsMatch[1]);
          if (Array.isArray(parsed)) {
            suggestedActions = parsed
              .filter((s: any) => typeof s === 'string' && s.trim().length > 0)
              .map((s: string) => ({
                label: s.trim(),
                query: s.trim(),
                mode: mode === 'quiz' ? 'quiz' : 'explainer',
              }));
          }
        } catch (_) {}
        // Strip the SUGGESTIONS: line from the text so user never sees it in the chat bubble
        trimmedText = trimmedText.replace(/\n?SUGGESTIONS:\s*(\[[^\]\r\n]+\])/i, '').trim();
      }

      // Extract Google Search grounding web sources & merge with direct citations
      const groundingMetadata = geminiData.candidates?.[0]?.groundingMetadata;
      const webSources: Array<{ title: string; url: string; domain: string; retrievedAt: string; snippet?: string }> = [...directCitations];
      const nowIso = new Date().toISOString();

      if (groundingMetadata?.groundingChunks && Array.isArray(groundingMetadata.groundingChunks)) {
        for (const chunk of groundingMetadata.groundingChunks) {
          if (chunk?.web?.uri) {
            const url = chunk.web.uri;
            let title = chunk.web.title?.trim() || '';
            let domain = 'web';
            try {
              domain = new URL(url).hostname.replace(/^www\./, '');
              if (!title) title = domain;
            } catch (_) {
              if (!title) title = 'Web Source';
            }

            // FILTER RESTRICTED SOURCES: Check domain against strict paywalls
            const isRestrictedDomain = KNOWN_PAYWALLED_DOMAINS.some((d) => domain.includes(d));
            if (isRestrictedDomain) {
              // Exclude restricted paywalled candidates in accordance with no-login, no-paywall policy
              continue;
            }

            if (!webSources.some((s) => s.url === url)) {
              webSources.push({
                title,
                url,
                domain,
                retrievedAt: nowIso,
              });
            }
          }
        }
      }

      let finalCleanText = trimmedText;
      // If web research sources were utilized and the answer doesn't already contain links, neatly append them
      if (webSources.length > 0 && !/\[[^\]]+\]\(https?:\/\/[^\)]+\)/i.test(finalCleanText)) {
        finalCleanText += '\n\n### 📚 Sources & Citations\n';
        webSources.slice(0, 5).forEach((source) => {
          finalCleanText += `- [${source.title}](${source.url}) - ${source.domain}\n`;
        });
        finalCleanText = finalCleanText.trim();
      }

      parsedResult = {
        text: finalCleanText,
        thoughtProcess: candidateThoughts || converted.thoughtProcess || null,
        latexFormula: extractedFormula,
        steps: null,
        example: null,
        suggestedActions,
        sources: webSources,
        citations: webSources,
        userIntent,
      };
    }

    // Optional usage logging (asynchronous, non-blocking to minimize latency)
    if (userId && supabaseUrl && supabaseAnonKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        supabase.from('ai_usage_logs').insert({
          user_id: userId,
          feature: 'ai-tutor',
          tokens_used: geminiData.usageMetadata?.totalTokenCount || 0,
          status: 'success',
        }).then(() => {}).catch((logErr: any) => {
          console.warn('[ai-tutor] Usage logging failed:', logErr);
        });
      } catch (logErr) {
        console.warn('[ai-tutor] Usage logging failed:', logErr);
      }
    }

    return new Response(JSON.stringify(parsedResult), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[ai-tutor] Unhandled error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error occurred.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
