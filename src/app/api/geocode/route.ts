import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  if (!q || q.length < 2) return NextResponse.json([]);

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1&accept-language=en`,
      { headers: { 'User-Agent': 'Zorya/1.0' } }
    );
    const data = await res.json();

    const cities = data
      .filter((r: any) => ['city', 'town', 'village', 'administrative'].includes(r.type) || r.class === 'place' || r.addresstype === 'city' || r.addresstype === 'town' || r.addresstype === 'village')
      .map((r: any) => ({
        name: r.address?.city || r.address?.town || r.address?.village || r.name,
        country: r.address?.country || '',
        countryCode: (r.address?.country_code || '').toUpperCase(),
        lat: parseFloat(r.lat),
        lon: parseFloat(r.lon),
        display: `${r.address?.city || r.address?.town || r.address?.village || r.name}, ${r.address?.country || ''}`,
      }));

    return NextResponse.json(cities);
  } catch {
    return NextResponse.json([]);
  }
}
