const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suitSymbols = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };

let deck = [];
let stock = [];
let waste = [];
let foundations = [[], [], [], []];
let tableau = [[], [], [], [], [], [], []];
let moves = 0;
let startTime = null;
let timerInterval = null;
let draggedCard = null;
let draggedFrom = null;

const stockPile = document.getElementById('stock');
const wastePile = document.getElementById('waste');
const foundationPiles = Array.from(document.querySelectorAll('.foundation'));
const tableauPiles = Array.from(document.querySelectorAll('.tableau-pile'));
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const newGameBtn = document.getElementById('new-game-btn');

function createDeck() {
    deck = [];
    for (const suit of suits) {
        for (const value of values) {
            deck.push({
                suit,
                value,
                faceUp: false,
                color: (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black'
            });
        }
    }
    return deck;
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function initGame() {
    createDeck();
    shuffleDeck();

    stock = [];
    waste = [];
    foundations = [[], [], [], []];
    tableau = [[], [], [], [], [], [], []];
    moves = 0;
    startTime = Date.now();

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    let cardIndex = 0;
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j <= i; j++) {
            const card = deck[cardIndex++];
            card.faceUp = (j === i);
            tableau[i].push(card);
        }
    }

    while (cardIndex < deck.length) {
        stock.push(deck[cardIndex++]);
    }

    render();
    updateScore();
}

function render() {
    renderStock();
    renderWaste();
    renderFoundations();
    renderTableau();
}

function renderStock() {
    stockPile.innerHTML = '';
    if (stock.length > 0) {
        const cardEl = createCardElement(stock[stock.length - 1], true);
        cardEl.style.position = 'relative';
        stockPile.appendChild(cardEl);
    }
}

function renderWaste() {
    wastePile.innerHTML = '';
    if (waste.length > 0) {
        const card = waste[waste.length - 1];
        const cardEl = createCardElement(card, false);
        cardEl.style.position = 'relative';
        cardEl.addEventListener('mousedown', (e) => startDrag(e, cardEl, 'waste'));
        wastePile.appendChild(cardEl);
    }
}

function renderFoundations() {
    foundationPiles.forEach((pile, index) => {
        const existingCards = pile.querySelectorAll('.card');
        existingCards.forEach(card => card.remove());

        if (foundations[index].length > 0) {
            const card = foundations[index][foundations[index].length - 1];
            const cardEl = createCardElement(card, false);
            cardEl.style.position = 'relative';
            pile.appendChild(cardEl);
        }
    });
}

function renderTableau() {
    tableauPiles.forEach((pile, colIndex) => {
        pile.innerHTML = '';
        tableau[colIndex].forEach((card, cardIndex) => {
            const cardEl = createCardElement(card, !card.faceUp);
            cardEl.style.position = 'absolute';
            cardEl.style.top = `${cardIndex * 30}px`;

            if (card.faceUp) {
                cardEl.addEventListener('mousedown', (e) => startDrag(e, cardEl, 'tableau', colIndex, cardIndex));
            }

            pile.appendChild(cardEl);
        });
    });
}

function createCardElement(card, faceDown) {
    const cardEl = document.createElement('div');
    cardEl.classList.add('card');
    cardEl.classList.add(card.color);

    if (faceDown) {
        cardEl.classList.add('face-down');
    } else {
        const valueTop = document.createElement('div');
        valueTop.classList.add('card-value');
        valueTop.textContent = card.value;

        const suit = document.createElement('div');
        suit.classList.add('card-suit');
        suit.textContent = suitSymbols[card.suit];

        const valueBottom = document.createElement('div');
        valueBottom.classList.add('card-value');
        valueBottom.textContent = card.value;

        cardEl.appendChild(valueTop);
        cardEl.appendChild(suit);
        cardEl.appendChild(valueBottom);
    }

    cardEl.dataset.suit = card.suit;
    cardEl.dataset.value = card.value;

    return cardEl;
}

function startDrag(e, cardEl, from, colIndex = null, cardIndex = null) {
    e.preventDefault();
    draggedCard = cardEl;
    draggedFrom = { type: from, colIndex, cardIndex };

    cardEl.classList.add('dragging');

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', endDrag);
}

