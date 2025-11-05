eexport function isValidEmail(email) {
    const val = (email || '').trim();
    if (!val) return false;

    // 1. Structural Check: Single @
    const atIndex = val.indexOf('@');
    if (atIndex <= 0 || atIndex !== val.lastIndexOf('@') || atIndex === val.length - 1) return false;

    const parts = val.split('@');
    const local = parts[0], domain = parts[1];

    // 2. Local Part Rules: (Cannot start/end with dot, no control characters, etc.)
    if (!local || local.length > 64 || local.startsWith('.') || local.endsWith('.')) return false;
    if (local.includes('..')) return false;
    for (const ch of local) {
        const code = ch.charCodeAt(0);
        if (code <= 31 || code === 127 || [' ', '"', '\\', '<', '>'].includes(ch)) return false;
    }

    // 3. Domain Part Rules: (At least two labels, no illegal chars/hyphens)
    if (!domain) return false;
    const labels = domain.split('.');
    if (labels.length < 2) return false;

    for (const lab of labels) {
        if (!lab || lab.length > 63 || lab.startsWith('-') || lab.endsWith('-')) return false;
        // Allows letters, numbers, and hyphens (and unicode as per RFC)
        if (/[^0-9A-Za-z\u00C0-\uFFFF-]/.test(lab)) return false;
    }

    // 4. Typo Blocking: Specific TLDs
    const tld = labels[labels.length - 1].toLowerCase();
    if (tld.length < 2) return false;
    
    // Blocks common typos that pass basic regex
    const badTLD = ['con', 'cmo', 'ocm', 'net', 'in']; 
    if (badTLD.includes(tld)) return false;

    return true;
}

export function isValidZip(zip) {
  const trimmed = zip.trim();
  const zipPattern = /^\d{5}$/;
  return zipPattern.test(trimmed);
}
export async function doesZipMatchCityState(zip, city, state) {
  const trimmedZip = zip.trim();
  const trimmedCity = city.trim().toLowerCase();
  const trimmedState = state.trim().toLowerCase();

  try {
    const response = await fetch(`https://api.zippopotam.us/us/${trimmedZip}`);
    if (!response.ok) return false;

    const data = await response.json();
    const places = data.places || [];

    return places.some(place => {
      const apiCity = place['place name'].toLowerCase();
      const apiState = place['state abbreviation'].toLowerCase();
      return apiCity === trimmedCity && apiState === trimmedState;
    });
  } catch (error) {
    console.error('ZIP lookup failed:', error);
    return false;
  }
}
