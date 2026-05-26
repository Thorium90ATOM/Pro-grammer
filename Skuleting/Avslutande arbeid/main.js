/* ===========================
   Temadag 2026 – Hovudskript
   =========================== */

/* ---------- Hamburger-meny ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Lukk meny ved klikk på lenkje
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });
}

/* ---------- Nedteljing ---------- */
/**
 * Siste skuletag er sett til 12. juni 2026.
 * Datoen kan justerast ved behov.
 */
const TEMADAG_DATO = new Date('2026-06-12T08:00:00');

function oppdaterNedteljing() {
  const no = new Date();
  const diff = TEMADAG_DATO - no;

  if (diff <= 0) {
    // Temadagen er her!
    document.querySelector('.countdown-section').innerHTML =
      '<div class="countdown-inner"><span class="countdown-label" style="font-size:1.1rem;color:var(--primary)">🎉 Temadagen er i dag!</span></div>';
    return;
  }

  const dagar  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const timar  = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const min    = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const sek    = Math.floor((diff % (1000 * 60)) / 1000);

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val).padStart(2, '0');
  };

  set('cd-dagar', dagar);
  set('cd-timar', timar);
  set('cd-min',   min);
  set('cd-sek',   sek);
}

// Køyr med ein gong og deretter kvart sekund
oppdaterNedteljing();
setInterval(oppdaterNedteljing, 1000);

/* ---------- Aktivitetsfilter ---------- */
const filterBtns  = document.querySelectorAll('.filter-btn');
const cards       = document.querySelectorAll('.activity-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Oppdater aktiv knapp
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    cards.forEach(card => {
      if (filter === 'alle' || card.dataset.kategori === filter) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ---------- Automatisk fyll inn aktivitet frå URL ---------- */
/**
 * Dersom brukaren klikkar "Meld på" på eit kort,
 * vert ?aktivitet=xyz lagt til URL-en til pamelding.html.
 * Skriptet på påmeldingssida les dette og fyller inn automatisk.
 */
