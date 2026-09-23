import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'PRAGATI2.0/.env') });
const key = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
console.log('Testing key prefix:', key ? key.substring(0, 8) : 'NONE');

async function testModel(model: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'Hello' }] }] })
    });
    console.log(model, 'Status:', res.status);
    if (!res.ok) {
      const errText = await res.text();
      console.log(model, 'Body:', errText.substring(0, 150));
    } else {
      const data = await res.json();
      console.log(model, 'OK:', data?.candidates?.[0]?.content?.parts?.[0]?.text?.substring(0, 40));
    }
  } catch(e: any) {
    console.log(model, 'Error:', e.message);
  }
}

async function run() {
  const models = [
    'gemini-3.6-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash'
  ];
  for (const m of models) {
    await testModel(m);
  }
}
run();
