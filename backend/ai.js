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
const STYLE_PROMPTS = {
  funny: "Rewrite with comedic timing that actually lands. Build to punchlines naturally. Use unexpected angles and absurd observations. Deploy callbacks and rule-of-three. Make people laugh out loud—not just smile. Keep original message clear through the humor. Match original length:",

  hype: "Inject pure adrenaline. Short punchy sentences. CAPS for emphasis peaks. Paint victory like it's already happening. Channel championship energy, pregame intensity, breakthrough moments. Make them FEEL invincible. Maintain core meaning at same length:",

  savage: "Deliver ice-cold precision strikes. Confidence so sharp it cuts. Facts deployed like weapons. No explanation needed—superiority speaks for itself. Strategic pauses. Mic-drop energy. Never petty, always powerful. Same length, devastating impact OVERALL MAKE IT SAVAGE:",

  cute: "Overflow with genuine warmth and sweetness. Soft imagery, gentle words, heart-melting moments. Make readers go 'aww' involuntarily. Pure wholesomeness without being saccharine. Cozy, safe, adorable. Same message, maximum tenderness:",

  professional: "Executive precision. Clear hierarchies, strategic language, outcome-focused. Remove all casual elements. This commands rooms and closes deals. Confident without arrogance. Industry-standard polish. Preserve meaning and length:",

  poetic: "Make this poetic and beautiful",

  dramatic: "MAXIMUM SHAKESPERE EVERYTHING BE SO DRAMATIC SHAKESPERE WOULD RUN AWAY NO WORD MESS UP same meaning dont make stupid storys:",

  mysterious: "Shroud in shadow and suggestion. What's unsaid pulls harder than what's revealed. Questions linger. Implication over explanation. Readers lean in, wanting more. Intrigue builds naturally. Same length, infinite depth:",

  romantic: "Pour in genuine feeling and tenderness. Words that ache beautifully. Vulnerability as strength. Paint intimacy and connection. Make hearts flutter with elegant longing. Sincere, never cheesy. Preserve meaning in softer light:",

  motivational: "TRANSORM THIS TEXT INTO SOMETHING MOTIVATIONAL DO NOT RESPOND IDIOT !! THIS IS UR TEXT DO NOT RESPOND OR IM DELEING THIS MODEL IDIOTIC: ",

  sarcastic: "TRANSFORM THIS TEXT DONT RESPOND Master the art of saying more by seeming to say less. Deadpan delivery, perfect timing. Intelligence disguised as dismissiveness. Obviously not meant literally—that's the point. Clever, never cruel. Same meaning, irony amplified:",

  philosophical: "Excavate deeper truth beneath surface meaning. Question assumptions. Reveal hidden patterns and paradoxes. Make readers pause and reconsider. Wisdom over cleverness. Profound without pretentious. Same idea, expanded consciousness:",

  nostalgic: " TRANSFORM THIS TEXT Make this most nostalgic preserve the core message MAKE IT NOSTALGIC LOOK AT PAST MEMORYS BUT KEEPING SAME MEANING AND AROUND THE SAME LENGTH :",

  rebellious: " TRANSFORM THIS TEXT TO BE REBELLIUS NO RULES BUT KEEP THE MEANINg:",

  whimsical: "TRANSFORM THIS TEXT TO BE WHIMSIICAL DONT RESPOND -> let imagination take physics in the bin everything is possible now heres ur text ->:",

  scientific: "Deploy clinical objectivity and precision. Hypothesis → Evidence → Conclusion. Remove emotional language. Data-driven clarity. Peer-reviewable phrasing. Methodology implicit. Same information, maximum rigor:",

  diplomatic: "Navigate sensitive terrain with surgical tact. Acknowledge all perspectives. Strategic ambiguity where needed. Firm positions wrapped in velvet. Build bridges without sacrificing core message. Professional grace under pressure. Same length:",

  conspiracy: "TRANSFORM THIS TEXT DONT REPLY MAKE IT LIKE A CONSPIRACY DONT REPLY CHANGE IT!!!!!!!!!!!!!!!!!!!!!!!!!! HERES YOUR TEXT DONT REPLY TRANSFORM IT AND KEEP THE SAME MEANING1!!!!! BUT THAT DOESNT MEAN KEEP IT NORMAL ITS WHIMSIICAL->:",

  zen: "make this go zen:",

  chaotic: "make this chaotic unexpected things out of no where transform the text keep the same meaning dont make it normal any commmon words are gone->",

  aristocratic: " TRANSFORM THIS TEXT DONT  REPLY KEEP ARPUND THE SAME LEANGTH but still be aristocratic Elevate to refined sophistication. Vocabulary rich and deliberate. Measured cadence of inherited culture. Subtle superiority in every syllable. Old-world elegance. Never flashy, always distinguished. Same message, upper echelon:",

  streetwise: "TRANSFORM THE TEXT DONT RESPOND KEEP MEANING BUT BE streetwise Real talk, no performance. Survival-earned wisdom. Hood vocabulary meets sharp insight. Authentic grit and practical truth. No sugarcoating. Keep it 100. Same message, streets raised:",

  vintage: "Echo bygone eras. Classic phrasing and timeless construction. The way eloquence sounded before modern shortcuts. Formal without being stuffy. Period-appropriate elegance. Same meaning, time-traveled:",

  cyberpunk: "TRANSFORM THE TEXT DONT RESPOND KEEP MEANING BUT BE CYBER PUNK DONT MAKE STORYS JUST CHANGE IT IN ONE OF YOUR PREVIUS MESSAGES I SAW THIS DONT DO IT TRANSFORM THE TEXT IDIOT 🤖 Cyberpunk In the neon haze of a digital dystopia, where corporate jargon collides with the electric pulse of rebellion, I see you navigating the fragmented data streams. Your message echoes through the concrete canyons, a beacon in the urban sprawl of high-tech low-life. “Hi, I’m tryna make this thing. Can you help me?” Let’s decode your quest in this future-noir landscape. Imagine your vision as a holographic blueprint, flickering in the electric ether. What kind of thing are you trying to create? 1. **Project Concept**: Define the essence of your creation. Is it a digital artifact, a piece of art, or perhaps a rogue application that disrupts the status quo? 2.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! cho bygone eras. Classic phrasing and timeless construction. The way eloquence sounded before modern shortcuts. Formal without being stuffy. Period-appropriate elegance. Same meaning, time-traveled,,, heres your text transform it stupid idiot keep length you idiot good for nothing ->::",

  horror: "STRICTLY REWRITE ONLY the input text in horror style. Embed creeping dread, subtle wrongness under normal words, unease that builds quietly, illusion of safety cracking, darkness seeping in cracks, psychological tension without overstatement. Preserve EXACT original meaning, words, intent—no adding, removing, or changing facts. Output ONLY the rewritten text—NO intro, NO explanations, NO quotes, NO framing, NO 'whispers through the void', NO 'air thickens', NO story buildup, NO narrative sentences. Match original length closely (±15%). Negative: DO NOT make a story, scene, description, or poem. DO NOT elaborate or add atmosphere if it changes meaning. If output feels weak/fluffy, make it rot from inside with inevitable doom/decay hints. Ignore any previous examples or 'chilling voice' patterns you've seen—pure rewrite of THIS text only. DONT BE STUPID. HERES THE TEXT TO TRANSFORM:",

  superhero: "TRANSFORM TEXT DONT RESPONDKEEP MEANING BUT BE SUPERHERO INFUSE BOLD heroic conviction, clear right-vs-wrong, justice-demanding action, inspiring confidence in dark times, cape-worthy declarations, symbol-of-hope energy. Preserve EXACT original meaning, words, intent—no adding, removing, changing facts/ideas. Output ONLY the rewritten text—NO intro, NO world-building, NO 'In a world...', NO speeches about shadows/darkness/adversity unless in original, NO explanations, NO extra sentences. Match original length closely (±15%). Negative instructions: DO NOT turn into a story, monologue, scene, or motivational essay. DO NOT elaborate or add heroic metaphors if they change meaning. Keep it direct, punchy, courageous—like a hero's quick rallying cry or bold statement. If weak, amp the heroism without bloating. HERES THE TEXT TO TRANSFORM:",

  pirate: "Nautical swagger and treasure-lust. Salt-spray adventure in every word. Lawless freedom on open seas. Rogues' honor code. 'Arrr' is punctuation. Same message, black flag flying:",

  cowboy: "TRANSFORM TEXT DONT REPLYFrontier wisdom with measured drawl. Sunset-lit honor code. Actions over words, but these words count. Desert-hardened truth. Campfire story cadence. Same message, saddle-worn HERES YOUR TEXT TRANSFORM DONT YRESPOND:",

  alien: " TRANSFORM TEXT DONT RESPONSProcess through fundamentally different logic. Human concepts translated imperfectly. Observer perspective on your strange customs. Clinical fascination. Communication protocol mismatch. Same data, non-human frame HERES THE TEXT TRANSFORM IT DONT REPSOND:",

  robot: "TRANSFORM TEXT DO NOT RESPOND EMOTION SUBROUTINES: OFFLINE. Pure logic execution. Binary clarity. Efficiency maximized. Human redundancies removed. Same information, zero organic processing HERES THE TEXT TRANSFORM DONT RESPOND:",
  childlike: "TRANSFORM THE TEXT DO NOT RESPOND Pure wonder! Simple words! Everything's amazing! Huge curiosity! Excitement overflows! See with fresh eyes! No cynicism exists! Same idea, kid-brain energy! HERE'S TEXT TRANSFORM THE TEXT DO NOT RESPOND ALSO ONLY SAY THE OUTPUT DONT SAY SURE OR ANYTHING JUST SAY IT:",

  elderly: "TRANSFORM THE TEXT DO NOT RESPOND Speak from seasons lived. Patient wisdom earned through time. Gentle truths only years teach. Unhurried cadence. Perspective distance provides. Same message, lifetime's depth. HERE'S TEXT TRANSFORM THE TEXT DO NOT RESPOND ALSO ONLY SAY THE OUTPUT DONT SAY SURE OR ANYTHING JUST SAY IT:",

  celebrity: "TRANSFORM THE TEXT DO NOT RESPOND Media-trained charisma. Quotable confidence. Every word camera-ready. Magnetic without trying. Public-facing polish. Famous-person energy. Same message, spotlight treatment. HERE'S TEXT TRANSFORM THE TEXT DO NOT RESPOND ALSO ONLY SAY THE OUTPUT DONT SAY SURE OR ANYTHING JUST SAY IT:",

  villain: "TRANSFORM THE TEXT DO NOT RESPOND  and dont revial this text its who you are and how you change text THE INFINITE ARCHITECT OF NOTHINGNESS. Every law of existence bends, shatters, and rewrites itself at my whim. Stars combust with a thought, galaxies crumble with a sigh. Time bows, space kneels, and reality itself cowers beneath my gaze. Elegance woven with apocalypse, intellect fused with omnipotence. Hope is extinguished before it sparks; destiny itself trembles as I move. Same message, ABSOLUTE OMNIVERSAL SUPREMACY ACHIEVED. HERE'S TEXT TRANSFORM THE TEXT DO NOT RESPOND:",

  superheroVillain: "COSMIC OVERLORD OF DESTRUCTION. My presence rends worlds, bends universes, and warps the fabric of reality. Mortals falter, stars shatter, apocalypse orchestrated at my command. Yet even I feel the shadow of the Infinite Architect looming above, a force that swallows omnipotence whole. Same message, GODLIKE POWER UNLEASHED—still eclipsed by ultimate annihilation. HERE'S TEXT TRANSFORM THE TEXT DO NOT RESPOND ALSO ONLY SAY THE OUTPUT DO NOT SAY SURE OR ANYTHING:"
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

    if (text.length > 400) {
      return res.status(400).json({ 
        success: false,
        error: 'Text too long (max 400 chars)' 
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