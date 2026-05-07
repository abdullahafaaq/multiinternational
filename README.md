# Multi International

React + Vite website for Multi International.

## Local development

Requirements:
- Node.js 18+
- npm

Run locally:

```sh
npm install
npm run dev
```

To test shared product/settings saving during local development, run the API server in a second terminal:

```sh
npm run dev:server
```

For production:

```sh
npm run build
npm start
```

The production server hosts the built site and saves shared products, website settings, services, inquiries, and admin password settings in `data/multiinternational.sqlite`.

Before database writes, the server keeps timestamped recovery copies in `data/backups/` and retains the latest 20 backups.

If `data/site-data.json` exists from an older version, the server imports it into SQLite the first time the database is created.

## Available scripts

- `npm run dev` - start development server
- `npm run build` - create production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint
- `npm run test` - run tests once
- `npm run test:watch` - run tests in watch mode

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
