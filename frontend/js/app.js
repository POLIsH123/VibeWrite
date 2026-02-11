// ===========================
// Global State
// ===========================

let currentVibe = null;
let userName = localStorage.getItem('vibewrite_username');
let isPro = (localStorage.getItem('vibewrite_pro') === '1') || (localStorage.getItem('vibewrite_pro') === 'true') || (typeof document !== 'undefined' && document.cookie && document.cookie.includes('vibewrite_pro=1'));
let dailyUsage = 0;
let lastUsageDate = localStorage.getItem('vibewrite_last_usage_date');
let history = JSON.parse(localStorage.getItem('vibewrite_history') || '[]');
let stats = JSON.parse(localStorage.getItem('vibewrite_stats') || '{"total":0,"vibes":{}}');

const MAX_FREE_REWRITES = 7; // Free users get 7 rewrites per day
// Backend API URL — use relative path for production/vercel compatibility
const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3000/api' : '/api';

console.log('🚀 VibeWrite.js Loading...');
console.log('📍 API_URL:', API_URL);

// Note: Global functions are assigned to window inside DOMContentLoaded at the bottom of the file
// to ensure they are fully defined before exposure.

const vibeEmojis = {
    funny: '😂', hype: '🔥', savage: '💀', cute: '💖', professional: '💼',
    poetic: '📜', sarcastic: '🙄', dramatic: '🎭', romantic: '💕', motivational: '💪',
    mysterious: '🕵️', zen: '🧘', nostalgic: '🕰️', rebellious: '🤘', whimsical: '✨',
    scientific: '🔬', diplomatic: '🤝', conspiracy: '👁️', chaotic: '🌀', aristocratic: '👑',
    streetwise: '🏙️', vintage: '📻', cyberpunk: '🤖', horror: '👻', superhero: '🦸',
    pirate: '🏴‍☠️',
    cowboy: '🤠',
    alien: '👽',
    robot: '🤖',
    childlike: '🧒',
    elderly: '🧓',
    celebrity: '🌟',
    villain: '🦹',
    superheroVillain: '💀',
    businessPro: '👔',
    genZTalk: '🧢'
};

// All vibes are now free - no locked vibes
const LOCKED_VIBES = [];

function markLockedVibes() {
    // No locked vibes anymore - all vibes are free
    return;
}

// Support modal removed - no payment system

// Support button removed - no payment system

