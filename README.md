[![ci-nextjs-application-template](https://github.com/ics-software-engineering/nextjs-application-template/actions/workflows/ci.yml/badge.svg)](https://github.com/ics-software-engineering/nextjs-application-template/actions/workflows/ci.yml)

For details, please see http://ics-software-engineering.github.io/nextjs-application-template/.

**Database & Deployment (Neon + Vercel)**

- **Overview:** To share the same database across devices and deployments, provision a hosted Postgres (we recommend Neon or Supabase), run Prisma migrations against it, and set the `DATABASE_URL` in your deployment environment (Vercel) and/or CI (GitHub Actions).

- **Local setup (quick):** copy `.env.example` -> `.env` and set `DATABASE_URL` to your Neon connection string. Then run:

```powershell
$env:DATABASE_URL = 'postgresql://<your-neon-connection-string>'
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

- **CI / Automatic migrations:** This repo includes a GitHub Actions workflow `.github/workflows/prisma-migrate.yml` which will run `prisma generate`, `prisma migrate deploy`, `prisma db seed`, and `npm run build` on pushes to `main` (also can be triggered manually). To enable it:
	- Add a repository secret named `DATABASE_URL` in your GitHub repository settings with the Neon connection string.
	- Push to `main` or run the workflow from the Actions tab.

- **Vercel:** To make your deployed site use the same Neon DB:
	- Go to your Vercel project -> Settings -> Environment Variables.
	- Add `DATABASE_URL` and paste the Neon connection string for both `Production` and `Preview` (and `Development` if you want previews to use it).
	- In Vercel's **Build & Output Settings** you can set the Build Command to:

```bash
npx prisma migrate deploy && npm run build
```

	This ensures migrations are applied during build. Alternatively, rely on the GitHub Actions workflow to run migrations before Vercel deploys.

- **Notes & best practices:**
	- Don't commit secrets to the repo. Use GitHub Secrets and Vercel Environment Variables.
	- The `build` script already runs `prisma generate` before `next build`.
	- If you prefer manual control, run `npx prisma migrate deploy` from a local shell that has `DATABASE_URL` set.

# M2 Milestone Complete
