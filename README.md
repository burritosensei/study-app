# Study App

A flashcard study app built with vanilla HTML, CSS, and JavaScript. No frameworks, no build step — just open `index.html` in a browser.

All data is saved to localStorage.

## Study Modes

- **Learn** — 3-block study: flashcards, multiple choice, then written response. Cards progress through New > Learning > Proficient > Mastered.
- **Quiz** — Type answers with fuzzy matching (tolerates typos).
- **Quick Check** — Fast diagnostic that goes through every card with multiple choice. Promotes New cards to Proficient without ever demoting.
- **Mastery Review** — Tests Proficient cards with MC + written response (skips flashcards). Clean pass = Mastered. 2 wrong = demoted.
- **Flip** — Classic flashcard flipping with self-rating (Again/Hard/Good/Easy).
- **Focus** — Targets weak cards only. Quiz or flip style.
- **Match** — Memory card game, match fronts to backs.

## Term Status System

| Status | Meaning |
|---|---|
| New | Never studied |
| Learning | Got 3+ wrong in a learn block |
| Proficient | Completed a learn chunk cleanly |
| Mastered | Passed mastery review cleanly |

## Features

- Per-deck special characters (for accented letters)
- Configurable direction: Front>Back, Back>Front, Random
- XP and leveling system
- Streak tracking with visual fire effect
- Deck import/export as JSON
- Bulk card import (tab or semicolon separated)
- Card list filtering by status
- Progress bars with status breakdown
- Animated mastered badge (black/white fire border)
- Celebration effects (confetti, white embers on mastery)
- ADHD-friendly: short feedback loops, progress bars, visual rewards
- All data persisted to localStorage
- Navigation state persisted across page refreshes

## Setup

No install needed. Just open `index.html` in a browser.

```
git clone <repo-url>
cd study-app
open index.html
```

## File Structure

```
index.html   — Shell HTML (loads CSS + JS)
styles.css   — All styling and animations
app.js       — All application logic
```
