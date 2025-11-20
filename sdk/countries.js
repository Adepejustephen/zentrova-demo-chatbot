// Countries module: populate selects with all world countries
// Uses RestCountries API to fetch names and dialing codes, with graceful fallback

function flagEmoji(iso2) {
  try {
    if (!iso2 || iso2.length !== 2) return '';
    const codePoints = [...iso2.toUpperCase()].map(c => 127397 + c.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch (_) {
    return '';
  }
}

export async function populateCountrySelect(selectId, defaultDial = '+234') {
  const select = document.getElementById(selectId);
  if (!select) return;

  // Show loading state
  try { select.innerHTML = '<option value="">Loading countries...</option>'; } catch (_) {}

  try {
    const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd');
    if (!res.ok) throw new Error('Failed to fetch countries');
    const countries = await res.json();

    const items = [];
    for (const c of countries) {
      const name = c?.name?.common || '';
      const cca2 = c?.cca2 || '';
      const root = c?.idd?.root || '';
      const suffixes = Array.isArray(c?.idd?.suffixes) ? c.idd.suffixes : [];
      if (!name || !root || suffixes.length === 0) continue;
      const flag = flagEmoji(cca2);
      for (const s of suffixes) {
        const dial = `${root}${s}`;
        items.push({ name, dial, flag });
      }
    }

    // Sort by country name for usability
    items.sort((a, b) => a.name.localeCompare(b.name));

    // Build options HTML
    let html = '';
    for (const it of items) {
      const selected = (it.dial === defaultDial) ? ' selected' : '';
      const label = `${it.flag ? it.flag + ' ' : ''}${it.name} (${it.dial})`;
      html += `<option value="${it.dial}"${selected}>${label}</option>`;
    }

    if (html) {
      select.innerHTML = html;
    } else {
      throw new Error('No countries with dialing codes');
    }
  } catch (err) {
    // Fallback: keep existing static options
    console.warn('Country population failed:', err?.message || err);
    try {
      // If select was empty, provide a minimal fallback set
      if (!select.innerHTML || select.innerHTML.includes('Loading countries')) {
        select.innerHTML = [
          '<option value="+234">🇳🇬 Nigeria (+234)</option>',
          '<option value="+1">🇺🇸 United States (+1)</option>',
          '<option value="+44">🇬🇧 United Kingdom (+44)</option>'
        ].join('');
      }
    } catch (_) {}
  }
}