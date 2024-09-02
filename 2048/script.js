// Variables globales
let plateau = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

// Fonction pour générer une nouvelle tuile (2 ou 4)
const generateTile = () => {
    let emptyTiles = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (plateau[i][j] === 0) {
                emptyTiles.push({x: i, y: j});
            }
        }
    }
    if (emptyTiles.length === 0) return false;  // Plateau plein
    let randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    plateau[randomTile.x][randomTile.y] = Math.random() > 0.5 ? 4 : 2;
    // console.log(randomTile);
    return true;
    
}

// Fonction pour déplacer les tuiles vers la droite
const moveRight = () => {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let row = plateau[i].filter(val => val); // Supprime les zéros
        for (let j = row.length - 1; j > 0; j--) {
            if (row[j] === row[j - 1]) {
                row[j] *= 2;
                row[j - 1] = 0;
               // moved = true; pas la peine le check sera fait ulterieurement !!!
            }
        }
        row = row.filter(val => val); // Supprime les zéros après fusion
        while (row.length < 4) row.unshift(0); // Complète avec des zéros à gauche
        if (plateau[i].toString() !== row.toString()) moved = true;
        plateau[i] = row;
    }
    return moved;
}

// Fonction pour déplacer les tuiles vers la gauche
const moveLeft = () => {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let row = plateau[i].filter(val => val); // Supprime les zéros
        for (let j = 0; j < row.length - 1; j++){
            if (row[j] === row[j + 1]) {
                row[j] *= 2;
                row[j + 1] = 0;
               // moved = true;
            }
        }
        row = row.filter(val => val); // Supprime les zéros après fusion
        while (row.length < 4) row.push(0); // Complète avec des zéros à droite
        if (plateau[i].toString() !== row.toString()) moved = true;
        plateau[i] = row;
    }
    return moved;
}

// Fonction pour déplacer les tuiles vers le haut
const moveUp = () => {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let col = [];
        for (let i = 0; i < 4; i++) col.push(plateau[i][j]);
        col = col.filter(val => val); // Supprime les zéros
        for (let i = 0; i < col.length - 1; i++) {
            if (col[i] === col[i + 1]) {
                col[i] *= 2;
                col[i + 1] = 0;
               // moved = true;
            }
        }
        col = col.filter(val => val); // Supprime les zéros après fusion
        while (col.length < 4) col.push(0); // Complète avec des zéros en bas
        for (let i = 0; i < 4; i++) {
            if (plateau[i][j] !== col[i]) moved = true;
            plateau[i][j] = col[i];
        }
    }
    return moved;
}

// Fonction pour déplacer les tuiles vers le bas
const moveDown = () => {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let col = [];
        for (let i = 0; i < 4; i++) col.push(plateau[i][j]);
        col = col.filter(val => val); // Supprime les zéros
        for (let i = col.length - 1; i > 0; i--) {
            if (col[i] === col[i - 1]) {
                col[i] *= 2;
                col[i - 1] = 0;
                //moved = true;
            }
        }
        col = col.filter(val => val); // Supprime les zéros après fusion
        while (col.length < 4) col.unshift(0); // Complète avec des zéros en haut
        for (let i = 0; i < 4; i++) {
            if (plateau[i][j] !== col[i]) moved = true;
            plateau[i][j] = col[i];
        }
    }
    return moved;
}

// Fonction pour vérifier la victoire (atteint 2048)
const checkWin = () => {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (plateau[i][j] === 2048) return true;
        }
    }
    return false;
}

// Fonction pour vérifier la défaite (pas de mouvements possibles)
const checkLoss = () => {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (plateau[i][j] === 0) return false;
            if (j < 3 && plateau[i][j] === plateau[i][j + 1]) return false;
            if (i < 3 && plateau[i][j] === plateau[i + 1][j]) return false;
        }
    }
    return true;
}

// Gestion des événements de clavier
document.addEventListener('keydown', (event) => {
    let moved = false;
    switch (event.key) {
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
    }
    
    if (moved) {
        generateTile();
        updateBoard();
        if (checkWin()) {
            alert("Vous avez gagné !");
        } else if (checkLoss()) {
            alert("Game Over !");
        }
    }
});

// Fonction pour mettre à jour l'affichage du plateau
const updateBoard = () => {
    const board = document.getElementById('plateau');
    board.innerHTML = ''; // Vide le plateau
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const tile = document.createElement('div');
            tile.classList.add('carreau');
            if (plateau[i][j] !== 0) {
                tile.classList.add('piece');
                tile.classList.add('c'+plateau[i][j]);
                tile.textContent = plateau[i][j];
            }
            board.appendChild(tile);
        }
    }
}

// Initialisation du jeu
const initGame = () => {
    generateTile();
    generateTile();
    updateBoard();
}

initGame();
