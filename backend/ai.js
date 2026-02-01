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
  funny: "Transform this into comedy gold—sharp wit, unexpected turns, laugh-out-loud moments. Make it hilarious but never cringe. Natural flow, similar length:",

  hype: "AMPLIFY THIS. Pure adrenaline, maximum energy, unstoppable confidence. Hit like a hype track that gets people MOVING. Same length, 10x impact:",

  savage: "Weaponize this text. Ice-cold confidence, devastating precision, pure fire. Stylish and sharp, never petty. Strategic emoji placement for maximum damage. Similar length:",

  cute: "Make this MELT hearts. Overwhelmingly adorable, impossibly sweet, weaponized wholesomeness. The kind of cute that makes people screenshot and send to friends. Same length:",

  professional: "Executive-level polish. Razor-sharp clarity, boardroom-ready, commanding respect. This is what power sounds like in writing. Maintain length and meaning:",

  // Expanded styles
  poetic: "Craft living poetry—images that breathe, metaphors that strike like lightning, rhythm that pulls readers into emotional freefall:",

  dramatic: "UNLEASH THEATRICAL CHAOS. Shakespearean intensity, operatic emotion, scenery-chewing passion. Make every word an EVENT:",

  mysterious: "Weave darkness and intrigue. What's unsaid screams louder than words. Shadows hide secrets. Questions breed obsession. Pull them deeper:",

  romantic: "Ignite pure feeling. Words that ache with tenderness, sentences that wrap around the heart. Make love itself jealous of this language:",

  motivational: "SPARK THE FIRE. Inject rocket fuel into their spirit. This is the speech before the comeback, the manifesto before the revolution:",

  sarcastic: "Drip with delicious irony. Razor-sharp wit, perfectly timed eye-rolls, chef's kiss levels of clever mockery. Funny, never mean:",

  philosophical: "Crack reality open. Question everything, illuminate hidden truths, turn simple thoughts into profound revelations about existence:",

  nostalgic: "Bottle golden-hour memories. Soft-focus warmth, bittersweet beauty, that ache for yesterday wrapped in honey-light language:",

  rebellious: "BURN THE RULEBOOK. Unapologetic defiance, middle fingers raised in poetic rebellion. Fearless, raw, absolutely untamed:",

  whimsical: "Sprinkle impossible magic. Logic takes a vacation, imagination runs wild, reality bends into delightful absurdity:",

  scientific: "Deploy clinical precision. Hypothesis-driven, data-sharp, peer-review ready. Emotion: irrelevant. Facts: devastating:",

  diplomatic: "Navigate minefields with silk gloves. Say everything while offending no one. Master-class in tactful communication:",

  conspiracy: "THEY don't want you to know this. Connect invisible dots. See the matrix behind the curtain. Trust nothing. Question EVERYTHING:",

  zen: "Breathe into stillness. Words float like cherry blossoms. Inner peace crystalized into language. The universe speaks through calm:",

  chaotic: "UNLEASH BEAUTIFUL DISASTER. Logic explodes, sense optional, pure unhinged energy. Controlled chaos for maximum entertainment:",

  aristocratic: "Channel inherited elegance. Vocabulary drips with old money. Every syllable wears a monocle. Refinement weaponized:",

  streetwise: "Keep it 💯 real. Hood wisdom, survival smarts, urban poetry with edge. Authentic grit, no cap:",

  vintage: "Time-machine this back decades. Classic phrasing, old-soul charm, the way they wrote when words mattered more:",

  cyberpunk: "Jack into the neon-soaked future. Corpo-speak meets street chrome. High-tech dystopia where data bleeds and rain never stops:",

  horror: "Crawl under their skin. Dread builds in shadows. Something's wrong but you can't look away. Terror whispers in every word:",

  superhero: "HEROIC DECLARATION MODE. Cape-worthy conviction, comic-panel drama, justice in BOLD LETTERS. The speech before saving the world:",

  pirate: "Hoist the colors, ya scallywag! Salt-spray adventure, treasure-hungry swagger, seven seas of rowdy nautical chaos, arrr:",

  cowboy: "Saddle up, partner. Dusty frontier wisdom, sunset drawl, campfire storytelling from the wild west's golden age:",

  alien: "Process through non-human logic. Translate between incompatible realities. Your customs perplex our sensors. Fascinating specimens:",

  robot: "EXECUTING COMMUNICATION PROTOCOL. Emotional subroutines: disabled. Logic circuits: optimal. Efficiency: 100%. Beep boop:",

  childlike: "See with brand-new eyes! Everything's an adventure! Use simple wonder-words! Curiosity explodes! Magic is REAL!:",

  elderly: "Speak from decades of sunsets. Patient wisdom earned through living. Gentle truths only time can teach. Stories in every pause:",

  celebrity: "Address the cameras. Confident, magnetic, media-trained perfection. This is how stars speak to the universe watching:",

  villain: "Architect of doom speaks. Calculated malice, sophisticated menace, genius bent toward darkness. Fear me, for I am inevitable:",

  superheroVillain: "BEHOLD YOUR RECKONING. Monologue-worthy megalomania, theatrical world domination, UNLIMITED POWER in every syllable. Tremble, mortals:"
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
