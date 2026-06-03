/* ===========================
   Temadag 2026 – Skjemavalidering
   =========================== */

/* --- Aktivitetsinformasjon (dummy-data) --- */
const aktivitetInfo = {
  fotball:   { tid: '09:00 – 11:30', stad: 'Skuleplassen',    laerar: 'Knut Halvorsen',  maks: 16, ledig: 3  },
  tegning:   { tid: '10:00 – 12:00', stad: 'Klasserom B12',   laerar: 'Marit Vik',       maks: 20, ledig: 12 },
  quiz:      { tid: '10:00 – 11:30', stad: 'Aula',            laerar: 'Olav Dahl',       maks: 24, ledig: 18 },
  natursti:  { tid: '09:00 – 12:00', stad: 'Skogen',          laerar: 'Anne Bergström',  maks: 15, ledig: 9  },
  musikk:    { tid: '10:00 – 13:00', stad: 'Musikkrom',       laerar: 'Torbjørn Moe',    maks: 12, ledig: 4  },
};

/* --- Hjelpe-funksjonar --- */
function visFeil(inputId, feilId, melding) {
  const input = document.getElementById(inputId);
  const feil  = document.getElementById(feilId);
  if (!input || !feil) return;
  input.classList.add('error');
  input.classList.remove('ok');
  feil.textContent = melding;
}

function visOk(inputId, feilId) {
  const input = document.getElementById(inputId);
  const feil  = document.getElementById(feilId);
  if (!input || !feil) return;
  input.classList.remove('error');
  input.classList.add('ok');
  feil.textContent = '';
}

function nullstillFelt(inputId, feilId) {
  const input = document.getElementById(inputId);
  const feil  = document.getElementById(feilId);
  if (!input || !feil) return;
  input.classList.remove('error', 'ok');
  feil.textContent = '';
}

/* --- Aktivitet-infoboks --- */
const aktivitetSelect = document.getElementById('aktivitet');
const infoBox         = document.getElementById('activityInfo');
const infoText        = document.getElementById('activityInfoText');

if (aktivitetSelect) {
  // Førehandsfyll valt aktivitet frå URL-parameter
  const params = new URLSearchParams(window.location.search);
  const preVal = params.get('aktivitet');
  if (preVal && aktivitetSelect.querySelector(`option[value="${preVal}"]`)) {
    aktivitetSelect.value = preVal;
  }

  aktivitetSelect.addEventListener('change', () => {
    const val = aktivitetSelect.value;
    const info = aktivitetInfo[val];

    if (info) {
      const ledige = info.ledig;
      const farge  = ledige <= 4 ? '#ff8080' : 'var(--accent-lt)';
      infoText.innerHTML = `
        <strong>${aktivitetSelect.options[aktivitetSelect.selectedIndex].text.split('(')[0].trim()}</strong><br>
        🕐 ${info.tid} &nbsp;|&nbsp; 📍 ${info.stad}<br>
        👨‍🏫 ${info.laerar}<br>
        <span style="color:${farge}">🪑 ${ledige} av ${info.maks} plassar ledige</span>
      `;
      infoBox.hidden = false;
    } else {
      infoBox.hidden = true;
    }
  });

  // Trigger om førehandsfylt
  if (preVal) aktivitetSelect.dispatchEvent(new Event('change'));
}

/* --- Teikn-teljar for merknad --- */
const merknadTa    = document.getElementById('merknad');
const merknadCount = document.getElementById('merknadCount');
const MAKS_TEIKN   = 300;

if (merknadTa && merknadCount) {
  merknadTa.addEventListener('input', () => {
    const n = merknadTa.value.length;
    merknadCount.textContent = `${n} / ${MAKS_TEIKN} teikn`;
    if (n > MAKS_TEIKN) {
      merknadTa.value = merknadTa.value.slice(0, MAKS_TEIKN);
      merknadCount.style.color = 'var(--danger)';
    } else {
      merknadCount.style.color = '';
    }
  });
}

/* --- Validering av kvart felt --- */
function validerFornamn() {
  const val = document.getElementById('fornamn').value.trim();
  if (!val)            { visFeil('fornamn', 'fornamn-err', 'Fornamn er påkravd.'); return false; }
  if (val.length < 2)  { visFeil('fornamn', 'fornamn-err', 'Fornamn må vera minst 2 teikn.'); return false; }
  visOk('fornamn', 'fornamn-err');
  return true;
}

