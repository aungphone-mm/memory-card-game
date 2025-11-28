const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suitSymbols = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };

let deck = [];
let playerHand = [];
let dealerHand = [];
let chips = 1000;
let currentBet = 0;
let wins = 0;
let gameInProgress = false;
let dealerRevealed = false;

const dealerHandEl = document.getElementById('dealer-hand');
const playerHandEl = document.getElementById('player-hand');
const dealerScoreEl = document.getElementById('dealer-score');
const playerScoreEl = document.getElementById('player-score');
const chipsEl = document.getElementById('chips');
const currentBetEl = document.getElementById('current-bet');
const winsEl = document.getElementById('wins');
const gameMessageEl = document.getElementById('game-message');

const bettingArea = document.getElementById('betting-area');
const gameControls = document.getElementById('game-controls');
const newRoundArea = document.getElementById('new-round-area');

const chipBtns = document.querySelectorAll('.chip-btn');
const clearBetBtn = document.getElementById('clear-bet-btn');
const dealBtn = document.getElementById('deal-btn');
const hitBtn = document.getElementById('hit-btn');
const standBtn = document.getElementById('stand-btn');
const doubleBtn = document.getElementById('double-btn');
const newRoundBtn = document.getElementById('new-round-btn');

function createDeck() {
    deck = [];
    for (const suit of suits) {
        for (const value of values) {
            deck.push({
                suit,
                value,
                color: (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black'
            });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealCard() {
    if (deck.length < 10) {
        createDeck();
        shuffleDeck();
    }
    return deck.pop();
}

function getCardValue(card) {
    if (card.value === 'A') return 11;
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    return parseInt(card.value);
}

function calculateScore(hand) {
    let score = 0;
    let aces = 0;

    for (const card of hand) {
        const value = getCardValue(card);
        score += value;
        if (card.value === 'A') aces++;
    }

    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
}

function createCardElement(card, faceDown = false) {
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

    return cardEl;
}

function renderHands() {
    playerHandEl.innerHTML = '';
    dealerHandEl.innerHTML = '';

    dealerHand.forEach((card, index) => {
        const faceDown = !dealerRevealed && index === 1;
        const cardEl = createCardElement(card, faceDown);
        dealerHandEl.appendChild(cardEl);
    });

    playerHand.forEach(card => {
        const cardEl = createCardElement(card);
        playerHandEl.appendChild(cardEl);
    });

    updateScores();
}

function updateScores() {
    const playerScore = calculateScore(playerHand);
    playerScoreEl.textContent = `(${playerScore})`;

    if (dealerRevealed) {
        const dealerScore = calculateScore(dealerHand);
        dealerScoreEl.textContent = `(${dealerScore})`;
    } else {
        dealerScoreEl.textContent = '';
    }
}

function updateDisplay() {
    chipsEl.textContent = chips;
    currentBetEl.textContent = currentBet;
    winsEl.textContent = wins;
}

function placeBet(amount) {
    if (chips >= amount) {
        currentBet += amount;
        chips -= amount;
        updateDisplay();
        dealBtn.disabled = false;
    }
}

function clearBet() {
    chips += currentBet;
    currentBet = 0;
    updateDisplay();
    dealBtn.disabled = true;
}

function startGame() {
    if (currentBet === 0) return;

    gameInProgress = true;
    dealerRevealed = false;
    playerHand = [];
    dealerHand = [];
    gameMessageEl.textContent = '';
    gameMessageEl.className = 'game-message';

    bettingArea.style.display = 'none';
    gameControls.style.display = 'flex';
    newRoundArea.style.display = 'none';

    playerHand.push(dealCard());
    dealerHand.push(dealCard());
    playerHand.push(dealCard());
    dealerHand.push(dealCard());

    renderHands();

    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);

    if (playerScore === 21 && playerHand.length === 2) {
        if (dealerScore === 21 && dealerHand.length === 2) {
            endGame('push', 'Both Blackjack! Push!');
        } else {
            endGame('blackjack', 'Blackjack! You Win!');
        }
    } else if (dealerScore === 21 && dealerHand.length === 2) {
        dealerRevealed = true;
        renderHands();
        endGame('lose', 'Dealer Blackjack! You Lose!');
    }

    doubleBtn.disabled = chips < currentBet;
}

function hit() {
    playerHand.push(dealCard());
    renderHands();

    const playerScore = calculateScore(playerHand);

    if (playerScore > 21) {
        endGame('lose', 'Bust! You Lose!');
    } else if (playerScore === 21) {
        stand();
    }

    doubleBtn.disabled = true;
}

function stand() {
    dealerRevealed = true;
    gameControls.style.display = 'none';

    let dealerScore = calculateScore(dealerHand);

    const dealerPlay = () => {
        renderHands();

        if (dealerScore < 17) {
            setTimeout(() => {
                dealerHand.push(dealCard());
                dealerScore = calculateScore(dealerHand);
                dealerPlay();
            }, 800);
        } else {
            setTimeout(() => {
                determineWinner();
            }, 500);
        }
    };

    dealerPlay();
}

function doubleDown() {
    if (chips >= currentBet) {
        chips -= currentBet;
        currentBet *= 2;
        updateDisplay();

        playerHand.push(dealCard());
        renderHands();

        const playerScore = calculateScore(playerHand);

        if (playerScore > 21) {
            endGame('lose', 'Bust! You Lose!');
        } else {
            stand();
        }
    }
}

function determineWinner() {
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);

    if (dealerScore > 21) {
        endGame('win', 'Dealer Busts! You Win!');
    } else if (playerScore > dealerScore) {
        endGame('win', 'You Win!');
    } else if (dealerScore > playerScore) {
        endGame('lose', 'You Lose!');
    } else {
        endGame('push', 'Push! Tie Game!');
    }
}

function endGame(result, message) {
    gameInProgress = false;
    dealerRevealed = true;
    renderHands();

    gameMessageEl.textContent = message;
    gameMessageEl.className = 'game-message';

    if (result === 'win') {
        gameMessageEl.classList.add('win');
        chips += currentBet * 2;
        wins++;
    } else if (result === 'blackjack') {
        gameMessageEl.classList.add('win');
        chips += Math.floor(currentBet * 2.5);
        wins++;
    } else if (result === 'push') {
        gameMessageEl.classList.add('push');
        chips += currentBet;
    } else {
        gameMessageEl.classList.add('lose');
    }

    currentBet = 0;
    updateDisplay();

    gameControls.style.display = 'none';
    newRoundArea.style.display = 'block';

    if (chips === 0) {
        setTimeout(() => {
            alert('You ran out of chips! Starting fresh with $1000.');
            chips = 1000;
            wins = 0;
            updateDisplay();
        }, 1000);
    }
}

function newRound() {
    bettingArea.style.display = 'block';
    newRoundArea.style.display = 'none';
    gameMessageEl.textContent = '';
    gameMessageEl.className = 'game-message';
    dealerScoreEl.textContent = '';
    playerScoreEl.textContent = '';
    dealerHandEl.innerHTML = '';
    playerHandEl.innerHTML = '';
}

chipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const value = parseInt(btn.dataset.value);
        placeBet(value);
    });
});

clearBetBtn.addEventListener('click', clearBet);
dealBtn.addEventListener('click', startGame);
hitBtn.addEventListener('click', hit);
standBtn.addEventListener('click', stand);
doubleBtn.addEventListener('click', doubleDown);
newRoundBtn.addEventListener('click', newRound);

createDeck();
shuffleDeck();
updateDisplay();
