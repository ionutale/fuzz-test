# Agents Instructions

This document provides instructions and guidelines for setting up the development environment and best practices for working on the Agents project.

## NEVER DO
 - NEVER commit
 - NEVER push
 - NEVER PR
 - NEVER merge or rebase
 - NEVER hide errors in the json responses. If an error occurs, propagate it to the http client.
 - never use <form> elements for actions that do not require them. Use fetch instead with REST API best practices.


## Technologies Used
- **SvelteKit**: A framework for building web applications using Svelte.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **DaisyUI**: A plugin for Tailwind CSS that provides pre-designed components.
- **Drizzle ORM**: A TypeScript ORM for SQL databases.
- **Vitest**: A Vite-native unit testing framework.
- **Playwright**: A framework for end-to-end testing.
- **PNPM**: A fast, disk space-efficient package manager.
- **PostgreSQL**: A powerful, open-source relational database system. (version 17)
- **Docker**: A platform for developing, shipping, and running applications in containers.
- **Docker Compose**: A tool for defining and running multi-container Docker applications.
- **asdf**: A version manager for multiple runtime environments.


## Build/test commands

Always use pnpm to run scripts

 - `pnpm dev` - Start development server
 - `pnpm lint` - type aware ox lint
 - `pnpm check`
 - `pnpm test`
 - `pnpm test:watch` - watch mode
 - `vitest run path/to/test.test.ts` Run single test file

When you feel like your done working, always run these checks:

- `pnpm lint` - lint code
- `pnpm check` - type checking
- `pnpm test` - run all tests
- `pnpm format` - format code

### Generate svelte proejct use this script

**important**: if the repo is not empty, add the `--force` flag to the command below.

```

pnpm dlx sv create --template minimal --types ts --add prettier eslint vitest="usages:unit,component" playwright tailwindcss="plugins:typography,forms" sveltekit-adapter="adapter:node" devtools-json drizzle="database:postgresql+postgresql:postgres.js+docker:yes" mcp="ide:vscode,other+setup:remote" --install pnpm . --force

```

## Architecture
- **Frontend** Sveltekit+tailwind+daisyui
- **Backend** Use Sveltekit server routes as api backend. In case a more complex backend is needed, use Go microservices, with grpc communication.
- **Database** Drizzle ORM with postgresql
- **Authentication** Use Sveltekit auth with OAuth providers (github, google, etc), or use Lucia for more complex auth needs.
- **Testing** Vitest for unit and component tests, Playwright for end to end tests.
- **Containerization** Docker and Docker Compose for local development and deployment.
- **PWA** Progressive Web App support using Sveltekit PWA plugin.
- **Favicons** Use realfavicongenerator.net to generate favicons and related files.
- **PWA icons** Use appiconmaker.co to generate app icons for PWA.
- **Help page** Use Sveltekit docs template for help page.
- **Readme** Create a detailed README.md file using templates from readme.so, also add a uml diagram for architecture using diagrams.net.
- **snackbar notifications** Use svelte-french-toast for snackbar notifications.



## Local development setup
 - Install dependencies: `pnpm install`
 - Setup environment variables: copy `.env.example` to `.env` and fill in the required values.
 - Setup database: Make sure you have a local postgresql database running. Update the `DATABASE_URL` in `.env` accordingly.
 - Run database migrations: `pnpm drizzle-kit migrate:up`
 - Start development server: `pnpm dev`

  
  ## instructions
  - always log the errors to console, never hide them. specifically the ones in the catch blocks.
  - always propagate the errors to the http client, never return a success response when an error occurs.

## Daisy configuration

`pnpm i daisyui@latest`

src/app.css or src/routes/layout.css
```css
@tailwind base;
@plugin "daisyui";


@plugin "daisyui/theme" {
  name: "light";
  default: true;
  prefersdark: false;
  color-scheme: "light";
  --color-base-100: oklch(100% 0 0);
  --color-base-200: oklch(98% 0 0);
  --color-base-300: oklch(95% 0 0);
  --color-base-content: oklch(21% 0.006 285.885);
  --color-primary: oklch(45% 0.24 277.023);
  --color-primary-content: oklch(93% 0.034 272.788);
  --color-secondary: oklch(65% 0.241 354.308);
  --color-secondary-content: oklch(94% 0.028 342.258);
  --color-accent: oklch(77% 0.152 181.912);
  --color-accent-content: oklch(38% 0.063 188.416);
  --color-neutral: oklch(14% 0.005 285.823);
  --color-neutral-content: oklch(92% 0.004 286.32);
  --color-info: oklch(74% 0.16 232.661);
  --color-info-content: oklch(29% 0.066 243.157);
  --color-success: oklch(76% 0.177 163.223);
  --color-success-content: oklch(37% 0.077 168.94);
  --color-warning: oklch(82% 0.189 84.429);
  --color-warning-content: oklch(41% 0.112 45.904);
  --color-error: oklch(71% 0.194 13.428);
  --color-error-content: oklch(27% 0.105 12.094);
  --radius-selector: 0.5rem;
  --radius-field: 0.5rem;
  --radius-box: 0.5rem;
  --size-selector: 0.25rem;
  --size-field: 0.25rem;
  --border: 1px;
  --depth: 1;
  --noise: 1;
}


@plugin "daisyui/theme" {
  name: "dark";
  default: false;
  prefersdark: false;
  color-scheme: "dark";
  --color-base-100: oklch(25.33% 0.016 252.42);
  --color-base-200: oklch(23.26% 0.014 253.1);
  --color-base-300: oklch(21.15% 0.012 254.09);
  --color-base-content: oklch(97.807% 0.029 256.847);
  --color-primary: oklch(58% 0.233 277.117);
  --color-primary-content: oklch(96% 0.018 272.314);
  --color-secondary: oklch(65% 0.241 354.308);
  --color-secondary-content: oklch(94% 0.028 342.258);
  --color-accent: oklch(77% 0.152 181.912);
  --color-accent-content: oklch(38% 0.063 188.416);
  --color-neutral: oklch(14% 0.005 285.823);
  --color-neutral-content: oklch(92% 0.004 286.32);
  --color-info: oklch(74% 0.16 232.661);
  --color-info-content: oklch(29% 0.066 243.157);
  --color-success: oklch(76% 0.177 163.223);
  --color-success-content: oklch(37% 0.077 168.94);
  --color-warning: oklch(82% 0.189 84.429);
  --color-warning-content: oklch(41% 0.112 45.904);
  --color-error: oklch(71% 0.194 13.428);
  --color-error-content: oklch(27% 0.105 12.094);
  --radius-selector: 0.5rem;
  --radius-field: 0.5rem;
  --radius-box: 0.5rem;
  --size-selector: 0.25rem;
  --size-field: 0.25rem;
  --border: 1px;
  --depth: 1;
  --noise: 0;
}


``` 

## Firebase auth

To set up Firebase authentication in your SvelteKit project, follow these steps:

./src/lib/firebase.ts
```ts
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    import { getAnalytics } from "firebase/analytics";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyDmKrv3-pOLUMeVKXJkpg6IEN0AOQXQ--s",
      authDomain: "playground-428410.firebaseapp.com",
      projectId: "playground-428410",
      storageBucket: "playground-428410.firebasestorage.app",
      messagingSenderId: "277290577442",
      appId: "1:277290577442:web:42c938424097dad5f9247b",
      measurementId: "G-HHGS6GZDW7"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
```

**Note**: Make sure you make use of svelte server hooks to manage authentication state between server and client.


