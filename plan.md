Viewed Senior_React_Developer_Test_Task.md:1-354
Listed directory Assesment
Ran command: `node -v; npm -v; git --version`
Ran command: `git status`

Here is a comprehensive, production-grade implementation plan designed specifically to maximize your chances of selection for the Senior React Developer role.

---

# 🎯 Strategic Analysis: What the Evaluators Are Looking For

The evaluation rubric emphasizes **engineering judgment, architectural clarity, and production readiness** over superficial flashiness. Specifically, the reviewers are looking for:

1. **Senior Engineering Architecture:** Clean separation of concerns (API layer, domain models, caching, UI components, URL state).
2. **Edge Case & Reliability Mastery:**
   - **The GitHub User Search Pitfall:** `GET /search/users` in GitHub's REST API **does not** return `followers`, `following`, `public_repos`, or `location`—it only returns shallow items (`login`, `avatar_url`, `id`, `html_url`). An inexperienced developer leaves these blank; a senior developer implements a **progressive enrichment pipeline** using `GET /users/{username}` with caching and skeleton placeholders.
   - **GitHub Rate Limiting (60 req/hr unauthenticated):** Parsing `x-ratelimit-remaining` and `x-ratelimit-reset` response headers, presenting a live rate-limit indicator, and providing an optional personal access token (PAT) input in settings so reviewers never hit a wall while testing.
   - **Race Conditions & Request Cancellation:** Rapid typing triggers multiple inflight requests. Stale requests must be cancelled via `AbortController` and TanStack Query query keys so older responses never overwrite newer ones.
3. **URL as the Single Source of Truth:** Query, active tab (`repos` | `users`), page number, sort, and selected repository must synchronize with browser URL search parameters (`?q=...&type=repos&page=1`), enabling browser back/forward history and shareable URLs.
4. **First-Class Documentation & AI Disclosure:** A README with the required **5 Architectural Decisions** formatted exactly as requested (`Decision`, `Alternatives considered`, `Why I chose this`, `Trade-off`) plus the required **AI Usage Disclosure**.
5. **Automated Testing:** Vitest + React Testing Library covering custom hooks, debounce logic, rate-limit parsing, and core component states.

---

# 🏛️ Architecture & Technology Stack

| Layer | Technology Choice | Architectural Justification |
| :--- | :--- | :--- |
| **Framework & Build** | **React 19/18 + TypeScript + Vite** | Ultra-fast HMR, strict type safety, zero configuration overhead. |
| **Server State & Caching** | **TanStack Query v5 (@tanstack/react-query)** | Industry-standard server state: automatic deduplication, stale-while-revalidate, built-in `AbortSignal` cancellation, and exponential backoff retry. |
| **Client & Navigation State**| **React Router v6/7** | Handles URL query params (`useSearchParams`) for shareable, bookmarkable search states and modal/detail route navigation. |
| **Styling & Design System** | **CSS Modules + CSS Custom Properties** | Zero-runtime dependency, scoped styling, complete theme token system (dark/light mode, typography, glassmorphism, responsive grid), meets strict criteria without bloated utility overhead. |
| **Icons** | **Lucide React** | Lightweight, tree-shakeable SVG icons for GitHub stars, forks, issues, search, and status badges. |
| **Testing** | **Vitest + React Testing Library + MSW (or Vitest fetch mock)** | Fast unit and integration tests for hooks, error states, and UI flows. |

---

# 📁 Proposed Project Structure (Feature-Driven)

```text
src/
├── api/                       # Centralized GitHub API client & endpoints
│   ├── githubClient.ts        # Fetch wrapper with AbortSignal, rate-limit header parser & error normalization
│   ├── githubEndpoints.ts     # Search repos, search users, get user detail, get repo detail, get issues
│   └── types/                 # Strongly typed GitHub DTOs & Domain interfaces
├── assets/                    # Static assets, branding, svgs
├── components/                # Shared, domain-agnostic UI primitives
│   ├── ui/
│   │   ├── Badge/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── EmptyState/
│   │   ├── ErrorAlert/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Pagination/
│   │   ├── Skeleton/
│   │   └── Tabs/
│   └── feedback/              # RateLimitBanner, OfflineBanner
├── features/                  # Domain-driven feature modules
│   ├── search/                # Search bar, filters, tab switcher, debounce hook
│   ├── repositories/          # Repo card list, repo detail modal/drawer, issue list
│   └── users/                 # User card list, user enrichment hook, profile details
├── hooks/                     # Generic custom hooks (useDebounce, useUrlParams, useLocalStorage)
├── styles/                    # Design tokens, variables, typography, reset
│   ├── tokens.css
│   └── global.css
├── utils/                     # Formatting (numbers, relative dates, rate-limit timer)
│   ├── dateUtils.ts
│   ├── formatters.ts
│   └── errorUtils.ts
├── App.tsx                    # Root layout, router setup, query provider
└── main.tsx                   # Entry point
```

