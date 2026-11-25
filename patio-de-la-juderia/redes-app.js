/* En Android, enlace nativo con alternativa web según la sintaxis de Chrome.
   En iOS se conserva HTTPS para que el sistema gestione los universal links.
   Sin temporizadores, ventanas nuevas ni aperturas sin un toque del visitante. */
(() => {
  const android = /Android/i.test(navigator.userAgent);
  const profiles = [
    ['instagram.com', 'com.instagram.android'],
    ['facebook.com', 'com.facebook.katana']
  ];
  document.querySelectorAll('.footer-socials a.social-button').forEach(link => {
    const url = new URL(link.href, location.href);
    const profile = profiles.find(([host]) => url.hostname === host || url.hostname === 'www.' + host);
    if (!profile) return;
    link.removeAttribute('target');
    if (android) {
      link.href = 'intent://' + url.host + url.pathname + url.search +
        '#Intent;scheme=https;package=' + profile[1] +
        ';S.browser_fallback_url=' + encodeURIComponent(url.href) + ';end';
    }
  });
})();
