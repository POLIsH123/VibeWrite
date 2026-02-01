// Test script to add some sample contributions
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api';

const sampleContributions = [
    {
        name: "Alex",
        scriptName: "Pirate Translator",
        instructions: "Rewrite any text like a pirate would say it, with 'arr', 'matey', and nautical terms",
        example: "Hello friend → Ahoy there, matey!"
    },
    {
        name: "Sarah",
        scriptName: "Emoji Master",
        instructions: "Add relevant emojis throughout the text to make it more expressive and fun",
        example: "I love pizza → I love pizza 🍕❤️"
    },
    {
        name: "CodeMaster",
        scriptName: "Shakespeare Mode",
        instructions: "Rewrite text in Shakespearean English with 'thou', 'thee', and poetic language",
        example: "You are beautiful → Thou art most beauteous"
    },
    {
        name: "Luna",
        scriptName: "Gen Z Translator",
        instructions: "Rewrite text using Gen Z slang like 'no cap', 'fr fr', 'periodt', 'slay'",
        example: "That's really good → That's fire no cap fr fr"
    },
    {
        name: "TechGuru",
        scriptName: "Robot Speak",
        instructions: "Rewrite text in a robotic, mechanical way with technical precision",
        example: "I'm happy → EMOTION: JOY DETECTED. HAPPINESS LEVEL: OPTIMAL"
    }
];

async function addTestContributions() {
    console.log('🧪 Adding test contributions...');
    
    for (const contribution of sampleContributions) {
        try {
            const response = await fetch(`${API_URL}/community/contribute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contribution)
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log(`✅ Added: "${contribution.scriptName}" by ${contribution.name} (${data.newCount}/50)`);
            } else {
                console.error(`❌ Failed to add: ${contribution.scriptName}`, data.error);
            }
            
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            console.error(`❌ Error adding ${contribution.scriptName}:`, error.message);
        }
    }
    
    console.log('🎉 Test contributions complete!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    addTestContributions();
}

export default addTestContributions;