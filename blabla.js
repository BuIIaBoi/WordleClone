// wordle.js
let secretArr = [];      // e.g. ['a','p','p','l','e']
let secretWord = '';     // e.g. 'apple'
let wordSet = new Set(); // valid 5-letter words, for guess validation
let filledCount = 0;     // number of letters currently typed in the active row (0-5)
let rowCounter = 1;
let gameOver   = false;
let innerRow;

/**
 * 1) Load the word list, pick one at random, split into letters.
 * 2) Then call setupGame() to wire up your listener.
 */
async function initWordle() {
  try {
    const resp = await fetch('./wordle-La.txt');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const text = await resp.text();
    // get all non‑empty lines, trim whitespace, lowercase
    const words = text
      .split('\n')
      .map(w => w.trim().toLowerCase())
      .filter(Boolean)
      .filter(w => w.length === 5);      // only 5‑letter words

    // build a lookup set so we can validate guesses in O(1)
    wordSet = new Set(words);

    // pick a random 5‑letter word
    secretWord = words[Math.floor(Math.random() * words.length)];
    secretArr = secretWord.split('');    // e.g. ['a','p','p','l','e']
    console.log('Secret word:', secretWord, secretArr);

    setupGame();
  } catch (err) {
    console.error('Failed to initialize word list:', err);
  }
}

/**
 * Wire up your keyup listener now that secretArr is ready.
 */
function setupGame() {
  innerRow = document.getElementById(`innerRow${rowCounter}`);

  document.addEventListener('keyup', event => {
    if (gameOver) return; // ignore input once the game has ended

    // BACKSPACE — remove the last filled letter, if there is one
    if (event.key === 'Backspace') {
      if (filledCount > 0) {
        filledCount -= 1;
        const cell = innerRow.children[filledCount];
        cell.textContent = '';
        cell.style.backgroundColor = 'white';
      }

    // ENTER
    } else if (event.key === 'Enter') {
      submitGuess();

    // LETTER KEYS
    } else if (/^[a-zA-Z]$/.test(event.key)) {
      if (filledCount < 5) {
        const cell = innerRow.children[filledCount];
        cell.textContent = event.key.toLowerCase();
        filledCount += 1;
      }
    }
  });
}

/**
 * Read the 5 letters currently typed into the active row.
 */
function getCurrentGuess() {
  let guess = '';
  for (let i = 0; i < 5; i++) {
    guess += innerRow.children[i].textContent || '';
  }
  return guess.toLowerCase();
}

/**
 * Validate and score the current row, then advance the game state.
 */
function submitGuess() {
  const guess = getCurrentGuess();

  // guard: don't let a guess through until 5 letters are typed
  if (guess.length < 5) {
    showMessage('Not enough letters');
    shakeRow();
    return;
  }

  // guard: only accept guesses that are real words from the list
  if (!wordSet.has(guess)) {
    showMessage('Not in word list');
    shakeRow();
    return;
  }

  for (let i = 0; i < 5; i++) checker(i);

  // WIN
  if (guess === secretWord) {
    gameOver = true;
    showMessage('You win!');
    return;
  }

  rowCounter += 1;
  filledCount = 0;

  // LOSS — out of rows
  if (rowCounter > 6) {
    gameOver = true;
    showMessage(`Out of guesses! The word was "${secretWord.toUpperCase()}"`);
  } else {
    innerRow = document.getElementById(`innerRow${rowCounter}`);
  }
}

/**
 * Compare the letter in column `i` against secretArr and color it.
 * Note: like the original version, this does simple per-letter matching
 * and does not special-case repeated letters (e.g. a guess with two
 * "e"s when the secret has only one may over-color as yellow). Fixing
 * that requires tracking remaining letter counts — a good next step.
 */
function checker(i) {
  const cell = innerRow.children[i];
  const val  = cell.textContent;

  if (!val) return;
  if (secretArr[i] === val) {
    cell.style.backgroundColor = 'green';
  } else if (secretArr.includes(val)) {
    cell.style.backgroundColor = 'yellow';
  } else {
    cell.style.backgroundColor = 'gray';
  }
}

/**
 * Show a short toast-style message (invalid guess, win, loss).
 */
function showMessage(text) {
  const msgBox = document.getElementById('message');
  if (!msgBox) return;
  msgBox.textContent = text;
  msgBox.style.opacity = 1;
  clearTimeout(showMessage._timeout);
  showMessage._timeout = setTimeout(() => {
    msgBox.style.opacity = 0;
  }, 2000);
}

/**
 * Small shake animation on the active row for invalid guesses.
 */
function shakeRow() {
  innerRow.classList.add('shake');
  setTimeout(() => innerRow.classList.remove('shake'), 400);
}

// kick everything off!
initWordle();
