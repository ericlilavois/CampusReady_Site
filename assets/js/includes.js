document.addEventListener('DOMContentLoaded', async () => {
  // Load any snippets marked with data-include (e.g., your header)
  const slots = document.querySelectorAll('[data-include]');
  for (const slot of slots) {
    const url = slot.getAttribute('data-include');
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
      const html = await res.text();

      // Replace the placeholder with the fetched markup
      const wrap = document.createElement('div');
      wrap.innerHTML = html;
      const parent = slot.parentNode;
      while (wrap.firstChild) parent.insertBefore(wrap.firstChild, slot);
      parent.removeChild(slot);
    } catch (e) {
      console.error('Include failed for', url, e);
    }
  }

  // After the header is in the page, wire up the mobile menu button
  const btn = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('hidden');
      const icons = btn.querySelectorAll('[data-icon]');
      if (icons.length === 2) {
        icons[0].classList.toggle('hidden');
        icons[1].classList.toggle('hidden');
      }
    });
  }
});
