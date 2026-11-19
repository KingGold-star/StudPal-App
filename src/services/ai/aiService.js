// src/services/ai/aiService.js
import { Platform } from 'react-native';
import { supabase, isSupabaseConfigured, SUPABASE_URL, SUPABASE_ANON_KEY } from '../../lib/supabaseClient.js';
import { networkService } from '../networkService.js';
import { aiTelemetry, TELEMETRY_EVENTS } from './aiRequestTelemetry.js';
import { classifyUserIntent, USER_INTENTS, getPersonaSystemPrompt } from '../aiPersonaService.js';
import { settingsService } from '../settings/settingsService.js';

function convertMarkupToReadableExplanation(raw) {
  if (!raw || typeof raw !== 'string') return '';

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

  const extractedItems = [];
  const compMatches = raw.matchAll(/<component(?:\s+name="([^"]+)")?[^>]*>([\s\S]*?)<\/component>/gi);
  for (const m of compMatches) {
    const name = m[1]?.trim();
    const content = m[2]?.replace(/<[^>]+>/g, '').trim();
    if (content) {
      extractedItems.push(name ? `**${name}:** ${content}` : content);
    }
  }

  const textMatches = raw.matchAll(/<(?:text|tspan)[^>]*>([\s\S]*?)<\/(?:text|tspan)>/gi);
  for (const m of textMatches) {
    const textContent = m[1]?.replace(/<[^>]+>/g, '').trim();
    if (textContent && textContent.length > 1 && !/^\d+(?:\.\d+)?$/.test(textContent) && !/^(M|L|C|Z|V|H)\s*-?\d+/i.test(textContent)) {
      if (!extractedItems.includes(textContent)) {
        extractedItems.push(textContent);
      }
    }
  }

  const titleMatch = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descMatch = raw.match(/<desc[^>]*>([\s\S]*?)<\/desc>/i);
  const diagramTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
  const diagramDesc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';

  const stepMatches = raw.matchAll(/<(?:step|item)(?:\s+title="([^"]+)")?[^>]*>([\s\S]*?)<\/(?:step|item)>/gi);
  for (const m of stepMatches) {
    const title = m[1]?.trim();
    const content = m[2]?.replace(/<[^>]+>/g, '').trim();
    if (content) {
      extractedItems.push(title ? `**${title}:** ${content}` : content);
    }
  }

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
    explanation += `\nEach structure is differentiated with distinct colors, leader lines, and an indexed legend to clarify their roles.`;
  }

  if (explanation.trim().length > 30) {
    return explanation.trim();
  }

  if (/cross-section|anatomical/i.test(raw)) {
    return "The diagram should show a clearly labelled cross-section, with each major structure identified and explained. Use distinct colours to differentiate the layers, and include a legend to help students understand their functions.";
  }
  return "I'm ready to help explain this concept! What specific aspect would you like to break down step-by-step?";
}

