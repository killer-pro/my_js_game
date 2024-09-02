const board = document.getElementById('plateau');
const popup = document.getElementById('popup');
const popupTitle = document.getElementById('popup-title');
const popupMessage = document.getElementById('popup-message');
const popupButton = document.getElementById('popup-button');

function showPopup(title, message, isVictory) {
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    popup.classList.add('show');
    popup.classList.toggle('victory', isVictory);
    popup.classList.toggle('defeat', !isVictory);
}

function hidePopup() {
    popup.classList.remove('show', 'victory', 'defeat');
}

popupButton.addEventListener('click', () => {
    hidePopup();
    begin();
});
let plateau = [[]];
let bombCase = [];
let taillePlateau;

const generationCase = (dimension) => {
    taillePlateau = dimension;
    for (let index = 0; index < dimension; index++) {
        plateau[index] = [];
        for (let index2 = 0; index2 < dimension; index2++) {
            plateau[index][index2] = "";
        }       
    }
}

const generationBombe = (bombe) => {
    for (let index = 0; index < bombe; index++) {
        let x = Math.floor(Math.random() * taillePlateau);
        let y = Math.floor(Math.random() * taillePlateau);
        if (plateau[x][y] === "x") {
            index--;
            continue;
        }
        bombCase.push({ x: x, y: y });
        plateau[x][y] = "x";
    }
}

const generationChiffreProximite = () => {
    for (let index = 0; index < taillePlateau; index++) {
        for (let index2 = 0; index2 < taillePlateau; index2++) {
            if (plateau[index][index2] === 'x') continue; 

            let valeurCase = 0;
            for (let index3 = -1; index3 <= 1; index3++) { 
                for (let index4 = -1; index4 <= 1; index4++) { 0
                    let indexAround1 = index + index3;
                    let indexAround2 = index2 + index4;

                    if (indexAround1 < 0 || indexAround1 >= taillePlateau || indexAround2 < 0 || indexAround2 >= taillePlateau) continue;

                    if (plateau[indexAround1][indexAround2] === 'x') {
                        valeurCase++; 
                    }
                }
            }
            plateau[index][index2] = valeurCase;
        }
    }
}

const creationPlateau = () => {
    for (let index = 0; index < taillePlateau; index++) {
        for (let index2 = 0; index2 < taillePlateau; index2++) {
            let place = document.createElement('div');
            place.classList.add('carreau', `x${index}y${index2}`, 'hide');

            place.addEventListener('click', () => clickCase(index, index2));
            place.addEventListener('contextmenu', (event) => togleDrapeau(event, index, index2));

            board.append(place);  
        }
    }
}

const togleDrapeau = (event, x, y) => {
    event.preventDefault();
    const caseElement = document.querySelector(`.x${x}y${y}`);
    if (caseElement.classList.contains('show')) return; // Ne pas mettre de drapeau sur une case révélée
    
    if (caseElement.classList.contains('flag')) {
        caseElement.classList.remove('flag');
        caseElement.innerHTML = "";
    } else {
        caseElement.classList.add('flag');
        let flag = document.createElement('img');
        flag.src = 'drapeau.png';
        flag.classList.add('flag-img');
        caseElement.append(flag);
    }
};

const clickCase = (x, y) => {
    const caseElement = document.querySelector(`.x${x}y${y}`);
    if (caseElement.classList.contains('flag') || caseElement.classList.contains('show')) {
        return; // Ne rien faire si la case est déjà marquée d'un drapeau ou révélée
    }

    caseElement.classList.remove('hide');
    caseElement.classList.add('show');

    if (plateau[x][y] === 'x') {
        reveleBomb(caseElement);
        bombCase = bombCase.filter(bombe => bombe.x !== x || bombe.y !== y);
        setTimeout(() => { reveleBombesSuivantes(0); }, 200);
    } else if (plateau[x][y] === 0) {
        reveleAdjacentCases(x, y);
    } else {
        caseElement.textContent = plateau[x][y];
    }

    checkWinCondition();
}

const reveleAdjacentCases = (x, y) => {
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < taillePlateau && newY >= 0 && newY < taillePlateau) {
                clickCase(newX, newY);
            }
        }
    }
}

const reveleBomb = (element) => {
    let mine = document.createElement('img');
    mine.src = 'mine.png';
    mine.classList.add('mine');
    element.append(mine);
}

const reveleBombesSuivantes = (index) => {
    if (index < bombCase.length) {
        const bombe = bombCase[index];
        let caseBombe = document.querySelector(`.x${bombe.x}y${bombe.y}`);
        if (caseBombe) {
            reveleBomb(caseBombe);
            setTimeout(() => {
                reveleBombesSuivantes(index + 1);
            }, 200);
        }
    } else {
        showPopup('Défaite !', 'Vous avez touché une bombe. Essayez encore !', false);
    }
}

const checkWinCondition = () => {
    const totalCases = taillePlateau * taillePlateau;
    const revealedCases = document.querySelectorAll('.show').length;
    const flaggedCases = document.querySelectorAll('.flag').length;
    
    if (revealedCases + flaggedCases === totalCases && flaggedCases === bombCase.length) {
        showPopup('Victoire !', 'Félicitations, vous avez gagné !', true);
    }
}





const begin = () => {
    board.innerHTML = ''; // Nettoie le plateau avant de commencer une nouvelle partie
    plateau = [[]];
    bombCase = [];
    generationCase(10);
    generationBombe(8);
    generationChiffreProximite();
    creationPlateau();
}

begin();

// Ajout d'un bouton pour recommencer le jeu
const restartButton = document.createElement('button');
restartButton.textContent = 'Restart Game';
restartButton.addEventListener('click', begin);
document.body.insertBefore(restartButton, board);