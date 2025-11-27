# CLAUDE.md - AI Assistant Guide for Memory Card Game

## Project Overview

This is a **Memory Card Game** built with vanilla HTML, CSS, and JavaScript. It's a simple, static web application with no build process, frameworks, or external dependencies.

**Live Demo**: https://aungphone-mm.github.io/memory-card-game/

### Project Goals
- Provide an interactive memory matching game
- Demonstrate clean, vanilla JavaScript without frameworks
- Maintain simplicity with minimal dependencies
- Deploy as a static site on GitHub Pages

## Repository Structure

```
memory-card-game/
├── index.html          # Main HTML structure
├── script.js           # Game logic and interactivity
├── style.css           # Styling and animations
├── README.md           # User-facing documentation
└── CLAUDE.md           # This file - AI assistant guide
```

### File Purposes

**index.html** (28 lines)
- Semantic HTML5 structure
- Single page application layout
- Contains game board container, score displays, and reset button
- Links to external CSS and JS files

**script.js** (104 lines)
- Core game logic and state management
- Event handlers for card interactions
- No external libraries - pure vanilla JavaScript
- Uses modern ES6+ syntax

**style.css** (142 lines)
- Responsive grid layout for card board
- CSS3 animations for card flips
- Purple gradient theme (#667eea to #764ba2)
- Mobile-responsive design with media queries

## Code Conventions & Patterns

### JavaScript Conventions

1. **Variable Naming**
   - Use camelCase for variables and functions
   - Use descriptive names (e.g., `flippedCards`, `matchedPairs`)
   - Constants for initial values (e.g., `cardSymbols`)

2. **DOM Manipulation**
   - Cache DOM elements at the top of script.js
   - Use `getElementById` for single elements
   - Use `querySelector`/`querySelectorAll` sparingly
   - Prefer `classList` methods over direct className manipulation

3. **State Management**
   - Global state variables declared at the top
   - State variables: `cards`, `flippedCards`, `matchedPairs`, `moves`, `canFlip`
   - Use `canFlip` flag to prevent race conditions during card flipping

4. **Function Organization**
   - Pure functions where possible
   - Functions ordered by logical flow: init → render → interaction → state update
   - No function longer than 30 lines

5. **Event Handling**
   - Event listeners attached during render
   - Use arrow functions for inline handlers
   - Guard clauses at function start for early returns

### CSS Conventions

1. **Styling Approach**
   - Mobile-first responsive design
   - Use flexbox for layout alignment
   - Use CSS Grid for card board (4x4 grid)
   - No CSS frameworks or preprocessors

2. **Class Naming**
   - Use lowercase with hyphens (e.g., `game-board`, `card-front`)
   - State classes: `.flipped`, `.matched`
   - Semantic, descriptive names

3. **Color Palette**
   - Primary gradient: #667eea → #764ba2 (purple)
   - Accent color: #ff6b6b (red for reset button)
   - White backgrounds for cards and score displays
   - Consistent use throughout

4. **Animations**
   - CSS transitions for smooth interactions
   - Transform-based animations (translateY, rotateY, scale)
   - 3D card flip using `transform-style: preserve-3d`
   - Timing: 0.3s for buttons, 0.6s for card flips

### HTML Conventions

1. **Structure**
   - Semantic HTML5 elements where appropriate
   - Single container for all game elements
   - ID selectors for unique elements (`game-board`, `moves`, `matches`)
   - Minimal inline styles or scripts

2. **Accessibility**
   - Lang attribute on html element
   - Viewport meta tag for mobile
   - Semantic button elements for interactivity

## Game Architecture

### Game Flow

1. **Initialization** (`initGame()`)
   - Duplicate card symbols array to create pairs
   - Shuffle cards using Fisher-Yates algorithm
   - Render cards to DOM
   - Reset counters and state

2. **Card Interaction** (`flipCard()`)
   - Guard against invalid flips (already flipped, matched, or disabled)
   - Add flipped class for CSS animation
   - Store in `flippedCards` array
   - Check for match when 2 cards flipped

3. **Match Detection** (`checkMatch()`)
   - Disable further flipping during check
   - Compare card symbols via data attributes
   - **Match**: Add `.matched` class after 500ms delay
   - **No Match**: Remove `.flipped` class after 1000ms delay
   - Re-enable flipping after animation completes

4. **Win Condition**
   - Check if all pairs matched (`matchedPairs === cardSymbols.length`)
   - Show alert with final move count
   - 500ms delay before alert for UX

### Key Design Decisions

1. **No Framework**: Pure vanilla JS keeps the bundle size minimal and reduces complexity
2. **Data Attributes**: Use `data-index` and `data-symbol` for card identification
3. **CSS-Only Animations**: No JS animation libraries needed
4. **Timing Delays**: Strategic `setTimeout` calls for better UX (prevents jarring instant changes)
5. **canFlip Flag**: Prevents rapid clicking and race conditions

## Development Workflow

### Git Workflow

1. **Branching Strategy**
   - Feature branches use `claude/` prefix followed by session ID
   - Format: `claude/claude-md-{session-id}`
   - Always develop on designated feature branch
   - Never push directly to main unless explicitly requested

2. **Commit Messages**
   - Use imperative mood ("Add feature" not "Added feature")
   - Be descriptive but concise
   - Examples from history:
     - "Add README with live demo link and project documentation"
     - "Add memory card game website with flip animations and score tracking"

3. **Push Protocol**
   - Always use: `git push -u origin <branch-name>`
   - Branch must start with `claude/` and match session ID
   - Retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s) on network failures
   - Push will fail with 403 if branch name doesn't match requirements

