const mathTopics = [
    "Relations and Functions", "Inverse Trigonometric Functions", 
    "Matrices", "Determinants", "Continuity and Differentiability", 
    "Application of Derivatives", "Integrals", "Application of Integrals", 
    "Differential Equations", "Vector Algebra", "3D Geometry", 
    "Linear Programming", "Probability"
];

let completed = JSON.parse(localStorage.getItem('math_completed')) || [];

function init() {
    updateCountdown();
    renderTopics();
}

function updateCountdown() {
    const examDate = new Date('2026-03-09');
    const today = new Date();
    const diff = examDate - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    document.getElementById('days-left').innerText = `⏳ ${days} days remaining until exam`;
}

function renderTopics() {
    const container = document.getElementById('topic-list');
    container.innerHTML = '';

    mathTopics.forEach(topic => {
        const isDone = completed.includes(topic);
        const div = document.createElement('div');
        div.className = `topic-card ${isDone ? 'completed' : ''}`;
        div.innerHTML = `
            <div class="topic-info">
                <h3>${topic}</h3>
            </div>
            <div class="check-circle" onclick="toggleTopic('${topic}')">
                ${isDone ? '✓' : ''}
            </div>
        `;
        container.appendChild(div);
    });

    updateProgress();
}

function toggleTopic(topic) {
    if (completed.includes(topic)) {
        completed = completed.filter(t => t !== topic);
    } else {
        completed.push(topic);
        // Save the most recent focus
        localStorage.setItem('recent_focus', topic);
        // Play a little alert sound or vibration if you want here!
    }
    
    // Calculate total XP: 100 XP per topic
    const currentXP = completed.length * 100;
    localStorage.setItem('user_xp', currentXP);
    
    localStorage.setItem('math_completed', JSON.stringify(completed));
    renderTopics();
}

function updateProgress() {
    const percent = Math.round((completed.length / mathTopics.length) * 100);
    document.getElementById('progress-text').innerText = `${percent}%`;
    document.getElementById('items-count').innerText = `${completed.length}/${mathTopics.length} Topics`;
}

init();