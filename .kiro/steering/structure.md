# Project Structure

## Root Level
- `src/`: Main source code directory
- `assets/`: Static assets (icons, images)
- `example.keys.json`: Template for store publishing keys
- Standard config files: `package.json`, `tsconfig.json`, `tailwind.config.js`

## Source Organization (`src/`)

### Core Files
- `content.tsx`: Content script for web page injection
- `style.css`: Global Tailwind CSS styles with custom overrides

### Directory Structure
- `popup/`: Extension popup interface components
  - `index.tsx`: Main popup entry point
  - `home.tsx`, `bookmark.tsx`, `export.tsx`, `finish.tsx`: Step-based UI flow
- `components/`: Reusable React components
  - `ui/`: UI component library
  - `bookmark-tree.tsx`: Bookmark visualization component
  - `icons.tsx`: Icon components
  - `main-footer.tsx`: Footer component
- `context/`: React context providers (`app-context.tsx`)
- `hooks/`: Custom React hooks for reusable logic
- `lib/`: Utility libraries (`utils.tsx`)
- `types/`: TypeScript type definitions (`bookmarks.ts`)
- `utils/`: Helper functions and utilities
  - `bookmark/`: Bookmark-specific utilities
  - Core utility files for tree operations and API wrappers

## Import Path Conventions
- Use `@/*` alias for src imports (configured in tsconfig.json)
- Follow Prettier import order: built-ins → third-party → Plasmo → local
- Plasmo-specific imports use `~` prefix for data and assets

## File Naming
- React components: PascalCase (`BookmarkTree.tsx`)
- Utilities and hooks: kebab-case (`use-recursive-progress.tsx`)
- Types: lowercase with extensions (`.ts` for types, `.tsx` for components)