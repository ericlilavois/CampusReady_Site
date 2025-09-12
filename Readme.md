# Campus Ready Foundation — Website

A simple static site on GitHub Pages with a shared header you edit once.

WIP: Seeding draft PR for site cleanup; will remove before merge.

## Folder map
~~~
/index.html
/mission/index.html
/donate/index.html
/faq/index.html
/privacy/index.html
/About/index.html
/About/team/index.html
/includes/header.html
/assets/
  /js/includes.js
  favicon-32.png
  favicon-16.png
  apple-touch-icon.png
  site.webmanifest
~~~

Other items: `.nojekyll`, `CNAME`, and small root redirects (e.g., `mission.html` → `/mission/`).

## Edit the navigation (one place)
- Update links in **`/includes/header.html`**.
- Desktop and mobile nav live in this file.
- “Contact” is an email link by default; on pages with the modal, the script opens the modal instead.

## How each page pulls in the header
Add these to every page:

**Where the header goes (near the top of `<body>`):**
~~~html
<div data-include="/includes/header.html"></div>
~~~

**Last script before `</body>`:**
~~~html
<script src="/assets/js/includes.js"></script>
~~~

## Add a new page
1. Make a folder: `/pagename/`  
2. Add `/pagename/index.html`  
3. Include the two snippets above (header include + last script)  
4. Add the favicon lines in the `<head>` (copy from any page)

## Favicons (site-wide)
Keep one set in each page’s `<head>`:
~~~html
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/assets/site.webmanifest">
~~~
To change the icon later, replace those files in `/assets/` with the same names.

## Contact behavior
- Default: opens an email draft to `hello@campusready.foundation`
- If a page includes the contact modal and `openContactModal()`, clicks open the modal instead (handled by `includes.js`).

## Redirects & case
- Current About URL is **`/About/`**.  
- If you later switch to lowercase `/about/`, add tiny redirect pages in `/About/` to forward to the lowercase paths, then update links in `header.html`.

## Tips
- Keep images/OG assets in `/assets/` (you can add `/assets/img/`).  
- Hard refresh (Shift+Reload) after header or favicon changes to clear cache.