// After returning from Stripe Checkout, confirm session and set Pro locally
async function checkPostCheckout() {
    try {
        const params = new URLSearchParams(window.location.search);
        const success = params.get('success');
        const sessionId = params.get('session_id') || params.get('sessionId');
        if (success === 'true' && sessionId) {
            const res = await fetch(`${API_URL}/confirm-checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
            });
            const data = await res.json();
            if (data.success && data.active) {
                window.setPro(true);
                // Remove query params
                if (window.history && window.history.replaceState) {
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
                // Small thank you hint
                setTimeout(() => alert('Subscription active — thanks for upgrading!'), 250);
            }
        }
    } catch (e) {
        console.error('confirm checkout failed', e);
    }
}

// ===========================
// Initialization
// ===========================
// OP Initialization - Ultra Modern
// ===========================
function initVibeWrite() {
    console.log('🎬 Initializing VibeWrite App...');
    try {
        checkAndResetDailyUsage();
        updateUI();
        updateStats();
        renderRecentHistory();

        const textarea = document.getElementById('input-text');
        if (textarea) {
            textarea.addEventListener('input', handleInput);
        }

        // OP Enhancements
        initializeOPEffects();
        setupIntersectionObserver();
        setupParallaxEffects();
        setupAdvancedAnimations();

        // Mark locked vibes in UI
        markLockedVibes();

        // Support button removed - no payment system

        // Support button removed - no payment system

        // Check for post-checkout
        if (typeof checkPostCheckout === 'function') checkPostCheckout();

        // Initialize settings
        if (document.getElementById('settings-name-input')) {
            document.getElementById('settings-name-input').value = userName || '';
        }

        // Attach explicit event listeners to "Open App" buttons for reliability
        const navOpenBtn = document.getElementById('nav-open-app');
        const heroOpenBtn = document.getElementById('hero-open-app');

        console.log('🔍 Button check:', { navOpenBtn: !!navOpenBtn, heroOpenBtn: !!heroOpenBtn });

        if (navOpenBtn) {
            navOpenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('👆 Nav Open App clicked');
                openApp();
            });
        }

        if (heroOpenBtn) {
            heroOpenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('👆 Hero Open App clicked');
                openApp();
            });
        }

        const backToLandingBtn = document.getElementById('back-to-landing');
        if (backToLandingBtn) {
            backToLandingBtn.addEventListener('click', (e) => {
                e.preventDefault();
                backToLanding();
            });
        }

        console.log('✅ VibeWrite Init Complete.');
    } catch (err) {
        console.error('❌ VibeWrite Init Failed:', err);
    }
}

// Run init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVibeWrite);
} else {
    initVibeWrite();
}

// Konami Code Easter Egg - INSANE KONAMI CODE - MAXIMUM CHAOS EDITION 🔥🔥🔥
(function () {
    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let pos = 0;

    // Helper: play melody
    function playMelody() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            const notes = [659.25, 659.25, 0, 659.25, 0, 523.25, 659.25, 0, 784.0];
            let t = 0;
            notes.forEach((freq, i) => {
                if (freq === 0) { t += 0.12; return; }
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.type = 'sine';
                o.frequency.value = freq;
                g.gain.value = 0.001;
                o.connect(g); g.connect(ctx.destination);
                o.start(now + t);
                g.gain.linearRampToValueAtTime(0.12, now + t + 0.01);
                g.gain.linearRampToValueAtTime(0.0001, now + t + 0.11);
                o.stop(now + t + 0.12);
                t += 0.12;
            });
        } catch (e) { /* ignore */ }
    }

    // RICK ROLL AUDIO 🎵
    function rickRoll() {
        const audio = new Audio('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
        // Backup: actual audio file
        const rickAudio = document.createElement('audio');
        rickAudio.src = 'https://cdn.jsdelivr.net/gh/fent/node-ytdl-core@master/example/media.mp3';
        rickAudio.volume = 0.4;
        rickAudio.play().catch(() => {
            // If fails, show Rick Roll video in corner
            const rickVideo = document.createElement('iframe');
            rickVideo.style.cssText = 'position:fixed;bottom:20px;right:20px;width:300px;height:170px;border:3px solid #ff0;z-index:999999;box-shadow:0 0 30px rgba(255,0,0,0.8)';
            rickVideo.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0';
            rickVideo.allow = 'autoplay';
            document.body.appendChild(rickVideo);
            setTimeout(() => rickVideo.remove(), 15000);
        });
    }

    // FAKE BROKEN SCREEN 💥
    function brokenScreen() {
        const overlay = document.createElement('div');
        overlay.id = 'broken-screen';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:999998;pointer-events:none;';

        // Create SVG cracks
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.cssText = 'width:100%;height:100%;position:absolute;';

        // Random crack lines
        for (let i = 0; i < 15; i++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            const x1 = Math.random() * window.innerWidth;
            const y1 = Math.random() * window.innerHeight;
            const angle = Math.random() * Math.PI * 2;
            const length = 100 + Math.random() * 300;
            const x2 = x1 + Math.cos(angle) * length;
            const y2 = y1 + Math.sin(angle) * length;

            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', 'rgba(255,255,255,0.6)');
            line.setAttribute('stroke-width', 2 + Math.random() * 3);
            line.style.filter = 'drop-shadow(0 0 4px rgba(0,0,0,0.8))';
            svg.appendChild(line);

            // Branch cracks
            for (let j = 0; j < 3; j++) {
                const branch = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                const t = Math.random();
                const bx1 = x1 + (x2 - x1) * t;
                const by1 = y1 + (y2 - y1) * t;
                const bAngle = angle + (Math.random() - 0.5) * Math.PI / 2;
                const bLength = 30 + Math.random() * 80;
                const bx2 = bx1 + Math.cos(bAngle) * bLength;
                const by2 = by1 + Math.sin(bAngle) * bLength;

                branch.setAttribute('x1', bx1);
                branch.setAttribute('y1', by1);
                branch.setAttribute('x2', bx2);
                branch.setAttribute('y2', by2);
                branch.setAttribute('stroke', 'rgba(255,255,255,0.4)');
                branch.setAttribute('stroke-width', 1 + Math.random() * 2);
                svg.appendChild(branch);
            }
        }

        overlay.appendChild(svg);
        document.body.appendChild(overlay);

        // Glitch effect on body
        document.body.style.animation = 'glitch-shake 0.3s infinite';

        setTimeout(() => {
            overlay.remove();
            document.body.style.animation = '';
        }, 5000);
    }

    // MATRIX RAIN 💚
    function matrixRain() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:fixed;inset:0;z-index:999997;pointer-events:none;';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ01234567890';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        let frame = 0;
        const interval = setInterval(() => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            frame++;
            if (frame > 300) {
                clearInterval(interval);
                canvas.remove();
            }
        }, 33);
    }

    // ROTATING 3D CUBE 🎲
    function rotating3DCube() {
        const container = document.createElement('div');
        container.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);perspective:1000px;z-index:999996;pointer-events:none;';

        const cube = document.createElement('div');
        cube.style.cssText = 'width:200px;height:200px;position:relative;transform-style:preserve-3d;animation:cube-spin 3s infinite linear;';

        const faces = [
            { transform: 'rotateY(0deg) translateZ(100px)', bg: 'rgba(255,0,0,0.7)' },
            { transform: 'rotateY(90deg) translateZ(100px)', bg: 'rgba(0,255,0,0.7)' },
            { transform: 'rotateY(180deg) translateZ(100px)', bg: 'rgba(0,0,255,0.7)' },
            { transform: 'rotateY(-90deg) translateZ(100px)', bg: 'rgba(255,255,0,0.7)' },
            { transform: 'rotateX(90deg) translateZ(100px)', bg: 'rgba(255,0,255,0.7)' },
            { transform: 'rotateX(-90deg) translateZ(100px)', bg: 'rgba(0,255,255,0.7)' }
        ];

        faces.forEach(face => {
            const div = document.createElement('div');
            div.style.cssText = `position:absolute;width:200px;height:200px;background:${face.bg};border:2px solid #fff;transform:${face.transform};display:flex;align-items:center;justify-content:center;font-size:40px;`;
            div.textContent = '🎮';
            cube.appendChild(div);
        });

        container.appendChild(cube);
        document.body.appendChild(container);

        setTimeout(() => container.remove(), 6000);
    }

    // DVDLOGO SCREENSAVER 📀
    function dvdLogo() {
        const logo = document.createElement('div');
        logo.textContent = 'DVD';
        logo.style.cssText = 'position:fixed;width:100px;height:60px;background:linear-gradient(45deg,#f00,#0f0,#00f);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:24px;border-radius:8px;z-index:999995;pointer-events:none;';
        document.body.appendChild(logo);

        let x = Math.random() * (window.innerWidth - 100);
        let y = Math.random() * (window.innerHeight - 60);
        let dx = 2 + Math.random() * 2;
        let dy = 2 + Math.random() * 2;

        const interval = setInterval(() => {
            x += dx;
            y += dy;

            if (x <= 0 || x >= window.innerWidth - 100) {
                dx = -dx;
                logo.style.background = `linear-gradient(45deg,hsl(${Math.random() * 360}deg,80%,50%),hsl(${Math.random() * 360}deg,80%,50%))`;
            }
            if (y <= 0 || y >= window.innerHeight - 60) {
                dy = -dy;
                logo.style.background = `linear-gradient(45deg,hsl(${Math.random() * 360}deg,80%,50%),hsl(${Math.random() * 360}deg,80%,50%))`;
            }

            logo.style.left = x + 'px';
            logo.style.top = y + 'px';
        }, 16);

        setTimeout(() => {
            clearInterval(interval);
            logo.remove();
        }, 10000);
    }

    // SNAKE GAME 🐍
    function snakeGame() {
        const gameDiv = document.createElement('div');
        gameDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.95);padding:20px;border-radius:12px;z-index:999999;border:3px solid #0f0;';
        gameDiv.innerHTML = `
            <div style="color:#0f0;text-align:center;margin-bottom:10px;font-weight:800;font-size:20px;">🐍 SNAKE GAME 🐍</div>
            <canvas id="snake-canvas" width="300" height="300" style="border:2px solid #0f0;display:block;"></canvas>
            <div style="color:#0f0;text-align:center;margin-top:10px;font-size:14px;">Score: <span id="snake-score">0</span></div>
            <div style="color:#0f0;text-align:center;margin-top:5px;font-size:12px;">Use Arrow Keys | ESC to close</div>
        `;
        document.body.appendChild(gameDiv);

        const canvas = document.getElementById('snake-canvas');
        const ctx = canvas.getContext('2d');
        const scoreEl = document.getElementById('snake-score');

        const gridSize = 15;
        const tileCount = 20;
        let snake = [{ x: 10, y: 10 }];
        let apple = { x: 5, y: 5 };
        let dx = 0, dy = 0;
        let score = 0;
        let gameActive = true;

        function drawGame() {
            if (!gameActive) return;

            // Move snake
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };

            // Check collision with walls
            if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
                gameActive = false;
                alert('Game Over! Score: ' + score);
                gameDiv.remove();
                return;
            }

            // Check collision with self
            if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                gameActive = false;
                alert('Game Over! Score: ' + score);
                gameDiv.remove();
                return;
            }

            snake.unshift(head);

            // Check apple collision
            if (head.x === apple.x && head.y === apple.y) {
                score++;
                scoreEl.textContent = score;
                apple = {
                    x: Math.floor(Math.random() * tileCount),
                    y: Math.floor(Math.random() * tileCount)
                };
            } else {
                snake.pop();
            }

            // Draw
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw snake
            ctx.fillStyle = '#0f0';
            snake.forEach(segment => {
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
            });

            // Draw apple
            ctx.fillStyle = '#f00';
            ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize - 2, gridSize - 2);
        }

        const gameInterval = setInterval(drawGame, 100);

        const keyHandler = (e) => {
            if (e.key === 'Escape') {
                gameActive = false;
                clearInterval(gameInterval);
                gameDiv.remove();
                document.removeEventListener('keydown', keyHandler);
            }
            if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
            if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
            if (e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
            if (e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
        };
        document.addEventListener('keydown', keyHandler);

        setTimeout(() => {
            if (gameActive) {
                gameActive = false;
                clearInterval(gameInterval);
                gameDiv.remove();
                document.removeEventListener('keydown', keyHandler);
            }
        }, 45000);
    }

    // GLITCH TEXT OVERLAY 📺
    function glitchText() {
        const messages = [
            '█▀█ █▀█ █ █ █▀▀ █▀█   █ █ █▀█',
            'SYSTEM OVERLOAD',
            'HACKER MODE: ACTIVATED',
            'YOU HAVE BEEN PRANKED',
            'DOWNLOADING VIRUS... JK LOL',
            '⚠️ WARNING: TOO MUCH SWAG ⚠️'
        ];

        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;z-index:999994;pointer-events:none;display:flex;align-items:center;justify-content:center;';

        const text = document.createElement('div');
        text.style.cssText = 'font-size:48px;font-weight:900;color:#f0f;text-shadow:2px 2px #0ff,-2px -2px #ff0;font-family:monospace;animation:glitch-anim 0.3s infinite;';
        text.textContent = messages[Math.floor(Math.random() * messages.length)];

        overlay.appendChild(text);
        document.body.appendChild(overlay);

        let changeCount = 0;
        const interval = setInterval(() => {
            text.textContent = messages[Math.floor(Math.random() * messages.length)];
            changeCount++;
            if (changeCount > 15) {
                clearInterval(interval);
                overlay.remove();
            }
        }, 200);
    }

    // FIREWORKS
    function createFireworksCanvas(parent) {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.inset = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        parent.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let W, H, particles = [];

        function resize() { W = canvas.width = parent.clientWidth; H = canvas.height = parent.clientHeight; }
        resize();
        window.addEventListener('resize', resize);

        function rand(min, max) { return Math.random() * (max - min) + min; }

        function spawn(x, y, count) {
            for (let i = 0; i < count; i++) {
                particles.push({
                    x, y,
                    vx: rand(-6, 6),
                    vy: rand(-10, -2),
                    life: rand(40, 80),
                    color: `hsl(${Math.floor(rand(0, 360))}deg ${rand(60, 90)}% ${rand(45, 65)}%)`,
                    size: rand(2, 5)
                });
            }
        }

        function tick() {
            ctx.clearRect(0, 0, W, H);
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life--;
                ctx.fillStyle = p.color;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
                if (p.life <= 0 || p.y > H + 50) particles.splice(i, 1);
            }
            requestAnimationFrame(tick);
        }

        tick();
        return { spawn, canvas };
    }

    // MAIN ACTIVATION
    function activateKonami() {
        if (document.getElementById('konami-overlay')) return;

        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glitch-shake {
                0%, 100% { transform: translate(0, 0); }
                10% { transform: translate(-2px, 1px); }
                20% { transform: translate(2px, -1px); }
                30% { transform: translate(-1px, 2px); }
                40% { transform: translate(1px, -2px); }
                50% { transform: translate(-2px, 1px); }
                60% { transform: translate(2px, -1px); }
                70% { transform: translate(-1px, 2px); }
                80% { transform: translate(1px, -2px); }
                90% { transform: translate(-2px, 1px); }
            }
            @keyframes cube-spin {
                0% { transform: rotateX(0deg) rotateY(0deg); }
                100% { transform: rotateX(360deg) rotateY(360deg); }
            }
            @keyframes glitch-anim {
                0% { transform: translate(0); }
                20% { transform: translate(-2px, 2px); }
                40% { transform: translate(-2px, -2px); }
                60% { transform: translate(2px, 2px); }
                80% { transform: translate(2px, -2px); }
                100% { transform: translate(0); }
            }
        `;
        document.head.appendChild(style);

        // Base overlay
        const overlay = document.createElement('div');
        overlay.id = 'konami-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;pointer-events:auto;';

        const bg = document.createElement('div');
        bg.style.cssText = 'position:absolute;inset:0;background:radial-gradient(ellipse at center, rgba(255,255,255,0.06), rgba(0,0,0,0.95));backdrop-filter: blur(4px);';
        overlay.appendChild(bg);

        // Content card
        const card = document.createElement('div');
        card.style.cssText = 'position:relative;z-index:100000;color:white;text-align:center;padding:28px 36px;border-radius:16px;max-width:880px;width:90%;box-shadow:0 40px 120px rgba(0,0,0,0.6);background:rgba(20,20,20,0.9)';
        card.innerHTML = `
            <div style="font-size:52px;font-weight:900;margin-bottom:8px;animation:glitch-anim 0.5s infinite;">🎮 KONAMI MEGA BLAST! 🎮</div>
            <div style="font-size:20px;opacity:0.95;margin-bottom:18px;">You just unlocked MAXIMUM CHAOS MODE!</div>
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:18px;">
                <button id="konami-rickroll" style="background:linear-gradient(90deg,#ff0844,#ffb199);border:none;padding:12px 18px;border-radius:999px;font-weight:800;cursor:pointer;font-size:14px;">🎵 RICK ROLL</button>
                <button id="konami-broken" style="background:linear-gradient(90deg,#fa709a,#fee140);border:none;padding:12px 18px;border-radius:999px;font-weight:800;cursor:pointer;font-size:14px;">💥 BREAK SCREEN</button>
                <button id="konami-matrix" style="background:linear-gradient(90deg,#0f0,#080);border:none;padding:12px 18px;border-radius:999px;font-weight:800;cursor:pointer;font-size:14px;">💚 MATRIX</button>
                <button id="konami-cube" style="background:linear-gradient(90deg,#667eea,#764ba2);border:none;padding:12px 18px;border-radius:999px;font-weight:800;cursor:pointer;font-size:14px;">🎲 3D CUBE</button>
                <button id="konami-dvd" style="background:linear-gradient(90deg,#f093fb,#f5576c);border:none;padding:12px 18px;border-radius:999px;font-weight:800;cursor:pointer;font-size:14px;">📀 DVD LOGO</button>
                <button id="konami-snake" style="background:linear-gradient(90deg,#4facfe,#00f2fe);border:none;padding:12px 18px;border-radius:999px;font-weight:800;cursor:pointer;font-size:14px;">🐍 SNAKE GAME</button>
                <button id="konami-glitch" style="background:linear-gradient(90deg,#fa71cd,#c471f5);border:none;padding:12px 18px;border-radius:999px;font-weight:800;cursor:pointer;font-size:14px;">📺 GLITCH TEXT</button>
                <button id="konami-all" style="background:linear-gradient(90deg,#ff5c7c,#ffd166);border:none;padding:14px 24px;border-radius:999px;font-weight:900;cursor:pointer;font-size:16px;">🔥 ACTIVATE ALL 🔥</button>
            </div>
            <button id="konami-close" style="background:#111;color:#fff;border:1px solid rgba(255,255,255,0.2);padding:10px 16px;border-radius:10px;cursor:pointer;margin-top:10px;">Close</button>
        `;
        overlay.appendChild(card);
        document.body.appendChild(overlay);

        // Confetti
        const colors = ['#ff5c7c', '#ffd166', '#06d6a0', '#4dabf7', '#b388eb', '#ff8a65', '#7cf7ff', '#fff07c'];
        for (let i = 0; i < 200; i++) {
            const el = document.createElement('div');
            const size = Math.random() * 10 + 6;
            el.style.position = 'absolute';
            el.style.left = Math.random() * 100 + '%';
            el.style.top = Math.random() * 20 + '%';
            el.style.width = `${size}px`;
            el.style.height = `${size * 1.4}px`;
            el.style.background = colors[Math.floor(Math.random() * colors.length)];
            el.style.opacity = Math.random() * 0.9 + 0.4;
            el.style.transform = `translateY(-40vh) rotate(${Math.random() * 360}deg)`;
            el.style.borderRadius = '3px';
            el.style.pointerEvents = 'none';
            el.style.zIndex = 99998;
            el.style.transition = `transform ${2 + Math.random() * 2}s cubic-bezier(.2,.8,.2,1), opacity 2s linear`;
            overlay.appendChild(el);
            setTimeout(() => {
                const dx = (Math.random() - 0.5) * 120;
                const dy = 120 + Math.random() * 80;
                el.style.transform = `translate(${dx}px, ${dy}vh) rotate(${Math.random() * 720}deg)`;
                el.style.opacity = 0;
            }, 50 + Math.random() * 600);
        }

        // Fireworks
        const fw = createFireworksCanvas(overlay);
        const fwInterval = setInterval(() => {
            const x = Math.random() * overlay.clientWidth;
            const y = Math.random() * overlay.clientHeight * 0.6 + 40;
            fw.spawn(x, y, 30 + Math.floor(Math.random() * 40));
        }, 350);

        // Body effects
        playMelody();
        if (navigator.vibrate) navigator.vibrate([120, 40, 120, 40, 120]);

        // Button handlers
        document.getElementById('konami-rickroll').onclick = rickRoll;
        document.getElementById('konami-broken').onclick = brokenScreen;
        document.getElementById('konami-matrix').onclick = matrixRain;
        document.getElementById('konami-cube').onclick = rotating3DCube;
        document.getElementById('konami-dvd').onclick = dvdLogo;
        document.getElementById('konami-snake').onclick = snakeGame;
        document.getElementById('konami-glitch').onclick = glitchText;

        document.getElementById('konami-all').onclick = () => {
            setTimeout(rickRoll, 100);
            setTimeout(brokenScreen, 300);
            setTimeout(matrixRain, 600);
            setTimeout(rotating3DCube, 900);
            setTimeout(dvdLogo, 1200);
            setTimeout(glitchText, 1500);
            playMelody(); playMelody(); playMelody();
            fw.spawn(overlay.clientWidth / 2, overlay.clientHeight / 2, 300);

            // MEGA EMOJI BURST
            const emojis = ['🚀', '✨', '🎉', '💥', '🌟', '🎮', '🔥', '💯', '⚡', '🎪', '🎨', '🎭'];
            for (let i = 0; i < 100; i++) {
                const e = document.createElement('div');
                e.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                e.style.position = 'absolute';
                e.style.left = `${50 + (Math.random() - 0.5) * 80}%`;
                e.style.top = `${50 + (Math.random() - 0.5) * 60}%`;
                e.style.fontSize = `${20 + Math.random() * 40}px`;
                e.style.zIndex = 99999;
                overlay.appendChild(e);
                setTimeout(() => {
                    e.style.transition = 'transform 3s ease, opacity 3s';
                    e.style.transform = `translate(${(Math.random() - 0.5) * 800}px, -${400 + Math.random() * 800}px) rotate(${Math.random() * 1080}deg)`;
                    e.style.opacity = 0;
                }, 20 + Math.random() * 300);
            }
        };

        function cleanup() {
            clearInterval(fwInterval);
            overlay.remove();
        }

        document.getElementById('konami-close').onclick = cleanup;
        overlay.addEventListener('click', (e) => { if (e.target === overlay) cleanup(); });

        setTimeout(cleanup, 20000);
    }

    // Konami code listener — use capture on window and add debug logs
    function konamiKeyHandler(e) {
        const raw = e.key;
        const key = raw.length === 1 ? raw.toLowerCase() : raw;
        const expected = konami[pos];
        console.debug('[Konami] key:', raw, 'normalized:', key, 'pos before:', pos, 'expected:', expected);

        if (expected.length === 1) {
            if (key === expected) pos++; else pos = (key === konami[0]) ? 1 : 0;
        } else {
            if (raw === expected) pos++; else pos = (raw === konami[0]) ? 1 : 0;
        }

        console.debug('[Konami] pos after:', pos);

        if (pos === konami.length) {
            try { activateKonami(); } catch (err) { console.error('Konami error', err); }
            pos = 0;
        }
    }

    window.addEventListener('keydown', konamiKeyHandler, true);
    console.debug('[Konami] listener registered on window (capture)');
})();

function initializeOPEffects() {
    // Add floating effects to icons
    const floatingElements = document.querySelectorAll('.trending-icon, .vibe-icon, .recent-vibe, .history-vibe');
    floatingElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.5}s`;
        el.classList.add('float-effect');
    });

    // Add shimmer effects to buttons
    const shimmerElements = document.querySelectorAll('.quick-start-btn, .upgrade-btn, .primary-btn');
    shimmerElements.forEach(el => {
        el.classList.add('shimmer-effect');
    });

    // Add glow effects to important elements
    const glowElements = document.querySelectorAll('.send-btn, .usage-badge');
    glowElements.forEach(el => {
        el.classList.add('glow-effect');
    });
}

