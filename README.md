# Tamojit Portfolio (GitHub Pages)

A clean, animated personal site that mirrors your LinkedIn/Resume content and runs on **GitHub Pages**. No build step — just static files.

## 1) Project structure

```
tamojit-site/
├─ index.html
├─ styles.css
├─ script.js
├─ data/
│  └─ profile.json
└─ assets/
   ├─ Resume.pdf
   └─ avatar.jpg   # (optional) add a square photo named exactly 'avatar.jpg'
```

## 2) Quick edit

- Open `data/profile.json` to update your name, headline, experience, projects, and skills.
- Replace `assets/Resume.pdf` with your latest résumé (same filename).
- Drop a square portrait as `assets/avatar.jpg` (400–800px recommended).

## 3) Host on GitHub Pages

**Option A – user site (easiest)**

1. Create a new repo named **`<your-username>.github.io`** (e.g., `phantom660.github.io`).
2. Upload the contents of `tamojit-site/` to the repo root (or push via git).
3. Visit `https://<your-username>.github.io` after ~1–2 minutes.

**Option B – project site**

1. Create any repo name (e.g., `portfolio`).
2. Upload files into the repo root.
3. In GitHub → *Settings* → *Pages* → *Build and deployment*: Source = **Deploy from a branch**, Branch = **main** (root). Save.
4. Your site will appear at `https://<your-username>.github.io/<repo-name>/`.

## 4) Customize animations

- GSAP + ScrollTrigger animate sections on scroll.
- 3D hover *tilt* on project/hero cards via VanillaTilt.
- The background uses a slow rotating radial gradient. Tweak it in `index.html` and `styles.css`.

## 5) Local preview

Open `index.html` directly, or use a local server:

```bash
# Python
python -m http.server 8080
# then visit http://localhost:8080
```

## 6) Custom domain (optional)

1. Buy a domain from your registrar.
2. In GitHub repo → *Settings* → *Pages*, set your custom domain.
3. Create `A` records for `@` and `CNAME` for `www` pointing to GitHub Pages IPs (see GitHub docs).

## 7) Accessibility & performance tips

- Always include descriptive `alt` text for your avatar.
- Keep images < 300–400 KB for fast loads.
- Use meaningful link text and sufficient contrast.

**Enjoy!**
