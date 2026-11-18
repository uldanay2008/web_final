/* Apply the saved theme before rendering the page. */
(function () {
    let theme = 'light';
    try { if (localStorage.getItem('winx-final-theme') === 'dark') theme = 'dark'; } catch { /* Use light mode when storage is blocked. */ }
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.bsTheme = theme;
})();
