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
| Email | Inbound MX: Cloudflare Email Routing. Mailbox host: `mail.baarnsmannenkoor.nl` (IMAP 993, SMTP 587). SPF also allows Brevo (Sendinblue). | *Owner: confirm how Cloudflare routing and the mailbox host fit together, and who administers each.* Client setup: [`email-instellingen.md`](email-instellingen.md). |
| Contact form | formsubmit.co → `info@baarnsmannenkoor.nl` | No account. The first submission to a new address triggers a confirmation email. |
| Tickets | Ticketkantoor shop `ticketkantoor.nl/shop/Baarnsmannenkoor` | Linked from `src/pages/events.astro`. |
| Passwords | KeePass database (`*.kdbx`, group `baarnsmannenkoor.nl`) | **Never committed** (`*.kdbx` is gitignored). Ask the current admin to share it with you through a private channel. |
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

## 4. Common tasks

### Add sheet music or a recording to the member portal
1. Put the PDF / `.m4a` in `public/bladmuziek/`.
2. Add an entry to the right array at the top of `src/pages/leden.astro`: `BLADMUZIEK`, `BLADMUZIEK_KERST`, `BLADMUZIEK_VERBEELDING`, `BLADMUZIEK_OVERIG` (`pdf: "..."`) or `STEMMEN` (`bestand: "..."`).
3. Run `node scripts/check-bladmuziek.mjs`. The filename must match **exactly**, including commas and spaces.
4. If the total size changes a lot, update the "ruim … MB" text above the zip button.

### Change the member or board password
Both pages compare a SHA-256 hash in the browser.

1. `echo -n "newpassword" | sha256sum`
2. Replace `PASSWORD_HASH` in `leden.astro` or `bestuur.astro`.
3. **Do not write the password in a code comment** (see section 6).
4. For `/bestuur/`, re-encrypt every document in `public/bestuur-documenten/` with the new password (PDFs: pikepdf AES-256; docx: msoffcrypto-tool).
5. Update KeePass and tell the members or board.

### Add a concert or ticket link
Edit `src/pages/events.astro`. Ticket buttons link to the Ticketkantoor shop.

### Add a YouTube video
Add the video ID to the `videos` array in `src/pages/media.astro`. The player loads `youtube.com/embed/<id>` on click.

### Add a board document
Encrypt it with the board password first, put it in `public/bestuur-documenten/`, then add it to the `DOCUMENTEN` array in `bestuur.astro`.

---

## 5. Gotchas

- **Repo is public.** Anything committed, including history, is visible to everyone. Never commit passwords, `.kdbx` files, `mail-source/`, or `docs/*-instellingen.md` (per-person email files with passwords; gitignored).
- **Filenames in `leden.astro` must match the disk exactly**, or the deploy is blocked by the bladmuziek test.
- **`.swarm/` and `agentdb.*` files** are local state from AI tooling (Claude Code / ruflo). They are binary and often cause merge conflicts. When they conflict, keep either version; the site doesn't use them.
- **Stale notes in `CLAUDE.md`:** the site is live on the custom domain (verified via DNS, Nov 2026) with `base: '/'`, so the "BASE_URL subpath" section and "DNS not yet pointed" are out of date. The `base` variable pattern still works and is harmless.
- Writing style on the site: no em-dashes (they were removed site-wide). Address visitors as "je", not "u".

---

## 6. Known security issues (act on these)

1. **Both portal passwords appear in plaintext in code comments** in `src/pages/leden.astro` and `src/pages/bestuur.astro` (line 6), in a public repo. Anyone can read them on GitHub. Fix: delete the comments, **choose new passwords** (the old ones stay in git history forever), and follow the change-password steps above.
2. **The password gate is cosmetic.** It only hides content in the browser. Every PDF, recording and the zip can be downloaded by direct URL, and the files sit in the public repo. Board documents are additionally encrypted per file; member files are not.
   - Preferred fix: Cloudflare Worker + R2 with a server-side password check, then remove the files from the repo **and its history**.
   - Quick alternative: a password-protected Nextcloud share.
3. KeePass is the only place credentials should live. Share it privately; never via the repo or email in plaintext.

---

## 7. Open backlog

Full list in `CLAUDE.md` → Backlog. Highlights:

- **High:** real protection for member files (see 6.2); ticketing beyond the Ticketkantoor link
- **Medium:** more on conductor Mark Walter; newsletter signup (Mailchimp/Buttondown)
- **Low:** SEO / Open Graph tags, privacy-friendly analytics (Plausible/Fathom), Pagefind search, sitemap
- **Research:** sheet music that scrolls along with the audio

---

## 8. Related

- `CLAUDE.md`: project facts, board contacts, design system, backlog (also read by Claude Code)
- `docs/email-instellingen.md`: email client setup for board addresses
- `kamitor/K-Libary` → `BaarnsMannenKoor/INDEX.md`: indexed weekly by a scheduled action; no action needed here
