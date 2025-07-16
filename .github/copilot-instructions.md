# Copilot Instructions for Flash Cards Application

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a client-side only flash card application built with:
- React 19 with TypeScript
- React Router for navigation
- IndexedDB for offline data storage (using Dexie)
- CSV parsing for importing flash cards (using PapaParse)
- Vite as the build tool

## Architecture Guidelines
- Keep all data operations client-side only
- Use IndexedDB for persistent offline storage
- Implement proper TypeScript interfaces for flash card data
- Follow React 19 best practices and hooks
- Ensure the app works completely offline

## Flash Card Data Structure
Each flash card record should have:
- `id`: unique identifier (string or number)
- `front`: string content for the front of the card
- `back`: string content for the back of the card

## Routes
1. `/` - Flash card display page
2. `/admin` - CSV import and data management page
