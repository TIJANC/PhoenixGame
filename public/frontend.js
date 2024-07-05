class Player {
    constructor({ x, y, radius, color }) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }
}

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const scoreIndicators = document.querySelector('#scoreIndicators');

const backgroundImages = {
    'City': 'images/Smart_city.png',
    'Town': 'images/De-growth_city.png',
    'Village': 'images/Post-growth_city.png'
};
const playerFaction = localStorage.getItem('playerFaction');

const randomImagePath = backgroundImages[playerFaction];

const backgroundImage = new Image();
backgroundImage.src = randomImagePath;

const devicePixelRatio = window.devicePixelRatio || 1;

canvas.width = innerWidth * devicePixelRatio;
canvas.height = (innerHeight * 2 / 3) * devicePixelRatio;

const frontEndPlayers = {};

const scores = Array(16).fill(0);

function updateScores(scoreUpdates) {
    for (let i = 0; i < scores.length; i++) {
        scores[i] += scoreUpdates[i];
    }
    displayScores();
    localStorage.setItem('scores', JSON.stringify(scores));
}

function displayScores() {
    const colors = ['green', 'orange', 'lightskyblue', 'darkseagreen', 'darkblue', 'darkcyan', 'brown',
        'red', 'purple', 'salmon', 'chocolate', 'sandybrown', 'olive', 'mediumorchid', 'mediumvioletred', 'grey'];

    scores.forEach((score, index) => {
        const indicator = document.querySelector(`.score-indicator[data-index="${index}"]`);
        if (indicator) {
            indicator.querySelector('.score-value').textContent = score;
            const color = colors[index]; 
            indicator.style.background = calculateColor(score, color);
        }
    });
}

function calculateColor(score, color) {
    if (score >= 15) {
        return color;
    }
    const percentage = Math.min(score / 15, 1);
    return `linear-gradient(to top, ${color} 0%, ${color} ${percentage * 100}%, grey ${percentage * 100}%, grey 100%)`;
}

function createScoreIndicators() {
    const tooltips = ['Habitat creation and maintenance',
        'Pollination and dispersal of seed and other propagules',
        'Regulation of air quality', 
        'Regulation of climate', 
        'Regulation of freshwater quantity, location and timing', 
        'Regulation of freshwater and coastal water quality', 
        'Formation, protection and decontamination of soils and sediments',
        'Regulation of hazards and extreme events', 
        'Regulation of detrimental organism and biological processes', 
        'Energy', 
        'Food and feed', 
        'Materials and assistance', 
        'Medicinal, biochemical and genetic resources', 
        'Learning and inspiration', 
        'Physical and psychological experiences', 
        'Supporting identities'];

        for (let i = 0; i < 16; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('score-indicator');
            indicator.dataset.index = i;
    
            const scoreValue = document.createElement('div');
            scoreValue.classList.add('score-value');
            scoreValue.textContent = scores[i]; 
            indicator.appendChild(scoreValue);
    
            const tooltip = document.createElement('div');
            tooltip.classList.add('tooltip');
            tooltip.textContent = tooltips[i];
            indicator.appendChild(tooltip);
    
            scoreIndicators.appendChild(indicator);
        }
    
        displayScores(); 
    }
    

createScoreIndicators();

function animate() {
    requestAnimationFrame(animate);
    c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    for (const id in frontEndPlayers) {
        const frontEndPlayer = frontEndPlayers[id];
        frontEndPlayer.draw();
    }
}

window.addEventListener('keydown', (event) => {
    if (!frontEndPlayers['player']) return;

    let moved = false;
    switch (event.code) {
        case 'KeyW':
            frontEndPlayers['player'].y -= 5;
            moved = true;
            break;
        case 'KeyA':
            frontEndPlayers['player'].x -= 5;
            moved = true;
            break;
        case 'KeyS':
            frontEndPlayers['player'].y += 5;
            moved = true;
            break;
        case 'KeyD':
            frontEndPlayers['player'].x += 5;
            moved = true;
            break;
    }

    if (moved) {
    }
});

