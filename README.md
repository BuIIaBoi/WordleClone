# Wordle Clone

A browser-based clone of Wordle, built with vanilla JavaScript, HTML, and CSS — no frameworks or build tools required.

## How to Play

Guess the secret 5-letter word in 6 tries. After each guess, each letter is colored to show how close you were:

- 🟩 **Green** — correct letter, correct position
- 🟨 **Yellow** — correct letter, wrong position
- ⬜ **Gray** — letter not in the word

Type letters on your keyboard, `Backspace` to delete, and `Enter` to submit a guess. Guesses are checked against a list of ~2,300 valid 5-letter words — invalid or incomplete guesses will shake the row and show a message instead of being accepted.

## Running Locally

The game loads its word list (`wordle-La.txt`) with `fetch()`, which browsers block when a page is opened directly from disk (`file://`). You need to serve the folder over `http://` instead:

**Option 1 — VS Code:** install the "Live Server" extension, then right-click `index.html` → "Open with Live Server."

**Option 2 — Python:**
```
python -m http.server
```
then open `http://localhost:8000` in your browser.

**Option 3 — Node:**
```
npx serve
```

## Project Structure

| File | Purpose |
|---|---|
| `index.html` | Page markup — the 6×5 letter grid and message banner |
| `style.css` | Layout, grid styling, and the invalid-guess shake animation |
| `blabla.js` | Game logic — word loading, input handling, guess validation, scoring, win/loss detection |
| `wordle-La.txt` | List of valid 5-letter words, used both to pick the secret word and to validate guesses |

## Features

- Random secret word selected from a real word list each game
- Full keyboard input handling (letters, backspace, enter)
- Guess validation against the word list, with shake + toast feedback for invalid entries
- Win/loss detection, with the answer revealed if you run out of guesses

## Known Limitations

- **Repeated letters aren't handled precisely.** If the secret word has one occurrence of a letter but your guess has two, both may be marked yellow when only one should be. Correct handling requires tracking remaining letter counts per guess rather than a simple per-letter comparison — a good next improvement.
- No on-screen keyboard — physical keyboard input only.
- No daily-word mode or answer persistence between sessions; a new random word is chosen each time the page loads.

## Built With

- HTML
- CSS
- JavaScript (vanilla, no frameworks)