function ensureHumanReadable(rawText, isExplicitCode = false) {
  if (!rawText || typeof rawText !== 'string') return '';
  let str = rawText.trim();

  // Strip internal thoughts
  str = str.replace(/<think[\s\S]*?<\/think>/gi, '');
  str = str.replace(/<thought[\s\S]*?<\/thought>/gi, '');
  str = str.replace(/<reasoning[\s\S]*?<\/reasoning>/gi, '');
  str = str.replace(/<reflection[\s\S]*?<\/reflection>/gi, '');

  // Strip unwanted TL;DR blockquotes
  str = str.replace(/^>\s*(?:\*\*)?TL;?DR:?(?:\*\*)?[\s\S]*?(?:\n\n|\n(?=[^>])|$)/gim, '');
  str = str.replace(/^(?:\*\*)?TL;?DR:?(?:\*\*)?[^\n]*(?:\n\n|\n|$)/gim, '');

  // Convert unexpected XML/SVG/CSS diagram code blocks into readable explanations
  // (Do NOT convert if code was explicitly requested!)
  if (!isExplicitCode && /```(?:xml|svg|html)|<(?:\?xml|svg|diagram|canvas|component)/i.test(str)) {
    str = convertMarkupToReadableExplanation(str);
  }

  // Check for unexpected raw JSON wrapper in chat
  if ((str.startsWith('{') && str.endsWith('}')) || (str.startsWith('```json') && str.endsWith('```'))) {
    try {
      const jsonClean = str.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
      const parsed = JSON.parse(jsonClean);
      const extracted = parsed.text || parsed.response || parsed.message || parsed.answer ||
        parsed.explanation || parsed.content || parsed.description || parsed.prompt || parsed.summary || parsed.result;
      if (typeof extracted === 'string' && extracted.trim().length > 0) {
        str = extracted.trim();
      }
    } catch (_) {}
  }

  // Check for unexpected XML markup in chat
  if (/<\/?([a-zA-Z][a-zA-Z0-9_\-:]*)(?:\s+[^>]*)?>/.test(str)) {
    str = str.replace(/<\/?(?:response|output|answer|explanation|message|result|content|diagram|canvas|illustration|root|city|image|scene)[^>]*>/gi, '');
    str = str.replace(/<component(?:\s+name="([^"]+)")?[^>]*>([\s\S]*?)<\/component>/gi, (_match, name, content) => {
      return name ? `\n- **${name}:** ${content.trim()}` : `\n- ${content.trim()}`;
    });
    str = str.replace(/<step(?:\s+title="([^"]+)")?[^>]*>([\s\S]*?)<\/step>/gi, (_match, title, content) => {
      return title ? `\n- **${title}:** ${content.trim()}` : `\n- ${content.trim()}`;
    });
    str = str.replace(/<description[^>]*>([\s\S]*?)<\/description>/gi, '$1\n');
    str = str.replace(/<prompt[^>]*>([\s\S]*?)<\/prompt>/gi, '$1\n');
    str = str.replace(/<\/?[a-zA-Z][a-zA-Z0-9_\-:]*(?:\s+[^>]*)?>/g, '');
    str = str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  str = str.replace(/\n{3,}/g, '\n\n').trim();
  if (!str || /^[\s{\[<]+$/.test(str)) {
    str = "I'm ready to help with your question! Could you please ask that once more or share a few more details?";
  }
  return str;
}

class AiService {
  constructor() {
    this.inFlightRequests = new Set();
    this.activeAbortControllers = new Map();
  }

  cancelActiveStream(reqKey = null) {
    if (reqKey && this.activeAbortControllers.has(reqKey)) {
      try {
        this.activeAbortControllers.get(reqKey).abort();
      } catch (_) {}
      this.activeAbortControllers.delete(reqKey);
    } else {
      for (const [_, controller] of this.activeAbortControllers) {
        try {
          controller.abort();
        } catch (_) {}
      }
      this.activeAbortControllers.clear();
    }
  }

  /**
   * Check for Gemini API key from environment variable or user settings
   */
  async getGeminiApiKey() {
    const envKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (envKey && typeof envKey === 'string' && envKey.trim().length > 10) {
      return envKey.trim();
    }
    try {
      const saved = await settingsService.getSetting('geminiApiKey');
      if (saved && typeof saved === 'string' && saved.trim().length > 10) {
        return saved.trim();
      }
    } catch (_) {}
    return null;
  }

  /**
   * Direct streaming from Google Gemini API (ChatGPT/Gemini Experience)
   */
  async streamFromGeminiDirectly({
    apiKey,
    prompt,
    conversationHistory = [],
    persona = 'all_round',
    academicLevel = 'undergraduate',
    customInstructions = '',
    depth = 'balanced',
    controller,
    onChunk,
    reqKey,
  }) {
    const systemPrompt = getPersonaSystemPrompt(persona, { academicLevel, customInstructions, depth });
    const contents = [];
    if (Array.isArray(conversationHistory)) {
      for (const m of conversationHistory.slice(-10)) {
        if (!m.text) continue;
        contents.push({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: prompt.trim() }],
    });

    const candidateModels = ['gemini-2.0-flash', 'gemini-1.5-flash'];
    for (const model of candidateModels) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}&alt=sse`;
      const body = JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });

      try {
        let accumulatedText = '';
        if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.ReadableStream !== 'undefined') {
          const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            signal: controller.signal,
          });
          if (resp.ok && resp.body && typeof resp.body.getReader === 'function') {
            const reader = resp.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';
              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith('data:')) continue;
                const jsonStr = trimmed.slice(5).trim();
                if (!jsonStr || jsonStr === '[DONE]') continue;
                try {
                  const data = JSON.parse(jsonStr);
                  const chunkText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (chunkText) {
                    accumulatedText += chunkText;
                    if (onChunk) onChunk(chunkText, accumulatedText);
                  }
                } catch (_) {}
              }
            }
            if (accumulatedText.length > 0) return { text: accumulatedText };
          }
        } else {
          // React Native iOS/Android via direct XHR SSE
          const xhrResult = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            let processedIndex = 0;
            controller.signal.addEventListener('abort', () => {
              xhr.abort();
              reject(new Error('GENERATION_CANCELLED'));
            });
            const handleChunks = () => {
              const text = xhr.responseText || '';
              if (text.length <= processedIndex) return;
              const newSegment = text.slice(processedIndex);
              processedIndex = text.length;
              const lines = newSegment.split('\n');
              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith('data:')) continue;
                const jsonStr = trimmed.slice(5).trim();
                if (!jsonStr || jsonStr === '[DONE]') continue;
                try {
                  const data = JSON.parse(jsonStr);
                  const chunkText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (chunkText) {
                    accumulatedText += chunkText;
                    if (onChunk) onChunk(chunkText, accumulatedText);
                  }
                } catch (_) {}
              }
            };
            xhr.onprogress = handleChunks;
            xhr.onreadystatechange = () => {
              if (xhr.readyState === 3 || xhr.readyState === 4) handleChunks();
            };
            xhr.onload = () => {
              handleChunks();
              if (xhr.status >= 200 && xhr.status < 300 && accumulatedText.length > 0) {
                resolve({ text: accumulatedText });
              } else {
                reject(new Error(`Gemini stream status ${xhr.status}`));
              }
            };
            xhr.onerror = () => reject(new Error('Gemini network error'));
            xhr.timeout = 25000;
            xhr.ontimeout = () => reject(new Error('Gemini timeout'));
            xhr.send(body);
          });
          if (xhrResult && xhrResult.text) return xhrResult;
        }
      } catch (err) {
        if (controller.signal.aborted) throw new Error('GENERATION_CANCELLED');
        console.warn(`[AiService] Gemini model ${model} failed, trying next...`, err?.message);
      }
    }
    return null;
  }

  /**
   * Stream a question or prompt to the AI Tutor using SSE / ReadableStream.
   * Delivers immediate token chunks to onChunk without waiting for full completion.
   */
  async streamTutor({
    prompt,
    conversationHistory = [],
    mode = 'general',
    persona = 'all_round',
    teachingStyle = 'socratic',
    depth = 'balanced',
    academicLevel = 'undergraduate',
    customInstructions = '',
    language = 'en',
    brainContext = '',
    requestId = null,
    onChunk = null,
    onMetadata = null,
    onFinish = null,
    onError = null,
    signal = null,
  }) {
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      throw new Error('Please enter a valid study question.');
    }

    const reqKey = requestId || `stream-${Date.now()}`;
    const controller = new AbortController();
    this.activeAbortControllers.set(reqKey, controller);

    if (signal) {
      signal.addEventListener('abort', () => controller.abort());
    }

    // Telemetry trace start
    aiTelemetry.startTrace(reqKey, { prompt });
    const localIntent = classifyUserIntent(prompt, conversationHistory);
    aiTelemetry.logEvent(reqKey, TELEMETRY_EVENTS.INTENT_ROUTING_COMPLETED, { intent: localIntent });

    const isExplicitCode =
      /(?:write|show|give|create|generate|provide|produce)\s+(?:me\s+)?(?:the\s+)?(?:raw\s+)?(?:svg|xml|html|css|json|python|javascript|typescript|c\+\+|sql|code)\b/i.test(prompt) ||
      /(?:svg|xml|html|css|json|sql)\s+(?:code|structure|markup|snippet)/i.test(prompt) ||
      /\b(?:source\s+code|programming\s+code|raw\s+code)\b/i.test(prompt);

    const endpointUrl = `${SUPABASE_URL}/functions/v1/ai-tutor`;
    aiTelemetry.logEvent(reqKey, TELEMETRY_EVENTS.BACKEND_REQUEST_DISPATCHED, { endpoint: endpointUrl });
    const payload = {
      prompt: prompt.trim(),
      conversationHistory,
      mode,
      persona,
      teachingStyle,
      depth,
      academicLevel,
      customInstructions,
      language,
      brainContext,
      stream: true,
    };

    let accumulatedText = '';
    let citations = [];
    let thoughtProcess = null;
    let userIntent = null;
    let streamSucceeded = false;

    // Check for direct Gemini streaming first (Google AI Studio Key)
    const geminiApiKey = await this.getGeminiApiKey();
    if (geminiApiKey) {
      try {
        const directGemini = await this.streamFromGeminiDirectly({
          apiKey: geminiApiKey,
          prompt,
          conversationHistory,
          persona,
          academicLevel,
          customInstructions,
          depth,
          controller,
          onChunk,
          reqKey,
        });
        if (directGemini && directGemini.text && directGemini.text.length > 0) {
          accumulatedText = directGemini.text;
          streamSucceeded = true;
        }
      } catch (geminiDirectErr) {
        if (controller.signal.aborted) throw new Error('GENERATION_CANCELLED');
        console.warn('[AiService] Direct Gemini streaming failed, falling back:', geminiDirectErr?.message);
      }
    }

    try {
      if (!streamSucceeded && !controller.signal.aborted) {
      // Select streaming transport: Fetch with ReadableStream for Web, direct XMLHttpRequest for React Native iOS/Android
      // This eliminates doomed initial fetch attempts and duplicate HTTP requests on native devices.
      const useFetchStream = Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.ReadableStream !== 'undefined';

      if (useFetchStream) {
        // 1. Primary for Web: Streaming fetch with ReadableStream reader
        try {
          const response = await fetch(endpointUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'text/event-stream',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });

          if (response.ok && response.body && typeof response.body.getReader === 'function') {
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let sseBuffer = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              sseBuffer += decoder.decode(value, { stream: true });
              const lines = sseBuffer.split('\n');
              sseBuffer = lines.pop() || '';

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith('data:')) continue;
                const jsonStr = trimmed.slice(5).trim();
                if (!jsonStr || jsonStr === '[DONE]') continue;

                try {
                  const data = JSON.parse(jsonStr);
                  if (typeof data.chunk === 'string' && data.chunk.length > 0) {
                    accumulatedText += data.chunk;
                    aiTelemetry.logEvent(reqKey, TELEMETRY_EVENTS.MODEL_FIRST_CHUNK_RECEIVED, { chunkLength: data.chunk.length });
                    if (onChunk) {
                      onChunk(data.chunk, accumulatedText);
                    }
                  }
                  if (data.citations && Array.isArray(data.citations)) {
                    citations = data.citations;
                    if (onMetadata) onMetadata({ citations, thoughtProcess });
                  }
                  if (data.thoughtProcess) {
                    thoughtProcess = data.thoughtProcess;
                    if (onMetadata) onMetadata({ citations, thoughtProcess });
                  }
                  if (data.userIntent) {
                    userIntent = data.userIntent;
                  }
                } catch (_) {}
              }
            }
            // If the backend returned a direct JSON object instead of SSE
            if (!accumulatedText && sseBuffer && sseBuffer.trim().startsWith('{')) {
              try {
                const data = JSON.parse(sseBuffer.trim());
                if (data.text) {
                  accumulatedText = data.text;
                  if (onChunk) onChunk(data.text, data.text);
                  if (data.citations && Array.isArray(data.citations)) citations = data.citations;
                  if (data.thoughtProcess) thoughtProcess = data.thoughtProcess;
                  if (data.userIntent) userIntent = data.userIntent;
                }
              } catch (_) {}
            }
            streamSucceeded = accumulatedText.length > 0;
          }
        } catch (streamFetchErr) {
          if (controller.signal.aborted) {
            throw new Error('GENERATION_CANCELLED');
          }
          console.warn('[AiService.streamTutor] Fetch stream reader failed:', streamFetchErr);
        }
      } else {
        // 2. Primary for React Native Mobile (iOS/Android): Direct XMLHttpRequest SSE
        try {
          await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', endpointUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Accept', 'text/event-stream');
            xhr.setRequestHeader('apikey', SUPABASE_ANON_KEY);
            xhr.setRequestHeader('Authorization', `Bearer ${SUPABASE_ANON_KEY}`);

            let processedIndex = 0;
            controller.signal.addEventListener('abort', () => {
              xhr.abort();
              reject(new Error('GENERATION_CANCELLED'));
            });

            const handleStreamChunks = () => {
              const fullResponse = xhr.responseText || '';
              if (fullResponse.length <= processedIndex) return;
              const newSegment = fullResponse.slice(processedIndex);
              processedIndex = fullResponse.length;

              const lines = newSegment.split('\n');
              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith('data:')) continue;
                const jsonStr = trimmed.slice(5).trim();
                if (!jsonStr || jsonStr === '[DONE]') continue;

                try {
                  const data = JSON.parse(jsonStr);
                  if (typeof data.chunk === 'string' && data.chunk.length > 0) {
                    accumulatedText += data.chunk;
                    aiTelemetry.logEvent(reqKey, TELEMETRY_EVENTS.MODEL_FIRST_CHUNK_RECEIVED, { chunkLength: data.chunk.length });
                    if (onChunk) onChunk(data.chunk, accumulatedText);
                  }
                  if (data.citations && Array.isArray(data.citations)) {
                    citations = data.citations;
                    if (onMetadata) onMetadata({ citations, thoughtProcess });
                  }
                  if (data.thoughtProcess) {
                    thoughtProcess = data.thoughtProcess;
                    if (onMetadata) onMetadata({ citations, thoughtProcess });
                  }
                  if (data.userIntent) {
                    userIntent = data.userIntent;
                  }
                } catch (_) {}
              }
            };

            xhr.onprogress = handleStreamChunks;
            xhr.onreadystatechange = () => {
              if (xhr.readyState === 3 || xhr.readyState === 4) {
                handleStreamChunks();
              }
            };

            xhr.onload = () => {
              handleStreamChunks();
              if (xhr.status >= 200 && xhr.status < 300) {
                // If the backend returned a direct JSON object instead of SSE
                if (!accumulatedText && xhr.responseText && xhr.responseText.trim().startsWith('{')) {
                  try {
                    const data = JSON.parse(xhr.responseText.trim());
                    if (data.text) {
                      accumulatedText = data.text;
                      if (onChunk) onChunk(data.text, data.text);
                      if (data.citations && Array.isArray(data.citations)) citations = data.citations;
                      if (data.thoughtProcess) thoughtProcess = data.thoughtProcess;
                      if (data.userIntent) userIntent = data.userIntent;
                    }
                  } catch (_) {}
                }
                streamSucceeded = accumulatedText.length > 0;
                resolve();
              } else {
                reject(new Error(`XHR stream status ${xhr.status}`));
              }
            };

            xhr.onerror = () => reject(new Error('XHR Network Error'));
            xhr.ontimeout = () => reject(new Error('XHR Timeout'));
            xhr.timeout = 10000;
            xhr.send(JSON.stringify(payload));
          });
        } catch (xhrErr) {
          if (controller.signal.aborted) {
            throw new Error('GENERATION_CANCELLED');
          }
          console.warn('[AiService.streamTutor] Direct XHR stream failed:', xhrErr);
        }
      }
      }

      // 3. Fallback: Standard non-streaming askTutor if streaming was blocked by network
      if (!streamSucceeded && !controller.signal.aborted) {
        console.warn('[AiService.streamTutor] Falling back to non-streaming askTutor...');
        const resp = await this.askTutor({
          prompt,
          conversationHistory,
          mode,
          persona,
          teachingStyle,
          depth,
          academicLevel,
          customInstructions,
          language,
          brainContext,
          requestId: reqKey,
        });

        if (resp && resp.text) {
          accumulatedText = resp.text;
          citations = resp.citations || [];
          thoughtProcess = resp.thoughtProcess || null;
          userIntent = resp.userIntent || null;
          if (onChunk) {
            onChunk(resp.text, resp.text);
          }
        }
      }

      const cleanText = ensureHumanReadable(accumulatedText, isExplicitCode);
      if (cleanText) {
        networkService.recordSuccessfulTraffic();
        aiTelemetry.logEvent(reqKey, TELEMETRY_EVENTS.ASSISTANT_RESPONSE_GENERATED, { textLength: cleanText.length });
        aiTelemetry.logEvent(reqKey, TELEMETRY_EVENTS.REQUEST_COMPLETED, { textLength: cleanText.length, toolCount: citations.length });
      }

      const finalResult = {
        text: cleanText,
        citations,
        thoughtProcess,
        isExplicitCode,
        userIntent,
        mode,
      };

      if (onFinish) {
        onFinish(finalResult);
      }
      return finalResult;
    } catch (err) {
      aiTelemetry.logEvent(reqKey, TELEMETRY_EVENTS.REQUEST_FAILED, { error: err?.message });
      if (onError) onError(err);
      throw err;
    } finally {
      this.activeAbortControllers.delete(reqKey);
    }
  }

  /**
   * Send a question or prompt to the AI Tutor
   */
  async askTutor({
    prompt,
    conversationHistory = [],
    mode = 'general',
    persona = 'all_round',
    teachingStyle = 'socratic',
    depth = 'balanced',
    academicLevel = 'undergraduate',
    customInstructions = '',
    language = 'en',
    brainContext = '',
    requestId = null,
  }) {
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      throw new Error('Please enter a valid study question.');
    }

    const reqKey = requestId || `tutor-${Date.now()}`;
    if (this.inFlightRequests.has(reqKey)) {
      console.warn('[AiService] Duplicate request ignored:', reqKey);
      return null;
    }

    this.inFlightRequests.add(reqKey);

    try {
      // Check for direct Gemini API key
      const geminiApiKey = await this.getGeminiApiKey();
      if (geminiApiKey) {
        try {
          const systemPrompt = getPersonaSystemPrompt(persona, { academicLevel, customInstructions, depth });
          const contents = [];
          if (Array.isArray(conversationHistory)) {
            for (const m of conversationHistory.slice(-10)) {
              if (!m.text) continue;
              contents.push({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }],
              });
            }
          }
          contents.push({
            role: 'user',
            parts: [{ text: prompt.trim() }],
          });

          for (const model of ['gemini-2.0-flash', 'gemini-1.5-flash']) {
            try {
              const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents,
                  systemInstruction: { parts: [{ text: systemPrompt }] },
                  generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                  },
                }),
              });
              if (resp.ok) {
                const data = await resp.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  return {
                    text: ensureHumanReadable(text),
                    citations: [],
                    thoughtProcess: null,
                    isExplicitCode: false,
                    mode,
                  };
                }
              }
            } catch (_) {}
          }
        } catch (directErr) {
          console.warn('[AiService.askTutor] Direct Gemini call failed:', directErr?.message);
        }
      }

      const localIntent = classifyUserIntent(prompt, conversationHistory);
      const isQuickIntent = localIntent === USER_INTENTS.CASUAL_CONVERSATION || localIntent === USER_INTENTS.GENERAL_ANSWER;
      const timeoutMs = isQuickIntent ? 6000 : 25000;

      // 1. Invoke the Supabase Edge Function with adaptive timeout (6s for quick conversational, 25s for deep research)
      let timeoutId;
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('AI_TIMEOUT')), timeoutMs);
      });

      const invokePromise = supabase.functions.invoke('ai-tutor', {
        body: {
          prompt: prompt.trim(),
          conversationHistory,
          mode,
          persona,
          teachingStyle,
          depth,
          academicLevel,
          customInstructions,
          language,
          brainContext,
        },
      });

      const result = await Promise.race([invokePromise, timeoutPromise]);
      clearTimeout(timeoutId);
      const { data, error } = result || {};

      if (error) {
        console.warn('[AiService.askTutor] Edge Function returned error:', error);
        throw new Error(error.message || 'AI Tutor is temporarily unavailable.');
      }

      if (!data) {
        throw new Error('Empty response received from AI service.');
      }

      // Record successful network traffic
      networkService.recordSuccessfulTraffic();

      const isExplicitCode =
        /(?:write|show|give|create|generate|provide|produce)\s+(?:me\s+)?(?:the\s+)?(?:raw\s+)?(?:svg|xml|html|css|json|python|javascript|typescript|c\+\+|sql|code)\b/i.test(prompt) ||
        /(?:svg|xml|html|css|json|sql)\s+(?:code|structure|markup|snippet)/i.test(prompt) ||
        /\b(?:source\s+code|programming\s+code|raw\s+code)\b/i.test(prompt);

      let thoughtProcess = data.thoughtProcess || null;
      if (!thoughtProcess && typeof data.text === 'string') {
        const thinkMatch = data.text.match(/<(?:think|thought|reasoning)>([\s\S]*?)<\/(?:think|thought|reasoning)>/i);
        if (thinkMatch && thinkMatch[1]) {
          thoughtProcess = thinkMatch[1].trim();
        }
      }

      let responseText = ensureHumanReadable(data.text || 'Explanation generated.', isExplicitCode);
      let steps = Array.isArray(data.steps) ? data.steps : null;
      let example = data.example || null;
      let suggestedActions = Array.isArray(data.suggestedActions) ? data.suggestedActions : [];
      let citations = Array.isArray(data.citations)
        ? data.citations
        : (Array.isArray(data.sources) ? data.sources : []);

      return {
        text: responseText,
        thoughtProcess,
        latexFormula: data.latexFormula || null,
        steps,
        example,
        suggestedActions,
        isExplicitCode,
        citations,
        userIntent: data.userIntent || null,
      };
    } finally {
      this.inFlightRequests.delete(reqKey);
    }
  }

  /**
   * Analyze a handwritten or printed math problem image
   */
  async analyzeMathImage({ imageBase64, mimeType = 'image/jpeg', userPrompt = '' }) {
    if (!imageBase64) {
      throw new Error('Image data is required for analysis.');
    }

    const reqKey = `math-image-${Date.now()}`;
    if (this.inFlightRequests.has(reqKey)) {
      return null;
    }
    this.inFlightRequests.add(reqKey);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-math-image', {
        body: {
          imageBase64,
          mimeType,
          userPrompt,
        },
      });

      if (error) {
        console.warn('[AiService.analyzeMathImage] Edge Function error:', error);
        throw new Error(error.message || 'Unable to analyze math image.');
      }

      return {
        recognizedQuestion: data?.recognizedQuestion || 'Mathematical problem',
        transcribedExpression: data?.transcribedExpression || null,
        steps: Array.isArray(data?.steps) ? data.steps : [],
        finalAnswer: data?.finalAnswer || 'Result obtained.',
        relevantFormulas: Array.isArray(data?.relevantFormulas) ? data.relevantFormulas : [],
        isUnclear: !!data?.isUnclear,
        text: data?.text || 'Math problem solved.',
        suggestedActions: Array.isArray(data?.suggestedActions) ? data.suggestedActions : [],
      };
    } finally {
      this.inFlightRequests.delete(reqKey);
    }
  }

  /**
   * Generate an academic quiz dynamically for any subject/topic
   */
  async generateQuiz({ subject, topic, difficulty = 'medium', questionCount = 5 }) {
    const prompt = `Create an academic quiz for ${subject}${topic ? ` focusing on "${topic}"` : ''}.
Difficulty level: ${difficulty}.
Include ${questionCount} multiple choice questions.
For each question provide:
- question text
- 4 clear options (A, B, C, D)
- correct option index (0 to 3)
- step-by-step explanatory feedback.`;

    const response = await this.askTutor({
      prompt,
      mode: 'quiz',
      academicLevel: difficulty,
    });

    return response;
  }

  /**
   * Generate high-yield study flashcards
   */
  async generateFlashcards({ subject, topic }) {
    const prompt = `Generate a set of 5 high-yield revision flashcards for ${subject}${topic ? ` on the topic of "${topic}"` : ''}.
Each flashcard should highlight a core concept, key formula or definition, and an easy mnemonic or breakdown.`;

    const response = await this.askTutor({
      prompt,
      mode: 'flashcards',
    });

    return response;
  }
}

export const aiService = new AiService();
export default aiService;
