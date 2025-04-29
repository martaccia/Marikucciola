// main.js
// Qui andrà la logica del timer e della crescita

console.log('Marikucciola pronta!');

// Papavero rosso in pixel art
function drawPoppy(ctx, x, y) {
    // Stelo
    ctx.fillStyle = '#38761d';
    ctx.fillRect(x+5, y+12, 2, 6);
    // Petali rossi
    ctx.fillStyle = '#e53935';
    ctx.fillRect(x+2, y+4, 10, 8); // petali centrali
    ctx.fillRect(x, y+6, 14, 4);   // petali laterali
    // Centro nero
    ctx.fillStyle = '#222';
    ctx.fillRect(x+6, y+8, 2, 2);
}

// Distribuzione uniforme dei papaveri su tutta la zolla
function randomPoppyOnZolla() {
    while (true) {
        const x = Math.floor(40 + Math.random() * 240);
        // Calcola i limiti y per questo x
        const yTop = 38 + (x - 40) * (18 / 240);    // bordo superiore inclinato
        const yBottom = 110 - (x - 40) * (18 / 240); // bordo inferiore inclinato
        const y = Math.floor(50 + Math.random() * (yBottom - 50 - 12)) + 35; // abbassa di 35px
        if (y >= 50 + 35 && y <= yBottom - 12 + 35) {
            return { x, y };
        }
    }
}

// Lista dei fiori attuali
let flowers = [];

function addFlower() {
    const pos = randomPoppyOnZolla();
    flowers.push({ x: pos.x, y: pos.y });
    drawAllFlowers();
}

function drawAllFlowers() {
    const canvas = document.getElementById('flowers-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const f of flowers) {
        drawPoppy(ctx, f.x, f.y);
    }
}

// Nuvolette pixel art animate
const clouds = [
    { x: 80, y: 40, w: 60, h: 24, speed: 0.18, phase: 0 },
    { x: 320, y: 60, w: 48, h: 18, speed: 0.12, phase: 80 },
    { x: 700, y: 30, w: 72, h: 26, speed: 0.09, phase: 140 },
    { x: 200, y: 90, w: 36, h: 14, speed: 0.15, phase: 200 },
    { x: 500, y: 55, w: 54, h: 20, speed: 0.13, phase: 320 },
    { x: 900, y: 70, w: 44, h: 18, speed: 0.11, phase: 420 },
];

function drawCloud(ctx, cx, cy, w, h) {
    // Semplice nuvoletta pixel art: 3 ellissi bianche
    ctx.fillStyle = '#fff';
    ctx.fillRect(cx, cy + h/3, w, h/2); // corpo
    ctx.fillRect(cx + w/4, cy, w/2, h); // parte alta
    ctx.fillRect(cx + w/2, cy + h/3, w/3, h/2); // gobba laterale
    // bordo grigio chiaro
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx, cy + h/3, w, h/2);
    ctx.strokeRect(cx + w/4, cy, w/2, h);
    ctx.strokeRect(cx + w/2, cy + h/3, w/3, h/2);
}

function animateClouds() {
    const canvas = document.getElementById('sky-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const c of clouds) {
        let x = (c.x + (performance.now() / 1000 + c.phase) * c.speed * 40) % (canvas.width + 100) - 50;
        drawCloud(ctx, x, c.y, c.w, c.h);
    }
    requestAnimationFrame(animateClouds);
}

// Movimento zolla e fiori solidali
let zollaY = 0;
let zollaPhase = 0;

function animateZolla() {
    zollaPhase += 0.035;
    zollaY = Math.round(Math.sin(zollaPhase) * 6); // movimento verticale morbido
    const zolla = document.getElementById('zolla');
    const flowersCanvas = document.getElementById('flowers-canvas');
    const maskCanvasEl = document.getElementById('mask-canvas');
    zolla.style.transform = `translateY(${zollaY}px)`;
    flowersCanvas.style.transform = `translateY(${zollaY}px)`;
    if (maskCanvasEl) maskCanvasEl.style.transform = `translateY(${zollaY}px)`;
    requestAnimationFrame(animateZolla);
}

let timerSeconds = 0;
let timerInterval = null;
let timerRunning = false;

function updateTimerDisplay() {
    const min = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
    const sec = String(timerSeconds % 60).padStart(2, '0');
    document.getElementById('timer-display').textContent = `${min}:${sec}`;
}

function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    timerInterval = setInterval(() => {
        timerSeconds++;
        updateTimerDisplay();
        if (timerSeconds % 300 === 0) { // ogni 5 minuti
            addFlower();
        }
    }, 1000);
}

function pauseTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 0;
    updateTimerDisplay();
}

// Frasi motivazionali
const motivationalQuotes = [
    "Impossibile? Non per te.",
    "Oggi vinci tu.",
    "Hai tutto quello che serve.",
    "Stai spaccando, non fermarti!",
    "Sei nata per farcela."
];

function showMotivationalBanner() {
    const banner = document.getElementById('motivational-banner');
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    banner.textContent = quote;
    banner.style.animation = 'none';
    banner.offsetHeight; // force reflow
    banner.style.opacity = '1';
    banner.style.animation = 'slide-banner 6s linear 1';
    setTimeout(() => {
        banner.style.opacity = '0';
    }, 6000);
}

// Ogni 30 minuti mostra una frase motivazionale
setInterval(showMotivationalBanner, 30 * 60 * 1000);
// Mostra subito la prima frase per test
setTimeout(showMotivationalBanner, 2000);

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('start-btn').onclick = function() {
        if (!timerRunning) startTimer();
    };
    document.getElementById('pause-btn').onclick = function() {
        pauseTimer();
    };
    document.getElementById('reset-btn').onclick = function() {
        resetTimer();
    };
    // Audio mute/unmute
    const music = document.getElementById('bg-music');
    const muteBtn = document.getElementById('mute-btn');
    let muted = false;
    muteBtn.onclick = function() {
        muted = !muted;
        music.muted = muted;
        muteBtn.textContent = muted ? '🔇' : '🔊';
    };
    // Avvia musica solo dopo interazione utente per compatibilità browser
    document.body.addEventListener('click', function playMusicOnce() {
        if (music.paused) {
            music.currentTime = 0;
            music.play().catch(()=>{});
        }
        document.body.removeEventListener('click', playMusicOnce);
    });
});

window.onload = function() {
    flowers = [];
    addFlower();
    animateClouds();
    animateZolla(); // attiva movimento zolla
    timerSeconds = 0;
    updateTimerDisplay();
    timerRunning = false;
    // Il timer parte solo se premi AVVIA
};
