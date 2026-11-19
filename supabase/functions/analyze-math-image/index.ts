// supabase/functions/analyze-math-image/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CANDIDATE_VISION_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash'];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY is not configured in Supabase secrets' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id ?? null;

    const body = await req.json();
    const { imageBase64, mimeType = 'image/jpeg', userPrompt = '' } = body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Image data (base64) is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Limit base64 length (approx 7MB raw limit)
    if (imageBase64.length > 10 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'Image file size exceeds maximum limit of 5MB' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Strip prefix if present (e.g. data:image/jpeg;base64,)
    const cleanBase64 = imageBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');

    const systemInstruction = `You are an expert mathematics and science tutor specializing in deciphering handwritten notes, homework assignments, equations, and textbook diagrams.
Task:
1. Examine the provided image carefully. Transcribe any handwritten or printed mathematical equations or questions.
2. If handwriting is ambiguous or illegible, state the uncertainty explicitly in the response and set "isUnclear": true.
3. Provide a rigorous, easy-to-follow, step-by-step mathematical solution using standard pedagogical formatting.
4. Use standard LaTeX syntax for mathematical expressions.
5. Format the entire response strictly as valid JSON matching this schema:
{
  "recognizedQuestion": "Transcribed question or problem statement",
  "transcribedExpression": "Key mathematical expression in LaTeX (or null)",
  "steps": ["Step 1: ...", "Step 2: ...", ...],
  "finalAnswer": "Final calculated answer or concluding result",
  "relevantFormulas": ["Formula 1 in LaTeX", ...],
  "isUnclear": false,
  "text": "Comprehensive explanation of the solution",
  "suggestedActions": ["Explain step 2 further", "Give me a similar practice problem"]
}
Return ONLY valid JSON with no markdown wrapping.`;

    let geminiData: any = null;
    let lastError: any = null;

    for (const modelName of CANDIDATE_VISION_MODELS) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`;

        const geminiResponse = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    inlineData: {
                      mimeType,
                      data: cleanBase64,
                    },
                  },
                  {
                    text: userPrompt ? `Student Note: ${userPrompt}\nPlease solve and explain step-by-step.` : 'Please solve and explain this problem step-by-step.',
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 2048,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (geminiResponse.ok) {
          geminiData = await geminiResponse.json();
          break;
        }

        const errText = await geminiResponse.text();
        console.warn(`[analyze-math-image] Model ${modelName} returned ${geminiResponse.status}:`, errText);
        lastError = { status: geminiResponse.status, message: errText };
      } catch (fetchErr) {
        console.warn(`[analyze-math-image] Model ${modelName} fetch error:`, fetchErr);
        lastError = fetchErr;
      }
    }

    if (!geminiData) {
      console.error('[analyze-math-image] All vision models failed:', lastError);
      return new Response(
        JSON.stringify({ error: 'Image analysis failed. Please ensure the image is clear and try again.' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rawCandidate = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    let parsedResult;
    try {
      parsedResult = JSON.parse(rawCandidate);
    } catch {
      parsedResult = {
        recognizedQuestion: 'Mathematical expression analysis',
        transcribedExpression: null,
        steps: [rawCandidate || 'Unable to parse detailed steps.'],
        finalAnswer: 'See explanation above.',
        relevantFormulas: [],
        isUnclear: true,
        text: rawCandidate || 'Analyzed math image.',
        suggestedActions: ['Try another problem', 'Can you clarify this step?'],
      };
    }

    if (userId) {
      try {
        await supabase.from('ai_usage_logs').insert({
          user_id: userId,
          feature: 'analyze-math-image',
          tokens_used: geminiData.usageMetadata?.totalTokenCount || 0,
          status: 'success',
        });
      } catch {}
    }

    return new Response(JSON.stringify(parsedResult), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[analyze-math-image] Unhandled error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error processing image.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
