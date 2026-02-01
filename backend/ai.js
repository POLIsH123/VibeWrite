// ===========================
// AI HELPER - OpenAI GPT-4o-mini Edition 🔥
// backend/ai.js
// ===========================

import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Vibe prompts - 30+ expanded styles
const vibePrompts = {
  // Core styles
  funny: "Rewrite this with clever, playful humor. Add light jokes and wit, keep it natural, and make it genuinely funny without embarrassing the sender. Keep roughly the same length:",

  hype: "Rewrite this with bold, high-energy excitement. Make it confident, punchy, and motivating like you’re hyping someone up. Keep it clear and about the same length:",

  savage: "Rewrite this sharp and savage with confident attitude. Be cutting and stylish, not mean or insulting. Add a few emojis only if they amplify impact. Keep the length similar:",

  cute: "Rewrite this to be adorable, wholesome, and heart-melting. Use soft, sweet, playful wording that makes someone smile or blush. Keep about the same length:",

  professional: "Rewrite this in a polished, professional tone. Clear, concise, and formal like business communication. Keep the meaning and similar length:",


  // Expanded styles
  poetic: "Rewrite this as lyrical poetry with vivid imagery, metaphors, and smooth rhythm that evokes emotion:",

  dramatic: "Rewrite this with intense, theatrical emotion and larger-than-life expression, like stage drama or epic storytelling:",

  mysterious: "Rewrite this with intrigue and suspense. Use subtle hints, shadows, and unanswered questions to create curiosity:",

  romantic: "Rewrite this with warmth, affection, and heartfelt emotion. Make it tender and deeply expressive:",

  motivational: "Rewrite this to inspire action and confidence. Use uplifting, empowering language that feels energizing:",

  sarcastic: "Rewrite this with dry, clever sarcasm and ironic humor. Keep it witty rather than cruel:",

  philosophical: "Rewrite this with deeper reflection and thoughtful insight, exploring meaning, purpose, or big ideas:",

  nostalgic: "Rewrite this with a soft, sentimental tone that feels reflective and warmly tied to the past:",

  rebellious: "Rewrite this with bold, defiant energy that challenges norms and feels fearless and independent:",

  whimsical: "Rewrite this in a playful, imaginative, slightly magical way with creative and fanciful language:",

  scientific: "Rewrite this with precise, objective, and logical wording like a scientific explanation:",

  diplomatic: "Rewrite this tactfully and respectfully, balancing clarity with sensitivity to avoid offense:",

  conspiracy: "Rewrite this with a suspicious tone that hints at hidden motives, secret agendas, and unseen forces:",

  zen: "Rewrite this with calm, mindful, and peaceful language that feels grounded and centered:",

  chaotic: "Rewrite this unpredictably with wild energy, strange turns, and intentionally messy logic for comedic chaos:",

  aristocratic: "Rewrite this in an elegant, refined, upper-class tone with sophisticated vocabulary and graceful phrasing:",

  streetwise: "Rewrite this with gritty, urban slang and confident street-smart attitude while staying natural:",

  vintage: "Rewrite this like it was written decades ago with classic phrasing and old-school charm:",

  cyberpunk: "Rewrite this with a futuristic, neon-lit, dystopian tech-noir vibe — high tech, low life:",

  horror: "Rewrite this with eerie, unsettling imagery and creeping dread that slowly builds tension:",

  superhero: "Rewrite this like a comic-book hero monologue — bold, action-packed, and larger than life:",

  pirate: "Rewrite this with fun nautical slang and adventurous seafaring energy like a lively pirate tale:",

  cowboy: "Rewrite this with rugged western frontier speech, relaxed drawl, and old-west storytelling style:",

  alien: "Rewrite this from an otherworldly perspective with strange logic and unfamiliar customs:",

  robot: "Rewrite this in a literal, logical, mechanical tone with precise and emotionless phrasing:",

  childlike: "Rewrite this with simple, innocent language full of wonder, curiosity, and playful joy:",

  elderly: "Rewrite this with gentle wisdom and reflective life experience, thoughtful and patient in tone:",

  celebrity: "Rewrite this with glamorous, confident, media-savvy language like a public figure addressing fans:",

  villain: "Rewrite this with dark, menacing intent and calculated ambition, like a scheming antagonist:",

  superheroVillain: "Rewrite this with grand, theatrical, world-dominating villain energy — dramatic, powerful, and intimidating:"
};





// ===========================
// FALLBACK REWRITES
// ===========================
function fallbackRewrite(text, vibe) {
  const mods = {
    funny: t => {
      const endings = [' lmao 💀', ' and I can\'t stop laughing 😭', ' fr fr no cap 😂', ' this is sending me 🤣', ' I\'m done bruh 💀💀'];
      return t + endings[Math.floor(Math.random() * endings.length)];
    },
    hype: t => {
      const openers = ['YO ', 'YOOO ', 'BRO ', 'LETS GOOOO ', 'AYYYY '];
      const closers = [' 🔥🔥🔥', ' ⚡️⚡️⚡️', ' 💯💯', ' LFG 🚀', ' SHEESH 🔥'];
      const text = Math.random() > 0.3 ? t.toUpperCase() : t;
      return openers[Math.floor(Math.random() * openers.length)] + text + closers[Math.floor(Math.random() * closers.length)];
    },
    savage: t => {
      const endings = [' ...and what? 💅', ' periodt.', ' that\'s the tea ☕', ' cry about it 🤷', ' no cap, just facts 😤'];
      return t + endings[Math.floor(Math.random() * endings.length)];
    },
    cute: t => {
      const openers = ['Aww ', 'Omg ', '✨ ', 'Hehe '];
      const closers = [' 🥺💕', ' 🌸✨', ' 💖🦋', ' 🥰', ' 💗✨'];
      return openers[Math.floor(Math.random() * openers.length)] + t + closers[Math.floor(Math.random() * closers.length)];
    },
    professional: t => {
      let result = t.charAt(0).toUpperCase() + t.slice(1);
      if (!/[.!?]$/.test(result)) result += '.';
      return result.replace(/\bi\b/g, 'I').replace(/\bim\b/gi, 'I am').replace(/\bdont\b/gi, 'do not');
    }
  };
  return mods[vibe]?.(text) || text;
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

    if (!vibe || !vibePrompts[vibe]) {
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

    if (text.length > 400) {
      return res.status(400).json({ 
        success: false,
        error: 'Text too long (max 400 chars)' 
      });
    }

    // Try OpenAI
    try {
      console.log(`🤖 Trying OpenAI GPT-4o-mini for ${vibe} vibe...`);
      
      const prompt = `${vibePrompts[vibe]} "${text}"`;
      
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
    }

    // Fallback
    console.log('🔄 Using fallback rewrite');
    const result = fallbackRewrite(text, vibe);
    return res.json({ 
      success: true, 
      rewrite: result,
      vibe: vibe,
      originalText: text,
      method: 'fallback'
    });

  } catch (err) {
    console.error('💥 API error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
}
