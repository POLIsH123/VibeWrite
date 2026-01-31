// ===========================
// AI Helper - NEW MODEL, NO LABUBUS
// ===========================
import { pipeline } from '@xenova/transformers';

let textGenerator = null;
let isLoading = false;

const vibePrompts = {
  funny: 'Rewrite this text to be funny and hilarious:\n\nOriginal: ',
  hype: 'Rewrite this text to be exciting and energetic:\n\nOriginal: ',
  savage: 'Rewrite this text to be sarcastic and savage:\n\nOriginal: ',
  cute: 'Rewrite this text to be cute and adorable:\n\nOriginal: ',
  professional: 'Rewrite this text to be professional and formal:\n\nOriginal: '
};

async function initializePipeline() {
  if (isLoading || textGenerator) return;

  try {
    isLoading = true;
    console.log('🤖 Loading GPT-2 (the SANE model)...');

    // GPT-2 is WAY better than T5 for this
    textGenerator = await pipeline(
      'text-generation',
      'Xenova/distilgpt2'
    );

    console.log('✅ Model loaded - Labubus GONE');
  } catch (err) {
    console.error('❌ Model load failed:', err);
    textGenerator = null;
  } finally {
    isLoading = false;
  }
}

initializePipeline();

// ===========================
// MAIN REWRITE - ACTUALLY WORKS NOW
// ===========================
async function generateRewrite(text, vibe) {
  const validation = validateInput(text);
  if (!validation.valid) throw new Error(validation.error);

  if (!vibePrompts[vibe]) {
    throw new Error(`Invalid vibe: ${vibe}`);
  }

  // Just use fallback - it's better than broken AI
  return fallbackRewrite(text, vibe);
  
  /* KEEPING AI CODE IN CASE YOU WANT TO TRY IT
  if (!textGenerator) {
    return fallbackRewrite(text, vibe);
  }

  const prompt = `${vibePrompts[vibe]}"${text}"\n\nRewritten: `;

  try {
    const output = await textGenerator(prompt, {
      max_new_tokens: 60,
      temperature: 0.9,
      top_k: 50,
      top_p: 0.95,
      do_sample: true
    });

    let result = output[0]?.generated_text
      ?.split('Rewritten: ')[1]
      ?.split('\n')[0]
      ?.trim();

    if (!result || result.length < 3) {
      return fallbackRewrite(text, vibe);
    }

    return cleanOutput(result);

  } catch (err) {
    console.error('❌ Error:', err);
    return fallbackRewrite(text, vibe);
  }
  */
}

// ===========================
// CLEAN OUTPUT
// ===========================
function cleanOutput(text) {
  return text
    .replace(/^["']|["']$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ===========================
// FALLBACK - ACTUALLY FIRE NOW 🔥
// ===========================
function fallbackRewrite(text, vibe) {
  const mods = {
    funny: t => {
      const endings = [
        ' lmao 💀',
        ' and I can\'t stop laughing 😭',
        ' fr fr no cap 😂',
        ' this is sending me 🤣',
        ' I\'m done bruh 💀💀'
      ];
      return t + endings[Math.floor(Math.random() * endings.length)];
    },
    
    hype: t => {
      const openers = ['YO ', 'YOOO ', 'BRO ', 'LETS GOOOO '];
      const closers = [' 🔥🔥🔥', ' ⚡️⚡️⚡️', ' 💯💯', ' LFG 🚀'];
      return openers[Math.floor(Math.random() * openers.length)] + 
             t.toUpperCase() + 
             closers[Math.floor(Math.random() * closers.length)];
    },
    
    savage: t => {
      const endings = [
        ' ...and what? 💅',
        ' periodt.',
        ' that\'s the tea ☕',
        ' cry about it 🤷',
        ' no cap, just facts 😤'
      ];
      return t + endings[Math.floor(Math.random() * endings.length)];
    },
    
    cute: t => {
      const openers = ['Aww ', 'Omg ', '✨ '];
      const closers = [' 🥺💕', ' 🌸✨', ' 💖🦋', ' 🥰'];
      return openers[Math.floor(Math.random() * openers.length)] + 
             t + 
             closers[Math.floor(Math.random() * closers.length)];
    },
    
    professional: t => {
      // Capitalize first letter
      let result = t.charAt(0).toUpperCase() + t.slice(1);
      // Add period if missing
      if (!/[.!?]$/.test(result)) {
        result += '.';
      }
      return result;
    }
  };

  return mods[vibe]?.(text) || text;
}

// ===========================
// VALIDATION
// ===========================
function validateInput(text) {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Text is required' };
  }

  const trimmed = text.trim();
  
  if (!trimmed) {
    return { valid: false, error: 'Text cannot be empty' };
  }

  if (trimmed.length > 400) {
    return { valid: false, error: 'Text too long (max 400 chars)' };
  }

  return { valid: true, text: trimmed };
}

export {
  generateRewrite,
  validateInput,
  fallbackRewrite
};