function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Add special effects for different elements
                if (entry.target.classList.contains('stat-card')) {
                    animateStatValue(entry.target);
                }

                if (entry.target.classList.contains('trending-card')) {
                    entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all animatable elements
    const observeElements = document.querySelectorAll('.stat-card, .trending-card, .vibe-card, .history-item, .section');
    observeElements.forEach(el => observer.observe(el));
}

function animateStatValue(statCard) {
    const valueEl = statCard.querySelector('.stat-value');
    if (!valueEl) return;

    const finalValue = parseInt(valueEl.textContent) || 0;
    let currentValue = 0;
    const increment = Math.ceil(finalValue / 30);

    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
            currentValue = finalValue;
            clearInterval(timer);
        }
        valueEl.textContent = currentValue;
    }, 50);
}

function setupParallaxEffects() {
    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.bg-layer, .hero-bg-element');

        parallaxElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

function setupAdvancedAnimations() {
    // Advanced hover effects for cards
    const cards = document.querySelectorAll('.stat-card, .trending-card, .vibe-card, .history-item');

    cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Add ripple effect
            createRipple(card, x, y);
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

function createRipple(element, x, y) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(99, 102, 241, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.left = `${x - 10}px`;
    ripple.style.top = `${y - 10}px`;
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '1000';

    element.style.position = 'relative';
    element.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation to CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

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

// ===========================
// OP Page Navigation - Ultra Modern
// ===========================
function showPage(pageId) {
    // Add exit animation to current page
    const currentPage = document.querySelector('.page[style*="flex"]');
    if (currentPage) {
        currentPage.style.animation = 'slideOutLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

        setTimeout(() => {
            // Hide all pages
            document.querySelectorAll('.page').forEach(p => p.style.display = 'none');

            // Show selected page with entrance animation
            const page = document.getElementById(`page-${pageId}`);
            if (page) {
                page.style.display = 'flex';
                page.style.animation = 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

                // Add stagger animations to page content
                setTimeout(() => {
                    const pageElements = page.querySelectorAll('.section, .stat-card, .trending-card, .vibe-card, .history-item');
                    pageElements.forEach((el, index) => {
                        el.style.animation = `slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s both`;
                    });
                }, 100);
            }
        }, 300);
    } else {
        // First load - no exit animation needed
        document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
        const page = document.getElementById(`page-${pageId}`);
        if (page) {
            page.style.display = 'flex';
            page.style.animation = 'slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    }

    // Update nav with OP effects
    document.querySelectorAll('.nav-item').forEach(n => {
        n.classList.remove('active');
        n.style.transform = '';
    });

    const navItem = document.querySelector(`[data-page="${pageId}"]`);
    if (navItem) {
        navItem.classList.add('active');
        navItem.style.animation = 'glow-pulse 1s ease-in-out';

        // Reset animation after it completes
        setTimeout(() => {
            navItem.style.animation = '';
        }, 1000);
    }

    // Update title with OP gradient effect
    const titles = {
        home: 'Dashboard',
        rewrite: 'AI Rewriter',
        community: 'Community',
        history: 'Your History'
    };
    const titleEl = document.getElementById('page-title');
    if (titleEl) {
        titleEl.style.animation = 'slideOutUp 0.2s ease-in';

        setTimeout(() => {
            titleEl.textContent = titles[pageId] || pageId;
            titleEl.style.animation = 'slideInDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 200);
    }

    // Load page-specific content
    if (pageId === 'history') {
        setTimeout(() => {
            renderHistory();
        }, 400);
    } else if (pageId === 'community') {
        setTimeout(() => {
            loadCommunityScripts();
        }, 400);
    } else if (pageId === 'settings') {
        const nameInput = document.getElementById('settings-name-input');
        if (nameInput) nameInput.value = userName || '';
    }

    // Close mobile sidebar with animation
    const sidebar = document.querySelector('.sidebar');
    if (sidebar.classList.contains('open')) {
        sidebar.style.animation = 'slideOutLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            sidebar.classList.remove('open');
            sidebar.style.animation = '';
        }, 300);
    }
}

// Add CSS animations for page transitions
const pageTransitionStyle = document.createElement('style');
pageTransitionStyle.textContent = `
    @keyframes slideOutLeft {
        to {
            opacity: 0;
            transform: translateX(-30px);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutUp {
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(pageTransitionStyle);

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const isOpen = sidebar.classList.contains('open');

    if (isOpen) {
        sidebar.style.animation = 'slideOutLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            sidebar.classList.remove('open');
            sidebar.style.animation = '';
        }, 300);
    } else {
        sidebar.classList.add('open');
        sidebar.style.animation = 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            sidebar.style.animation = '';
        }, 400);
    }
}

function logout() {
    localStorage.removeItem('vibewrite_username');
    localStorage.removeItem('vibewrite_pro');
    userName = null;
    isPro = false;
    backToLanding();
    setTimeout(() => {
        location.reload();
    }, 500);
}

function setPro(val) {
    console.log('💎 Setting Pro Status:', val);
    isPro = val;
    localStorage.setItem('vibewrite_pro', val ? '1' : '0');
    // Also set a cookie for backend verification
    document.cookie = `vibewrite_pro=${val ? '1' : '0'}; Path=/; Max-Age=31536000; SameSite=Lax`;
    updateUI();
    markLockedVibes(); // Unlock the premium ones
}

// ===========================
// OP UI Updates - Ultra Modern
// ===========================
function updateUI() {
    const userNameEl = document.getElementById('sidebar-name');
    const userAvatar = document.getElementById('sidebar-avatar');
    const userPlan = document.querySelector('.user-plan');
    const usageBadge = document.getElementById('usage-badge');
    const welcomeName = document.getElementById('welcome-name');

    if (userName) {
        if (userNameEl) userNameEl.textContent = userName;
        if (userAvatar) {
            userAvatar.textContent = userName.charAt(0).toUpperCase();
            userAvatar.style.animation = 'glow-pulse 3s ease-in-out infinite';
        }
        if (welcomeName) welcomeName.textContent = userName;
    }

    if (isPro) {
        if (userPlan) {
            userPlan.textContent = 'Pro Plan - Unlimited';
            userPlan.style.background = 'linear-gradient(135deg, #a855f7, #6366f1)';
            userPlan.style.webkitBackgroundClip = 'text';
            userPlan.style.backgroundClip = 'text';
            userPlan.style.webkitTextFillColor = 'transparent';
        }

        if (usageBadge) {
            usageBadge.textContent = 'Unlimited Access ∞';
            usageBadge.style.background = 'rgba(139, 92, 246, 0.1)';
            usageBadge.style.borderColor = 'rgba(139, 92, 246, 0.3)';
            usageBadge.style.color = '#a78bfa';
            usageBadge.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.2)';
        }
    } else {
        const remaining = MAX_FREE_REWRITES - dailyUsage;
        if (usageBadge) usageBadge.textContent = `${remaining} left today`;
    }
    // Add OP entrance animations
    setTimeout(() => {
        const elements = [userNameEl, userAvatar, userPlan, usageBadge];
        elements.forEach((el, index) => {
            if (el) {
                el.style.animation = `slideInLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s both`;
            }
        });
    }, 100);
}

function updateStats() {
    const totalEl = document.getElementById('stat-rewrites');
    const favoriteEl = document.getElementById('stat-favorite');
    const todayEl = document.getElementById('stat-today');

    if (totalEl) {
        // Animate the stat value
        animateStatValue(totalEl.closest('.stat-card'));
        totalEl.textContent = isNaN(stats.total) || stats.total === undefined ? '0' : stats.total;
    }

    if (todayEl) {
        animateStatValue(todayEl.closest('.stat-card'));
        todayEl.textContent = isNaN(dailyUsage) || dailyUsage === undefined ? '0' : dailyUsage;
    }

    // Find favorite vibe with OP animation
    if (favoriteEl) {
        let maxVibe = null;
        let maxCount = 0;
        for (const [vibe, count] of Object.entries(stats.vibes || {})) {
            if (count > maxCount) {
                maxCount = count;
                maxVibe = vibe;
            }
        }

        const favoriteIcon = maxVibe ? vibeEmojis[maxVibe] || maxVibe : (stats.total > 0 ? '?' : '✨');
        favoriteEl.textContent = favoriteIcon;

        if (maxVibe) {
            favoriteEl.style.animation = 'float 3s ease-in-out infinite';
            favoriteEl.style.fontSize = '32px';
            favoriteEl.style.filter = 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.6))';
        }
    }

    // Add OP glow effects to stat cards
    setTimeout(() => {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            card.style.animation = `slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s both`;

            // Add hover glow effect
            card.addEventListener('mouseenter', () => {
                card.style.boxShadow = '0 0 40px rgba(99, 102, 241, 0.3), 0 16px 64px rgba(0, 0, 0, 0.5)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
            });
        });
    }, 200);
}

function checkAndResetDailyUsage() {
    const today = new Date().toDateString();
    if (lastUsageDate !== today) {
        dailyUsage = 0;
        localStorage.setItem('vibewrite_daily_usage', '0');
        localStorage.setItem('vibewrite_last_usage_date', today);
        lastUsageDate = today;
    } else {
        // Same day - restore saved usage count
        const saved = parseInt(localStorage.getItem('vibewrite_daily_usage') || '0', 10);
        dailyUsage = isNaN(saved) ? 0 : saved;
    }
}


// ===========================
// Input Handling
// ===========================
function handleInput() {
    const textarea = document.getElementById('input-text');
    const charCount = document.getElementById('char-count');
    const sendBtn = document.getElementById('rewrite-btn');

    const len = textarea.value.trim().length;
    charCount.textContent = `${len}/500`;

    // Enable only if text exists AND a vibe is selected
    const isActive = len > 0 && currentVibe;
    sendBtn.disabled = !isActive;

    if (isActive) {
        sendBtn.style.animation = 'glow-pulse 2s ease-in-out infinite';
    } else {
        sendBtn.style.animation = 'none';
    }
}

// ===========================
// OP Vibe Selection - Ultra Modern
// ===========================
function selectVibe(vibe) {
    // If vibe is locked and user is not pro, show subscribe modal
    if (LOCKED_VIBES.includes(vibe) && !isPro) {
        showSubscribeModal(vibe);
        return;
    }

    currentVibe = vibe;

    // Remove previous selections with animation
    document.querySelectorAll('.vibe-card.selected').forEach(card => {
        card.style.animation = 'scaleOut 0.2s ease-in';
        setTimeout(() => {
            card.classList.remove('selected');
            card.style.animation = '';
        }, 200);
    });

    // Add selection with OP animation
    setTimeout(() => {
        document.querySelectorAll(`[data-vibe="${vibe}"]`).forEach(card => {
            card.classList.add('selected');
            card.style.animation = 'scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

            // Add ripple effect
            const rect = card.getBoundingClientRect();
            createRipple(card, rect.width / 2, rect.height / 2);

            // Add glow pulse
            card.style.boxShadow = '0 0 40px rgba(99, 102, 241, 0.6), 0 16px 64px rgba(0, 0, 0, 0.5)';

            setTimeout(() => {
                card.style.animation = '';
            }, 400);
        });
    }, 200);

    // Update send button state with animation
    const textarea = document.getElementById('input-text');
    const sendBtn = document.getElementById('rewrite-btn');
    if (textarea && sendBtn) {
        const canSend = textarea.value.trim().length > 0 && currentVibe;
        sendBtn.disabled = !canSend;

        if (canSend) {
            sendBtn.style.animation = 'glow-pulse 2s ease-in-out infinite';
            sendBtn.style.transform = 'scale(1.1)';

            setTimeout(() => {
                sendBtn.style.transform = '';
            }, 300);
        } else {
            sendBtn.style.animation = 'none';
        }
    }

    // Show selection feedback
    showVibeSelectionFeedback(vibe);
}

function showVibeSelectionFeedback(vibe) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        padding: 16px 24px;
        border-radius: 50px;
        font-weight: 700;
        font-size: 16px;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 0 40px rgba(99, 102, 241, 0.6);
        animation: feedbackPop 1.5s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    feedback.textContent = `${vibeEmojis[vibe] || '✨'} ${vibe.charAt(0).toUpperCase() + vibe.slice(1)} selected!`;
    document.body.appendChild(feedback);

    setTimeout(() => {
        feedback.remove();
    }, 1500);
}

// Add feedback animation CSS
const feedbackStyle = document.createElement('style');
feedbackStyle.textContent = `
    @keyframes feedbackPop {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
        }
        80% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
        }
    }
    
    @keyframes scaleOut {
        to {
            opacity: 0.5;
            transform: scale(0.9);
        }
    }
`;
document.head.appendChild(feedbackStyle);

function quickRewrite(vibe) {
    // Add page transition effect
    showPage('rewrite');

    // Wait for page transition then select vibe
    setTimeout(() => {
        selectVibe(vibe);

        // Focus on textarea with animation
        const textarea = document.getElementById('input-text');
        if (textarea) {
            textarea.focus();
            textarea.style.animation = 'glow-pulse 1s ease-in-out';

            setTimeout(() => {
                textarea.style.animation = '';
            }, 1000);
        }
    }, 500);
}

function toggleAllVibes() {
    const extended = document.getElementById('extended-vibes');
    const btn = document.querySelector('.see-all-btn');
    const text = document.getElementById('see-all-text');

    if (extended.style.display === 'none') {
        // Show with stagger animation
        extended.style.display = 'grid';
        text.textContent = 'Show less';
        btn.classList.add('expanded');

        // Animate each vibe card
        const vibeCards = extended.querySelectorAll('.vibe-card');
        vibeCards.forEach((card, index) => {
            card.style.animation = `slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s both`;
        });

        // Animate button
        btn.style.animation = 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

    } else {
        // Hide with animation
        const vibeCards = extended.querySelectorAll('.vibe-card');
        vibeCards.forEach((card, index) => {
            card.style.animation = `slideOutDown 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.02}s both`;
        });

        setTimeout(() => {
            extended.style.display = 'none';
            text.textContent = 'See all vibes';
            btn.classList.remove('expanded');

            // Reset animations
            vibeCards.forEach(card => {
                card.style.animation = '';
            });
        }, 300 + (vibeCards.length * 20));
    }

    setTimeout(() => {
        btn.style.animation = '';
    }, 300);
}

// Add slide out animation
const vibeAnimationStyle = document.createElement('style');
vibeAnimationStyle.textContent = `
    @keyframes slideOutDown {
        to {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
        }
    }
`;
document.head.appendChild(vibeAnimationStyle);

// ===========================
// OP Generate Rewrite - Ultra Modern
// ===========================
async function generateRewrite() {
    const inputText = document.getElementById('input-text').value.trim();

    if (!inputText || !currentVibe) return;

    if (!isPro && dailyUsage >= MAX_FREE_REWRITES) {
        showLimitModal();
        return;
    }

    // Show loading with OP animation
    document.getElementById('results-section').style.display = 'none';
    const loadingEl = document.getElementById('loading');
    loadingEl.style.display = 'flex';
    loadingEl.style.animation = 'slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

    try {
        console.log('🚀 Making API request to:', `${API_URL}/rewrite`);
        console.log('📝 Request data:', { text: inputText, vibe: currentVibe });

        const response = await fetch(`${API_URL}/rewrite`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ text: inputText, vibe: currentVibe })
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Response not OK:', response.status, errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Response data:', data);

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

            // Show success feedback
            showSuccessFeedback();

        } else {
            throw new Error(data.error || 'Failed to rewrite');
        }
    } catch (error) {
        console.error('💥 Error details:', error);

        // Show detailed error message
        let errorMessage = 'Something went wrong. Please try again.';

        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Cannot connect to server. Make sure the backend is running on http://localhost:3000';
        } else if (error.message.includes('CORS')) {
            errorMessage = 'CORS error. Check server configuration.';
        } else if (error.message.includes('HTTP 500')) {
            errorMessage = 'Server error. Check your OpenAI API key and server logs.';
        } else if (error.message.includes('HTTP 400')) {
            errorMessage = 'Invalid request. Please check your input.';
        }

        // Show error with OP styling
        showErrorFeedback(errorMessage);

    } finally {
        loadingEl.style.display = 'none';
    }
}

function showSuccessFeedback() {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 14px;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 0 30px rgba(16, 185, 129, 0.4);
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    feedback.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <span>✅</span>
            <span>Rewrite generated successfully!</span>
        </div>
    `;

    document.body.appendChild(feedback);

    setTimeout(() => {
        feedback.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => feedback.remove(), 300);
    }, 3000);
}

