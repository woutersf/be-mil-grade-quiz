# Belgian Military Ranks Quiz

An interactive quiz game to learn Belgian Defence military ranks across all three components: Land, Air, and Marine.

## Features

- **69 Total Ranks** - Complete database of Belgian military ranks
  - 23 Land Component ranks (Army)
  - 23 Air Component ranks (Air Force)
  - 23 Marine Component ranks (Navy)

- **Component Selection** - Choose which components to practice:
  - Land Component only
  - Air Component only
  - Marine Component only
  - Any combination of the above

- **Three Quiz Modes**:
  - 10 questions
  - 20 questions
  - All ranks (random selection based on selected components)

- **Learning Features**:
  - Multiple choice (3 options)
  - Instant feedback after each answer
  - Score tracking
  - Error review at the end
  - Retry with new random questions

## How to Use

### Local Development

1. Open `index.html` in your web browser
2. Select which components you want to practice
3. Choose a quiz mode
4. Identify each rank insignia by selecting the correct name
5. Review your mistakes at the end

### GitHub Pages Deployment

1. Create a new GitHub repository
2. Upload all files to the repository:
   - `index.html`
   - `style.css`
   - `app.js`
   - `ranks-data.js`
3. Go to Settings > Pages
4. Select "Deploy from a branch"
5. Choose `main` branch and `/root` folder
6. Save and wait for deployment
7. Your quiz will be live at: `https://[username].github.io/[repo-name]/`

## Files

- `index.html` - Main HTML structure
- `style.css` - Styling (Bootstrap + custom CSS)
- `app.js` - Game logic
- `ranks-data.js` - All Belgian military ranks data
- `README.md` - This file

## Data Source

All rank insignia images are from Wikimedia Commons and represent official Belgian Defence military ranks.

## Technologies

- Pure HTML5, CSS3, and JavaScript
- Bootstrap 5.3 for UI components
- No build process or dependencies required
- Works offline (except for Bootstrap CDN and insignia images)

## License

Public domain - Free to use, modify, and distribute.
