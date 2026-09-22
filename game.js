/* 
  Frontend Concept: Separation of Concerns
  We separate our "State" (the data representing the game) from our "View" (the HTML elements).
  Instead of reading numbers from the HTML directly, we keep a 2D array in JS.
*/
const SIZE = 4;
let board = [];
let score = 0;
let hasWon = false;
let isGameOver = false;
let isMoving = false;
let moveTimeout = null;

// High Score State
let bestScore = parseInt(localStorage.getItem('2048_bestScore')) || 0;

// Game Mode State
let currentMode = 'CLASSIC';
let timeAttackInterval = null;
let timeAttackStartTime = 0;
let timeAttackDuration = 2000;

// DOM Elements
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('best-score');
const tileContainer = document.getElementById('tile-container');
const messageElement = document.getElementById('game-message');
const messageText = document.getElementById('message-text');
const retryButton = document.getElementById('retry');
const resetButton = document.getElementById('reset');
const modeBtns = document.querySelectorAll('.mode-btn');
const progressContainer = document.getElementById('progress-container');
const progressFill = document.getElementById('progress-fill');

// Mode Selection
modeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Remove active class from all
        modeBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked
        e.target.classList.add('active');
        
        currentMode = e.target.dataset.mode;
        initGame();
    });
});

/*
  Frontend Concept: Object-Oriented UI
  By creating a Tile class, each tile manages its own HTML element and position.
  This allows us to easily update its CSS `top` and `left` properties so it animates smoothly.
*/
class Tile {
    constructor(value, row, col) {
        this.value = value;
        this.row = row;
        this.col = col;
        
        // Create the physical HTML element
        this.element = document.createElement('div');
        this.updateClassAndText();
        
        // Add to DOM
        tileContainer.appendChild(this.element);
        
        // Set initial position
        this.updatePosition();
    }
    
    updatePosition() {
        // We use CSS `calc()` to dynamically place the tile based on row/col.
        // This makes it perfectly responsive when the grid size changes on mobile!
        this.element.style.left = `calc(${this.col} * (var(--cell-size) + var(--grid-gap)))`;
        this.element.style.top = `calc(${this.row} * (var(--cell-size) + var(--grid-gap)))`;
    }
    
    setValue(newValue) {
        this.value = newValue;
        this.updateClassAndText();
        
        // Retrigger the pop animation
        this.element.style.animation = 'none';
        this.element.offsetHeight; // Trigger reflow to restart animation
        this.element.style.animation = 'pop 200ms ease-in-out';
    }
    
    updateClassAndText() {
        const valueClass = this.value <= 2048 ? `tile-${this.value}` : 'tile-super';
        this.element.className = `tile ${valueClass}`;
        this.element.textContent = this.value;
    }
    
    remove() {
        // Small timeout lets it slide to the destination before disappearing
        setTimeout(() => {
            if(this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }, 100);
    }
}

function initGame() {
    if (moveTimeout) clearTimeout(moveTimeout);
    
    // Clear the board array and DOM container
    board = [];
    tileContainer.innerHTML = '';
    score = 0;
    hasWon = false;
    isGameOver = false;
    isMoving = false;
    updateScore();
    hideMessage();
    
    // Set initial Best Score display
    bestScoreElement.textContent = bestScore;
    
    // Initialize 4x4 board with nulls
    for (let r = 0; r < SIZE; r++) {
        board[r] = [];
        for (let c = 0; c < SIZE; c++) {
            board[r][c] = null;
        }
    }
    
    // Spawn initial 2 tiles
    addRandomTile();
    addRandomTile();
    
    // Handle Game Mode logic
    if (currentMode === 'TIME_ATTACK') {
        startTimeAttack();
    } else {
        stopTimeAttack();
    }
}

// --- Time Attack Mechanics ---
function startTimeAttack() {
    stopTimeAttack();
    timeAttackStartTime = Date.now();
    progressFill.style.transform = `scaleX(1)`;
    progressContainer.style.display = 'block';
    
    // Use an interval to visually update the progress bar, but calculate progress based on Date.now()
    // This prevents the tab-throttling bug where the timer desyncs when the browser is minimized.
    timeAttackInterval = setInterval(() => {
        if (isGameOver) return;
        
        // If an animation is playing, pause the timer by pushing the start time forward!
        if (isMoving) {
            timeAttackStartTime += 16;
            return;
        }
        
        let elapsed = Date.now() - timeAttackStartTime;
        let remainingRatio = 1 - (elapsed / timeAttackDuration);
        
        if (remainingRatio <= 0) {
            // Timer hit 0! Spawn a tile!
            timeAttackStartTime = Date.now(); // reset timer
            addRandomTile();
            checkGameOver();
            remainingRatio = 1;
        }
        
        // Update visual bar
        progressFill.style.transform = `scaleX(${Math.max(0, remainingRatio)})`;
    }, 16);
}

function stopTimeAttack() {
    if (timeAttackInterval) clearInterval(timeAttackInterval);
    progressContainer.style.display = 'none';
}

function addRandomTile() {
    // Find all empty spots
    let emptySpots = [];
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (board[r][c] === null) {
                emptySpots.push({ r, c });
            }
        }
    }
    
    if (emptySpots.length > 0) {
        // Pick a random empty spot
        let randomSpot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
        // 90% chance of 2, 10% chance of 4
        let value = Math.random() < 0.9 ? 2 : 4;
        
        // Create new Tile instance and put it in the state
        board[randomSpot.r][randomSpot.c] = new Tile(value, randomSpot.r, randomSpot.c);
    }
}