function showErrorFeedback(message) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 14px;
        z-index: 1000;
        cursor: pointer;
        box-shadow: 0 0 30px rgba(239, 68, 68, 0.4);
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
    `;

    feedback.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 8px;">
            <span style="flex-shrink: 0;">❌</span>
            <div>
                <div style="font-weight: 700; margin-bottom: 4px;">Error</div>
                <div style="font-size: 13px; opacity: 0.9;">${message}</div>
                <div style="font-size: 11px; opacity: 0.7; margin-top: 4px;">Click to dismiss</div>
            </div>
        </div>
    `;

    feedback.onclick = () => {
        feedback.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => feedback.remove(), 300);
    };

    document.body.appendChild(feedback);

    // Auto-dismiss after 8 seconds
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => feedback.remove(), 300);
        }
    }, 8000);
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(notificationStyle);

function displayResult(text) {
    const resultsSection = document.getElementById('results-section');
    const resultVibe = document.getElementById('result-vibe');
    const resultText = document.getElementById('result-text');

    resultVibe.textContent = `${vibeEmojis[currentVibe] || '✨'} ${currentVibe.charAt(0).toUpperCase() + currentVibe.slice(1)}`;
    resultText.textContent = text;

    // Show with OP animation
    resultsSection.style.display = 'block';
    resultsSection.style.animation = 'slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

    // Add typewriter effect to result text
    const originalText = text;
    resultText.textContent = '';

    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            resultText.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 20);
        }
    };

    setTimeout(typeWriter, 300);

    // Scroll into view smoothly
    setTimeout(() => {
        resultsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest'
        });
    }, 400);
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
// Settings & Profile
// ===========================
function updateProfileName() {
    const input = document.getElementById('settings-name-input');
    const newName = input.value.trim();

    if (!newName) {
        showErrorFeedback('Please enter a valid name');
        return;
    }

    userName = newName;
    localStorage.setItem('vibewrite_username', newName);
    updateUI();
    showSuccessFeedback('Profile updated!');
}

