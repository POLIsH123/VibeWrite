// ===========================
// Global State
// ===========================
let currentVibe = null;
let userName = localStorage.getItem('vibewrite_username');
let isPro = localStorage.getItem('vibewrite_pro') === 'true';
let dailyUsage = parseInt(localStorage.getItem('vibewrite_daily_usage') || '0');
let lastUsageDate = localStorage.getItem('vibewrite_last_usage_date');
const MAX_FREE_REWRITES = 5;

// Backend API URL - update this to your deployed backend
const API_URL = 'http://localhost:3000/api';

// ===========================
// Initialization
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Check if user needs to enter name
    if (!userName) {
        showNameModal();
    }
    
    // Update UI with user info
    updateUserInfo();
    
    // Reset daily usage if it's a new day
    checkAndResetDailyUsage();
    
    // Add character counter listener
    const inputTextarea = document.getElementById('input-text');
    if (inputTextarea) {
        inputTextarea.addEventListener('input', updateCharCount);
    }
    
    // Animate rotating text in hero
    animateRotatingText();
});

// ===========================
// Navigation Functions
// ===========================
function openApp() {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    window.scrollTo(0, 0);
}

function backToHome() {
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('landing-page').style.display = 'block';
    window.scrollTo(0, 0);
    resetApp();
}

// ===========================
// User Management
// ===========================
function showNameModal() {
    const modal = document.getElementById('name-modal');
    modal.style.display = 'flex';
}

function saveName() {
    const nameInput = document.getElementById('user-name-input');
    const name = nameInput.value.trim();
    
    if (name) {
        userName = name;
        localStorage.setItem('vibewrite_username', name);
        document.getElementById('name-modal').style.display = 'none';
        updateUserInfo();
    } else {
        alert('Please enter your name!');
    }
}

function updateUserInfo() {
    const userNameEl = document.getElementById('user-name');
    const usageCounterEl = document.getElementById('usage-counter');
    const upgradeBtn = document.getElementById('upgrade-btn');
    
    if (userNameEl && userName) {
        userNameEl.textContent = `Hey, ${userName}! 👋`;
    }
    
    if (isPro) {
        usageCounterEl.textContent = '∞ Unlimited rewrites';
        usageCounterEl.style.color = '#10B981';
        upgradeBtn.style.display = 'none';
    } else {
        const remaining = MAX_FREE_REWRITES - dailyUsage;
        usageCounterEl.textContent = `${remaining} rewrites left today`;
        
        if (remaining === 0) {
            usageCounterEl.style.color = '#EF4444';
        }
    }
}

function checkAndResetDailyUsage() {
    const today = new Date().toDateString();
    
    if (lastUsageDate !== today) {
        dailyUsage = 0;
        localStorage.setItem('vibewrite_daily_usage', '0');
        localStorage.setItem('vibewrite_last_usage_date', today);
        lastUsageDate = today;
    }
}

// ===========================
// Vibe Selection
// ===========================
function selectVibe(vibe) {
    currentVibe = vibe;
    
    // Update UI to show selected vibe
    const vibeButtons = document.querySelectorAll('.vibe-button');
    vibeButtons.forEach(btn => {
        btn.classList.remove('selected');
    });
    
    const selectedBtn = document.querySelector(`[data-vibe="${vibe}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }
    
    // Enable rewrite button if text is entered
    const inputText = document.getElementById('input-text').value.trim();
    const rewriteBtn = document.getElementById('rewrite-btn');
    const rewriteBtnText = document.getElementById('rewrite-btn-text');
    
    if (inputText) {
        rewriteBtn.disabled = false;
        rewriteBtnText.textContent = `Rewrite in ${getVibeName(vibe)} Vibe`;
    } else {
        rewriteBtn.disabled = false;
        rewriteBtnText.textContent = `Enter text to continue`;
    }
}

function getVibeName(vibe) {
    const names = {
        'funny': 'Funny 😂',
        'hype': 'Hype 🔥',
        'savage': 'Savage 💀',
        'cute': 'Cute 💖',
        'professional': 'Professional 💼'
    };
    return names[vibe] || vibe;
}

function getVibeColor(vibe) {
    const colors = {
        'funny': '#FFC700',
        'hype': '#FF6B6B',
        'savage': '#A855F7',
        'cute': '#FF69B4',
        'professional': '#8B5CF6'
    };
    return colors[vibe] || '#FF3B8F';
}

// ===========================
// Text Input
// ===========================
function updateCharCount() {
    const textarea = document.getElementById('input-text');
    const charCount = document.getElementById('char-count');
    const currentLength = textarea.value.length;
    charCount.textContent = `${currentLength} / 500`;
    
    // Enable/disable rewrite button based on text and vibe
    if (currentLength > 0 && currentVibe) {
        const rewriteBtn = document.getElementById('rewrite-btn');
        const rewriteBtnText = document.getElementById('rewrite-btn-text');
        rewriteBtn.disabled = false;
        rewriteBtnText.textContent = `Rewrite in ${getVibeName(currentVibe)} Vibe`;
    }
}

// ===========================
// Generate Rewrite
// ===========================
async function generateRewrite() {
    const inputText = document.getElementById('input-text').value.trim();
    
    if (!inputText) {
        alert('Please enter some text to rewrite!');
        return;
    }
    
    if (!currentVibe) {
        alert('Please select a vibe!');
        return;
    }
    
    // Check if user has reached daily limit (free users only)
    if (!isPro && dailyUsage >= MAX_FREE_REWRITES) {
        showLimitModal();
        return;
    }
    
    // Show loading state
    document.getElementById('results-section').style.display = 'none';
    document.getElementById('loading-state').style.display = 'block';
    
    try {
        // Call backend API
        const response = await fetch(`${API_URL}/rewrite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: inputText,
                vibe: currentVibe
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Update usage count for free users
            if (!isPro) {
                dailyUsage++;
                localStorage.setItem('vibewrite_daily_usage', dailyUsage.toString());
                updateUserInfo();
            }
            
            // Display result
            displayResult(data.rewrite);
        } else {
            throw new Error(data.error || 'Failed to generate rewrite');
        }
    } catch (error) {
        console.error('Error generating rewrite:', error);
        alert('Oops! Something went wrong. Please try again.');
        document.getElementById('loading-state').style.display = 'none';
    }
}

