# Chosen Arrows Foundation

A crowdfunding and community platform built with Next.js 16, Supabase, and Tailwind CSS.

**Repository**: [github.com/chosenarrowsfoundation-cpu/Chosen-Arrows-Foundation](https://github.com/chosenarrowsfoundation-cpu/Chosen-Arrows-Foundation)

## Quick Start

```bash
# Install dependencies
bun install

# Copy environment template and configure
cp env.example .env.local

# Start development server
bun run dev
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── actions/            # Server actions
│   ├── admin/              # Admin dashboard pages
│   ├── campaigns/          # Campaign pages
│   └── proxy.ts            # Next.js 16 proxy (auth routing)
├── components/             # Admin-specific components
├── docs/                   # Project documentation
│   ├── ARCHITECTURE_SPEC.md
│   ├── SETUP_GUIDE.md
│   ├── QUICK_START.md
│   └── ...
├── lib/                    # Shared utilities
├── public/                 # Static assets
├── scripts/                # Utility scripts
├── src/                    # Source code
│   ├── components/         # UI components
│   ├── hooks/              # React hooks
│   ├── i18n/               # Internationalization
│   └── lib/                # Client utilities
└── supabase/               # Database migrations
```

## Documentation

All detailed documentation is in the `docs/` folder:

- **[QUICK_START.md](docs/QUICK_START.md)** - Get started quickly
- **[SETUP_GUIDE.md](docs/SETUP_GUIDE.md)** - Detailed setup instructions
- **[ARCHITECTURE_SPEC.md](docs/ARCHITECTURE_SPEC.md)** - System architecture
- **[ADMIN_DASHBOARD_SPEC.md](docs/ADMIN_DASHBOARD_SPEC.md)** - Admin features
- **[SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)** - Database configuration

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Language**: TypeScript
- **Package Manager**: Bun

## Scripts

```bash
bun run dev              # Start development server
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # Run ESLint
bun run verify-setup     # Verify project setup
bun run verify-supabase  # Verify Supabase connection
```