let isTouchMoving = false;
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (event) => {
    isTouchMoving = true;
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

canvas.addEventListener('touchmove', (event) => {
    if (!isTouchMoving || !frontEndPlayers['player']) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    frontEndPlayers['player'].x += deltaX * 1;
    frontEndPlayers['player'].y += deltaY * 1;

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

});

canvas.addEventListener('touchend', () => {
    isTouchMoving = false;
});

function addCards() {
    const cardContainer = document.getElementById('cardContainer');

    const cardTexts = ['Urban Greening', 'Sustainable Energy', 'Sustainable Mobility', 'Water Management',
        'Urban Farming', 'Urban Forestry', 'Urbanisation', 'Biodiversity'];

    for (let i = 0; i < cardTexts.length; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add(`card-${i}`);
        card.textContent = cardTexts[i];
        cardContainer.appendChild(card);

        if (playedCards[i]) {
            card.classList.add('disabled');
        }
        cardContainer.appendChild(card);
    }
}

const playedCards = Array(8).fill(false); 
const cardContainer = document.getElementById('cardContainer');
let selectedCardIndex = null;

cardContainer.addEventListener('click', (event) => {
    const selectedCard = event.target.closest('.card');
    if (selectedCard && !selectedCard.classList.contains('disabled')) {
        const cardIndex = Array.from(selectedCard.parentNode.children).indexOf(selectedCard);
        selectedCardIndex = cardIndex;

        const playerFaction = localStorage.getItem('playerFaction') || 'City';
        const cardEffect = cardEffects[playerFaction][cardIndex];

        openModal(cardEffect);
    }
});

const modal = document.getElementById('cardModal');
const closeBtn = document.querySelector('.close');
const playCardBtn = document.getElementById('playCardBtn');
const cardEffectText = document.getElementById('cardEffect');

function openModal(cardEffect) {
    cardEffectText.textContent = cardEffect;
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

closeBtn.addEventListener('click', closeModal);

playCardBtn.addEventListener('click', () => {
    if (selectedCardIndex !== null) {
        applyCardEffect(selectedCardIndex);
        playedCards[selectedCardIndex] = true;
        document.querySelectorAll('.card')[selectedCardIndex - 1].classList.add('disabled');
    }
    closeModal();
});

const faction = localStorage.getItem('playerFaction');

const cardEffects = {
    City: [
        '',
        'Greenery is applied to buildings facades, roofs and infrastructure',
        'Digital systems allow for more efficient use of energy',
        'As the efficiency of logistics improves some industrial areas can be cleared',
        'Storage pools are created in the city outskirts',
        'Vertical farms are built in former industrial areas',
        'Forestation on private land is incentivised',
        'Population grows but the city does not expand',
        'All rooftops have greenery'
    ],
    Town: [
        '',
        'Underused urban areas are transformed into urban parks',
        'Solar panels are installed in peri-urban fields',
        'Green and blue infrastructures are designed to promote slow mobility',
        'Water drainage is increased with new vegetation',
        'Collective farms substitute most current urban parks',
        'New trees are planted along infrastructures and in underused plots',
        'New urban developments are forbidden',
        'Some urban parks are redesigned to enhance biodiversity'
    ],
    Village: [
        '',
        'Dismissed urban areas are replaced with mixed forests',
        'Peri-urban forests are cyclically cut to use wood for energy',
        'Slow mobility (e.g. walking, cycling) become main mean of transportation and asphalt is reduced',
        'Dismissed urban areas are replaced with grassland',
        'Farming production becomes decentralised and self-managed',
        'New trees are planted in dismissed areas of the city',
        'Population shrinks but the city does not expand',
        'All urban greenery and sports fields are converted to enhance biodiversity'
    ]
};

function applyCardEffect(cardNumber) {
    const scoreUpdates = Array(16).fill(0);
    const faction = localStorage.getItem('playerFaction');

    switch (faction) {
        case 'City':
            switch (cardNumber) {
                case 1:
                    scoreUpdates[0] = 4;
                    scoreUpdates[1] = 2;
                    scoreUpdates[2] = 2;
                    scoreUpdates[3] = 3;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 3;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 2;
                    scoreUpdates[15] = 2;
                    break;
                case 2:
                    scoreUpdates[0] = 3;
                    scoreUpdates[1] = 3;
                    scoreUpdates[2] = 1;
                    scoreUpdates[3] = 2;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 0;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 3;
                    scoreUpdates[15] = 3;
                    break;
                case 3:
                    scoreUpdates[0] = 4;
                    scoreUpdates[1] = 3;
                    scoreUpdates[2] = 0;
                    scoreUpdates[3] = 2;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 0;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 3;
                    scoreUpdates[15] = 3;
                    break;
                case 4:
                    scoreUpdates[0] = 3;
                    scoreUpdates[1] = 2;
                    scoreUpdates[2] = 1;
                    scoreUpdates[3] = 2;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 0;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 2;
                    scoreUpdates[15] = 2;
                    break;
                case 5:
                    scoreUpdates[0] = 4;
                    scoreUpdates[1] = 2;
                    scoreUpdates[2] = 2;
                    scoreUpdates[3] = 3;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 3;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 2;
                    scoreUpdates[15] = 2;
                    break;
                case 6:
                    scoreUpdates[0] = 3;
                    scoreUpdates[1] = 2;
                    scoreUpdates[2] = 2;
                    scoreUpdates[3] = 2;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 0;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 3;
                    scoreUpdates[15] = 3;
                    break;
                case 7:
                    scoreUpdates[0] = 3;
                    scoreUpdates[1] = 2;
                    scoreUpdates[2] = 1;
                    scoreUpdates[3] = 2;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 0;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 2;
                    scoreUpdates[15] = 2;
                    break;
                case 8:
                    scoreUpdates[0] = 0;
                    scoreUpdates[1] = 0;
                    scoreUpdates[2] = 0;
                    scoreUpdates[3] = 2;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 0;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 2;
                    scoreUpdates[15] = 2;
                    break;
            }
            break;
        case 'Town':
            switch (cardNumber) {
                case 1:
                    scoreUpdates[0] = 4;
                    scoreUpdates[1] = 3;
                    scoreUpdates[2] = 2;
                    scoreUpdates[3] = 3;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 3;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 3;
                    scoreUpdates[15] = 2;
                    break;
                case 2:
                    scoreUpdates[0] = 4;
                    scoreUpdates[1] = 2;
                    scoreUpdates[2] = 2;
                    scoreUpdates[3] = 3;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 3;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 3;
                    scoreUpdates[15] = 3;
                    break;
                case 3:
                    scoreUpdates[0] = 4;
                    scoreUpdates[1] = 3;
                    scoreUpdates[2] = 2;
                    scoreUpdates[3] = 3;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 3;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 3;
                    scoreUpdates[15] = 3;
                    break;
                case 4:
                    scoreUpdates[0] = 4;
                    scoreUpdates[1] = 3;
                    scoreUpdates[2] = 2;
                    scoreUpdates[3] = 3;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 3;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 3;
                    scoreUpdates[15] = 3;
                    break;
                case 5:
                    scoreUpdates[0] = 4;
                    scoreUpdates[1] = 3;
                    scoreUpdates[2] = 2;
                    scoreUpdates[3] = 3;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 3;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 3;
                    scoreUpdates[15] = 3;
                    break;
                case 6:
                    scoreUpdates[0] = 4;
                    scoreUpdates[1] = 3;
                    scoreUpdates[2] = 2;
                    scoreUpdates[3] = 3;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 3;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 3;
                    scoreUpdates[15] = 3;
                    break;
                case 7:
                    scoreUpdates[0] = 4;
                    scoreUpdates[1] = 3;
                    scoreUpdates[2] = 2;
                    scoreUpdates[3] = 3;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 3;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 3;
                    scoreUpdates[15] = 3;
                    break;
                case 8:
                    scoreUpdates[0] = 4;
                    scoreUpdates[1] = 3;
                    scoreUpdates[2] = 2;
                    scoreUpdates[3] = 3;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 3;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 3;
                    scoreUpdates[15] = 3;
                    break;
            }
            break;
        case 'Village':
            switch (cardNumber) {
                case 1:
                    scoreUpdates[0] = 4;
                    scoreUpdates[1] = 3;
                    scoreUpdates[2] = 2;
                    scoreUpdates[3] = 3;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 3;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 3;
                    scoreUpdates[15] = 3;
                    break;
                case 2:
                    scoreUpdates[0] = 4;
                    scoreUpdates[1] = 3;
                    scoreUpdates[2] = 2;
                    scoreUpdates[3] = 3;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 3;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 3;
                    scoreUpdates[15] = 3;
                    break;
                case 3:
                    scoreUpdates[0] = 4;
                    scoreUpdates[1] = 3;
                    scoreUpdates[2] = 2;
                    scoreUpdates[3] = 3;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 3;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 3;
                    scoreUpdates[15] = 3;
                    break;
                case 4:
                    scoreUpdates[0] = 4;
                    scoreUpdates[1] = 3;
                    scoreUpdates[2] = 2;
                    scoreUpdates[3] = 3;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 3;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 3;
                    scoreUpdates[15] = 3;
                    break;
                case 5:
                    scoreUpdates[0] = 4;
                    scoreUpdates[1] = 3;
                    scoreUpdates[2] = 2;
                    scoreUpdates[3] = 3;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 3;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 3;
                    scoreUpdates[15] = 3;
                    break;
                case 6:
                    scoreUpdates[0] = 4;
                    scoreUpdates[1] = 3;
                    scoreUpdates[2] = 2;
                    scoreUpdates[3] = 3;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 3;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 3;
                    scoreUpdates[15] = 3;
                    break;
                case 7:
                    scoreUpdates[0] = 4;
                    scoreUpdates[1] = 3;
                    scoreUpdates[2] = 2;
                    scoreUpdates[3] = 3;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 3;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 3;
                    scoreUpdates[15] = 3;
                    break;
                case 8:
                    scoreUpdates[0] = 4;
                    scoreUpdates[1] = 3;
                    scoreUpdates[2] = 2;
                    scoreUpdates[3] = 3;
                    scoreUpdates[4] = 0;
                    scoreUpdates[5] = 0;
                    scoreUpdates[6] = 0;
                    scoreUpdates[7] = 0;
                    scoreUpdates[8] = 3;
                    scoreUpdates[9] = 0;
                    scoreUpdates[10] = 0;
                    scoreUpdates[11] = 0;
                    scoreUpdates[12] = 0;
                    scoreUpdates[13] = 0;
                    scoreUpdates[14] = 3;
                    scoreUpdates[15] = 3;
                    break;
            }
            break;
    }

    updateScores(scoreUpdates);
    checkEndGame();
}

animate();
addCards();

function checkEndGame() {
    const gameEndCondition = scores.some(score => score >= 15) && scores.every(score => score >= 0);
    if (gameEndCondition) {
        alert('You win!'); 
        window.location.href = 'ResultsPage.html';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const name = localStorage.getItem('playerName');
    const faction = localStorage.getItem('playerFaction');
    const storedScores = localStorage.getItem('scores');
    const scores = storedScores ? JSON.parse(storedScores) : Array(16).fill(0);

    const data = {
        name: name,
        faction: faction,
        scores: scores
    };

    try {
        const response = await fetch('/api/saveResults', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to save results');
        }

        console.log('Results saved successfully');
        // Optionally, handle success (e.g., show a success message)
    } catch (error) {
        console.error('Error saving results:', error);
        // Handle error (e.g., show an error message to the user)
    }
});