function displayResult(rewrittenText) {
    // Hide loading
    document.getElementById('loading-state').style.display = 'none';
    
    // Show results section
    const resultsSection = document.getElementById('results-section');
    resultsSection.style.display = 'block';
    
    // Update result card
    const resultVibeTag = document.getElementById('result-vibe-tag');
    const resultText = document.getElementById('result-text');
    
    resultVibeTag.textContent = getVibeName(currentVibe);
    resultVibeTag.style.background = `${getVibeColor(currentVibe)}33`;
    resultVibeTag.style.color = getVibeColor(currentVibe);
    
    resultText.textContent = rewrittenText;
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===========================
// Result Actions
// ===========================
function copyResult() {
    const resultText = document.getElementById('result-text').textContent;
    
    navigator.clipboard.writeText(resultText).then(() => {
        const copyBtn = document.querySelector('.copy-button span');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy text. Please try manually.');
    });
}

function resetApp() {
    // Clear input
    document.getElementById('input-text').value = '';
    updateCharCount();
    
    // Clear vibe selection
    currentVibe = null;
    const vibeButtons = document.querySelectorAll('.vibe-button');
    vibeButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Reset buttons
    const rewriteBtn = document.getElementById('rewrite-btn');
    const rewriteBtnText = document.getElementById('rewrite-btn-text');
    rewriteBtn.disabled = true;
    rewriteBtnText.textContent = 'Select a vibe to start';
    
    // Hide results
    document.getElementById('results-section').style.display = 'none';
    document.getElementById('loading-state').style.display = 'none';
}

// ===========================
// Modals
// ===========================
function showUpgradeModal() {
    document.getElementById('upgrade-modal').style.display = 'flex';
}

function closeUpgradeModal() {
    document.getElementById('upgrade-modal').style.display = 'none';
}

function showLimitModal() {
    document.getElementById('limit-modal').style.display = 'flex';
}

function closeLimitModal() {
    document.getElementById('limit-modal').style.display = 'none';
}

function showSuccessModal() {
    document.getElementById('success-modal').style.display = 'flex';
}

function closeSuccessModal() {
    document.getElementById('success-modal').style.display = 'none';
}

// ===========================
// Stripe Subscription
// ===========================
async function handleSubscribe() {
    try {
        // Call backend to create Stripe checkout session
        const response = await fetch(`${API_URL}/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userName: userName
            })
        });
        
        const data = await response.json();
        
        if (data.url) {
            // Redirect to Stripe checkout
            window.location.href = data.url;
        } else {
            throw new Error('Failed to create checkout session');
        }
    } catch (error) {
        console.error('Subscription error:', error);
        alert('Failed to start subscription. Please try again.');
    }
}

// Handle return from Stripe (called via URL parameter)
function handleStripeReturn() {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    
    if (success === 'true') {
        // Activate pro subscription
        isPro = true;
        localStorage.setItem('vibewrite_pro', 'true');
        updateUserInfo();
        showSuccessModal();
        
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Check for Stripe return on page load
if (window.location.search.includes('success')) {
    handleStripeReturn();
}

// ===========================
// Animations
// ===========================
function animateRotatingText() {
    const rotatingTextEl = document.querySelector('.rotating-text');
    if (!rotatingTextEl) return;
    
    const vibes = JSON.parse(rotatingTextEl.dataset.vibes || '[]');
    if (vibes.length === 0) return;
    
    let currentIndex = 0;
    
    setInterval(() => {
        currentIndex = (currentIndex + 1) % vibes.length;
        rotatingTextEl.style.opacity = '0';
        
        setTimeout(() => {
            rotatingTextEl.textContent = vibes[currentIndex];
            rotatingTextEl.style.opacity = '1';
        }, 300);
    }, 3000);
}

// ===========================
// Close modals on click outside
// ===========================
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Allow Enter key in name input
document.addEventListener('keypress', function(event) {
    const nameInput = document.getElementById('user-name-input');
    if (event.target === nameInput && event.key === 'Enter') {
        saveName();
    }
});