/* 
  Core Logic: Sliding and Merging
  We extract the non-null tiles from a row/col, merge adjacent equals, 
  and then push them back into the array.
*/
function slideLine(line) {
    // 1. Remove nulls
    let tiles = line.filter(tile => tile !== null);
    
    // 2. Merge adjacent equal tiles
    for (let i = 0; i < tiles.length - 1; i++) {
        if (tiles[i].value === tiles[i+1].value) {
            // Fix Scoring: Score increases by the merged value!
            let newValue = tiles[i].value * 2;
            tiles[i].setValue(newValue);
            score += newValue;
            
            // Flag win condition
            if (newValue === 2048 && !hasWon) {
                hasWon = true;
                showMessage("You Win!");
            }
            
            // Remove the consumed tile from DOM and array
            tiles[i+1].remove();
            tiles.splice(i + 1, 1);
        }
    }
    
    // 3. Pad with nulls to maintain array length
    while (tiles.length < SIZE) {
        tiles.push(null);
    }
    
    return tiles;
}

function move(direction) {
    if (isGameOver || isMoving) return;
    
    let moved = false;
    
    if (direction === 'LEFT' || direction === 'RIGHT') {
        for (let r = 0; r < SIZE; r++) {
            let row = board[r];
            if (direction === 'RIGHT') row.reverse();
            
            let newRow = slideLine(row);
            
            if (direction === 'RIGHT') newRow.reverse();
            
            // Update positions and check if anything moved
            for (let c = 0; c < SIZE; c++) {
                if (board[r][c] !== newRow[c]) {
                    moved = true;
                }
                board[r][c] = newRow[c];
                if (board[r][c]) {
                    board[r][c].row = r;
                    board[r][c].col = c;
                    board[r][c].updatePosition();
                }
            }
        }
    } else if (direction === 'UP' || direction === 'DOWN') {
        for (let c = 0; c < SIZE; c++) {
            // Extract column
            let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
            if (direction === 'DOWN') col.reverse();
            
            let newCol = slideLine(col);
            
            if (direction === 'DOWN') newCol.reverse();
            
            for (let r = 0; r < SIZE; r++) {
                if (board[r][c] !== newCol[r]) {
                    moved = true;
                }
                board[r][c] = newCol[r];
                if (board[r][c]) {
                    board[r][c].row = r;
                    board[r][c].col = c;
                    board[r][c].updatePosition();
                }
            }
        }
    }
    
    if (moved) {
        isMoving = true;
        updateScore();
        // Add slight delay before spawning new tile so merge animation is visible
        moveTimeout = setTimeout(() => {
            addRandomTile();
            checkGameOver();
            isMoving = false;
            
            // Reset the panic timer in Time Attack!
            if (currentMode === 'TIME_ATTACK' && !isGameOver) {
                startTimeAttack(); 
            }
        }, 150);
    }
}

function checkGameOver() {
    // Are there any empty spots?
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (board[r][c] === null) return;
        }
    }
    
    // Are there any adjacent matches?
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            let val = board[r][c].value;
            if (
                (r < SIZE - 1 && board[r+1][c].value === val) ||
                (c < SIZE - 1 && board[r][c+1].value === val)
            ) {
                return; // Can still move
            }
        }
    }
    
    isGameOver = true;
    showMessage("Game Over!");
}

function updateScore() {
    scoreElement.textContent = score;
    
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('2048_bestScore', bestScore);
        bestScoreElement.textContent = bestScore;
    }
}

function showMessage(msg) {
    messageText.textContent = msg;
    messageElement.classList.add('show');
}

function hideMessage() {
    messageElement.classList.remove('show');
}

/* 
  Frontend Concept: Event Listeners
  We listen for keyboard arrows, as well as touch swipes for mobile support!
*/

// Keyboard Support
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            e.preventDefault(); // Prevent page scrolling
            move('UP');
            break;
        case 'ArrowDown':
        case 's':
            e.preventDefault();
            move('DOWN');
            break;
        case 'ArrowLeft':
        case 'a':
            e.preventDefault();
            move('LEFT');
            break;
        case 'ArrowRight':
        case 'd':
            e.preventDefault();
            move('RIGHT');
            break;
    }
});

// Mobile Touch / Swipe Support
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, {passive: false});

document.addEventListener('touchend', (e) => {
    if (isGameOver) return;
    
    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;
    
    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;
    
    // Minimum distance to register as a swipe
    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal swipe
            if (dx > 0) move('RIGHT');
            else move('LEFT');
        } else {
            // Vertical swipe
            if (dy > 0) move('DOWN');
            else move('UP');
        }
    }
});

// Button Events
retryButton.addEventListener('click', initGame);
resetButton.addEventListener('click', initGame);

// Start game on load
initGame();
