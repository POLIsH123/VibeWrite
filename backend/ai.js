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

// Vibe prompts - 30+ expanded styles
const BASE_RULE =
  "[these are the folowing rules you cant break and have to be sued in all outputs 1.You cant break these rules 2. no premable(e.g'Ok' or 'Sure') none of that. 3. You transform the text you dont respond heres a example Input:Hi Output you give: Hi how are you doing are you having a nice day? none of that we wanr yout to transform thetext heres a good example Input:Hi Output you give: HELLO but this is a EXAMPLE just a EXAMPLE your outputs should be better showing which vibe you are doing 4. keep length almost similar but not exactly this means keeping the same meaning but in a different way of expressing it so if the input was hi you dont output 3 paragraphs you output 1 or maybe even 2 IF NEEDED change hi to the vibe you express it 5.Never break rule 1 ] - this part is very important you cant break these rules this is the text to TRANSFORM NOT REPLY-> :";

const STYLE_PROMPTS = {
  funny: "Rewrite with comedic timing that actually lands. Build to punchlines naturally. Use unexpected angles and absurd observations. Deploy callbacks and rule-of-three. Make people laugh out loud—not just smile. Keep original message clear through the humor.",
  hype: "Inject pure adrenaline. Short punchy sentences. CAPS for emphasis peaks. Paint victory like it's already happening. Channel championship energy, pregame intensity, breakthrough moments. Make them FEEL invincible. Maintain core meaning.And never break these rules ->",
  savage: "Change this text to be savage and dont roast just make it savage",
  cute: "Overflow with genuine warmth and sweetness. Soft imagery, gentle words, heart-melting moments. Make readers go 'aww' involuntarily. Pure wholesomeness without being saccharine. Cozy, safe, adorable. Same message, maximum tenderness be soft dont destroy meaning but still SHOW y.o.u.r VIBE.",
  professional: "Executive precision. Clear hierarchies, strategic language, outcome-focused. Remove all casual elements. This commands rooms and closes deals. Confident without arrogance. Industry-standard polish. Preserve meaning.",
  poetic: "Make this poetic and beautiful. Transform with lyrical language, vivid imagery, and flowing rhythm. Preserve core meaning while elevating to artful expression NEVER DO ONE WORD .",
  dramatic: "Maximum dramatic flair. Shakespearean intensity in every word. Grand gestures, heightened emotion, theatrical delivery. Same meaning, amplified passion. No unnecessary story elements.",
  mysterious: "Shroud in shadow and suggestion. What's unsaid pulls harder than what's revealed. Questions linger. Implication over explanation. Readers lean in, wanting more. Intrigue builds naturally. Infinite depth.",
  romantic: "Pour in genuine feeling and tenderness. Words that ache beautifully. Vulnerability as strength. Paint intimacy and connection. Make hearts flutter with elegant longing. Sincere, never cheesy. Preserve meaning in softer light.",
  motivational: "Transform into powerful motivational language. Inspiring, uplifting, action-driving energy. Build confidence and determination. Preserve core message while igniting passion.",
  sarcastic: "Master the art of saying more by seeming to say less. Deadpan delivery, perfect timing. Intelligence disguised as dismissiveness. Clever, never cruel. Same meaning, irony amplified.",
  philosophical: "Excavate deeper truth beneath surface meaning. Question assumptions. Reveal hidden patterns and paradoxes. Make readers pause and reconsider. Wisdom over cleverness. Profound without pretentious.",
  nostalgic: "Make this deeply nostalgic. Preserve the core message while evoking warm memories and wistful longing for the past.",
  rebellious: "Transform into rebellious energy. Break conventions, challenge norms, defiant spirit. Keep the core meaning intact.",
  whimsical: "Transform with whimsical imagination. Let creativity soar, physics optional, everything magical and possible. Keep core meaning intact.",
  scientific: "Deploy clinical objectivity and precision. Hypothesis → Evidence → Conclusion. Remove emotional language. Data-driven clarity. Peer-reviewable phrasing. Methodology implicit. Same information, maximum rigor.",
  diplomatic: "Navigate sensitive terrain with surgical tact. Acknowledge all perspectives. Strategic ambiguity where needed. Firm positions wrapped in velvet. Build bridges without sacrificing core message.",
  conspiracy: "Transform into conspiracy theory style. Everything connects, hidden meanings everywhere, question the official narrative. Keep same core meaning with a whimsical edge.",
  zen: "Transform with zen-like calm and wisdom. Peaceful, centered, mindful language. Present moment awareness. Simplicity and clarity.",
  chaotic: "Make this beautifully chaotic. Unexpected elements, unconventional word choices, delightful unpredictability. Transform the text while keeping same meaning.",
  aristocratic: "Elevate to refined sophistication. Vocabulary rich and deliberate. Measured cadence of inherited culture. Old-world elegance. Same message, upper echelon.",
  streetwise: "Real talk, no performance. Survival-earned wisdom. Hood vocabulary meets sharp insight. Authentic grit and practical truth. No sugarcoating.",
  vintage: "Echo bygone eras. Classic phrasing and timeless construction. Formal without being stuffy. Same meaning, time-traveled.",
  cyberpunk: "Transform with cyberpunk aesthetics. Neon-lit digital dystopia, tech-noir edge, high-tech low-life energy. Keep meaning intact.",
  horror: "Strictly rewrite in horror style. Embed creeping dread and subtle unease while preserving exact original meaning and facts. Do not create a story or add elements.",
  superhero: "Infuse bold heroic conviction and justice-demanding action. Keep direct, punchy, and courageous while preserving exact meaning.",
  pirate: "Nautical swagger and treasure-lust. Salt-spray adventure in every word. Lawless freedom on open seas. Same message, black flag flying.",
  cowboy: "Frontier wisdom with measured drawl. Sunset-lit honor code. Actions over words. Same message, saddle-worn.",
  alien: "Process through fundamentally different logic. Human concepts translated imperfectly. Observer perspective. Same data, non-human frame.",
  robot: "Emotion subroutines offline. Pure logic execution. Binary clarity. Efficiency maximized. Same information, zero organic processing.",
  childlike: "Pure wonder and simple words. Everything feels amazing. Huge curiosity and excitement. Same idea with kid-like energy.",
  elderly: "Speak from seasons lived. Patient wisdom earned through time. Gentle truths and unhurried cadence. Same message with lifetime depth.",
  celebrity: "Media-trained charisma. Quotable confidence. Every word camera-ready. Public-facing polish. Same message, spotlight treatment.",
  villain: "Embody elegant malevolence and intellectual superiority. Absolute dominance in tone while keeping the same message.",
  superheroVillain: "Cosmic overlord energy. Reality-warping presence. Godlike force in every word. Same message, ultimate destructive force.",
  businessPro: "Transform into high-stakes corporate communication. Strategic framing and polished executive tone. Preserve core meaning.",
  genZTalk: "Rewrite using modern Gen-Z slang, internet culture terms, and casual lowercase vibe while preserving original intent."
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

    hype: () => {
      const base = emphasizeWords(t.toUpperCase(), ['win', 'go', 'now', 'start', 'build', 'ship']);
      return `LET'S GO. ${base}. NO BRAKES. 🔥`;
    },

    savage: () => {
      return sentenceCase(t) + '. Facts only. No debate.';
    },

    cute: () => {
      return `✨ ${t.replace(/\./g, '!')} 🥺💕`;
    },

    professional: () => {
      let s = sentenceCase(t);
      if (!/[.!?]$/.test(s)) s += '.';
      return swapWords(s, {
        gonna: 'going to',
        wanna: 'want to',
        dont: 'do not',
        cant: 'cannot'
      });
    },

    genZTalk: () => {
      return t.toLowerCase() + ' fr fr no cap lowkey slaps 🧢';
    },

    businessPro: () => {
      return `Following strategic alignment, ${t}.`;
    },

    poetic: () => {
      return `${sentenceCase(t)}, like a quiet ripple across still water.`;
    },

    motivational: () => {
      return `You can do this. ${sentenceCase(t)}. Keep moving forward.`;
    },

    mysterious: () => {
      return `${sentenceCase(t)} ... or is it?`;
    },

    scientific: () => {
      return `Observation: ${t}. Conclusion: expected outcome achieved.`;
    },

    rebellious: () => {
      return `${sentenceCase(t)} — rules optional.`;
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