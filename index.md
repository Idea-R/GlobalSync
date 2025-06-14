# GlobalSync - AI Developer Command Center

## High-Level Overview
A React-based TypeScript application for coordinating AI-assisted development teams across global timezones.

## Project Structure

### Root Files
- `package.json` - Project dependencies and scripts
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration  
- `tsconfig.json` - TypeScript configuration
- `index.html` - Main HTML entry point

### Source Structure (`src/`)
- `App.tsx` - Main application component (204 lines)
- `main.tsx` - Application entry point
- `index.css` - Global styles

### Components (`src/components/`)
- `PersonalTimeHero.tsx` - **⚠️ CRITICAL: 733 lines - REQUIRES IMMEDIATE REFACTORING**
- `TeamGrid.tsx` - Team member grid display (136 lines)
- `AddMemberModal.tsx` - Add team member modal (321 lines)
- `CollaborationPanel.tsx` - Collaboration display (117 lines)
- `HelpModal.tsx` - Help documentation modal (221 lines)
- `MemberCard.tsx` - Individual team member card (265 lines)
- `ScheduleSelector.tsx` - Schedule selection component (290 lines)

### Utilities (`src/utils/`)
- `storage.ts` - Local storage management
- `timezone.ts` - Timezone handling utilities
- `shareString.ts` - Import/export functionality

### Types (`src/types/`)
- Type definitions for the application

### Configuration (`src/config/`)
- Application configuration files

## Critical Issues
1. **PersonalTimeHero.tsx** - 733 lines violates 500-line rule
2. Missing required directory structure (`logs/`, `.cursor/rules/`)
3. Missing AI documentation files (`ai.md`, `_change.logs`)

## Technology Stack
- React 18.3.1
- TypeScript 5.5.3
- Vite 5.4.2
- Tailwind CSS 3.4.1
- Lucide React (icons)

## Theme Support
- Dark/Light theme toggle
- Tactical color scheme

## Core Features
- Global timezone coordination
- Team member management
- Status tracking
- Data import/export
- Profile sharing 