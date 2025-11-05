export function isValidEmail(email) {
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
    -    const badTLD = ['con', 'cmo', 'ocm', 'net', 'in']; 
-    if (badTLD.includes(tld)) return false;
+    // Optional: keep only truly common typo TLDs; do NOT block real TLDs like .net / .in
+    const badTLD = ['con', 'cmo', 'ocm'];
+    if (badTLD.includes(tld)) return false;
    return true;
}

export function isValidZip(zip) {
// Allow 5-digit or ZIP+4 with optional hyphen
return /^\d{5}(-\d{4})?$/.test(String(zip || '').trim());
}

export async function doesZipMatchCityState(zip, city, state) {
// Normalize inputs
const zip5 = String(zip || '').trim().slice(0, 10).replace(/\D/g, '').slice(0, 5); // use 5-digit portion
const st  = String(state || '').trim().toUpperCase(); // USPS 2-letter via <select>
const normCity = (s) => {
let x = String(s || '').toLowerCase();
x = x.replace(/\./g, '');        // drop periods: "St." -> "St"
x = x.replace(/\s+/g, ' ').trim();
// Expand common prefixes to reduce false mismatches
x = x.replace(/^st\s+/, 'saint ');
x = x.replace(/^ste\s+/, 'sainte ');
return x;
};
const c = normCity(city);

try {
if (!zip5 || zip5.length !== 5) return false;
const response = await fetch(`https://api.zippopotam.us/us/${zip5}`);
if (!response.ok) return false;

const data = await response.json();
const places = Array.isArray(data.places) ? data.places : [];

return places.some(place => {
const apiCity  = normCity(place['place name']);
const apiState = String(place['state abbreviation'] || '').toUpperCase();
// Match on exact state, and city after normalization
return apiState === st && apiCity === c;
});
} catch (error) {
console.error('ZIP lookup failed:', error);
return false;
}
}
