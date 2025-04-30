# Daily Checklist

A simple, mobile-friendly daily checklist app for tracking medications and routines.

## Features

- Mobile-first design
- Daily reset at 3 AM
- Persistent storage using localStorage
- Organized by time of day
- Clean, modern UI

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Customization

To add your own checklist items, modify the `getItemsForSection` function in `main.js`. Each section (Morning, Breakfast, etc.) can have its own set of items.

## Deployment

The app is automatically deployed to GitHub Pages when changes are pushed to the main branch. 