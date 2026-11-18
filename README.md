# Winx Studio - Final Project (original design)

Team: Winx Studio. Members: Uldanay and Assylzhan.
Built on the supplied Assignment 5 project. Original layout and Assignment 6 interactions are retained. Final additions: persistent light/dark theme, Account and Profile pages, browser-local signup/login/logout, explicit shared JavaScript validation including phone and password complexity, and a live beauty API on Products. See docs/FINAL_CHANGES_RU.md and docs/FINAL_TESTING.md.

## Run
Extract the complete ZIP, then open index.html in a modern browser. Recommended: VS Code Live Server or `python3 -m http.server 8000` inside this folder and open http://localhost:8000.
Internet is required for jQuery 4.0.0, Bootstrap and the existing remote photographs. No npm install or build step is needed. Clipboard access works best on HTTPS or localhost. If the browser refuses clipboard access, the page reports the failure and you can copy the email manually.

## Demonstration of tasks 0-9
| Task | Where and how to show it | Code |
| --- | --- | --- |
| 0 Setup | Open DevTools console: jQuery is ready! | jQuery CDN in each head; js/assignment6.js document.ready |
| 1 Live filter | Products: type lip; clear the search; combine with category and favorites | searchProducts; .on('input'); .filter; original shared catalog updater |
| 2 Autocomplete | Products: type e, use ArrowDown/ArrowUp then Enter; Escape closes suggestions | #product-suggestions, ARIA listbox/combobox |
| 3 Highlighting | Tips: type clean to highlight all three literal matches in FAQ questions and answers | highlightText; safe text nodes and mark; matching answers open |
| 4 Scroll progress | Scroll any page; the gradient bar fills at the top | updateProgress; jQuery .css and .attr |
| 5 Number counter | Home: scroll to Explore Winx Studio | jQuery .animate counters: 8 pages, 7 featured products, 3 categories |
| 6 Submit spinner | Contact: enter valid details; submit; watch Please wait and the disabled button for 1.4 seconds | Existing validation first; .prop('disabled'); timeout restoration |
| 7 Notifications | Products: save/remove a favorite; copy email or finish demo validation | notify; fadeIn/fadeOut; old timers cancelled |
| 8 Clipboard | Footer: Copy email; success changes text to a checkmark and shows a tooltip | navigator.clipboard with checked fallback; jQuery click handler |
| 9 Lazy images | Scroll galleries; inspect Network or img data-src attributes | loadVisibleImages; viewport check; jQuery .attr('src') |

Search respects category and favorites-only filters. Empty results show the existing catalog empty message. Suggestions respect the same filters. Clearing the search restores the filtered catalog.
FAQ highlighting treats search text literally, so brackets and other regex characters cannot break the search. Text is inserted with textContent/.text(), not interpreted as user HTML. Clearing search restores the FAQ's previous expanded state.
The hero and Bootstrap carousel images remain eager for reliable first paint and carousel transitions. Other photographs keep their original URLs in data-src and receive src only when near the viewport. The first visible images load immediately; lower images load on scroll. This does not download remote photographs for offline use.

## Existing Assignment 5 features
Home rating, keyboard navigation, local audio playback and optional three-step contact form remain available. Existing Assignment 4 features include FAQ, subscription validation, background changes, clock, catalog categories and favorites.
Contact form: Fill step by step enables the wizard. Next validates the current step; Back preserves entered values; Reset cancels pending loading and restores defaults. Submit on the last step validates all fields before starting the spinner.

## Files
- Eight HTML pages: index, makeup, products, tips, team, contact, account, profile.
- css/style.css and js/script.js: original site behavior; catalog updater now also accepts search queries.
- css/assignment5.css and js/assignment5.js: existing Assignment 5 features.
- css/assignment6.css and js/assignment6.js: new jQuery features.
- audio/assignment5-chime.wav: existing local sound.
- docs/ASSIGNMENT6_TESTS.json: isolated DOM interaction checks and their scope.

## Verification and limits
JavaScript syntax and isolated DOM interactions are checked using real jQuery 4.0.0 in jsdom. Clipboard and layout are mocked for these checks, so they are not an independent live-browser test. No claim is made about responsive rendering or availability of remote images/Bootstrap. Check those in your browser before submission.
The contact and newsletter forms are demos: no message is transmitted, no account/subscription is created and no password is saved. The delay simulates waiting; the completion message states this explicitly. Favorites use localStorage when available. Audio plays only after a click.

## Deploy and submit
Push all files to the team's shared repository and publish through GitHub Pages or Netlify. Use the actual working deployment URL in the report. This archive has not been deployed.
Each member submits the full project ZIP and a separate PDF report with team/group, objective, task descriptions, code/page screenshots, deployment URL and reflection. The report is not included in this project archive.


## Final implementation notes

New files: account.html, profile.html, css/final.css, js/theme-init.js, js/validation.js, js/final.js and a local image fallback. Existing source changes use the shared validation module in both full and step-by-step contact modes. All forms have novalidate; required/pattern/minlength/maxlength/min/max/type=email constraints are not used as input validation. See the final testing record for the current browser checks; the older ASSIGNMENT6_TESTS.json remains historical evidence for the original version.

Account details and a salted password digest are saved in localStorage. This is only a frontend demonstration and does not provide secure authentication. Use fictitious data and a demo password. Profile favorites are shared by this browser, not account-specific server records. The contact/newsletter form still sends nothing.

Run from localhost (`python -m http.server 8000`) or HTTPS hosting. Direct file:// opening may not support storage or crypto APIs reliably. The original public GitHub Pages deployment is unchanged until you commit/push this patch.