function resetAppData() {
    if (confirm('Are you absolutely sure? This will wipe your history, drafts, and stats forever.')) {
        localStorage.clear();
        window.location.reload();
    }
}

// Compact Mode handling
document.addEventListener('change', (e) => {
    if (e.target.id === 'compact-toggle') {
        if (e.target.checked) {
            document.body.classList.add('compact-mode');
        } else {
            document.body.classList.remove('compact-mode');
        }
    }
});

// Add compact mode styles
const compactStyle = document.createElement('style');
compactStyle.textContent = `
    .compact-mode .sidebar { width: 220px; }
    .compact-mode .nav-item { padding: 10px 15px; font-size: 14px; }
    .compact-mode .stat-card { padding: 15px; }
    .compact-mode .section-title { font-size: 20px; }
    .compact-mode .main-content { padding: 20px; }
    
    /* Toggle Switch Style */
    .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255,255,255,0.1); transition: .4s; border-radius: 24px; }
    .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
    input:checked + .slider { background-color: #6366f1; }
    input:checked + .slider:before { transform: translateX(20px); }
`;
document.head.appendChild(compactStyle);

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
        <div class="history-item" data-history-id="${item.id}">
            <div class="history-header">
                <span class="history-vibe">${vibeEmojis[item.vibe] || '✨'}</span>
                <div class="history-meta">
                    <div class="history-vibe-name">${item.vibe.charAt(0).toUpperCase() + item.vibe.slice(1)}</div>
                    <div class="history-time">${timeAgo(item.timestamp)}</div>
                </div>
                <button class="history-delete" onclick="deleteHistoryItem(${item.id})" title="Delete this item">
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

    // Add stagger animations
    const historyItems = list.querySelectorAll('.history-item');
    historyItems.forEach((item, index) => {
        item.style.animation = `slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s both`;
    });
}

