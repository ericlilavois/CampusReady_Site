export function isValidEmail(email) {
  const trimmed = email.trim().toLowerCase();
  const basicPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const knownTypos = ['.con', '@gmaal', '@gmial', '@hotmial', '@yaho', '@outlok'];

  if (!basicPattern.test(trimmed)) return false;
  for (const typo of knownTypos) {
    if (trimmed.includes(typo)) return false;
  }
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
