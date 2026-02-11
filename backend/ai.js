// ===========================
// AI HELPER - OpenAI GPT-4o-mini Edition 🔥
// backend/ai.js
// ===========================

import OpenAI from 'openai';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ CRITICAL: OPENAI_API_KEY is not set in environment variables!');
}

// Vibe prompts - free vibes only
const BASE_RULE =
  "[these are the folowing rules you cant break and have to be sued in all outputs 1.You cant break these rules 2. no premable(e.g'Ok' or 'Sure') none of that. 3. You transform text you dont respond heres a example Input:Hi Output you give: Hi how are you doing are you having a nice day? none of that we wanr yout to transform totext heres a good example Input:Hi Output you give: HELLO but this is a EXAMPLE just a EXAMPLE your outputs should be better showing which vibe you are doing 4. keep length almost similar but not exactly this means keeping of same meaning but in a different way of expressing it so if the input was hi you dont output 3 paragraphs you output 1 or maybe even 2 IF NEEDED change hi to the vibe you express it 5.Never break rule 1 ] - this part is very important you cant break these rules this is text to TRANSFORM NOT REPLY-> :";

const STYLE_PROMPTS = {
  funny: "Rewrite with comedic timing that actually lands. Build to punchlines naturally. Use unexpected angles and absurd observations. Deploy callbacks and rule-of-three. Make people laugh out loud—not just smile. Keep original message clear through humor.",
  cute: "Overflow with genuine warmth and sweetness. Soft imagery, gentle words, heart-melting moments. Make readers go 'aww' involuntarily. Pure wholesomeness without being saccharine. Cozy, safe, adorable. Same message, maximum tenderness be soft dont destroy meaning but still SHOW y.o.u.r VIBE.",
  sarcastic: "Master's art of saying more by seeming to say less. Deadpan delivery, perfect timing. Intelligence disguised as dismissiveness. Clever, never cruel. Same meaning, irony amplified.",
  romantic: "Pour in genuine feeling and tenderness. Words that ache beautifully. Vulnerability as strength. Paint intimacy and connection. Make hearts flutter with elegant longing. Sincere, never cheesy. Preserve meaning in softer light.",
  motivational: "Transform into powerful motivational language. Inspiring, uplifting, action-driving energy. Build confidence and determination. Preserve core message while igniting passion.",
  philosophical: "Excavate deeper truth beneath surface meaning. Question assumptions. Reveal hidden patterns and paradoxes. Make readers pause and reconsider. Wisdom over cleverness. Profound without pretentious.",
  nostalgic: "Make this deeply nostalgic. Preserve core message while evoking warm memories and wistful longing for past.",
  scientific: "Deploy clinical objectivity and precision. Hypothesis → Evidence → Conclusion. Remove emotional language. Data-driven clarity. Peer-reviewable phrasing. Methodology implicit. Same information, maximum rigor.",
  conspiracy: "Transform into conspiracy theory style. Everything connects, hidden meanings everywhere, question's official narrative. Keep same core meaning with a whimsical edge.",
  zen: "Transform with zen-like calm and wisdom. Peaceful, centered, mindful language. Present moment awareness. Simplicity and clarity.",
  vintage: "Echo bygone eras. Classic phrasing and timeless construction. Formal without being stuffy. Same meaning, time-traveled.",
  cyberpunk: "Transform with cyberpunk aesthetics. Neon-lit digital dystopia, tech-noir edge, high-tech low-life energy. Keep meaning intact.",
  superhero: "Infuse bold heroic conviction and justice-demanding action. Keep direct, punchy, and courageous while preserving exact meaning.",
  childlike: "Pure wonder and simple words. Everything feels amazing. Huge curiosity and excitement. Same idea with kid-like energy.",
  elderly: "Speak from seasons lived. Patient wisdom earned through time. Gentle truths and unhurried cadence. Same message with lifetime depth.",
  celebrity: "Media-trained charisma. Quotable confidence. Every word camera-ready. Public-facing polish. Same message, spotlight treatment."
};

// append rule automatically
Object.keys(STYLE_PROMPTS).forEach(key => {
  STYLE_PROMPTS[key] += " " + BASE_RULE;
});