---

# 🚀 Sprint-by-Sprint Execution Roadmap

### **Sprint 1: Tooling, Strict Typing & Core Design System**
- Initialize modern Vite + React + TypeScript project with strict TypeScript settings (`noImplicitAny`, strict null checks).
- Establish CSS design tokens in `tokens.css` (accessible palette, dark/light theme, typography, spacing, elevations).
- Build reusable UI primitives: `Button`, `Input`, `Card`, `Badge`, `Tabs`, `Skeleton`, `Pagination`, and `Modal`.
- Verify responsive layout grid and mobile breakpoints.

### **Sprint 2: GitHub API Service Layer, Rate-Limiting & Domain Models**
- Implement `githubClient.ts` with custom `HttpError` classes (distinguishing 403 Rate Limit, 404 Not Found, 422 Invalid Query, Network Failure).
- Parse and expose GitHub rate limit headers (`x-ratelimit-remaining`, `x-ratelimit-reset`, `x-ratelimit-limit`) into a reactive rate-limit store/context.
- Add optional support for a user-provided GitHub Personal Access Token (stored securely in `localStorage`) to bypass the 60 req/hr IP limit.
- Model complete TypeScript interfaces for GitHub Repositories, Users, User Details, and Issues.

### **Sprint 3: High-Performance Search Engine (Repos & Users)**
- Implement `useDebounce` hook (350–400ms) to eliminate redundant API calls during fast typing.
- Connect search state and tab selection (`repositories` vs `users`) directly to URL search params (`?q=...&type=repos&page=1`).
- Configure TanStack Query with automatic request cancellation via `AbortSignal` (explicitly preventing race conditions).
- Build the **Repository Results View**: Name, owner avatar, description, primary language, stars, forks, open issues, updated date, and GitHub link.
- Build the **User Results View** with **progressive detail enrichment**: As shallow users stream in from `/search/users`, enrich each card with full metrics (`followers`, `following`, `public_repos`, `location`) using cached detail queries and skeleton states.
- Implement robust pagination with item counts, page buttons, and edge-boundary handling.

### **Sprint 4: Deep-Dive Repository Details & Issues Explorer**
- Build interactive Repository Detail View (accessible via clean modal or dedicated URL route `/repo/:owner/:repo`):
  - Full repo metadata: Watchers, open issues count, default branch, created/updated dates, language distribution.
- Implement Recent Issues viewer (`GET /repos/{owner}/{repo}/issues`):
  - Issue number, state (Open/Closed badge), author avatar & login, created/updated date, and direct GitHub link.
  - Proper empty state for repositories with 0 open issues.

### **Sprint 5: UX Polish, Error Resilience & Accessibility**
- Implement **Zero-Flicker Loading Skeletons** for repo cards, user cards, and issue tables.
- Build resilient Error States:
  - Rate-limit countdown banner with live reset timer and "Add Token" option.
  - Network disconnection banner (`window.addEventListener('offline')`).
  - Retry mechanism with exponential backoff on transient errors.
- Ensure full keyboard accessibility: ARIA tab roles, focus management on modal open/close, focus indicators, escape key listeners.

### **Sprint 6: Automated Testing & Gold-Standard README**
- Write unit and integration tests with **Vitest + React Testing Library**:
  - Test `useDebounce` hook.
  - Test `githubClient` rate-limit extraction and error classification.
  - Test Search form interactions, query triggering, and pagination.
  - Test Empty and Error state rendering.
- Author an executive **README.md** meeting all section 8 & 10 requirements:
  - Project Overview & Architecture diagram.
  - Setup instructions (`npm install`, `npm run dev`, `npm test`).
  - **The 5 Required Decisions** formatted with:
    1. *Server State Architecture (TanStack Query vs Redux/Context)*
    2. *URL-Driven Search & Filter State vs Local State*
    3. *User Search Enrichment Strategy (Handling GitHub's Shallow Search Response)*
    4. *Race Condition & Inflight Request Cancellation Strategy*
    5. *Rate-Limit Resilience & Token Injection Strategy*
  - Comprehensive **AI Usage Disclosure** (tools used, decisions made by developer, prompt iterations, rejected AI suggestions).

