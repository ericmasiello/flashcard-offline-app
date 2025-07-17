# Flash Cards PWA

A **Progressive Web App (PWA)** flash card application built with React 19, TypeScript, and Vite. The app works completely offline using IndexedDB for data storage and can be installed on any device.

## Features

- **💾 Offline Support**: Works completely offline with service worker caching
- **📱 Installable**: Can be installed as a native app on mobile and desktop
- **🔄 Flash Card Display**: Navigate through flash cards with flip animation
- **📊 CSV Import**: Import flash cards via CSV format in the admin panel
- **🔍 Network Status**: Shows online/offline status
- **📲 Install Prompt**: Automatic PWA installation prompt
- **📱 Responsive Design**: Mobile-friendly interface
- **🔒 TypeScript**: Full type safety throughout the application

## Tech Stack

- **React 19** with TypeScript
- **React Router** for navigation
- **Vite** for fast development and building
- **Vite PWA Plugin** for service worker and manifest generation
- **Dexie** for IndexedDB management
- **Papa Parse** for CSV parsing
- **Canvas API** for generating PWA icons

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, including:
- Service worker for offline functionality
- Web app manifest for PWA installation
- Precached assets for offline use

### Generating PWA Icons

```bash
npm run generate-icons
```

This creates optimized PNG icons for the PWA from the vector design.

## PWA Features

### Installation
- **Desktop**: Look for the install button in your browser's address bar
- **Mobile**: Use the "Add to Home Screen" option in your browser menu
- **Automatic Prompt**: The app will show an install prompt when criteria are met

### Offline Functionality
- All app functionality works offline after first visit
- Flash cards are stored locally in IndexedDB
- Service worker caches all assets
- Network status indicator shows online/offline state

### App Manifest
The app includes a comprehensive web app manifest with:
- Custom app icons (192x192, 512x512)
- Standalone display mode
- Theme and background colors
- Proper metadata for app stores

## Usage

### Flash Card Display

- Navigate to the home page (`/`) to view flash cards
- Click on a card to flip between front and back
- Use "Previous" and "Next" buttons to navigate between cards
- If no cards exist, you'll see a prompt to create them via the admin page

### Admin Panel

- Navigate to `/admin` to manage flash cards
- Import flash cards by pasting CSV content in the format:
  ```
  Front text,Back text
  What is the capital of France?,Paris
  What is 2 + 2?,4
  ```
- Click "Import Flash Cards" to add them to the database
- Use "Clear All Cards" to delete all existing flash cards

## CSV Format

The CSV import expects two columns:
1. **Front**: The text to display on the front of the card
2. **Back**: The text to display on the back of the card

Example:
```csv
What is the capital of France?,Paris
What is 2 + 2?,4
How do you say "hello" in Spanish?,Hola
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── FlashCardComponent.tsx
│   └── FlashCardComponent.css
├── pages/              # Page components
│   ├── FlashCardPage.tsx
│   ├── FlashCardPage.css
│   ├── AdminPage.tsx
│   └── AdminPage.css
├── services/           # Data layer
│   └── database.ts     # IndexedDB service
├── App.tsx            # Main app component with routing
└── main.tsx          # Application entry point
```

## Development

This project uses:
- **ESLint** for code linting
- **TypeScript** for type checking
- **Vite** for development server and building

Run type checking:
```bash
npm run tsc
```

Run linting:
```bash
npm run lint
```
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
