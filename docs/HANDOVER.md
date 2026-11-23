# Handover: Baarns Mannenkoor website

*Written 23 November 2026 for a new admin joining the account.*

This document explains how the site works, where everything lives, and how to do the common jobs. It contains **no passwords**. The repo is public, so secrets never go in here. See [Access and credentials](#access-and-credentials).

---

## 1. Access and credentials

| What | Where / who | Notes |
|---|---|---|
| GitHub repo | `TheSocialChicken/BaarnsMannenKoor` (**public**) | `TheSocialChicken` is a GitHub **organization**. An org owner adds you to the repo (or org) with the Admin role if you need Pages/domain settings; Write is enough for content. |
| Hosting | GitHub Pages (same repo) | Settings → Pages. Custom domain `baarnsmannenkoor.nl`, set via `public/CNAME`. |
| Domain registrar | **TransIP** (part of team.blue) | Domain registration lives here; nameservers point to Cloudflare. *Owner: note which TransIP account holds it.* |
| DNS | **Cloudflare** (nameservers `aaron`/`kelly.ns.cloudflare.com`) | The site is proxied through Cloudflare to GitHub Pages, so public A records show Cloudflare IPs. *Owner: note who has Cloudflare login.* |
| Email (receive) | **Cloudflare Email Routing** forwards each address to a personal inbox (no mailbox server). | Rules: Cloudflare → baarnsmannenkoor.nl → Email → Email Routing. Since Sep 2026: secretaris → Hans Stalenhoef's Gmail, the rest → the admin's Gmail. |
| Email (send) | **Brevo** SMTP relay, used through Gmail "Send mail as" (`smtp-relay.brevo.com:587`, one shared SMTP key) | Brevo re-enables IP blocking about every 30 days; then sending fails with "unauthorized server". Fix: app.brevo.com → Settings → Security → Authorized IPs → Deactivate blocking. Member guide: [`e-mail-instellen.pdf`](e-mail-instellen.pdf). |
| Old mail server | Mailcow at `mail.baarnsmannenkoor.nl` | No longer used by members since Sep 2026. Old mailbox passwords are kept in KeePass for reference only. |
| Contact form | formsubmit.co → `info@baarnsmannenkoor.nl` | No account. The first submission to a new address triggers a confirmation email. |
| Tickets | Ticketkantoor shop `ticketkantoor.nl/shop/Baarnsmannenkoor` | Linked from `src/pages/events.astro`. |
| Passwords | `BaarnsMannenKoor-wachtwoorden.kdbx` in the repo root (KeePass 4, encrypted) | Committed deliberately by the owner so it can be downloaded anywhere. Open with KeePassXC. **The master password is never written in the repo**; get it from the owner in person or by phone. Other `*.kdbx` files stay gitignored. |
| Member page password (`/leden/`) | KeePass / secretaris | Shared with all choir members. |
| Board page password (`/bestuur/`) | KeePass / secretaris | Board only. |

---

## 2. How the site works

- **Stack:** [Astro](https://astro.build) 4, fully static, plain scoped CSS. No database, no server.
- **Deploy:** every push to `main` runs `.github/workflows/deploy.yml`:
  1. **Build:** `npm ci`, `astro check`, `npm run build`
  2. **Validate:** every page must return 200, and there must be no stale `/BaarnsMannenKoor/` paths
  3. **Test:** `scripts/check-bladmuziek.mjs` checks that every file listed on `/leden/` exists
  4. **Deploy:** runs only if all three pass. The old site stays live until then (`cancel-in-progress: false`; **never change this**)
- If a deploy fails, the live site is unchanged. Check the Actions tab for the red step.

### Pages (`src/pages/`)

| URL | File | What's on it |
|---|---|---|
| `/` | `index.astro` | Hero, intro, rehearsal info, news |
| `/events/` | `events.astro` | Concerts and ticket links |
| `/history/` | `history.astro` | History since 1907 |
| `/conductor/` | `conductor.astro` | Conductor Mark Walter |
| `/media/` | `media.astro` | YouTube videos (`videos` array), photo gallery (`galleryPhotos`), audio, posters |
| `/membership/` | `membership.astro` | Joining the choir |
| `/friends/` | `friends.astro` | Friends/sponsor programme |
| `/contact/` | `contact.astro` | Contact form + board contacts |
| `/leden/` | `leden.astro` | **Member portal:** sheet music, rehearsal recordings, schedules, download-all zip (password) |
| `/bestuur/` | `bestuur.astro` | **Board portal:** internal documents (password) |
| 404 | `404.astro` | Not-found page |

Shared layout and all design tokens (colours, spacing, fonts) live in `src/layouts/Layout.astro`. Components: `Hero.astro`, `Card.astro`.

### Files

- `public/bladmuziek/`: sheet music PDFs and `.m4a` voice recordings for `/leden/`
- `public/bestuur-documenten/`: board documents (each one also encrypted with the board password)
- `public/downloads/`: rehearsal schedules
- `public/images/`: photos
- `scripts/build-leden-zip.mjs`: runs after the build and zips all of `bladmuziek/` into `dist/downloads/BMK-bladmuziek-en-opnames.zip` (about 211 MB; generated at build time, not stored in git)

---

## 3. Local setup

```bash
git clone https://github.com/TheSocialChicken/BaarnsMannenKoor.git
cd BaarnsMannenKoor
npm install
npm run dev       # http://localhost:4321
npm run build     # production build into dist/ (needs the `zip` command)
npm run preview   # serve the build locally
```

Node 22 matches CI.

**House rule:** commit and push after every change. Don't leave work uncommitted, because other people (and Claude sessions on other machines) push to `main` too. Always `git pull` before you start.

---

## 4. Editing the site in the browser (Pages CMS)

No code needed for the lists on the site. Login is your own GitHub account, so there is no extra password.

**One-time setup (an owner of the `TheSocialChicken` GitHub organization does this once):**

1. Go to <https://app.pagescms.org> and click **Sign in with GitHub**.
2. Install the Pages CMS GitHub App on the `TheSocialChicken` organization, and give it access to the `BaarnsMannenKoor` repo.
3. Every editor needs a GitHub account with at least **Write** access to the repo.

**Daily use:** <https://app.pagescms.org> → sign in → **TheSocialChicken / BaarnsMannenKoor**. Every save goes straight to `main`, and the live site updates in about 2 minutes. If a save breaks something, the deploy stops and the old site stays online.

| In Pages CMS | Changes on the site | Data file |
|---|---|---|
| Video's | YouTube videos on `/media/` | `src/data/videos.json` |
| Fotogalerij | Photos on `/media/` | `src/data/fotos.json` |
| Bladmuziek (4 lists) | Sheet music on `/leden/` | `src/data/bladmuziek-*.json` |
| Voorzingopnames per stem | Recordings on `/leden/` | `src/data/stemmen.json` |
| Media (left menu) | Upload PDFs, `.m4a` files, photos and schedules | `public/bladmuziek`, `public/images`, `public/downloads` |

**Adding sheet music:** first upload the PDF under **Media → Bladmuziek**. Then add an entry to the right list and type the filename **exactly** as uploaded. If a name doesn't match, the deploy check blocks it and the site stays as it was.

The page texts (history, conductor, contact, concert texts) are still in the `.astro` files and need code edits. Config: `.pages.yml`.

## 5. Common tasks (code)

### Add sheet music or a recording to the member portal
1. Put the PDF / `.m4a` in `public/bladmuziek/`.
2. Add an entry to the right list in `src/data/` (`bladmuziek-algemeen/kerst/verbeelding/overig.json`, or `stemmen.json`), or use Pages CMS (section 4).
3. Run `node scripts/check-bladmuziek.mjs`. The filename must match **exactly**, including commas and spaces.
4. If the total size changes a lot, update the "ruim … MB" text above the zip button.

### Change the member or board password
Both pages compare a SHA-256 hash in the browser.

1. `echo -n "newpassword" | sha256sum`
2. Replace `PASSWORD_HASH` in `leden.astro` or `bestuur.astro`.
3. **Do not write the password in a code comment** (see section 7).
4. For `/bestuur/`, re-encrypt every document in `public/bestuur-documenten/` with the new password (PDFs: pikepdf AES-256; docx: msoffcrypto-tool).
5. Update KeePass and tell the members or board.

### Add a concert or ticket link
Edit `src/pages/events.astro`. Ticket buttons link to the Ticketkantoor shop.

### Add a YouTube video
Add the video ID to `src/data/videos.json` (or use Pages CMS). The player loads `youtube.com/embed/<id>` on click.

### Add a board document
Encrypt it with the board password first, put it in `public/bestuur-documenten/`, then add it to the `DOCUMENTEN` array in `bestuur.astro`.

---

## 6. Gotchas

- **Repo is public.** Anything committed, including history, is visible to everyone. Never commit passwords, other `.kdbx` files, `mail-source/`, or `docs/*-instellingen.md` (per-person email files with passwords; gitignored).
- **Filenames in `leden.astro` must match the disk exactly**, or the deploy is blocked by the bladmuziek test.
- **`.swarm/` and `agentdb.*` files** are local state from AI tooling (Claude Code / ruflo). They are binary and often cause merge conflicts. When they conflict, keep either version; the site doesn't use them.
- **Stale notes in `CLAUDE.md`:** the site is live on the custom domain (verified via DNS, Nov 2026) with `base: '/'`, so the "BASE_URL subpath" section and "DNS not yet pointed" are out of date. The `base` variable pattern still works and is harmless.
- Writing style on the site: no em-dashes (they were removed site-wide). Address visitors as "je", not "u".

---

## 7. Known security issues (act on these)

1. **The old portal passwords and two KeePass databases are in the public git history.** Plaintext password comments were removed from `leden.astro` and `bestuur.astro` on 23 Nov 2026, and `keyswebsite.kdbx` / `passwords.kdbx` were untracked earlier, but older commits still contain them. Fix: **choose new portal passwords**, rotate every credential stored in those KeePass files (they can be brute-forced offline), and purge them from history.
2. **The password gate is cosmetic.** It only hides content in the browser. Every PDF, recording and the zip can be downloaded by direct URL, and the files sit in the public repo. Board documents are additionally encrypted per file; member files are not.
   - Preferred fix: Cloudflare Worker + R2 with a server-side password check, then remove the files from the repo **and its history**.
   - Quick alternative: a password-protected Nextcloud share.
3. KeePass is the only place credentials should live. The shared database is in the repo by owner decision, so its **master password must be strong and shared only in person or by phone**. Never put a password in plain text in the repo or in email.

---

## 8. Open backlog

Full list in `CLAUDE.md` → Backlog. Highlights:

- **High:** real protection for member files (see 7.2); ticketing beyond the Ticketkantoor link
- **Medium:** more on conductor Mark Walter; newsletter signup (Mailchimp/Buttondown)
- **Low:** SEO / Open Graph tags, privacy-friendly analytics (Plausible/Fathom), Pagefind search, sitemap
- **Research:** sheet music that scrolls along with the audio

---

## 9. Related

- `CLAUDE.md`: project facts, board contacts, design system, backlog (also read by Claude Code)
- `docs/e-mail-instellen.pdf`: member guide for sending from a choir address (source in `docs/pdf-src/`)
- `docs/pdf-src/build.sh`: rebuilds every PDF in `docs/` from markdown (pandoc + weasyprint)
- `kamitor/K-Libary` → `BaarnsMannenKoor/INDEX.md`: indexed weekly by a scheduled action; no action needed here
