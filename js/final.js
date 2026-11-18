/* Missing final-project requirements, added to the original Assignment 6 site. */
'use strict';
(function () {
    const V = WinxValidation;
    // Keep the original remote artwork; provide a local fallback if a host fails.
    document.addEventListener('error', event => {
        const image = event.target;
        if (image.tagName === 'IMG' && !image.src.endsWith('/assets/image-unavailable.svg')) {
            image.src = 'assets/image-unavailable.svg';
            image.title = 'The original image is unavailable.';
        }
    }, true);
    function read(key, fallback) {
        try { const value = localStorage.getItem(key); return value === null ? fallback : JSON.parse(value); } catch { return fallback; }
    }
    function write(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
    }
    const themeButton = document.getElementById('theme-toggle');
    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
        document.documentElement.dataset.bsTheme = theme;
        themeButton.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
        themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
        document.getElementById('change-background').disabled = theme === 'dark';
    }
    applyTheme(document.documentElement.dataset.theme || 'light');
    themeButton.addEventListener('click', () => {
        const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(theme);
        try { localStorage.setItem('winx-final-theme', theme); } catch {
            themeButton.title = 'Browser storage is unavailable; the theme lasts for this page only.';
        }
    });
    const usersKey = 'winx-final-users', sessionKey = 'winx-final-session';
    function users() {
        const value = read(usersKey, []);
        return Array.isArray(value) ? value.filter(user => user && typeof user.email === 'string') : [];
    }
    function getUser() { return users().find(user => user.email === read(sessionKey, null)); }
    async function digest(password, salt) {
        if (!window.crypto?.subtle) throw new Error('Use the hosted site or a localhost server to create a demo account.');
        const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':' + password));
        return Array.from(new Uint8Array(buffer), byte => byte.toString(16).padStart(2, '0')).join('');
    }
    function error(id, message) { V.setError(document.getElementById(id), message); return !message; }
    const delay = () => new Promise(resolve => setTimeout(resolve, 700));
    async function submitAccount(form, task) {
        if (form.dataset.busy) return;
        form.dataset.busy = 'true';
        const button = form.querySelector('[type="submit"]'), label = button.textContent;
        button.disabled = true; button.innerHTML = '<span class="a6-spinner" aria-hidden="true"></span> Please wait…'; form.setAttribute('aria-busy', 'true');
        try { await delay(); await task(); }
        finally { delete form.dataset.busy; button.disabled = false; button.textContent = label; form.removeAttribute('aria-busy'); }
    }
    document.querySelectorAll('input[id$="-email"]').forEach(input => input.setAttribute('inputmode', 'email'));
    document.getElementById('signup-form')?.addEventListener('submit', async function (event) {
        event.preventDefault(); if (this.dataset.busy) return;
        const name = this.querySelector('#signup-name').value.trim();
        const email = this.querySelector('#signup-email').value.trim().toLowerCase();
        const phone = this.querySelector('#signup-phone').value.trim();
        const password = this.querySelector('#signup-password').value;
        const status = this.querySelector('#signup-status'); status.textContent = '';
        const checks = [
            error('signup-name', name ? '' : 'Please enter your name.'),
            error('signup-email', V.email(email) ? '' : 'Enter a valid email address.'),
            error('signup-phone', V.phone(phone) ? '' : 'Enter a phone number with 7–15 digits.'),
            error('signup-password', V.password(password) ? '' : 'Use 8+ characters with uppercase, lowercase, a number and a symbol.'),
            error('signup-confirm', this.querySelector('#signup-confirm').value === password && password ? '' : 'Passwords do not match.')
        ];
        if (checks.includes(false)) { this.querySelector('[aria-invalid="true"]').focus(); return; }
        if (users().some(user => user.email === email)) { error('signup-email', 'This email is already registered in this browser. Please log in.'); return; }
        await submitAccount(this, async () => {
            try {
                const salt = crypto.randomUUID();
                const passwordDigest = await digest(password, salt);
                // Password field contains a digest. This is still only a local simulation.
                if (!write(usersKey, [...users(), { name, email, phone, salt, password: passwordDigest }])) throw new Error('Browser storage is unavailable. Allow site storage and try again.');
                if (!write(sessionKey, email)) throw new Error('The account was saved but the session could not start. Please try logging in.');
                location.href = 'profile.html';
            } catch (err) { status.textContent = err.message; }
        });
    });
    document.getElementById('login-form')?.addEventListener('submit', async function (event) {
        event.preventDefault(); if (this.dataset.busy) return;
        const email = this.querySelector('#login-email').value.trim().toLowerCase();
        const password = this.querySelector('#login-password').value;
        const status = this.querySelector('#login-status'); status.textContent = '';
        const validEmail = error('login-email', V.email(email) ? '' : 'Enter a valid email address.');
        const validPassword = error('login-password', V.password(password) ? '' : 'Use your 8+ character demo password with uppercase, lowercase, a number and a symbol.');
        if (!validEmail || !validPassword) { this.querySelector('[aria-invalid="true"]').focus(); return; }
        await submitAccount(this, async () => {
            try {
                const user = users().find(user => user.email === email);
                if (!user || await digest(password, user.salt) !== user.password) { status.textContent = 'The email or password is incorrect.'; return; }
                if (!write(sessionKey, email)) throw new Error('Browser storage is unavailable. Allow site storage and try again.');
                location.href = 'profile.html';
            } catch (err) { status.textContent = err.message; }
        });
    });
    if (document.getElementById('profile-member')) {
        const user = getUser();
        document.getElementById('profile-member').hidden = !user;
        document.getElementById('profile-guest').hidden = Boolean(user);
        if (user) {
            ['name', 'email', 'phone'].forEach(key => { document.getElementById('profile-' + key).textContent = user[key]; });
            const names = { foundation: 'Foundation', blush: 'Blush', lipstick: 'Lipstick', mascara: 'Mascara', highlighter: 'Highlighter', eyeliner: 'Eyeliner', bronzer: 'Bronzer' };
            const stored = read('winx-studio-favorites', []);
            const favorites = Array.isArray(stored) ? stored.filter(id => names[id]) : [];
            const list = document.getElementById('profile-favorites');
            if (!favorites.length) list.textContent = 'No saved products yet. Explore Products to start your collection.';
            favorites.forEach(id => { const item = document.createElement('p'); item.textContent = '♡ ' + names[id]; list.append(item); });
        }
        document.getElementById('logout').addEventListener('click', () => {
            if (write(sessionKey, null)) location.href = 'account.html';
            else document.getElementById('logout-status').textContent = 'Storage is unavailable. Clear this site’s browser data to end the local demo session.';
        });
    }
    // Live public API: real data, loading, timeout, validation, failure message and retry.
    const apiGrid = document.getElementById('api-products');
    if (apiGrid) {
        const button = document.getElementById('api-retry'), status = document.getElementById('api-status');
        async function loadProducts() {
            if (button.disabled) return;
            button.disabled = true; apiGrid.setAttribute('aria-busy', 'true'); apiGrid.replaceChildren(); status.textContent = 'Loading beauty products…';
            const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 15000);
            try {
                const response = await fetch('https://dummyjson.com/products/category/beauty', { signal: controller.signal });
                if (!response.ok) throw new Error('The catalog service returned HTTP ' + response.status);
                const data = await response.json();
                if (!Array.isArray(data.products) || !data.products.length) throw new Error('The catalog has no products.');
                data.products.forEach(product => {
                    const card = document.createElement('article'); card.className = 'final-panel final-api-card';
                    const image = document.createElement('img'); image.alt = String(product.title || 'Beauty product'); image.loading = 'lazy'; image.width = 320; image.height = 240;
                    let source; try { source = new URL(product.thumbnail); } catch { source = null; }
                    image.src = source?.protocol === 'https:' ? source.href : 'assets/image-unavailable.svg';
                    image.onerror = () => { image.onerror = null; image.src = 'assets/image-unavailable.svg'; };
                    card.append(image);
                    const title = document.createElement('h3'); title.textContent = String(product.title || 'Beauty product'); card.append(title);
                    const description = document.createElement('p'); description.textContent = String(product.description || ''); card.append(description);
                    const price = document.createElement('p'); price.className = 'fw-bold'; price.textContent = Number.isFinite(Number(product.price)) ? '$' + Number(product.price).toFixed(2) + ' USD' : 'Price not provided'; card.append(price);
                    apiGrid.append(card);
                });
                status.textContent = '';
            } catch (err) {
                status.textContent = 'We could not load the live catalog. Check your connection and choose Refresh products to try again. The studio catalog above is still available.';
            } finally { clearTimeout(timeout); button.disabled = false; apiGrid.setAttribute('aria-busy', 'false'); }
        }
        button.addEventListener('click', loadProducts); loadProducts();
    }
})();