function deleteHistoryItem(id) {
    console.log('🗑️ Deleting history item:', id);

    // Add deletion animation
    const historyItem = document.querySelector(`[data-history-id="${id}"]`);
    if (historyItem) {
        historyItem.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        historyItem.style.transform = 'translateX(100%)';
        historyItem.style.opacity = '0';
    }

    // Actually delete from array
    const originalLength = history.length;
    history = history.filter(item => item.id !== id);

    console.log(`📊 History items: ${originalLength} → ${history.length}`);

    // Save to localStorage
    localStorage.setItem('vibewrite_history', JSON.stringify(history));

    // Re-render after animation
    setTimeout(() => {
        renderHistory();
        renderRecentHistory();

        // Show success feedback
        showDeleteFeedback();
    }, 300);
}

function showDeleteFeedback() {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: white;
        padding: 12px 20px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 14px;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    feedback.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <span>🗑️</span>
            <span>History item deleted</span>
        </div>
    `;

    document.body.appendChild(feedback);

    setTimeout(() => {
        feedback.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
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

function scrollToSupport() {
    const supportBtn = document.querySelector('.support-btn');
    if (supportBtn) {
        supportBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Pulse effect to highlight it
        supportBtn.style.transform = 'scale(1.1)';
        supportBtn.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.8)';
        setTimeout(() => {
            supportBtn.style.transform = '';
            supportBtn.style.boxShadow = '';
        }, 2000);
    }
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

// Stripe
async function handleSubscribe() {
    const btn = document.querySelector('.upgrade-btn') || document.getElementById('subscribe-pro-btn');
    try {
        if (btn) { btn.style.pointerEvents = 'none'; btn.textContent = 'Redirecting...'; }
        const res = await fetch(`${API_URL}/create-checkout-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: userName || 'anonymous' })
        });
        const data = await res.json().catch(() => null);
        if (!data) {
            // Network error or server restart; show retry option
            showErrorFeedback('Cannot connect to server. Please try again in a moment.');
            if (btn) { btn.style.pointerEvents = ''; btn.textContent = 'Upgrade'; }
            return;
        }
        if (data && data.url) {
            window.location.href = data.url;
        } else {
            showErrorFeedback('Unable to start checkout.');
            if (btn) { btn.style.pointerEvents = ''; btn.textContent = 'Upgrade'; }
        }
    } catch (e) {
        console.error('checkout error', e);
        showErrorFeedback('Checkout failed. Please try again.');
        if (btn) { btn.style.pointerEvents = ''; btn.textContent = 'Upgrade'; }
    }
}