### Testing Approach

Since this is a simple static site:
- Manual testing in browser (Chrome, Firefox, Safari, Mobile)
- Test card flip animations
- Verify match/no-match logic
- Check responsive behavior at different screen sizes
- Ensure move counter accuracy
- Test reset functionality

### Deployment

- **Platform**: GitHub Pages
- **Deployment**: Automatic from main branch
- **URL**: https://aungphone-mm.github.io/memory-card-game/
- **Process**: Push to main → GitHub Pages rebuilds automatically

## Making Changes: Guidelines for AI Assistants

### Before Making Changes

1. **Read First**: Always read files before modifying them
2. **Understand Context**: Review related files to understand dependencies
3. **Check Existing Patterns**: Follow established conventions in the codebase
4. **Minimal Changes**: Make only the changes explicitly requested

### Common Tasks

#### Adding New Features

1. Determine which file(s) need modification:
   - Game logic → `script.js`
   - Visual styling → `style.css`
   - Structure/layout → `index.html`

2. Follow existing patterns:
   - Add state variables at top of script.js if needed
   - Add functions in logical order
   - Update UI elements in `updateScore()` or similar

3. Test thoroughly:
   - Verify no regressions in existing functionality
   - Check responsive design still works
   - Ensure animations remain smooth

#### Modifying Styling

1. Maintain the purple gradient theme unless explicitly asked to change
2. Keep mobile responsiveness (check media queries)
3. Use existing CSS custom properties pattern if adding more
4. Test hover states and transitions
5. Ensure accessibility (contrast, focus states)

#### Debugging Issues

1. Check browser console for errors
2. Verify event listeners are properly attached
3. Check state management (canFlip, flippedCards array)
4. Review timing issues with setTimeout delays
5. Test edge cases (rapid clicking, double-clicking same card)

### Code Quality Standards

1. **No Unnecessary Complexity**: Keep it simple, this is a learning/demo project
2. **No Dependencies**: Don't add npm packages or frameworks without explicit request
3. **Vanilla JS Only**: No jQuery, React, or other libraries
4. **Cross-Browser Compatible**: Use widely-supported CSS and JS features
5. **Readable Code**: Prefer clarity over cleverness

### Anti-Patterns to Avoid

❌ Don't add TypeScript or build tools
❌ Don't introduce frameworks (React, Vue, etc.)
❌ Don't add unnecessary abstractions
❌ Don't create separate modules/files without reason
❌ Don't change the color scheme without request
❌ Don't add dependencies or package.json
❌ Don't over-engineer simple features

### Preferred Patterns

✅ Keep everything in single files (HTML, CSS, JS)
✅ Use modern ES6+ syntax (arrow functions, destructuring, etc.)
✅ Use CSS Grid and Flexbox for layouts
✅ Add comments for complex logic only
✅ Maintain existing code style and formatting
✅ Test manually in browser before committing

## Current State Analysis

### Strengths
- Clean, readable code
- No dependencies or build complexity
- Smooth animations and good UX
- Fully responsive design
- Working game logic with proper state management

### Potential Improvements (If Requested)
- Add sound effects for card flips and matches
- Add difficulty levels (more/fewer cards)
- Add timer for speed challenges
- Add high score persistence (localStorage)
- Add keyboard navigation support
- Add better win celebration (confetti animation)
- Add theme customization

## Quick Reference

### File Locations
- Main logic: `script.js:1-104`
- Card flip handler: `script.js:49-63`
- Match checking: `script.js:65-94`
- Initialization: `script.js:13-22`
- Card grid layout: `style.css:68-74`
- Card flip animation: `style.css:91-93`
- Mobile responsive: `style.css:128-141`

### Key Variables
- `cardSymbols`: Array of 8 emoji symbols (script.js:6)
- `flippedCards`: Currently flipped cards array (script.js:8)
- `matchedPairs`: Count of matched pairs (script.js:9)
- `moves`: Total move counter (script.js:10)
- `canFlip`: Boolean flag to prevent invalid flips (script.js:11)

### Key Functions
- `initGame()`: Initialize/reset game state
- `shuffleCards()`: Fisher-Yates shuffle algorithm
- `renderCards()`: Create DOM elements for all cards
- `flipCard(card)`: Handle card click interaction
- `checkMatch()`: Compare two flipped cards
- `updateScore()`: Update move and match displays

## Version History

- **Initial Version**: Basic memory card game with 16 cards (8 pairs)
- **Current Version**: Added README documentation and GitHub Pages deployment

---

**Last Updated**: 2025-11-27
**Repository**: https://github.com/aungphone-mm/memory-card-game
**Maintained By**: aungphone-mm
