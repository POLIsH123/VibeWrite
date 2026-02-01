// ===========================
// Global State
// ===========================
let currentVibe = null;
let userName = localStorage.getItem('vibewrite_username');
let isPro = localStorage.getItem('vibewrite_pro') === 'true';
let dailyUsage = parseInt(localStorage.getItem('vibewrite_daily_usage') || '0');
let lastUsageDate = localStorage.getItem('vibewrite_last_usage_date');
let history = JSON.parse(localStorage.getItem('vibewrite_history') || '[]');
let stats = JSON.parse(localStorage.getItem('vibewrite_stats') || '{"total":0,"vibes":{}}');

const MAX_FREE_REWRITES = 5;
const API_URL = (typeof window !== 'undefined' ? window.location.origin : '') + '/api';

const vibeEmojis = {
    funny: '😂', hype: '🔥', savage: '💀', cute: '💖', professional: '💼',
    poetic: '📜', sarcastic: '🙄', dramatic: '🎭', romantic: '💕', motivational: '💪',
    mysterious: '🕵️', zen: '🧘', nostalgic: '🕰️', rebellious: '🤘', whimsical: '✨',
    scientific: '🔬', diplomatic: '🤝', conspiracy: '👁️', chaotic: '🌀', aristocratic: '👑',
    streetwise: '🏙️', vintage: '📻', cyberpunk: '🤖', horror: '👻', superhero: '🦸',
    pirate: '🏴‍☠️', cowboy: '🤠', alien: '👽', robot: '🤖', childlike: '🧒',
    elderly: '🧓', villain: '🦹'
};

// ===========================
// Initialization
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    checkAndResetDailyUsage();
    updateUI();
    updateStats();
    renderRecentHistory();
    
    const textarea = document.getElementById('input-text');
    if (textarea) {
        textarea.addEventListener('input', handleInput);
    }
});

// ===========================
// Landing Page
// ===========================
function openApp() {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    
    if (!userName) {
        showNameModal();
    }
}

function backToLanding() {
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('landing-page').style.display = 'block';
}

function backToLanding() {
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('landing-page').style.display = 'block';
}

// ===========================
// Page Navigation
// ===========================
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    
    // Show selected page
    const page = document.getElementById(`page-${pageId}`);
    if (page) page.style.display = 'flex';
    
    // Update nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navItem = document.querySelector(`[data-page="${pageId}"]`);
    if (navItem) navItem.classList.add('active');
    
    // Update title
    const titles = { home: 'Home', rewrite: 'Rewrite', history: 'History' };
    document.getElementById('page-title').textContent = titles[pageId] || pageId;
    
    // Render history if on history page
    if (pageId === 'history') {
        renderHistory();
    }
    
    // Close mobile sidebar
    document.querySelector('.sidebar').classList.remove('open');
}

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('open');
}

// ===========================
// UI Updates
// ===========================
function updateUI() {
    const userNameEl = document.getElementById('sidebar-user-name');
    const userAvatar = document.getElementById('user-avatar');
    const userPlan = document.getElementById('user-plan');
    const usageBadge = document.getElementById('usage-badge');
    const upgradeBtn = document.getElementById('upgrade-btn');
    const welcomeName = document.getElementById('welcome-name');
    
    if (userName) {
        userNameEl.textContent = userName;
        userAvatar.textContent = userName.charAt(0).toUpperCase();
        if (welcomeName) welcomeName.textContent = userName;
    }
    
    if (isPro) {
        userPlan.textContent = 'Pro Plan';
        usageBadge.textContent = 'Unlimited';
        usageBadge.style.color = '#22c55e';
        if (upgradeBtn) upgradeBtn.style.display = 'none';
    } else {
        userPlan.textContent = 'Free Plan';
        const remaining = MAX_FREE_REWRITES - dailyUsage;
        usageBadge.textContent = `${remaining} left today`;
        usageBadge.style.color = remaining === 0 ? '#ef4444' : '';
    }
}

