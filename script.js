const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const matchesDisplay = document.getElementById('matches');
const resetBtn = document.getElementById('reset-btn');

const cardSymbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎹'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = true;

function initGame() {
    cards = [...cardSymbols, ...cardSymbols];
    shuffleCards();
    renderCards();
    matchedPairs = 0;
    moves = 0;
    flippedCards = [];
    canFlip = true;
    updateScore();
}

function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

function renderCards() {
    gameBoard.innerHTML = '';
    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.dataset.symbol = symbol;

        card.innerHTML = `
            <div class="card-back">?</div>
            <div class="card-front">${symbol}</div>
        `;

        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
    });
}

function flipCard(card) {
    if (!canFlip) return;
    if (card.classList.contains('flipped')) return;
    if (card.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        updateScore();
        checkMatch();
    }
}

function checkMatch() {
    canFlip = false;
    const [card1, card2] = flippedCards;
    const symbol1 = card1.dataset.symbol;
    const symbol2 = card2.dataset.symbol;

    if (symbol1 === symbol2) {
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            updateScore();
            flippedCards = [];
            canFlip = true;

            if (matchedPairs === cardSymbols.length) {
                setTimeout(() => {
                    alert(`Congratulations! You won in ${moves} moves!`);
                }, 500);
            }
        }, 500);
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

function updateScore() {
    movesDisplay.textContent = moves;
    matchesDisplay.textContent = matchedPairs;
}

resetBtn.addEventListener('click', initGame);

initGame();