function handleStripeReturn() {
    // No-op
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
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

document.addEventListener('keypress', function (event) {
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
    const enabled = !!val;
    isPro = enabled;
    localStorage.setItem('vibewrite_pro', enabled ? '1' : '0');
    updateUI();
    console.log('Pro:', enabled);
    if (enabled) {
        document.querySelectorAll('.vibe-card.locked-vibe').forEach(card => {
            card.classList.remove('locked-vibe');
            card.dataset.locked = 'false';
            const lock = card.querySelector('.vibe-lock');
            if (lock) lock.remove();
        });
    }
};

// Reset all user data and stats
window.resetUserData = () => {
    dailyUsage = 0;
    localStorage.setItem('vibewrite_daily_usage', '0');

    stats = { total: 0, vibes: {} };
    localStorage.setItem('vibewrite_stats', JSON.stringify(stats));

    history = [];
    localStorage.setItem('vibewrite_history', JSON.stringify([]));

    // Reset last usage date to today
    const today = new Date().toDateString();
    localStorage.setItem('vibewrite_last_usage_date', today);
    lastUsageDate = today;

    updateUI();
    updateStats();
    renderRecentHistory();
    console.log('All user data reset');
};

// ===========================
// OP Community Features - Locked/Unlocked System
// ===========================
let communityScripts = [];
let currentFilter = 'all';
let currentSearch = '';
const UNLOCK_THRESHOLD = 50;

// Load community script count and check if unlocked
async function loadCommunityScripts() {
    try {
        console.log('🌐 Loading community script count...');

        const response = await fetch(`${API_URL}/community/scripts/count`);
        const data = await response.json();

        if (data.success) {
            const scriptCount = data.count || 0;
            console.log(`📊 Current script count: ${scriptCount}/${UNLOCK_THRESHOLD}`);

            // Update progress displays
            updateCommunityProgress(scriptCount);

            // Check if community should be unlocked
            if (scriptCount >= UNLOCK_THRESHOLD) {
                unlockCommunity();
                // Load actual scripts
                await loadFullCommunityScripts();
            } else {
                showLockedCommunity(scriptCount);
            }
        } else {
            throw new Error(data.error || 'Failed to load script count');
        }

    } catch (error) {
        console.error('❌ Error loading community:', error);
        showLockedCommunity(0);
        showErrorFeedback('Failed to load community data. Please try again.');
    }
}

// Update progress bars and counters
function updateCommunityProgress(count) {
    const percentage = Math.min((count / UNLOCK_THRESHOLD) * 100, 100);

    // Update main progress bar
    const progressFill = document.getElementById('progress-fill');
    const progressPercentage = document.getElementById('progress-percentage');
    const scriptCountEl = document.getElementById('script-count');

    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (progressPercentage) progressPercentage.textContent = `${Math.round(percentage)}%`;
    if (scriptCountEl) scriptCountEl.textContent = count;

    // Update modal progress bar
    const modalProgressFill = document.getElementById('modal-progress-fill');
    const modalScriptCount = document.getElementById('modal-script-count');

    if (modalProgressFill) modalProgressFill.style.width = `${percentage}%`;
    if (modalScriptCount) modalScriptCount.textContent = count;
}

// Show locked community state
function showLockedCommunity(count) {
    document.getElementById('community-locked').style.display = 'block';
    document.getElementById('community-unlocked').style.display = 'none';
    updateCommunityProgress(count);
}

// Unlock community features
function unlockCommunity() {
    console.log('🎉 Community unlocked!');
    document.getElementById('community-locked').style.display = 'none';
    document.getElementById('community-unlocked').style.display = 'block';

    // Show unlock celebration
    showUnlockCelebration();
}

// Show unlock celebration
function showUnlockCelebration() {
    const celebration = document.createElement('div');
    celebration.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 32px 40px;
        border-radius: 20px;
        font-weight: 700;
        font-size: 20px;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 0 60px rgba(16, 185, 129, 0.6);
        animation: celebrationPop 3s cubic-bezier(0.4, 0, 0.2, 1);
        text-align: center;
    `;

    celebration.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
        <div>Community Unlocked!</div>
        <div style="font-size: 16px; opacity: 0.9; margin-top: 8px;">50+ scripts collected!</div>
    `;

    document.body.appendChild(celebration);

    setTimeout(() => {
        celebration.remove();
    }, 3000);
}

// Load full community scripts (when unlocked)
async function loadFullCommunityScripts() {
    try {
        const response = await fetch(`${API_URL}/community/scripts`);
        const data = await response.json();

        if (data.success) {
            communityScripts = data.scripts || [];
            updateCommunityStats();
            renderCommunityScripts();
        }
    } catch (error) {
        console.error('❌ Error loading full scripts:', error);
    }
}

// Show contribute modal
function showContributeModal() {
    const modal = document.getElementById('contribute-modal');
    const form = document.getElementById('contribute-form');
    const success = document.getElementById('contribute-success');

    // Reset form
    form.reset();
    form.style.display = 'block';
    success.style.display = 'none';

    // Pre-fill name if available
    const nameInput = document.getElementById('contribute-name');
    if (userName && nameInput) {
        nameInput.value = userName;
    }

    modal.style.display = 'flex';
    modal.style.animation = 'fadeIn 0.3s ease';
}

function closeContributeModal() {
    const modal = document.getElementById('contribute-modal');
    modal.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Submit contribution
async function submitContribution(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('contribute-name').value.trim(),
        scriptName: document.getElementById('contribute-script-name').value.trim(),
        instructions: document.getElementById('contribute-instructions').value.trim(),
        example: document.getElementById('contribute-example').value.trim()
    };

    if (!formData.name || !formData.scriptName || !formData.instructions) {
        showErrorFeedback('Please fill in all required fields.');
        return;
    }

    try {
        console.log('📝 Submitting contribution:', formData);

        const response = await fetch(`${API_URL}/community/contribute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            // Show success state
            document.getElementById('contribute-form').style.display = 'none';
            document.getElementById('contribute-success').style.display = 'block';

            // Update success counter
            const successCount = document.getElementById('success-count');
            if (successCount) successCount.textContent = data.newCount;

            // Update main progress
            updateCommunityProgress(data.newCount);

            // Check if we've unlocked community
            if (data.newCount >= UNLOCK_THRESHOLD && data.unlocked) {
                setTimeout(() => {
                    closeContributeModal();
                    unlockCommunity();
                }, 2000);
            }

            console.log('✅ Contribution submitted successfully!');

        } else {
            throw new Error(data.error || 'Failed to submit contribution');
        }

    } catch (error) {
        console.error('❌ Error submitting contribution:', error);
        showErrorFeedback('Failed to submit contribution. Please try again.');
    }
}

// Add celebration animation
const celebrationStyle = document.createElement('style');
celebrationStyle.textContent = `
    @keyframes celebrationPop {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
        }
        80% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
        }
    }
`;
document.head.appendChild(celebrationStyle);

// Update community stats
function updateCommunityStats() {
    const totalScripts = communityScripts.length;
    const totalVotes = communityScripts.reduce((sum, script) => sum + (script.votes || 0), 0);
    const activeCreators = new Set(communityScripts.map(script => script.author)).size;

    // Animate stat values
    animateCounter(document.getElementById('total-scripts'), totalScripts);
    animateCounter(document.getElementById('total-votes'), totalVotes);
    animateCounter(document.getElementById('active-creators'), activeCreators);
}

function animateCounter(element, targetValue) {
    if (!element) return;

    let currentValue = 0;
    const increment = Math.ceil(targetValue / 20);

    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        element.textContent = currentValue;
    }, 50);
}

// Render community scripts
function renderCommunityScripts() {
    const gridEl = document.getElementById('scripts-grid');
    const loadingEl = document.getElementById('scripts-loading');
    const emptyEl = document.getElementById('empty-scripts');

    loadingEl.style.display = 'none';

    // Filter scripts
    let filteredScripts = [...communityScripts];

    // Apply search filter
    if (currentSearch) {
        filteredScripts = filteredScripts.filter(script =>
            script.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
            script.instructions.toLowerCase().includes(currentSearch.toLowerCase()) ||
            script.author.toLowerCase().includes(currentSearch.toLowerCase())
        );
    }

    // Apply category filter
    switch (currentFilter) {
        case 'popular':
            filteredScripts.sort((a, b) => (b.votes || 0) - (a.votes || 0));
            break;
        case 'recent':
            filteredScripts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case 'my-scripts':
            filteredScripts = filteredScripts.filter(script => script.author === userName);
            break;
    }

    if (filteredScripts.length === 0) {
        gridEl.innerHTML = '';
        emptyEl.style.display = 'block';
        return;
    }

    emptyEl.style.display = 'none';

    // Render script cards
    gridEl.innerHTML = filteredScripts.map(script => `
        <div class="script-card" onclick="showScriptDetail(${script.id})" data-script-id="${script.id}">
            <div class="script-header">
                <div class="script-info">
                    <div class="script-title">${escapeHtml(script.name)}</div>
                    <div class="script-author">by ${escapeHtml(script.author)}</div>
                </div>
                <div class="script-votes">
                    <button class="vote-btn" onclick="event.stopPropagation(); voteScript(${script.id}, 'up')" title="Upvote">
                        ▲
                    </button>
                    <div class="vote-count">${script.votes || 0}</div>
                    <button class="vote-btn" onclick="event.stopPropagation(); voteScript(${script.id}, 'down')" title="Downvote">
                        ▼
                    </button>
                </div>
            </div>
            <div class="script-description">${escapeHtml(script.instructions)}</div>
            <div class="script-footer">
                <div class="script-meta">
                    <span>${timeAgo(script.created_at)}</span>
                    <span>${script.status || 'active'}</span>
                </div>
                <div class="script-actions">
                    <button class="script-action-btn primary" onclick="event.stopPropagation(); useScript(${script.id})">
                        Use Script
                    </button>
                    <button class="script-action-btn" onclick="event.stopPropagation(); showScriptDetail(${script.id})">
                        View
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add stagger animations
    const scriptCards = gridEl.querySelectorAll('.script-card');
    scriptCards.forEach((card, index) => {
        card.style.animation = `slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s both`;
    });
}

// Filter scripts
function filterScripts(filter) {
    currentFilter = filter;

    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

    // Re-render scripts
    renderCommunityScripts();
}

// Search scripts
function searchScripts() {
    currentSearch = document.getElementById('script-search').value.trim();
    renderCommunityScripts();
}

// Vote on script
async function voteScript(scriptId, direction) {
    try {
        console.log(`🗳️ Voting ${direction} on script ${scriptId}`);

        const response = await fetch(`${API_URL}/community/scripts/${scriptId}/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ direction, voter: userName || 'Anonymous' })
        });

        const data = await response.json();

        if (data.success) {
            // Update local script data
            const script = communityScripts.find(s => s.id === scriptId);
            if (script) {
                script.votes = data.votes;
            }

            // Re-render scripts
            renderCommunityScripts();
            updateCommunityStats();

            // Show feedback
            showSuccessFeedback(`Vote ${direction === 'up' ? '👍' : '👎'} recorded!`);
        } else {
            throw new Error(data.error || 'Failed to vote');
        }

    } catch (error) {
        console.error('❌ Error voting:', error);
        showErrorFeedback('Failed to record vote. Please try again.');
    }
}

// Use script (go to rewrite page with custom prompt)
function useScript(scriptId) {
    const script = communityScripts.find(s => s.id === scriptId);
    if (!script) return;

    // Show page transition
    showPage('rewrite');

    // Wait for page transition then apply script
    setTimeout(() => {
        // Set custom instructions in a special way
        const textarea = document.getElementById('input-text');
        if (textarea) {
            textarea.placeholder = `Using "${script.name}" script: ${script.instructions}`;
            textarea.focus();
        }

        // Show success feedback
        showSuccessFeedback(`🎯 Using "${script.name}" script!`);
    }, 500);
}

// Show script detail modal
function showScriptDetail(scriptId) {
    const script = communityScripts.find(s => s.id === scriptId);
    if (!script) return;

    const modal = document.getElementById('script-detail-modal');
    const content = document.getElementById('script-detail-content');

    content.innerHTML = `
        <div class="script-detail-header">
            <div class="script-detail-info">
                <div class="script-detail-title">${escapeHtml(script.name)}</div>
                <div class="script-detail-author">Created by ${escapeHtml(script.author)}</div>
                <div class="script-detail-meta">${timeAgo(script.created_at)} • ${script.votes || 0} votes</div>
            </div>
            <div class="script-detail-votes">
                <button class="vote-btn" onclick="voteScript(${script.id}, 'up')" title="Upvote">▲</button>
                <div class="vote-count">${script.votes || 0}</div>
                <button class="vote-btn" onclick="voteScript(${script.id}, 'down')" title="Downvote">▼</button>
            </div>
        </div>
        
        <div class="script-detail-description">
            <h4>Instructions</h4>
            <p>${escapeHtml(script.instructions)}</p>
        </div>
        
        <div class="script-detail-actions">
            <button class="secondary-btn" onclick="closeScriptDetailModal()">Close</button>
            <button class="primary-btn" onclick="useScript(${script.id}); closeScriptDetailModal();">Use Script</button>
        </div>
    `;

    modal.style.display = 'flex';
    modal.style.animation = 'fadeIn 0.3s ease';
}

function closeScriptDetailModal() {
    const modal = document.getElementById('script-detail-modal');
    modal.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Show create script modal
function showCreateScriptModal() {
    const modal = document.getElementById('create-script-modal');
    const form = document.getElementById('create-script-form');
    const success = document.getElementById('create-script-success');

    // Reset form
    form.reset();
    form.style.display = 'block';
    success.style.display = 'none';

    modal.style.display = 'flex';
    modal.style.animation = 'fadeIn 0.3s ease';
}

function closeCreateScriptModal() {
    const modal = document.getElementById('create-script-modal');
    modal.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Submit community script
async function submitCommunityScript(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('script-name').value.trim(),
        instructions: document.getElementById('script-instructions').value.trim(),
        example: document.getElementById('script-example').value.trim(),
        author: userName || 'Anonymous'
    };

    if (!formData.name || !formData.instructions) {
        showErrorFeedback('Please fill in all required fields.');
        return;
    }

    try {
        console.log('📝 Submitting community script:', formData);

        const response = await fetch(`${API_URL}/community/scripts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            // Show success state
            document.getElementById('create-script-form').style.display = 'none';
            document.getElementById('create-script-success').style.display = 'block';

            // Add to local scripts array
            communityScripts.unshift({
                id: data.scriptId,
                ...formData,
                votes: 0,
                created_at: new Date().toISOString(),
                status: 'active'
            });

            console.log('✅ Script created successfully!');

        } else {
            throw new Error(data.error || 'Failed to create script');
        }

    } catch (error) {
        console.error('❌ Error creating script:', error);
        showErrorFeedback('Failed to create script. Please try again.');
    }
}

// Add modal fade animations
const modalAnimationStyle = document.createElement('style');
modalAnimationStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(modalAnimationStyle);

// Enhanced interactive UI (FAQ, steps, privacy modal, testimonials)
document.addEventListener('DOMContentLoaded', function () {
    // Step details toggles
    document.querySelectorAll('.step-details-btn').forEach(btn => {
        const details = btn.nextElementSibling;
        btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', (!expanded).toString());
            if (expanded) {
                details.hidden = true;
                details.style.maxHeight = null;
            } else {
                details.hidden = false;
                details.style.maxHeight = details.scrollHeight + 'px';
            }
            btn.blur();
        });
    });

    // 3D Tilt on step-cards
    document.querySelectorAll('.step-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const dx = (x - cx) / cx;
            const dy = (y - cy) / cy;
            const rotX = dy * 6; // tune for subtlety
            const rotY = dx * -6;
            card.style.transform = `translateY(-8px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Accessible FAQ accordion (with assistive text updates)
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        const answer = document.getElementById(btn.getAttribute('aria-controls'));
        const assistive = btn.querySelector('.assistive');
        // start collapsed
        if (answer) { answer.style.maxHeight = null; answer.style.opacity = 0; }

        btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';

            // Close others for accordion behavior
            faqQuestions.forEach(other => {
                if (other !== btn) {
                    other.setAttribute('aria-expanded', 'false');
                    const otherAnswer = document.getElementById(other.getAttribute('aria-controls'));
                    if (otherAnswer) { otherAnswer.style.maxHeight = null; otherAnswer.style.opacity = 0; }
                    other.parentElement.classList.remove('active');
                    const otherAssist = other.querySelector('.assistive'); if (otherAssist) otherAssist.textContent = 'Show';
                }
            });

            // Toggle current item
            btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
            if (!expanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = 1;
                btn.parentElement.classList.add('active');
                if (assistive) assistive.textContent = 'Hide';
            } else {
                answer.style.maxHeight = null;
                answer.style.opacity = 0;
                btn.parentElement.classList.remove('active');
                if (assistive) assistive.textContent = 'Show';
            }
        });

        // keyboard support: Enter/Space to toggle
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
        });
    });

    // Privacy modal handling
    const openPrivacy = document.getElementById('open-privacy-modal');
    const privacyModal = document.getElementById('privacy-modal');
    if (openPrivacy && privacyModal) {
        const closeBtn = privacyModal.querySelector('.modal-close');
        const overlay = privacyModal.querySelector('.modal-overlay');
        const closeModal = () => {
            privacyModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
        };
        const openModal = () => {
            privacyModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
            closeBtn && closeBtn.focus();
        };
        openPrivacy.addEventListener('click', openModal);
        closeBtn && closeBtn.addEventListener('click', closeModal);
        overlay && overlay.addEventListener('click', closeModal);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && privacyModal.getAttribute('aria-hidden') === 'false') closeModal();
        });
    }

    // Smooth testimonials carousel (fade/slide)
    const testimonialsContainer = document.getElementById('testimonials');
    if (testimonialsContainer) {
        const cards = Array.from(testimonialsContainer.querySelectorAll('.testimonial-card'));
        let idx = 0;
        const showIndex = (i) => {
            idx = (i + cards.length) % cards.length;
            cards.forEach((c, j) => {
                c.classList.toggle('active', j === idx);
            });
            console.log('Current active index:', idx);
            cards.forEach((c, j) => {
                console.log(`Card ${j} active:`, c.classList.contains('active'));
            });
        };
        showIndex(0);
        const nextBtn = document.querySelector('.testimonials-nav.next');
        const prevBtn = document.querySelector('.testimonials-nav.prev');
        nextBtn && nextBtn.addEventListener('click', () => showIndex(idx + 1));
        prevBtn && prevBtn.addEventListener('click', () => showIndex(idx - 1));
        let auto = setInterval(() => showIndex(idx + 1), 5000);
        // pause on hover
        testimonialsContainer.addEventListener('mouseenter', () => clearInterval(auto));
        testimonialsContainer.addEventListener('mouseleave', () => { clearInterval(auto); auto = setInterval(() => showIndex(idx + 1), 5000); });
        [nextBtn, prevBtn].forEach(b => b && b.addEventListener('click', () => { clearInterval(auto); auto = setInterval(() => showIndex(idx + 1), 5000); }));

        // Debugging logs
        console.log('Testimonials container:', testimonialsContainer);
        console.log('Testimonial cards:', cards);
        console.log('Next button:', nextBtn);
        console.log('Previous button:', prevBtn);
        console.log('Initial index:', idx);
    }
    // Make functions global for HTML onclick attributes
    window.openApp = openApp;
    window.backToLanding = backToLanding;
    window.scrollToSupport = scrollToSupport;
    window.quickRewrite = quickRewrite;
    window.selectVibe = selectVibe;
    window.setPro = setPro;
    window.logout = logout;
    window.toggleSidebar = toggleSidebar;
    window.toggleAllVibes = toggleAllVibes;
    window.generateRewrite = generateRewrite;

}); // End Enhanced interactive UI

// ===========================
// SECRET CHEAT CODE 🤫
// ===========================