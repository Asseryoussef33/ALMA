# ALMA website: setup guide

Plain HTML, CSS and JavaScript. No framework, no build step, no install.

## Files

```
index.html        Home (search, featured hero, categories, featured projects)
services.html     Services grouped Design / Execution / Other services + cost estimator
projects.html     Portfolio: search, category and status filters (?saved=1 shows saved)
project.html      Project detail (?id=...): gallery, features, Materials & Finishes, Request a Quote
offices.html      Office directory (public) + "Request to be listed" form
engineers.html    Engineers directory (public)
engineer.html     Engineer profile (?id=...) with completed projects
login.html        Demo staff login
dashboard.html    Engineer dashboard (restricted): ?view=projects | ?view=inbox
reports.html      Daily journal + weekly report (restricted), CSV export and print to PDF
css/styles.css    All styles (mobile-first, tokens at the top)
js/data.js        ALL placeholder content and demo credentials
js/app.js         Shared header, drawer, bottom nav, footer, cards, filters, modal, forms, auth
js/pages/*.js     One small script per page
assets/           favicon + images folder (see assets/README.md)
```

## Open and run

**Visual Studio 2022:** File > Open > Web Site (or Open > Folder) and pick the `alma` folder. Right-click `index.html` > View in Browser.

**VS Code:** File > Open Folder > `alma`. Install the "Live Server" extension, right-click `index.html` > Open with Live Server.

**No editor:** double-click `index.html`. Everything works from the file system because data is a script, not a fetched file.

A local server is recommended (Live Server / IIS Express) so saved items and the login session behave the same in every browser.

## External dependencies

Only one, optional: **Google Fonts** (Inter and Cormorant Garamond), linked in the `<head>` of each page. Remove those three lines to use system fonts. Icons are inline SVG, so there is no icon CDN.

## Swapping placeholder data

Edit `js/data.js` only. Each section is commented:

- `brand`: phone, email, hours in the footer
- `services`: names, descriptions, which buttons show (`actions: ['quote', 'visit']`)
- `estimator`: rates per m² (placeholders)
- `projects`: portfolio items; `price` or `budgetMin`/`budgetMax`; `status` `completed` or `in-progress`
- `engineers`, `offices`: directory entries (`sample: true` shows a "Sample" badge; remove it for real entries)
- `dashboard.metrics`: the three dashboard figures (entered, not calculated)
- `dashboard.requests`, `dashboard.messages`: incoming requests and inbox seed
- `sites`, `journal`: site list and daily journal entries that feed both reports

## Replacing the demo login

The current login checks `auth.users` in `data.js` inside the browser. Anyone can read those passwords, so it is a placeholder only.

To replace it:

1. Delete the `auth` block from `data.js`.
2. Put real authentication on a server (for example ASP.NET Core Identity in Visual Studio, Firebase Auth, Supabase Auth or Auth0).
3. In `js/app.js`, rewrite `ALMA.auth.login`, `current` and `logout` to call your server and read its session. The rest of the site only uses those three functions and the `data-protected="true"` flag on `dashboard.html` and `reports.html`.
4. Protect the dashboard and report data on the server too. A browser-side check alone never secures data.

## Adding real images

Put photos in `assets/images/` and list them in the item's `images` array in `data.js`. Full details in `assets/README.md`.

## Where form submissions go

Quote requests, site-visit bookings, listing requests, proposal and visit actions, and new journal entries are saved to the browser's `localStorage` and show up in the staff Messages view **on the same browser only**. Connect the forms to email, WhatsApp, a CRM or your backend before launch (`ALMA.openQuote` in `app.js` and the listing form in `js/pages/offices.js`).

---

# Interpretation notes (please confirm)

1. **Demo auth.** Client-side check against `data.js` (`loay` / `alma-demo`, `staff` / `alma-staff`), session kept in `sessionStorage` until the tab closes. Clearly marked on the login page. Not secure.
2. **Export format.** CSV download (UTF-8 with BOM so Excel opens it correctly) plus the browser's Print dialog with a print stylesheet, where "Save as PDF" makes the PDF. No PDF library.
3. **Office directory contacts.** Each office shows the phone, email and website it supplied, as Call / Email / Website buttons. Listings are sorted alphabetically, carry no ratings, and a note says ALMA does not rank or endorse them. All six offices are "Sample" entries with example.com contacts. The listing form requires a consent tick and goes to review, not straight onto the page.
4. **Services list.** I followed your brief's three groups. Two notes: the notebook shows "Shop drawings" (your brief says "Snap drawings"), so I used **Shop drawings & CAD plans**; the notebook shows "3D Interior design" as one line, while I kept your brief's split into **Interior design** and **3D**. The notebook also seems to use "Site inspection & consultation" and "Small utilities" as sub-headings; easy to regroup in `data.js` if you prefer that.
5. **Service buttons.** Execution services show both Request a Quote and Book a Site Visit. Inspection services show Book a Site Visit. Video consultation shows "Book a Video Consultation" (same booking form). Site tracker and Daily Journal link to the staff pages; the Smart cost estimator is a working calculator with **placeholder rates**.
6. **Bottom navigation.** Public pages: Home, Explore, + (Request, opens Services), Saved, Profile (login or dashboard). Staff pages: Home, Projects, Reports (calendar icon, labelled "Reports" since there is no separate calendar), Messages, Profile. Offices and Engineers are reached from the menu button on mobile and the top bar on desktop.
7. **Messages.** A simple inbox of website requests plus two sample messages, not a chat system.
8. **Dashboard actions.** Submit Proposal and Accept Site Visit open short forms and move the request to In Progress with a note (e.g. "Proposal sent: EGP 1,400,000"). Changes are stored in the browser and can be reset from the "..." menu.
9. **Dashboard figures** (5 sites, 3 quotations / 2 urgent, EGP 482K, +18%) are fixed values from the reference, not calculated from the requests list.
10. **Reports.** Weeks run Saturday to Friday (matching the notebook header). "Revenue" in reports = payments received on site that day. Progress is the engineer's overall % for the site.
11. **Search.** Matches title, location and style tags, and also feature and material names so "marble" or "oak" work.
12. **Simplified from the references:** real photos replaced by drawn placeholders and colour swatches; no dark mode (light theme only, as requested); the phone status bar and home indicator are not reproduced; the logo is a simple redraw of the ALMA mark.
13. **Colour contrast.** Brand orange `#F26A1B` is used for icons, active marks and focus rings. Filled buttons and orange text use a deeper `#C9480A` so white text passes WCAG AA. Change `--accent-600` in `styles.css` if you want the brighter tone everywhere.
14. **Engineer details.** Loay's years, phone, email and bio are placeholders. The other three engineers are sample profiles.
