const fs = require('fs');

async function deploy() {
  const token = process.env.SUPABASE_ACCESS_TOKEN || '';
  const projectRef = process.env.SUPABASE_PROJECT_REF || 'yzyartppzcsazwkqtjbw';
  const functionSlug = 'generate-speech';
  
  const filePath = 'c:/Users/USER/Desktop/Studpal App/supabase/functions/generate-speech/index.ts';
  const codeContent = fs.readFileSync(filePath, 'utf8');

  const metadata = {
    name: functionSlug,
    entrypoint_path: 'index.ts',
    verify_jwt: false,
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([codeContent], { type: 'application/typescript' }), 'index.ts');

  const url = `https://api.supabase.com/v1/projects/${projectRef}/functions/deploy?slug=${functionSlug}`;
  
  console.log('Deploying WAV-containerized generate-speech to:', url);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: form,
  });

  const text = await res.text();
  console.log('Deploy status:', res.status);
  console.log('Deploy response:', text);
}

deploy().catch(console.error);
