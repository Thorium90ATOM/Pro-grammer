/* ===========================
   admin.js – Påmeldingsoversikt
   =========================== */

let sortKey   = 'id';
let sortAsc   = true;
let slettId   = null;

/* --- DOM-referansar --- */
const tableBody      = document.getElementById('tableBody');
const emptyMsg       = document.getElementById('emptyMsg');
const tableCount     = document.getElementById('tableCount');
const searchInput    = document.getElementById('searchInput');
const filterAkt      = document.getElementById('filterAktivitet');
const filterKlasse   = document.getElementById('filterKlasse');
const modalBackdrop  = document.getElementById('modalBackdrop');
const modalText      = document.getElementById('modalText');
const modalConfirm   = document.getElementById('modalConfirm');
const modalCancel    = document.getElementById('modalCancel');

/* --- Rendrer tabellen --- */
function renderTabell() {
  const sok      = (searchInput?.value || '').toLowerCase();
  const aktFil   = filterAkt?.value    || '';
  const klasseFil= filterKlasse?.value || '';

  // Filtrer
  let data = registreringar.filter(r => {
    const namn = `${r.fornamn} ${r.etternamn}`.toLowerCase();
    const matchSok    = !sok      || namn.includes(sok) || r.klasse.toLowerCase().includes(sok) || r.aktivitet.includes(sok);
    const matchAkt    = !aktFil   || r.aktivitet === aktFil;
    const matchKlasse = !klasseFil|| r.klasse === klasseFil;
    return matchSok && matchAkt && matchKlasse;
  });

  // Sorter
  data = data.sort((a, b) => {
    let va = a[sortKey] ?? '';
    let vb = b[sortKey] ?? '';
    if (typeof va === 'string') va = va.toLowerCase();
    if (typeof vb === 'string') vb = vb.toLowerCase();
    if (va < vb) return sortAsc ? -1 :  1;
    if (va > vb) return sortAsc ?  1 : -1;
    return 0;
  });

  // Bygg rader
  tableBody.innerHTML = '';

  if (data.length === 0) {
    emptyMsg.hidden = false;
    tableCount.textContent = '';
    return;
  }

  emptyMsg.hidden = true;
  tableCount.textContent = `Viser ${data.length} av ${registreringar.length} påmeldingar`;

  data.forEach(r => {
    const meta   = AKTIVITET_META[r.aktivitet] || {};
    const tr     = document.createElement('tr');
    tr.dataset.id = r.id;

    tr.innerHTML = `
      <td class="col-id">${r.id}</td>
      <td><strong>${r.etternamn}</strong>, ${r.fornamn}</td>
      <td><span class="klasse-badge">${r.klasse}</span></td>
      <td><a href="mailto:${r.epost}" class="epost-link">${r.epost}</a></td>
      <td><span class="akt-chip akt-${r.aktivitet}">${meta.namn || r.aktivitet}</span></td>
      <td class="col-tid">${r.tid}</td>
      <td class="col-merknad">${r.merknad ? `<span title="${r.merknad}">📝</span>` : '–'}</td>
      <td>
        <button class="slett-btn" data-id="${r.id}" aria-label="Slett påmelding for ${r.fornamn} ${r.etternamn}">
          🗑️
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  // Legg til event-listeners for slett-knappar
  tableBody.querySelectorAll('.slett-btn').forEach(btn => {
    btn.addEventListener('click', () => opneModal(Number(btn.dataset.id)));
  });
}

/* --- Oppdater statistikk-kort --- */
function oppdaterStatistikk() {
  document.getElementById('statTotal').textContent     = registreringar.length;
  document.getElementById('statFotball').textContent   = tellPerAktivitet('fotball');
  document.getElementById('statTegning').textContent   = tellPerAktivitet('tegning');
  document.getElementById('statQuiz').textContent      = tellPerAktivitet('quiz');
  document.getElementById('statNatursti').textContent  = tellPerAktivitet('natursti');
  document.getElementById('statMusikk').textContent    = tellPerAktivitet('musikk');
}

/* --- Sortering ved klikk på kolonne-header --- */
document.querySelectorAll('th[data-sort]').forEach(th => {
  th.style.cursor = 'pointer';
  th.addEventListener('click', () => {
    const key = th.dataset.sort;
    if (sortKey === key) {
      sortAsc = !sortAsc;
    } else {
      sortKey = key;
      sortAsc = true;
    }
    renderTabell();
  });
});

/* --- Søk og filter --- */
searchInput ?.addEventListener('input',  renderTabell);
filterAkt   ?.addEventListener('change', renderTabell);
filterKlasse?.addEventListener('change', renderTabell);

/* --- Slett-modal --- */
function opneModal(id) {
  slettId = id;
  const r = registreringar.find(x => x.id === id);
  if (r) modalText.textContent = `Er du sikker på at du vil slette påmeldinga til ${r.fornamn} ${r.etternamn}?`;
  modalBackdrop.classList.add('open');
}

function lukkModal() {
  modalBackdrop.classList.remove('open');
  slettId = null;
}

modalCancel ?.addEventListener('click', lukkModal);
modalBackdrop?.addEventListener('click', e => { if (e.target === modalBackdrop) lukkModal(); });

modalConfirm?.addEventListener('click', () => {
  if (slettId === null) return;
  registreringar = registreringar.filter(r => r.id !== slettId);
  lukkModal();
  oppdaterStatistikk();
  renderTabell();
});

/* --- CSV-eksport --- */
document.getElementById('exportBtn')?.addEventListener('click', () => {
  const header = ['ID','Fornamn','Etternamn','E-post','Klasse','Aktivitet','Dato','Merknad'];
  const rows   = registreringar.map(r =>
    [r.id, r.fornamn, r.etternamn, r.epost, r.klasse, r.aktivitet, r.tid, r.merknad]
      .map(v => `"${String(v).replace(/"/g,'""')}"`)
      .join(',')
  );
  const csv  = [header.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: 'paamelding-temadag.csv' });
  a.click();
  URL.revokeObjectURL(url);
});

/* --- Init --- */
oppdaterStatistikk();
renderTabell();
