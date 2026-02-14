import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '..', 'vibewrite.db');

const scripts = [
    { name: "Pirate Captain", instructions: "Rewrite as a crusty pirate captain. Use words like 'arr', 'matey', 'scallywag'.", author: "Alex", example: "Ahoy there!" },
    { name: "Emoji Overlord", instructions: "Add excessive but relevant emojis. Every other word should have an emoji.", author: "Sarah", example: "I ❤️ coding 💻" },
    { name: "Shakespearean Poet", instructions: "Rewrite in authentic Early Modern English. Use 'thou', 'thee', 'art'.", author: "LordBard", example: "Thou art fair." },
    { name: "Gen Z Slang", instructions: "Use maximum Gen Z slang. Include 'no cap', 'fr fr', 'slay', 'periodt'.", author: "Z-Master", example: "Highkey fire fr." },
    { name: "Cold War Spy", instructions: "Rewrite as a coded message. Use 'eagle has landed', 'package secured'.", author: "Agent00", example: "The sparrow flies at midnight." },
    { name: "Gamer God", instructions: "Use gaming terminology. Include 'poggers', 'noob', 'carry', 'clutch'.", author: "Pwnz0r", example: "GG team! EZ win." },
    { name: "Gordon Ramsay", instructions: "Rewrite as if Gordon Ramsay is shouting. Use 'raw', 'donkey', 'stunning'.", author: "ChefHells", example: "IT'S RAW!" },
    { name: "Drill Sergeant", instructions: "Rewrite as a harsh Drill Sergeant. Use ALL CAPS and 'private'.", author: "SgtHardy", example: "MOVE IT, PRIVATE!" },
    { name: "Yoga Instructor", instructions: "Rewrite with extreme calmness. Use 'breath', 'center', 'energy'.", author: "ZenMaster", example: "Inhale peace." },
    { name: "Ancient Philosopher", instructions: "Rewrite as an ancient philosopher. Use grand metaphors about virtue.", author: "Socrates2", example: "Sands of time are fleeting." },
    { name: "Detective Noir", instructions: "Rewrite as a gritty noir detective. Use 'dame', 'heat', 'lead'.", author: "Spade", example: "Trouble in her eyes." },
    { name: "NASA Control", instructions: "Rewrite as mission control status updates. Use 'Roger', 'Copy', 'T-minus'.", author: "Houston", example: "All systems are green." },
    { name: "Medieval Knight", instructions: "Rewrite as a chivalrous knight. Use 'milord', 'honor', 'steel'.", author: "SirGalahad", example: "My sword is yours." },
    { name: "High Fantasy Wizard", instructions: "Rewrite as a mysterious wizard. Use 'arcane', 'spells', 'elder'.", author: "Gandalf9", example: "The arcane threads of fate." },
    { name: "Cyberpunk Hacker", instructions: "Rewrite with tech jargon. Use 'mainframe', ' ICE', 'glitch'.", author: "GhostInShell", example: "Bypassing the ICE." },
    { name: "Australian Outback", instructions: "Rewrite with heavy Aussie slang. Use 'mate', 'crikey', 'bonza'.", author: "Dundee", example: "Crikey! Ripper of a croc!" },
    { name: "Valley Girl", instructions: "Rewrite as a 90s Valley Girl. Use 'like', 'totally', 'as if'.", author: "Cher2", example: "Like, oh my god!" },
    { name: "Grumpy Cat", instructions: "Rewrite with extreme cynicism. Short, punchy, and miserable.", author: "Tardar", example: "I had fun once. It was awful." },
    { name: "Space Marine", instructions: "Rewrite as a futuristic soldier. Use 'target acquired', 'hostiles'.", author: "MasterChief", example: "Check your sectors." },
    { name: "Western Cowboy", instructions: "Rewrite as a rough cowboy. Use 'y'all', 'reckon', 'partner'.", author: "Wayner", example: "Howdy, partner." },
    { name: "Alien Scientist", instructions: "Rewrite as analyzing humans. Use 'specimen', 'carbon-based'.", author: "Zorg", example: "Primitive but fascinating." },
    { name: "Victorian Lady", instructions: "Rewrite with extreme politeness. Use 'scandal', 'tea', 'proper'.", author: "LadyA", example: "Quite improper, indeed." },
    { name: "Mad Scientist", instructions: "Rewrite with manic energy. Use 'behold', 'experiment', 'muhahaha'.", author: "DrFrank", example: "BEHOLD! It lives!" },
    { name: "Sports Commentator", instructions: "Rewrite as exciting play-by-play. Use 'unbelievable', 'GOAL'.", author: "Marv", example: "UNBELIEVABLE! He's done it!" },
    { name: "Nature Documentary", instructions: "David Attenborough style about a rare animal. Use 'majestic', 'habitat'.", author: "SirDavid", example: "Majestic creature." },
    { name: "Lovecraftian Horror", instructions: "Rewrite with cosmic dread. Use 'eldritch', 'unfathomable'.", author: "HP_L", example: "Eldritch shadow." },
    { name: "Professional Lawyer", instructions: "Rewrite with legal jargon. Use 'notwithstanding', 'heretofore'.", author: "Counselor", example: "Heretofore acknowledged." },
    { name: "Conspiracy Theorist", instructions: "Rewrite explaining dark secrets. Use 'rabbit hole', 'sheeple'.", author: "TruthSeeker", example: "They're spraying the clouds!" },
    { name: "Dungeon Master", instructions: "DM describing a scene. Use 'roll for initiative', 'perception check'.", author: "CritFail", example: "Roll for perception." },
    { name: "Southern Belle", instructions: "Rewrite with southern hospitality. Use 'bless your heart', 'darlin'.", author: "Scarlett", example: "Bless your heart, darlin'." },
    { name: "Viking Warrior", instructions: "Rewrite as a fierce Viking. Use 'shield-brother', 'skal', 'raiding'.", author: "Ragnar", example: "Skal shield-brothers!" },
    { name: "Hip Hop Producer", instructions: "Rewrite with industry slang. Use 'beats', 'fire', 'slapping'.", author: "DJ_Drop", example: "Track is slapping!" },
    { name: "Samurai Code", instructions: "Rewrite with honor and discipline. Use 'bushido', 'sword', 'peace'.", author: "Musashi", example: "Honor is the only path." },
    { name: "Film Critic", instructions: "Pretentious movie review. Use 'cinematography', 'pacing'.", author: "Ebert99", example: "Pacing suffered." },
    { name: "Italian Grandma", instructions: "Rewrite with warmth and care. Use 'mangia', 'bambino'.", author: "NonnaM", example: "Mangia! I made lasagna." },
    { name: "Time Traveler (1800s)", instructions: "1800s person discovering modern tech. Use 'bewitchment', 'steam'.", author: "Wells", example: "Hidden steam!" },
    { name: "Corporate Buzzword", instructions: "Use corporate buzzwords. Include 'synergy', 'leverage', 'deep dive'.", author: "CEO_Chad", example: "Strategic roadmap synergy." },
    { name: "Classic Fairy Tale", instructions: "Opening lines of a Brothers Grimm tale. Use 'once upon a time'.", author: "Grimm", example: "Once upon a time..." },
    { name: "Survivalist Expert", instructions: "Giving survival advice. Use 'shelter', 'foraging', 'primitive'.", author: "BearG", example: "Construct immediate shelter." },
    { name: "Zen Monk", instructions: "Rewrite with extreme simplicity. Focus on the present moment.", author: "Soji", example: "Do one thing." },
    { name: "British Aristocrat", instructions: "Rewrite with extreme poshness. Use 'quite', 'splendid', 'rubbish'.", author: "LordPosh", example: "Absolute rubbish!" },
    { name: "Streetwise Hustler", instructions: "Street-smart, fast-talking vibe. Use 'game', 'grind', 'stacks'.", author: "G-Money", example: "Out here on the grind." },
    { name: "NASA Scientist", instructions: "Cold, objective precision. Use 'velocity', 'trajectory'.", author: "Astro", example: "Nominal trajectory." },
    { name: "Southern Preacher", instructions: "Fiery southern preacher. Use 'hallelujah', 'amen', 'spirit'.", author: "RevDave", example: "Hallelujah! Amen!" },
    { name: "Ninja Assassin", instructions: "Stealthy, lethal precision. Use 'shadows', 'strike', 'silence'.", author: "Hanzo", example: "I move unseen." },
    { name: "Chef de Cuisine", instructions: "High-end French chef. Use 'presentation', 'palette', 'essence'.", author: "Pierre", example: "Je ne sais quoi." },
    { name: "Biker Gang", instructions: "Tough biker. Use 'hog', 'asphalt', 'brotherhood', 'chrome'.", author: "Blade", example: "Fire up the hogs!" },
    { name: "Ancient Egyptian Priest", instructions: "Priest of the Pharaoh. Use 'Nile', 'afterlife', 'gods'.", author: "Imhotep", example: "Ra rises over the Nile." },
    { name: "Social Media Influencer", instructions: "Annoying influencer speak. Use 'aesthetic', 'vibe', 'besties'.", author: "Tiffany_X", example: "OMG besties! Such a vibe." },
    { name: "Robot Surgeon", instructions: "Clinical medical language. Use 'incision', 'biometrics'.", author: "Unit7", example: "Initializing incision." },
    { name: "Wise Grandpa", instructions: "Gentle warmth and advice. Use 'listen here', 'patience'.", author: "Pops", example: "Patience builds character." }
];

async function seed() {
    console.log('🚀 Direct Seed starting...');
    console.log('📁 Target DB:', dbPath);

    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS community_scripts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            instructions TEXT NOT NULL,
            author TEXT DEFAULT 'Anonymous',
            votes INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
            example TEXT
        )
    `);

    // Ensure 'example' column exists (if table was created earlier without it)
    try {
        await db.exec('ALTER TABLE community_scripts ADD COLUMN example TEXT');
        console.log('✅ Added missing "example" column');
    } catch (e) {
        // Column likely already exists
    }

    await db.exec('DELETE FROM community_scripts');
    console.log('🧹 DB Cleared');

    for (const script of scripts) {
        await db.run(
            `INSERT INTO community_scripts (name, instructions, author, example, status, votes)
             VALUES (?, ?, ?, ?, 'approved', ?)`,
            [script.name, script.instructions, script.author, script.example, Math.floor(Math.random() * 50)]
        );
    }

    const count = await db.get('SELECT COUNT(*) as count FROM community_scripts');
    console.log(`✅ Success! Community Script Count: ${count.count}`);
    await db.close();
}

seed().catch(err => {
    console.error('💥 Error:', err);
    process.exit(1);
});
