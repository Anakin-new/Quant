let currentQuestions = [];
let currentIdx = 0;
let userAnswers = [];
const BATTLE_SIZE = 10; 

function startTest(mode) {
    const pool = testData[mode];

    if (!pool || Object.keys(pool).length === 0) {
        alert("This category is empty! Add questions to test-data.js.");
        return;
    }

    // Both NCERT and PYQ are now Objects (Chapter-based)
    showChapterMenu(pool, mode);
}

function showChapterMenu(chaptersObj, modeName) {
    document.getElementById('chapter-search').value = ''; // Reset search
    document.getElementById('mode-selection').style.display = 'none';
    document.getElementById('chapter-selection').style.display = 'block';

    // Update Header Text to show which mode we are in
    const title = modeName === 'ncert' ? 'NCERT CHAPTERS' : 'PYQ ARCHIVES';
    document.querySelector('#chapter-selection .glow-text').innerText = title;

    const list = document.getElementById('chapter-list');
    list.innerHTML = '';

    Object.keys(chaptersObj).forEach(chapterName => {
        const count = chaptersObj[chapterName].length;
        const btn = document.createElement('button');
        btn.className = 'chapter-card';
        // Add a class for specific styling if needed
        btn.classList.add(modeName); 
        
        btn.innerHTML = `
            <span>${chapterName}</span>
            <small>${count} Qs</small>
        `;
        btn.onclick = () => setupBattle(chaptersObj[chapterName]);
        list.appendChild(btn);
    });
}

function setupBattle(questions) {
    const limit = Math.min(BATTLE_SIZE, questions.length);
    // Shuffle and pick
    currentQuestions = [...questions].sort(() => 0.5 - Math.random()).slice(0, limit);
    
    currentIdx = 0;
    userAnswers = [];
    
    document.getElementById('chapter-selection').style.display = 'none';
    document.getElementById('quiz-arena').style.display = 'block';
    
    showQuestion();
}

function showQuestion() {
    const q = currentQuestions[currentIdx];
    document.getElementById('question-text').innerText = q.q;
    document.getElementById('progress-text').innerText = `CHALLENGE ${currentIdx + 1}/${currentQuestions.length}`;
    
    const optionsDiv = document.getElementById('options-grid');
    optionsDiv.innerHTML = '';
    
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => handleSelection(i);
        optionsDiv.appendChild(btn);
    });
}

function handleSelection(selectedIdx) {
    const q = currentQuestions[currentIdx];
    const isRight = selectedIdx === q.correct;
    
    userAnswers.push({
        question: q.q,
        selected: q.options[selectedIdx],
        correct: q.options[q.correct],
        isRight: isRight
    });

    if (!isRight) { addToMistakeBank(q); }

    currentIdx++;
    if (currentIdx < currentQuestions.length) {
        showQuestion();
    } else {
        endBattle();
    }
}

function addToMistakeBank(qObj) {
    let bank = JSON.parse(localStorage.getItem('mistake_bank')) || [];
    if (!bank.some(item => item.question === qObj.q)) {
        bank.push({
            question: qObj.q,
            correct: qObj.options[qObj.correct],
            options: qObj.options
        });
        localStorage.setItem('mistake_bank', JSON.stringify(bank));
    }
}

function endBattle() {
    document.getElementById('quiz-arena').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';

    const correctCount = userAnswers.filter(a => a.isRight).length;
    const xpGained = correctCount * 50;
    const accuracy = userAnswers.length > 0 ? Math.round((correctCount / userAnswers.length) * 100) : 0;

    let totalXP = parseInt(localStorage.getItem('user_xp')) || 0;
    localStorage.setItem('user_xp', totalXP + xpGained);

    document.getElementById('final-xp').innerText = `+${xpGained}`;
    document.getElementById('accuracy-text').innerText = `Accuracy: ${accuracy}%`;

    const reviewDiv = document.getElementById('review-list');
    reviewDiv.innerHTML = '<h3 style="margin-bottom:15px; color:var(--accent-blue)">BATTLE LOG</h3>';
    
    userAnswers.forEach((ans, i) => {
        const div = document.createElement('div');
        div.className = `review-item ${ans.isRight ? 'correct' : 'wrong'}`;
        div.innerHTML = `
            <strong>Q${i+1}: ${ans.question}</strong><br>
            <span style="color:${ans.isRight ? '#39ff14' : '#ff4500'}">
                ${ans.isRight ? '✓' : '✗'} Your Answer: ${ans.selected}
            </span><br>
            ${!ans.isRight ? `<small style="color:#aaa">Correct Answer: ${ans.correct}</small>` : ''}
        `;
        reviewDiv.appendChild(div);
    });
}

function backToModes() {
    document.getElementById('chapter-selection').style.display = 'none';
    document.getElementById('mode-selection').style.display = 'block';
}

function filterChapters() {
    const input = document.getElementById('chapter-search').value.toLowerCase();
    const cards = document.getElementsByClassName('chapter-card');
    let visibleCount = 0;

    for (let i = 0; i < cards.length; i++) {
        const chapterName = cards[i].querySelector('span').innerText.toLowerCase();
        if (chapterName.includes(input)) {
            cards[i].style.display = "flex";
            visibleCount++;
        } else {
            cards[i].style.display = "none";
        }
    }

    // Optional: Handle "No Results found"
    const list = document.getElementById('chapter-list');
    const existingMsg = document.getElementById('search-error');
    
    if (visibleCount === 0) {
        if (!existingMsg) {
            const msg = document.createElement('p');
            msg.id = 'search-error';
            msg.className = 'no-results';
            msg.innerText = "No battlegrounds found with that name...";
            list.appendChild(msg);
        }
    } else if (existingMsg) {
        existingMsg.remove();
    }
}