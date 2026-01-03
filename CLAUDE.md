# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A feature-rich TODO application built with vanilla HTML, CSS, and JavaScript. The app runs entirely in the browser with no build process required.

## How to Run

Simply open `index.html` in a web browser. No build step or server required.

## Architecture

### File Structure

- `index.html` - Main HTML structure with form, filters, and todo list
- `style.css` - Modern, responsive styling with gradient theme
- `app.js` - TodoApp class containing all application logic

### Key Components

**TodoApp Class (`app.js`)**
- Single class managing all app state and behavior
- Uses LocalStorage for data persistence
- Implements filtering (all/active/completed), search, and CRUD operations

**Data Model**
Each todo object contains:
- `id`: Timestamp-based unique identifier
- `text`: Task description
- `completed`: Boolean completion status
- `priority`: 'low', 'medium', or 'high'
- `dueDate`: Optional ISO date string
- `createdAt`: ISO timestamp of creation

## Features

- **CRUD Operations**: Add, delete, and toggle completion status
- **Persistence**: All data saved to LocalStorage automatically
- **Priority Levels**: Visual color-coding (high=red, medium=yellow, low=green)
- **Due Dates**: Optional deadlines with overdue detection
- **Filtering**: View all, active, or completed tasks
- **Search**: Real-time text search across tasks
- **Statistics**: Live counters for total, active, and completed tasks
- **Responsive Design**: Mobile-friendly layout

## Technical Details

- No dependencies or build tools required
- Uses CSS Grid and Flexbox for layout
- Gradient purple theme with smooth transitions
- LocalStorage key: `todos` (JSON array)
- All JavaScript uses ES6+ class syntax