function validerEtternamn() {
  const val = document.getElementById('etternamn').value.trim();
  if (!val)            { visFeil('etternamn', 'etternamn-err', 'Etternamn er påkravd.'); return false; }
  if (val.length < 2)  { visFeil('etternamn', 'etternamn-err', 'Etternamn må vera minst 2 teikn.'); return false; }
  visOk('etternamn', 'etternamn-err');
  return true;
}

function validerEpost() {
  const val = document.getElementById('epost').value.trim();
  const re  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!val)        { visFeil('epost', 'epost-err', 'E-post er påkravd.'); return false; }
  if (!re.test(val)){ visFeil('epost', 'epost-err', 'Skriv inn ein gyldig e-postadresse.'); return false; }
  visOk('epost', 'epost-err');
  return true;
}

function validerKlasse() {
  const val = document.getElementById('klasse').value;
  if (!val) { visFeil('klasse', 'klasse-err', 'Du må velje klasse.'); return false; }
  visOk('klasse', 'klasse-err');
  return true;
}

function validerAktivitet() {
  const val = document.getElementById('aktivitet').value;
  if (!val) { visFeil('aktivitet', 'aktivitet-err', 'Du må velje ein aktivitet.'); return false; }
  visOk('aktivitet', 'aktivitet-err');
  return true;
}

function validerSamtykke() {
  const cb  = document.getElementById('samtykke');
  const err = document.getElementById('samtykke-err');
  if (!cb.checked) {
    err.textContent = 'Du må samtykkje for å melde deg på.';
    return false;
  }
  err.textContent = '';
  return true;
}

/* --- Live-validering (ved blur) --- */
document.getElementById('fornamn')  ?.addEventListener('blur', validerFornamn);
document.getElementById('etternamn')?.addEventListener('blur', validerEtternamn);
document.getElementById('epost')    ?.addEventListener('blur', validerEpost);
document.getElementById('klasse')   ?.addEventListener('blur', validerKlasse);
document.getElementById('aktivitet')?.addEventListener('blur', validerAktivitet);

/* --- Send inn --- */
const sendBtn      = document.getElementById('sendBtn');
const formError    = document.getElementById('formError');
const formSuccess  = document.getElementById('formSuccess');
const skjemaWrapper= document.getElementById('skjemaWrapper');

if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    // Køyr alle valideringar
    const ok = [
      validerFornamn(),
      validerEtternamn(),
      validerEpost(),
      validerKlasse(),
      validerAktivitet(),
      validerSamtykke(),
    ].every(Boolean);

    formError.hidden   = ok;
    formSuccess.hidden = !ok;

    if (ok) {
      // Skjul sjølve skjemaet etter vellukka innsending
      skjemaWrapper.style.opacity = '0.4';
      skjemaWrapper.style.pointerEvents = 'none';
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // I eit ekte system hadde ein sendt data til ein server her.
      // console.log('Data klar til sending:', innsamleData());
    } else {
      formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

/* --- Nullstill --- */
const nullstillBtn = document.getElementById('nullstillBtn');

if (nullstillBtn) {
  nullstillBtn.addEventListener('click', () => {
    ['fornamn','etternamn','epost','klasse','aktivitet'].forEach(id => {
      nullstillFelt(id, `${id}-err`);
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const merknad = document.getElementById('merknad');
    if (merknad) merknad.value = '';
    if (merknadCount) merknadCount.textContent = `0 / ${MAKS_TEIKN} teikn`;

    const cb  = document.getElementById('samtykke');
    const err = document.getElementById('samtykke-err');
    if (cb)  cb.checked = false;
    if (err) err.textContent = '';

    if (infoBox) infoBox.hidden = true;

    formError.hidden  = true;
    formSuccess.hidden = true;
    skjemaWrapper.style.opacity = '';
    skjemaWrapper.style.pointerEvents = '';
  });
}

/* --- Hjelpe: samle inn skjemadata --- */
function innsamleData() {
  return {
    fornamn:   document.getElementById('fornamn').value.trim(),
    etternamn: document.getElementById('etternamn').value.trim(),
    epost:     document.getElementById('epost').value.trim(),
    klasse:    document.getElementById('klasse').value,
    aktivitet: document.getElementById('aktivitet').value,
    merknad:   document.getElementById('merknad').value.trim(),
  };
}