function onDrag(e) {
    if (!draggedCard) return;
}

function endDrag(e) {
    if (!draggedCard) return;

    draggedCard.classList.remove('dragging');

    const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
    const targetPile = dropTarget?.closest('.pile');

    if (targetPile) {
        handleDrop(targetPile);
    }

    draggedCard = null;
    draggedFrom = null;

    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', endDrag);
}

function handleDrop(targetPile) {
    const suit = draggedCard.dataset.suit;
    const value = draggedCard.dataset.value;

    if (targetPile.classList.contains('foundation')) {
        const foundationIndex = foundationPiles.indexOf(targetPile);
        if (canMoveToFoundation(suit, value, foundationIndex)) {
            moveToFoundation(foundationIndex);
        }
    } else if (targetPile.classList.contains('tableau-pile')) {
        const tableauIndex = tableauPiles.indexOf(targetPile);
        if (canMoveToTableau(suit, value, tableauIndex)) {
            moveToTableau(tableauIndex);
        }
    }
}

function canMoveToFoundation(suit, value, foundationIndex) {
    const foundation = foundations[foundationIndex];
    const foundationSuit = foundationPiles[foundationIndex].dataset.suit;

    if (suit !== foundationSuit) return false;

    if (draggedFrom.type === 'tableau') {
        const col = tableau[draggedFrom.colIndex];
        if (draggedFrom.cardIndex !== col.length - 1) return false;
    }

    if (foundation.length === 0) {
        return value === 'A';
    }

    const topCard = foundation[foundation.length - 1];
    const valueIndex = values.indexOf(value);
    const topValueIndex = values.indexOf(topCard.value);

    return valueIndex === topValueIndex + 1;
}

function canMoveToTableau(suit, value, tableauIndex) {
    const column = tableau[tableauIndex];
    const color = (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black';

    if (column.length === 0) {
        return value === 'K';
    }

    const topCard = column[column.length - 1];
    const valueIndex = values.indexOf(value);
    const topValueIndex = values.indexOf(topCard.value);

    return topCard.color !== color && valueIndex === topValueIndex - 1;
}

function moveToFoundation(foundationIndex) {
    let card;

    if (draggedFrom.type === 'waste') {
        card = waste.pop();
    } else if (draggedFrom.type === 'tableau') {
        card = tableau[draggedFrom.colIndex].pop();
        flipTopCard(draggedFrom.colIndex);
    }

    foundations[foundationIndex].push(card);
    moves++;
    updateScore();
    render();
    checkWin();
}

function moveToTableau(tableauIndex) {
    if (draggedFrom.type === 'waste') {
        const card = waste.pop();
        tableau[tableauIndex].push(card);
    } else if (draggedFrom.type === 'tableau') {
        const fromCol = draggedFrom.colIndex;
        const fromIndex = draggedFrom.cardIndex;
        const cardsToMove = tableau[fromCol].splice(fromIndex);
        tableau[tableauIndex].push(...cardsToMove);
        flipTopCard(fromCol);
    }

    moves++;
    updateScore();
    render();
}

function flipTopCard(colIndex) {
    const column = tableau[colIndex];
    if (column.length > 0) {
        const topCard = column[column.length - 1];
        if (!topCard.faceUp) {
            topCard.faceUp = true;
        }
    }
}

function updateScore() {
    movesDisplay.textContent = moves;
}

function updateTimer() {
    if (!startTime) return;
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function checkWin() {
    const totalCards = foundations.reduce((sum, pile) => sum + pile.length, 0);
    if (totalCards === 52) {
        clearInterval(timerInterval);
        setTimeout(() => {
            alert(`Congratulations! You won in ${moves} moves and ${timerDisplay.textContent}!`);
        }, 300);
    }
}

stockPile.addEventListener('click', () => {
    if (stock.length > 0) {
        const card = stock.pop();
        card.faceUp = true;
        waste.push(card);
        moves++;
    } else if (waste.length > 0) {
        while (waste.length > 0) {
            const card = waste.pop();
            card.faceUp = false;
            stock.push(card);
        }
        stock.reverse();
        moves++;
    }
    updateScore();
    render();
});

newGameBtn.addEventListener('click', initGame);

initGame();