function updateStats() {
    const totalEl = document.getElementById('stat-rewrites');
    const favoriteEl = document.getElementById('stat-favorite');
    const todayEl = document.getElementById('stat-today');
    
    if (totalEl) totalEl.textContent = stats.total;
    if (todayEl) todayEl.textContent = dailyUsage;
    
    // Find favorite vibe
    if (favoriteEl) {
        let maxVibe = null;
        let maxCount = 0;
        for (const [vibe, count] of Object.entries(stats.vibes)) {
            if (count > maxCount) {
                maxCount = count;
                maxVibe = vibe;
            }
        }
        favoriteEl.textContent = maxVibe ? vibeEmojis[maxVibe] || maxVibe : '-';
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
// Input Handling
// ===========================
function handleInput() {
    const textarea = document.getElementById('input-text');
    const charCount = document.getElementById('char-count');
    const sendBtn = document.getElementById('rewrite-btn');
    
    const len = textarea.value.length;
    charCount.textContent = `${len}/500`;
    sendBtn.disabled = !(len > 0 && currentVibe);
}

// ===========================
// Vibe Selection
// ===========================
function selectVibe(vibe) {
    currentVibe = vibe;
    
    document.querySelectorAll('.vibe-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    document.querySelectorAll(`[data-vibe="${vibe}"]`).forEach(card => {
        card.classList.add('selected');
    });
    
    const textarea = document.getElementById('input-text');
    const sendBtn = document.getElementById('rewrite-btn');
    if (textarea && sendBtn) {
        sendBtn.disabled = !(textarea.value.trim().length > 0);
    }
}

function quickRewrite(vibe) {
    showPage('rewrite');
    selectVibe(vibe);
}

function toggleAllVibes() {
    const extended = document.getElementById('extended-vibes');
    const btn = document.querySelector('.see-all-btn');
    const text = document.getElementById('see-all-text');
    
    if (extended.style.display === 'none') {
        extended.style.display = 'grid';
        text.textContent = 'Show less';
        btn.classList.add('expanded');
    } else {
        extended.style.display = 'none';
        text.textContent = 'See all vibes';
        btn.classList.remove('expanded');
    }
}

// ===========================
// Generate Rewrite
// ===========================
async function generateRewrite() {
    const inputText = document.getElementById('input-text').value.trim();
    
    if (!inputText || !currentVibe) return;
    
    if (!isPro && dailyUsage >= MAX_FREE_REWRITES) {
        showLimitModal();
        return;
    }
    
    document.getElementById('results-section').style.display = 'none';
    document.getElementById('loading').style.display = 'flex';
    
    try {
        const response = await fetch(`${API_URL}/rewrite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: inputText, vibe: currentVibe })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Update usage
            if (!isPro) {
                dailyUsage++;
                localStorage.setItem('vibewrite_daily_usage', dailyUsage.toString());
            }
            
            // Update stats
            stats.total++;
            stats.vibes[currentVibe] = (stats.vibes[currentVibe] || 0) + 1;
            localStorage.setItem('vibewrite_stats', JSON.stringify(stats));
            
            // Save to history
            saveToHistory(inputText, data.rewrite, currentVibe);
            
            updateUI();
            updateStats();
            displayResult(data.rewrite);
        } else {
            throw new Error(data.error || 'Failed to rewrite');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function displayResult(text) {
    const resultsSection = document.getElementById('results-section');
    const resultVibe = document.getElementById('result-vibe');
    const resultText = document.getElementById('result-text');
    
    resultVibe.textContent = `${vibeEmojis[currentVibe] || ''} ${currentVibe.charAt(0).toUpperCase() + currentVibe.slice(1)}`;
    resultText.textContent = text;
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function copyResult() {
    const text = document.getElementById('result-text').textContent;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.result-actions .icon-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>';
        setTimeout(() => { btn.innerHTML = originalHTML; }, 2000);
    });
}

function saveToFavorites() {
    // Just visual feedback for now
    const btn = document.querySelectorAll('.result-actions .icon-btn')[1];
    btn.style.color = '#6366f1';
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
}

function resetRewrite() {
    document.getElementById('input-text').value = '';
    document.getElementById('char-count').textContent = '0/500';
    document.getElementById('results-section').style.display = 'none';
    document.getElementById('rewrite-btn').disabled = true;
    
    currentVibe = null;
    document.querySelectorAll('.vibe-card').forEach(card => {
        card.classList.remove('selected');
    });
}

// ===========================
// History
// ===========================
function saveToHistory(original, rewritten, vibe) {
    const item = {
        id: Date.now(),
        original,
        rewritten,
        vibe,
        timestamp: new Date().toISOString()
    };
    
    history.unshift(item);
    if (history.length > 50) history.pop(); // Limit to 50 items
    
    localStorage.setItem('vibewrite_history', JSON.stringify(history));
    renderRecentHistory();
}

function renderRecentHistory() {
    const section = document.getElementById('recent-section');
    const list = document.getElementById('recent-list');
    
    if (!section || !list) return;
    
    if (history.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    const recent = history.slice(0, 3);
    
    list.innerHTML = recent.map(item => `
        <div class="recent-item">
            <span class="recent-vibe">${vibeEmojis[item.vibe] || '✨'}</span>
            <span class="recent-text">${escapeHtml(item.rewritten)}</span>
            <span class="recent-time">${timeAgo(item.timestamp)}</span>
        </div>
    `).join('');
}

function renderHistory() {
    const list = document.getElementById('history-list');
    const empty = document.getElementById('empty-history');
    
    if (history.length === 0) {
        list.innerHTML = '';
        list.appendChild(empty);
        empty.style.display = 'block';
        return;
    }
    
    empty.style.display = 'none';
    
    list.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-header">
                <span class="history-vibe">${vibeEmojis[item.vibe] || '✨'}</span>
                <div class="history-meta">
                    <div class="history-vibe-name">${item.vibe.charAt(0).toUpperCase() + item.vibe.slice(1)}</div>
                    <div class="history-time">${timeAgo(item.timestamp)}</div>
                </div>
                <button class="history-delete" onclick="deleteHistoryItem(${item.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
            </div>
            <div class="history-original">${escapeHtml(item.original)}</div>
            <div class="history-result">${escapeHtml(item.rewritten)}</div>
        </div>
    `).join('');
}

function deleteHistoryItem(id) {
    history = history.filter(item => item.id !== id);
    localStorage.setItem('vibewrite_history', JSON.stringify(history));
    renderHistory();
    renderRecentHistory();
}

function clearHistory() {
    if (confirm('Clear all history?')) {
        history = [];
        localStorage.setItem('vibewrite_history', '[]');
        renderHistory();
        renderRecentHistory();
    }
}

// ===========================
// Modals
// ===========================
function showNameModal() {
    document.getElementById('name-modal').style.display = 'flex';
}

function saveName() {
    const input = document.getElementById('user-name-input');
    const name = input.value.trim();
    
    if (name) {
        userName = name;
        localStorage.setItem('vibewrite_username', name);
        document.getElementById('name-modal').style.display = 'none';
        updateUI();
    }
}

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

function closeSuccessModal() {
    document.getElementById('success-modal').style.display = 'none';
}

function openCommunityModal() {
    document.getElementById('community-modal').style.display = 'flex';
}

function closeCommunityModal() {
    document.getElementById('community-modal').style.display = 'none';
    document.getElementById('community-form').reset();
    document.getElementById('community-form').style.display = 'block';
    document.getElementById('community-success').style.display = 'none';
}

function closeLogoutModal() {
    document.getElementById('logout-modal').style.display = 'none';
}

// ===========================
// Logout
// ===========================
function logout() {
    document.getElementById('logout-modal').style.display = 'flex';
}

function confirmLogout() {
    // Clear user data
    localStorage.removeItem('vibewrite_username');
    localStorage.removeItem('vibewrite_pro');
    localStorage.removeItem('vibewrite_daily_usage');
    localStorage.removeItem('vibewrite_last_usage_date');
    localStorage.removeItem('vibewrite_history');
    localStorage.removeItem('vibewrite_stats');
    
    // Reload
    window.location.reload();
}

// ===========================
// Stripe
// ===========================
async function handleSubscribe() {
    try {
        const response = await fetch(`${API_URL}/create-checkout-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName })
        });
        
        const data = await response.json();
        
        if (data.url) {
            window.location.href = data.url;
        } else {
            throw new Error('Failed to create checkout session');
        }
    } catch (error) {
        console.error('Subscription error:', error);
        alert('Failed to start subscription. Please try again.');
    }
}

function handleStripeReturn() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
        isPro = true;
        localStorage.setItem('vibewrite_pro', 'true');
        updateUI();
        document.getElementById('success-modal').style.display = 'flex';
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

if (window.location.search.includes('success')) {
    handleStripeReturn();
}

// ===========================
// Community Scripts
// ===========================
async function submitCommunityScript(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('script-name').value,
        instructions: document.getElementById('script-instructions').value,
        author: userName || 'Anonymous'
    };
    
    try {
        const response = await fetch(`${API_URL}/community/scripts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('community-form').style.display = 'none';
            document.getElementById('community-success').style.display = 'block';
        } else {
            throw new Error(data.error || 'Failed to submit');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit. Please try again.');
    }
}

// ===========================
// Utilities
// ===========================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function timeAgo(timestamp) {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    return new Date(timestamp).toLocaleDateString();
}

// ===========================
// Event Listeners
// ===========================
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

document.addEventListener('keypress', function(event) {
    const nameInput = document.getElementById('user-name-input');
    if (event.target === nameInput && event.key === 'Enter') {
        saveName();
    }
});

// Dev helpers
window.resetUsage = () => {
    dailyUsage = 0;
    localStorage.setItem('vibewrite_daily_usage', '0');
    updateUI();
    console.log('Usage reset');
};

window.setPro = (val) => {
    isPro = val;
    localStorage.setItem('vibewrite_pro', val.toString());
    updateUI();
    console.log('Pro:', val);
};
