# ServiceHub Pro

## Overview

ServiceHub Pro is a comprehensive home service booking platform that connects customers with service workers (plumbers, electricians, cleaners, etc.). The application supports three distinct user roles: Customers who book services, Workers who provide services, and Admins who manage the entire platform. Built as a full-stack TypeScript application, it features a mobile-first responsive design with a desktop admin panel.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight React Router alternative)
- TanStack Query for server state management and data fetching

**UI Framework**
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS v4 for styling with custom design tokens
- Framer Motion for animations and transitions
- Mobile-first responsive design philosophy

**Design System**
- Custom theme configuration with CSS variables
- "Plus Jakarta Sans" as primary font family
- Color palette centered around primary blue (#3B82F6) with neutral grays
- Mobile container layout that mimics native app experience on desktop (rounded corners, border frame)
- Component path aliases (@/components, @shared) for clean imports

**State Management**
- React Context API for authentication state (AuthContext)
- TanStack Query for server state caching and synchronization
- Local component state with React hooks

**Layout Strategy**
- Three distinct layout approaches:
  - **MobileLayout**: Used for Customer and Worker interfaces with bottom navigation and drawer menu
  - **AdminLayout**: Desktop-focused sidebar navigation for admin panel
  - **Conditional routing**: Different route protection based on user role
- Mock status bar and device frame to simulate mobile app on desktop

### Backend Architecture

**Runtime & Framework**
- Node.js with Express.js for HTTP server
- TypeScript with ESNext modules
- HTTP server wrapped with WebSocket support capability

**API Design**
- RESTful API endpoints under `/api` prefix
- Route organization in `server/routes.ts`
- Separation of concerns: routes → storage layer → database

**Development vs Production**
- Development: Vite middleware for HMR and SSR
- Production: Pre-built static assets served from dist/public
- Build script bundles server code with esbuild (allowlisted dependencies included, others external)

**Storage Layer Pattern**
- Abstract storage interface (IStorage) in `server/storage.ts`
- All database operations go through storage methods
- Clean separation between business logic and data access
- Supports CRUD operations for: Users, Customer Details, Worker Details, Services, Bookings, Notifications

**Session & Authentication**
- Phone-based authentication flow
- OTP verification (currently mocked in frontend)
- Role-based access control (ADMIN, WORKER, CUSTOMER)
- Express sessions (connect-pg-simple for PostgreSQL session store)

### Database Schema

**ORM & Migration**
- Drizzle ORM for type-safe database queries
- Drizzle-Kit for schema migrations
- PostgreSQL dialect with SSL support for Supabase

**Core Tables**
1. **users**: Central user table with role field (ADMIN/WORKER/CUSTOMER), phone authentication, profile data
2. **customerDetails**: Extended customer info (addresses)
3. **workerDetails**: Worker profiles with category, experience, KYC status, ratings, availability
4. **services**: Service catalog with categories, pricing, packages
5. **bookings**: Service bookings with status tracking, scheduling, pricing
6. **notifications**: User notification system

**Schema Organization**
- Shared schema definitions in `shared/schema.ts`
- Zod schemas generated from Drizzle tables for validation (drizzle-zod)
- Type inference for Insert and Select operations

**Key Design Decisions**
- Single users table with role discriminator (simpler than separate tables)
- Related details in separate tables (customerDetails, workerDetails) for role-specific data
- Timestamps for audit trails (createdAt, updatedAt)
- Text-based enums for status fields (flexibility over rigid constraints)

### External Dependencies

**Database**
- PostgreSQL (Replit-provisioned or Supabase)
- Connection via `DATABASE_URL` or `SUPABASE_DB_URL` environment variable
- SSL required for Supabase connections

**Supabase Integration**
- Supabase client initialized in `server/lib/supabase.ts`
- Used for authentication and file storage capabilities
- Environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_DB_URL`

**UI Component Library**
- Radix UI primitives (@radix-ui/*) for accessible components
- Lucide React for icons
- CMDK for command palette functionality

**Form Handling**
- React Hook Form for form state management
- Zod for schema validation
- @hookform/resolvers for Zod integration

**Utilities**
- class-variance-authority (CVA) for component variant styling
- clsx + tailwind-merge for className composition
- date-fns for date manipulation
- nanoid for unique ID generation

**Development Tools**
- Replit-specific plugins (vite-plugin-cartographer, vite-plugin-dev-banner, vite-plugin-runtime-error-modal)
- Custom meta-images plugin for OpenGraph image URL management on Replit deployments

**Planned Integrations** (Present in dependencies but not yet implemented)
- Stripe for payment processing
- Nodemailer for email notifications
- OpenAI/Google Generative AI for chatbot features
- WebSocket (ws) for real-time updates

**Build & Deployment**
- ESBuild for server bundling with selective dependency bundling
- Vite for client asset bundling
- Environment-aware configuration (NODE_ENV)