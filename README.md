# 💰 Expense Tracker

A modern, minimal personal expense tracker with beautiful visualizations. Track your expenses, view statistics, and analyze your spending patterns with an intuitive interface.

**Made with ❤️ by Sushil RK**

![Expense Tracker Screenshot](./screenshot.png)

## ✨ Features

- **Add Expenses**: Track expenses with amount, category, date, and description
- **Multi-Currency Support**: INR (₹), USD ($), EUR (€), GBP (£) - with INR as default
- **Three Visualizations**:
  - 🥧 Pie Chart: Category-wise expense breakdown
  - 📈 Line Graph: 30-day spending trends
  - 📋 Statistics: Detailed metrics and insights
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on all devices
- **Local Storage**: Data persists between sessions
- **Modern UI/UX**: Clean, minimal design with smooth animations
- **Attractive Footer**: Beautiful footer featuring:
  - "Made with love by Sushil RK" with animated underline
  - GitHub link button with icon to https://github.com/sushil3050-ctrl
  - "Star the repository" call-to-action
  - Gradient button with hover effects
- **Progressive Web App (PWA)**: Install as an app on any device
- **Offline Support**: Works without internet connection
  - Service Worker for caching
  - Offline fallback page
  - Automatic sync when back online
  - All features work offline

## 🚀 Quick Start

### Local Development

Simply open `index.html` in your browser:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

### 📱 Install as PWA

Expense Tracker is a Progressive Web App (PWA) that can be installed on your device:

**On Mobile (iOS/Android):**
1. Open the app in your browser
2. Tap the share/menu button
3. Select "Add to Home Screen"
4. The app will install like a native app

**On Desktop (Chrome/Edge):**
1. Open the app in your browser
2. Look for the install icon (➕) in the address bar
3. Click "Install"
4. The app will open in its own window

**Benefits of PWA:**
- Works offline without internet
- Fast loading with caching
- Native app-like experience
- No app store required
- Automatic updates

## 📦 Deployment

### Option 1: Netlify (Recommended)

1. **Drag & Drop**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the project folder
   - Done! Your site is live

2. **Git Deployment**:
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   netlify deploy --prod --dir=.
   ```

### Option 2: Vercel (Recommended for this project)

This project includes a `vercel.json` configuration file for optimal deployment.

**Method 1 - Vercel CLI:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Or deploy directly to production
vercel --prod
```

**Method 2 - Git Integration:**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect the configuration
6. Click "Deploy"
7. Your site will be live instantly with a `.vercel.app` domain

**Features enabled by vercel.json:**
- ✅ Optimized caching for CSS and JS files
- ✅ Proper cache headers for performance
- ✅ SPA routing support
- ✅ Automatic compression

### Option 3: GitHub Pages

1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select source: Deploy from a branch
4. Select branch: main / root
5. Your site will be live at `https://username.github.io/repo-name`

### Option 4: Surge.sh

```bash
# Install Surge
npm install -g surge

# Deploy
surge
```

### Option 5: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

### Option 6: Traditional Web Hosting

Upload these files to your web server:
- `index.html`
- `style.css`
- `script.js`

If using Apache, the included `.htaccess` file will handle caching and compression.

## 📁 File Structure

```
expense-tracker/
├── index.html          # Main HTML file
├── style.css           # All styles
├── script.js           # All JavaScript functionality
├── sw.js              # Service Worker for offline support
├── manifest.json      # PWA manifest
├── offline.html       # Offline fallback page
├── vercel.json        # Vercel deployment configuration
├── .htaccess          # Apache configuration (optional)
├── netlify.toml       # Netlify configuration (optional)
└── README.md          # This file
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables
- **JavaScript (ES6+)** - All functionality
- **Chart.js** - Beautiful charts and visualizations
- **LocalStorage API** - Data persistence

## 🔧 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📝 Data Storage

All data is stored locally in your browser using LocalStorage. Your expense data:
- ✅ Stays on your device
- ✅ Works offline
- ✅ Persists between sessions
- ❌ Not synced across devices
- ❌ Will be lost if you clear browser data

## 🎨 Customization

### Change Default Currency

Edit `script.js` line 4:
```javascript
let currentCurrency = localStorage.getItem('currency') || 'INR'; // Change 'INR' to your preferred currency
```

### Add More Categories

Edit `script.js` lines 6-13:
```javascript
const categoryColors = {
    food: '#f59e0b', 
    transport: '#3b82f6',
    // Add your custom categories here
};
```

### Customize Colors

Edit CSS variables in `style.css` lines 7-23:
```css
:root {
    --accent-color: #3b82f6;  /* Change to your brand color */
    /* ... other variables */
}
```

## 🔒 Privacy

This is a fully client-side application:
- No data is sent to any server
- No tracking or analytics
- No cookies (except LocalStorage)
- Your financial data stays private

## 📱 PWA Support

To convert to a Progressive Web App (PWA):

1. Create `manifest.json`:
```json
{
  "name": "Expense Tracker",
  "short_name": "Expenses",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#f8fafc",
  "theme_color": "#3b82f6"
}
```

2. Add to `index.html` head:
```html
<link rel="manifest" href="manifest.json">
```

3. Create a service worker (optional for offline support)

## 🤝 Contributing

Feel free to fork and customize for your needs!

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 💡 Tips

- Use browser bookmarks for quick access
- Pin the tab for daily expense tracking
- Export data regularly (copy from LocalStorage in browser dev tools)
- Use mobile browser "Add to Home Screen" for app-like experience

---

Built with ❤️ using vanilla HTML, CSS, and JavaScript
