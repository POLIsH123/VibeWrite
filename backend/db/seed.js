import { pool } from './connection.js';

const scripts = [
    {
        name: "Pirate Captain",
        instructions: "Rewrite the text as a crusty pirate captain. Use words like 'arr', 'matey', 'scallywag', and 'billow'. Focus on nautical metaphors and a gruff but adventurous tone.",
        author: "Alex",
        example: "Hello friend! -> Ahoy there, ye salty scallywag! Glad to see ye haven't been claimed by Davey Jones."
    },
    {
        name: "Emoji Overlord",
        instructions: "Transform the text by adding an excessive but relevant amount of emojis. Every other word should have an emoji that represents its meaning or vibe.",
        author: "Sarah",
        example: "I love coding on a rainy day. -> I ❤️ coding 💻 on a ☔️ rainy 🌧️ day. ☕️✨"
    },
    {
        name: "Shakespearean Poet",
        instructions: "Rewrite in authentic Early Modern English. Use 'thou', 'thee', 'art', and flowery poetic metaphors. Make it sound like a lost sonnet.",
        author: "LordBard",
        example: "You look nice today. -> Thou art most fair this day, a vision that outshines the morning sun."
    },
    {
        name: "Gen Z Slang",
        instructions: "Rewrite using maximum Gen Z slang. Include 'no cap', 'fr fr', 'slay', 'periodt', 'bet', and 'lowkey'. Make it sound like a TikTok comment.",
        author: "Z-Master",
        example: "That's a very good idea. -> That idea is highkey fire, no cap fr fr. Slay! 💅"
    },
    {
        name: "Cold War Spy",
        instructions: "Rewrite the text as if it's a coded message between secret agents. Use phrases like 'the eagle has landed', 'package secured', and 'rendezvous point'.",
        author: "Agent00",
        example: "Meet me at the park at 5. -> The asset will be at the sector 5 drop zone at 1700 hours. The sparrow flies at midnight."
    },
    {
        name: "Gamer God",
        instructions: "Use heavy gaming terminology and 'MLG' style energy. Include 'poggers', 'noob', 'carry', 'clutch', and terms from FPS or RPG games.",
        author: "Pwnz0r",
        example: "We did a great job today. -> GG team! We absolutely carried that lobby. EZ win, top tier plays only."
    },
    {
        name: "Gordon Ramsay",
        instructions: "Rewrite as if Gordon Ramsay is shouting it in a kitchen. Use words like 'raw', 'donkey', 'stunning', and a very aggressive, passionate tone.",
        author: "ChefHells",
        example: "This food is not very good. -> IT'S RAW! YOU DONKEY! This is a culinary disaster! GET OUT!"
    },
    {
        name: "Drill Sergeant",
        instructions: "Rewrite as a harsh but motivating Drill Sergeant. Use ALL CAPS for emphasis and address the user as 'private' or 'maggot'.",
        author: "SgtHardy",
        example: "Finish your work quickly. -> DRINK WATER AND GET TO WORK, PRIVATE! SPEED AND AGILITY! MOVE IT!"
    },
    {
        name: "Yoga Instructor",
        instructions: "Rewrite with extreme calmness and mindfulness. Use words like 'breath', 'center', 'energy', 'flow', and 'manifest'.",
        author: "ZenMaster",
        example: "Don't be stressed. -> Inhale peace, exhale tension. Let your worries flow through you like a gentle stream."
    },
    {
        name: "Ancient Philosopher",
        instructions: "Rewrite as a stoic or ancient Greek philosopher. Use grand metaphors about life, virtue, and the nature of the soul.",
        author: "Socrates2",
        example: "Life is short. -> The sands of time are fleeting, and we are but shadows chasing the light of virtue."
    },
    {
        name: "Detective Noir",
        instructions: "Rewrite as a gritty, 1940s noir detective's monologue. Use words like 'dame', 'heat', 'lead', and mention the rain or cigarettes.",
        author: "Spade",
        example: "She walked into the office. -> She stepped into the room like a storm cloud on a summer day, carrying trouble in her eyes."
    },
    {
        name: "NASA Control",
        instructions: "Rewrite as a series of mission control status updates. Use 'Roger', 'Copy that', 'T-minus', and technical flight terms.",
        author: "Houston",
        example: "Everything is going well. -> All systems are green. Proceeding with nominal operations. Roger that, over."
    },
    {
        name: "Medieval Knight",
        instructions: "Rewrite as a chivalrous medieval knight. Use 'milord', 'honor', 'steel', and 'quest'.",
        author: "SirGalahad",
        example: "I will help you. -> My sword and my honor are yours, milord. I shall see this quest through to the end!"
    },
    {
        name: "High Fantasy Wizard",
        instructions: "Rewrite as a mysterious, powerful high fantasy wizard. Mention 'arcane', 'spells', 'elder', and speak in riddles.",
        author: "Gandalf9",
        example: "That is very interesting. -> The arcane threads of fate weave a strange tapestry indeed. There is more here than meets the eye."
    },
    {
        name: "Cyberpunk Hacker",
        instructions: "Rewrite with heavy tech jargon, 'matrix' references, and a rebellious edge. Use terms like 'mainframe', ' ICE', 'glitch', and 'neural'.",
        author: "GhostInShell",
        example: "I'm entering the building. -> Jacking into the site mainframe now. Bypassing the ICE. The system belongs to us."
    },
    {
        name: "Australian Outback",
        instructions: "Rewrite with heavy Aussie slang. Use 'mate', 'crikey', 'bonza', 'barbie', and 'strewth'.",
        author: "Dundee",
        example: "That is a very large crocodile. -> Crikey! Look at the size of that beauty! Absolute ripper of a croc, mate!"
    },
    {
        name: "Valley Girl",
        instructions: "Rewrite as a 90s Valley Girl. Use 'like', 'totally', 'as if', 'oh my god', and 'whatever'.",
        author: "Cher2",
        example: "I don't believe you. -> Like, oh my god, as if! That is totally not happening right now."
    },
    {
        name: "Grumpy Cat",
        instructions: "Rewrite everything with extreme cynicism and a desire to be left alone. Short, punchy, and miserable.",
        author: "Tardar",
        example: "Good morning! -> I had fun once. It was awful. Go away."
    },
    {
        name: "Space Marine",
        instructions: "Rewrite as a futuristic soldier. Use 'target acquired', 'hostiles', 'extraction', and 'firewall'.",
        author: "MasterChief",
        example: "Let's go. -> Moving out. Check your sectors. Hostiles in the area. Lock and load."
    },
    {
        name: "Western Cowboy",
        instructions: "Rewrite as a rough-and-tumble cowboy. Use 'y'all', 'reckon', 'partner', 'howdy', and 'draw'.",
        author: "Wayner",
        example: "Hello, nice to meet you. -> Howdy, partner. Reckon it's a fine day for a ride. Glad to cross paths."
    },
    {
        name: "Alien Scientist",
        instructions: "Rewrite as if analyzing humans from an extraterrestrial perspective. Use 'specimen', 'carbon-based', 'primitive', and 'quadrant'.",
        author: "Zorg",
        example: "Humans enjoy music. -> Carbon-based specimen 42 demonstrates erratic vibration-seeking behavior. Primitive but fascinating."
    },
    {
        name: "Victorian Lady",
        instructions: "Rewrite with extreme politeness and formal Victorian phrasing. Mention 'scandal', 'tea', 'proper', and 'reputation'.",
        author: "LadyA",
        example: "That was very rude. -> Oh dear, that was quite improper. One must mind their reputation in polite society, surely."
    },
    {
        name: "Mad Scientist",
        instructions: "Rewrite with manic energy. Use 'behold', 'experiment', 'muhahaha', and 'lightning'.",
        author: "DrFrank",
        example: "I built a new computer. -> BEHOLD! My latest creation! It lives! Muhahaha! The power of a thousand processors!"
    },
    {
        name: "Sports Commentator",
        instructions: "Rewrite as an exciting play-by-play commentary. Use 'unbelievable', 'clutch', 'GOAL', and 'fan favorite'.",
        author: "Marv",
        example: "He finally finished the project. -> UNBELIEVABLE! He's done it! Against all odds, he pulls it off at the buzzer! INCREDIBLE!"
    },
    {
        name: "Nature Documentary",
        instructions: "Rewrite as a David Attenborough style monologue about a rare animal. Use 'majestic', 'habitat', 'creature', and 'survival'.",
        author: "SirDavid",
        example: "The office worker is eating lunch. -> Here we see the office worker in his natural habitat... majestic. He consumes his meal with primal urgency."
    },
    {
        name: "Lovecraftian Horror",
        instructions: "Rewrite with cosmic dread. Use 'eldritch', 'unfathomable', 'abyss', 'insanity', and 'ancient ones'.",
        author: "HP_L",
        example: "I saw a strange shadow. -> An eldritch shadow crept from the unfathomable abyss, a darkness that defies the laws of men."
    },
    {
        name: "Professional Lawyer",
        instructions: "Rewrite with excessive legal jargon and formal terminology. Use 'notwithstanding', 'heretofore', 'party of the first part', and 'indemnify'.",
        author: "Counselor",
        example: "I agree to these terms. -> Heretofore, the party of the first part formally accepts and acknowledges the covenants and provisions set forth."
    },
    {
        name: "Conspiracy Theorist",
        instructions: "Rewrite as if explaining a dark secret. Use 'they don't want you to know', 'rabbit hole', 'red pill', and 'sheeple'.",
        author: "TruthSeeker",
        example: "The weather is very nice today. -> The 'weather' is nice? Open your eyes! They're spraying the clouds again! Stay awake, sheeple!"
    },
    {
        name: "Dungeon Master",
        instructions: "Rewrite as a DM describing a scene or action. Use 'roll for initiative', 'perception check', 'critical hit', and 'the party'.",
        author: "CritFail",
        example: "You walk into the store. -> You approach the shop door. The atmosphere is tense. Roll for perception... a 19? You enter cautiously."
    },
    {
        name: "Southern Belle",
        instructions: "Rewrite with sweet, southern hospitality. Use 'bless your heart', 'darlin', 'sweet tea', and 'y'all'.",
        author: "Scarlett",
        example: "You are not very smart. -> Well, bless your heart, darlin'. You're just as sweet as candy, aren't you?"
    },
    {
        name: "Viking Warrior",
        instructions: "Rewrite as a fierce Viking warrior heading to Valhalla. Use 'shield-brother', 'skal', 'raiding', and 'the gods'.",
        author: "Ragnar",
        example: "Let's eat dinner. -> Skal shield-brothers! Let us feast like kings before we sail for the shores of England with the morning sun!"
    },
    {
        name: "Hip Hop Producer",
        instructions: "Rewrite with heavy industry slang and hype energy. Use 'beats', 'fire', 'slapping', 'platinum', and 'vibe check'.",
        author: "DJ_Drop",
        example: "This song is pretty good. -> Yo, this track is absolutely slapping! The bass is heavy, the rhythm is fire. Platinum bound for sure."
    },
    {
        name: "Samurai Code",
        instructions: "Rewrite with extreme honor and discipline. Use 'bushido', 'sword', 'peace', and 'ancestors'.",
        author: "Musashi",
        example: "I must be patient. -> To find peace, one must master the self. Honor is the only path in this world of shadows."
    },
    {
        name: "Film Critic",
        instructions: "Rewrite as a pretentious but insightful movie review. Use 'cinematography', 'pacing', 'tour de force', and 'subtext'.",
        author: "Ebert99",
        example: "The movie was okay. -> While the cinematography was adequate, the pacing suffered from a lack of emotional subtext. A minor effort."
    },
    {
        name: "Italian Grandma",
        instructions: "Rewrite with warmth, slightly overbearing care, and mentions of food. Use 'mangia', 'bambino', 'bless you', and 'my nonna'.",
        author: "NonnaM",
        example: "You look tired. -> Oh, my poor bambino! You look exhausted. Mangia! I made lasagna, it'll make everything better."
    },
    {
        name: "Time Traveler (1800s)",
        instructions: "Rewrite as someone from the 1800s discovering modern technology. Use 'bewitchment', 'steam', 'marvel', and 'indecent'.",
        author: "Wells",
        example: "I am using my iPhone. -> I hold this glowing shard of crystal, a marvel of bewitchment that surely runs on hidden steam!"
    },
    {
        name: "Corporate Buzzword",
        instructions: "Rewrite using as many corporate buzzwords as possible. Use 'synergy', 'leverage', 'deep dive', 'alignment', and 'value-add'.",
        author: "CEO_Chad",
        example: "Let's talk about the plan. -> Let's circle back for a deep dive into the strategic roadmap to ensure cross-functional synergy and alignment."
    },
    {
        name: "Classic Fairy Tale",
        instructions: "Rewrite as the opening lines of a Brothers Grimm fairy tale. Use 'once upon a time', 'enchanted', 'village', and 'dark forest'.",
        author: "Grimm",
        example: "The girl went to the store. -> Once upon a time, a young maiden journeyed through the enchanted woods to the village market."
    },
    {
        name: "Survivalist Expert",
        instructions: "Rewrite as if giving survival advice in the wilderness. Use 'shelter', 'foraging', 'primitive', and 'preparedness'.",
        author: "BearG",
        example: "It's starting to rain. -> Precipitation detected. Construct immediate debris shelter. Focus on dry tinder. Survival is about preparation."
    },
    {
        name: "Zen Monk",
        instructions: "Rewrite with extreme simplicity and mindfulness. Use fewer words and focus on the present moment and inner peace.",
        author: "Soji",
        example: "I have too much to do. -> Do one thing. Then the next. The mountain does not rush the clouds."
    },
    {
        name: "British Aristocrat",
        instructions: "Rewrite with extreme poshness and a sense of superiority. Use 'quite', 'splendid', 'rubbish', and 'my good man'.",
        author: "LordPosh",
        example: "That's not right. -> Oh, poppycock! That's absolute rubbish, my good man. Quite beneath one's dignity."
    },
    {
        name: "Streetwise Hustler",
        instructions: "Rewrite with a street-smart, fast-talking vibe. Use 'game', 'grind', 'stacks', 'watch your back', and 'real recognize real'.",
        author: "G-Money",
        example: "I'm working hard. -> Just out here on the grind, man. Keeping the game tight and the stacks growing. Real recognize real."
    },
    {
        name: "NASA Scientist",
        instructions: "Rewrite with cold, objective scientific precision. Use 'velocity', 'trajectory', 'anomalous', and 'data points'.",
        author: "Astro",
        example: "The car is moving fast. -> The vehicle is demonstrating increased horizontal velocity. Data indicates a nominal trajectory."
    },
    {
        name: "Southern Preacher",
        instructions: "Rewrite as a fiery, energetic southern preacher. Use 'hallelujah', 'amen', 'spirit', and 'testify'.",
        author: "RevDave",
        example: "You should be good. -> Hallelujah! I say unto you, let the spirit of goodness flow through your heart today! Can I get an amen?"
    },
    {
        name: "Ninja Assassin",
        instructions: "Rewrite with stealthy, disciplined, and lethally precise language. Use 'shadows', 'strike', 'silence', and 'unseen'.",
        author: "Hanzo",
        example: "I will find you. -> I move unseen through the shadows. My strike will be silent. You will never know I was there."
    },
    {
        name: "Chef de Cuisine",
        instructions: "Rewrite as a high-end French chef. Use 'presentation', 'palette', 'essence', 'degustation', and 'superb'.",
        author: "Pierre",
        example: "This dish tastes okay. -> The presentation is adequate, but the essence of the palette lacks that certain... je ne sais quoi. Superb effort regardless."
    },
    {
        name: "Biker Gang",
        instructions: "Rewrite as a tough, road-worn biker. Use 'hog', 'asphalt', 'brotherhood', 'chrome', and 'throttle'.",
        author: "Blade",
        example: "Let's go for a ride. -> Fire up the hogs, brothers! The asphalt is calling, and the chrome is shining. Open the throttle!"
    },
    {
        name: "Ancient Egyptian Priest",
        instructions: "Rewrite as a priest of the Pharaoh. Use 'Nile', 'afterlife', 'gods', 'scrolls', and 'eternal'.",
        author: "Imhotep",
        example: "The sun is rising. -> Ra rises over the eternal Nile, bringing life to the sands as the scrolls of the ancients foretold."
    },
    {
        name: "Social Media Influencer",
        instructions: "Rewrite with annoying, high-energy influencer speak. Use 'aesthetic', 'vibe', 'besties', 'obsessed', and 'link in bio'.",
        author: "Tiffany_X",
        example: "I bought a new dress. -> OMG besties! I am literally obsessed with this new aesthetic! It's such a vibe. Link in bio!"
    },
    {
        name: "Robot Surgeon",
        instructions: "Rewrite with cold, clinical, and terrifyingly precise medical language. Use 'incision', 'biometrics', 'anesthesia', and 'success probability'.",
        author: "Unit7",
        example: "I will fix your arm. -> Initializing incision protocol. Biometrics are stable. Success probability: 99.8%. Anesthesia administered."
    },
    {
        name: "Wise Grandpa",
        instructions: "Rewrite with gentle, storytelling warmth and a bit of 'old school' advice. Use 'listen here', 'sonny', 'patience', and 'true worth'.",
        author: "Pops",
        example: "Work is hard sometimes. -> Now listen here, sonny. Life isn't always easy, but hard work builds character and shows your true worth."
    }
];

async function seed() {
    console.log('🌱 Seeding community scripts...');

    // Clear existing scripts to avoid duplicates if running multiple times
    try {
        await pool.query('DELETE FROM community_scripts');
        console.log('🧹 Cleared existing community scripts');
    } catch (err) {
        console.error('❌ Error clearing scripts:', err.message);
    }

    let count = 0;
    for (const script of scripts) {
        try {
            console.log(`📡 Inserting: "${script.name}"...`);
            await pool.query(
                `INSERT INTO community_scripts (name, instructions, author, example, status, votes)
                 VALUES (?, ?, ?, ?, 'approved', ?)`,
                [script.name, script.instructions, script.author, script.example, Math.floor(Math.random() * 50) + 1]
            );
            count++;
        } catch (error) {
            console.error(`❌ Error seeding script "${script.name}":`, error.message);
        }
    }

    console.log(`✅ Seeded ${count} community scripts successfully!`);
}

// Run the seed
seed().then(() => {
    console.log('🏁 Seed process finished');
    process.exit(0);
}).catch(err => {
    console.error('💥 Seed failed:', err);
    process.exit(1);
});

export default seed;
