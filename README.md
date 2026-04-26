# Tourism Marketplace

A full-stack tourism marketplace built with Next.js App Router, TypeScript, Tailwind CSS, MongoDB/Mongoose, JWT auth, Cloudinary uploads, and email moderation.

## From Scratch Setup

If you want to recreate the project locally from an empty folder:

```bash
npx create-next-app@latest tourism-platform --typescript --app --eslint --tailwind
code tourism-platform
```

Then replace the generated app with this codebase, install dependencies, and add your environment variables.

## Install

```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_UPLOAD_PRESET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `ADMIN_EMAIL`

## Run Locally

```bash
npm run dev
```

## Main Routes

- `/` Home
- `/services` Listings with filters
- `/listings/[slug]` Listing details
- `/listings/add` Add listing
- `/login` Login
- `/register` Register
- `/dashboard` User dashboard
- `/admin` Admin dashboard
- `/blog` Blog index

## Deployment

1. Push the repository to GitHub.
2. Import the repo into Vercel.
3. Add the production environment variables in the Vercel project settings.
4. Deploy.

## Notes

- MongoDB collections are created automatically by Mongoose the first time data is written.
- Core collections include `users`, `listings`, `reviews`, and `blogposts`.
- Listings are created with `pending` status.
- Admins can approve or reject listings from the admin dashboard.
- Public pages only show approved listings and published blog posts.
- Image uploads go to Cloudinary through the `/api/upload` route.
- Search filters currently support keyword, category, subcategory, location, country, price range, minimum rating, featured listings, and sorting by latest, popular, or rating.
