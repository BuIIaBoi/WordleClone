// wordle.js
let secretArr = [];      // this will be ['a','p','p','l','e'] etc.
let counter    = 1;
let rowCounter = 1;
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
    // get all non‑empty lines, trim whitespace
    const words = text
      .split('\n')
      .map(w => w.trim())
      .filter(Boolean)
      .filter(w => w.length === 5);      // only 5‑letter words

    // pick a random 5‑letter word
    const secret = words[Math.floor(Math.random() * words.length)];
    secretArr = secret.split('');        // e.g. ['a','p','p','l','e']
    console.log('Secret word:', secret, secretArr);

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
    // BACKSPACE
    if (event.key === 'Backspace') {
      const cell = innerRow.children[counter - 1];
      cell.textContent = '';
      cell.style.backgroundColor = 'white';
      counter = Math.max(1, counter - 1);

    // ENTER
    } else if (event.key === 'Enter') {
      // run your checker on columns 0–4
      for (let i = 0; i < 5; i++) checker(i);

      rowCounter++;
      counter = 1;
      if (rowCounter <= 6) {
        innerRow = document.getElementById(`innerRow${rowCounter}`);
      } else {
        // no more rows → stop listening
        document.removeEventListener('keyup', this);
      }

    // LETTER KEYS
    } else if (/^[a-zA-Z]$/.test(event.key)) {
      const cell = innerRow.children[counter - 1];
      cell.textContent = event.key.toLowerCase();
      counter = Math.min(5, counter + 1);
    }
  });
}

/**
 * Compare the letter in column `i` against secretArr.
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
    cell.style.backgroundColor = 'red';
  }
}

// kick everything off!
initWordle();
