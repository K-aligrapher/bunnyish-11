# 🚀 Deploying The Story Press to Vercel + Supabase

Follow these steps in order. Takes about 10 minutes total.

---

## STEP 1 — Set up Supabase (your database)

1. Go to https://supabase.com and sign up for free
2. Click **New Project** → give it a name like "storypress" → set a password → Create
3. Wait ~2 minutes for it to spin up
4. In the left sidebar, click **SQL Editor**
5. Paste the entire contents of `supabase-schema.sql` and click **Run**
   - This creates your `posts` table and sets permissions
6. Go to **Project Settings → API** and copy:
   - **Project URL** (looks like https://xxxx.supabase.co)
   - **anon / public key** (long string starting with "eyJ...")

---

## STEP 2 — Push your code to GitHub

1. Go to https://github.com and create a **New Repository** (call it "storypress")
2. In your terminal, from the project folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/storypress.git
git push -u origin main
```

---

## STEP 3 — Deploy to Vercel

1. Go to https://vercel.com and sign up (use your GitHub account)
2. Click **Add New → Project**
3. Select your `storypress` GitHub repo → click **Import**
4. Before clicking Deploy, click **Environment Variables** and add:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

5. Click **Deploy** — Vercel will build and deploy automatically

---

## STEP 4 — Your blog is live! 🎉

Vercel gives you a free URL like:
👉 `https://storypress-yourname.vercel.app`

You can also add a **custom domain** (like yourblog.com) for free in Vercel settings.

---

## How to write new posts

Visit `https://your-vercel-url.vercel.app/write` to publish new stories.
They're saved to Supabase and appear on your homepage instantly.

## How to delete posts

Visit `/admin` to manage and delete your stories.

---

## Storage limits (free tiers)

| Service | Free Limit |
|---------|-----------|
| Supabase | 500 MB database, 2 GB bandwidth/month |
| Vercel | 100 GB bandwidth/month, unlimited deployments |

For a text blog, 500 MB = roughly **500,000+ blog posts**. You'll never hit it.

---

## Updating your blog design later

Just edit the files locally and run:
```bash
git add .
git commit -m "Update design"
git push
```
Vercel auto-deploys on every push. ✨
