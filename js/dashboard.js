/**
 * Namah's StudyFlow: Gamer Edition
 * Handles: XP System, Avatar Evolution, Countdown, and Syncing
 */

const DASHBOARD_CONFIG = {
    totalTopics: 13,
    xpPerTopic: 100,
    xpPerLevel: 300 // Levels up every 3 topics
};

function initDashboard() {
    // 1. DATA RETRIEVAL
    const completed = JSON.parse(localStorage.getItem('math_completed')) || [];
    const recentTopic = localStorage.getItem('recent_focus') || "Ready to start?";
    
    // 2. XP & LEVEL CALCULATIONS
    const totalXP = completed.length * DASHBOARD_CONFIG.xpPerTopic;
    const currentLevel = Math.floor(totalXP / DASHBOARD_CONFIG.xpPerLevel) + 1;
    const xpTowardsNextLevel = totalXP % DASHBOARD_CONFIG.xpPerLevel;
    const progressInLevel = (xpTowardsNextLevel / DASHBOARD_CONFIG.xpPerLevel) * 100;

    // 3. UI UPDATES: STATS & PROGRESS
    const percent = Math.round((completed.length / DASHBOARD_CONFIG.totalTopics) * 100);
    
    safeSetText('dash-percent', `${percent}%`);
    safeSetText('total-xp', `${totalXP} XP`);
    safeSetText('user-level', currentLevel);
    safeSetText('recent-focus-text', `Recent Focus: ${recentTopic}`);

    const xpFill = document.getElementById('xp-fill');
    if (xpFill) xpFill.style.width = `${progressInLevel}%`;

    // 4. AVATAR & RANK EVOLUTION
    updateAvatar(currentLevel);

    // 5. EXAM COUNTDOWN
    updateCountdown();
}

/**
 * Handles the Avatar and Title changes based on level
 */
function updateAvatar(level) {
    const avatarImg = document.getElementById('divine-avatar');
    const rankEl = document.getElementById('rank-name');
    const aura = document.getElementById('aura');
    
    // Define the stages with God of War / Shiva themes
    const stages = [
        { name: "MORTAL EXILE", img: "assets/lvl1_mark.png", color: "#888" },    // e.g., Kratos' Omega symbol
        { name: "QUANTUM SPARTAN", img: "assets/lvl2_trishul.png", color: "#ff4500" }, // e.g., A Tech-Trishul
        { name: "GHOST OF SPARTA", img: "assets/lvl3_blades.png", color: "#ff0000" },  // e.g., Blades of Chaos
        { name: "RUDRA DESTROYER", img: "assets/lvl4_shiva.png", color: "#00d4ff" },   // e.g., Meditating Shiva Silhouette
        { name: "MAHADEV UNBOUND", img: "assets/lvl5_god.png", color: "#fff" }        // e.g., A glowing Quantum Singularity
    ];

    const current = stages[Math.min(level - 1, 4)]; 

    if (avatarImg) {
        avatarImg.src = current.img;
        avatarImg.style.filter = `drop-shadow(0 0 15px ${current.color})`;
    }

    if (rankEl) {
        rankEl.innerText = current.name;
        rankEl.style.color = current.color;
    }

    if (aura) {
        aura.style.background = current.color;
    }
}

/**
 * Logic for the Exam Countdown
 */
function updateCountdown() {
    const examDate = new Date('2026-03-09');
    const today = new Date();
    const diff = examDate - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    const countdownEl = document.getElementById('dash-countdown');
    if (countdownEl) {
        countdownEl.innerText = days > 0 ? `⏳ ${days} Days to Math Exam` : "🔥 Exam Day!";
    }
}

/**
 * Helper to prevent errors if IDs are missing
 */
function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

// Run when the page loads
document.addEventListener('DOMContentLoaded', initDashboard);