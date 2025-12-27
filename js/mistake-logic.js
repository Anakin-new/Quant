document.addEventListener('DOMContentLoaded', () => {
    renderMistakes();
});

function renderMistakes() {
    const vault = JSON.parse(localStorage.getItem('mistake_bank')) || [];
    const container = document.getElementById('mistake-list');
    document.getElementById('error-count').innerText = vault.length;

    if (vault.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:#888;'>The Vault is empty. You are a perfect warrior!</p>";
        return;
    }

    container.innerHTML = '';
    vault.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'mistake-card';
        card.innerHTML = `
            <button class="clear-btn" onclick="removeMistake(${index})">Mastered ✓</button>
            <h4>${item.question}</h4>
            <div class="solution-box">Correct Answer: ${item.correct}</div>
        `;
        container.appendChild(card);
    });
}

function removeMistake(index) {
    let vault = JSON.parse(localStorage.getItem('mistake_bank'));
    vault.splice(index, 1);
    localStorage.setItem('mistake_bank', JSON.stringify(vault));
    renderMistakes();
}

function clearFullVault() {
    if(confirm("Are you sure you want to delete all recorded mistakes?")) {
        localStorage.removeItem('mistake_bank');
        renderMistakes();
    }
}