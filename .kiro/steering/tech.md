# Technology Stack

## Framework & Build System
- **Plasmo Framework**: Modern Chrome extension development framework
- **TypeScript**: Primary language for type safety
- **React 18.2.0**: UI framework for popup and content scripts
- **pnpm**: Package manager

## UI & Styling
- **Tailwind CSS**: Utility-first CSS framework with custom color scheme
- **Ant Design (antd)**: Component library for complex UI elements
- **Radix UI**: Headless components for accessibility
- **@iconify/react**: Icon system

## Development Tools
- **Prettier**: Code formatting with custom import sorting
- **PostCSS**: CSS processing
- **Chrome Types**: TypeScript definitions for Chrome APIs

## Common Commands
```bash
# Development
pnpm install          # Install dependencies
pnpm dev             # Start development server with hot reload
pnpm build           # Build for production
pnpm package         # Package extension for distribution

# Development Setup
# 1. Load unpacked extension from build/ folder in Chrome
# 2. Rename example.keys.json to keys.json for store publishing
```

## Key Configuration
- Uses Chrome bookmarks permission
- Supports host permissions for web access
- Extends Plasmo's base TypeScript configuration
- Custom Tailwind theme with primary green color (#2D9C6C)