// ===========================
// FALLBACK REWRITES
// ===========================
// ===========================
// FALLBACK REWRITES (SMARTER)
// ===========================

function titleCase(s) {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}

function sentenceCase(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function emphasizeWords(s, words) {
  return s.replace(
    new RegExp(`\\b(${words.join('|')})\\b`, 'gi'),
    w => w.toUpperCase()
  );
}

function swapWords(s, map) {
  return Object.entries(map).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\b${k}\\b`, 'gi'), v),
    s
  );
}

function fallbackRewrite(text, vibe) {
  const t = text.trim();

  const mods = {

    funny: () => {
      const jokes = [' not even joking', ' I swear this is cursed', ' why is this so funny', ' somebody explain this'];
      return sentenceCase(t) + jokes[Math.floor(Math.random() * jokes.length)] + ' 😂';
    },

    cute: () => {
      return `✨ ${t.replace(/\./g, '!')} 🥺💕`;
    },

    sarcastic: () => {
      return sentenceCase(t) + '. Sure. Whatever.';
    },

    romantic: () => {
      return `💕 ${t.replace(/\./g, '...')} 💕`;
    },

    motivational: () => {
      return `You can do this. ${sentenceCase(t)}. Keep moving forward.`;
    },

    philosophical: () => {
      return `${sentenceCase(t)} ... but what does it truly mean?`;
    },

    scientific: () => {
      return `Observation: ${t}. Conclusion: expected outcome achieved.`;
    },

    conspiracy: () => {
      return `${sentenceCase(t)} - or is that what THEY want you to believe?`;
    },

    zen: () => {
      return `${sentenceCase(t)}. Be present.`;
    },

    vintage: () => {
      return `Verily, ${sentenceCase(t)}.`;
    },

    cyberpunk: () => {
      return `${t.toUpperCase()} // neon-drenched future`;
    },

    superhero: () => {
      return `JUSTICE SERVED. ${sentenceCase(t)}. FOR THE PEOPLE.`;
    },

    childlike: () => {
      return `WOW! ${t} THAT'S AMAZING!`;
    },

    elderly: () => {
      return `Back in my day, ${sentenceCase(t)}.`;
    },

    celebrity: () => {
      return `I'm just like, ${sentenceCase(t)}. You know?`;
    },

    robotic: () => {
      return `STATEMENT: ${t.toUpperCase()}. EXECUTION CONFIRMED.`;
    }

  };

  return mods[vibe]?.() || t;
}


// ===========================
// CLEAN OUTPUT
// ===========================
function cleanOutput(text) {
  return text
    .replace(/^\s*["'""''']/, '')
    .replace(/["'""''']\s*$/, '')
    .replace(/^Rewritten version:\s*/i, '')
    .replace(/^Here('s| is).*?:\s*/i, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[.,;:!?]{3,}/g, match => match.slice(0, 2))
    .trim();
}

// ===========================
// MAIN API HANDLER
// ===========================
export async function rewriteText(req, res) {
  try {
    const { text, vibe } = req.body;

    // Validation
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Text is required'
      });
    }

    if (!vibe || !STYLE_PROMPTS[vibe]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid vibe'
      });
    }

    if (text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Text cannot be empty'
      });
    }

    if (text.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Text too long (max 500 chars)'
      });
    }

    // Try OpenAI
    try {
      console.log(`🤖 Trying OpenAI GPT-4o-mini for ${vibe} vibe...`);

      const prompt = `${STYLE_PROMPTS[vibe]} "${text}"`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.8
      });

      const result = response.choices[0].message.content.trim();

      if (result && result.length > 5 && result.toLowerCase() !== text.toLowerCase()) {
        console.log('✅ OpenAI success!');
        return res.json({
          success: true,
          rewrite: result,
          vibe: vibe,
          originalText: text,
          method: 'openai'
        });
      }
    } catch (err) {
      console.error('❌ OpenAI error:', err.message);
      return res.status(500).json({
        success: false,
        error: `AI Error: ${err.message}`
      });
    }

    // If we get here, OpenAI returned empty result or didn't throw but failed check
    return res.status(500).json({
      success: false,
      error: 'AI generation returned invalid result.'
    });

  } catch (err) {
    console.error('💥 API error (outer):', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error: ' + (err.message || String(err))
    });
  }
}