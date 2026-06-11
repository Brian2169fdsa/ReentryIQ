// po-data.jsx — synthetic release dataset for the ReentryIQ prototype.
// ALL names are randomly generated and fictional. Facilities are real Arizona
// ADCRR complex names (public information); counties are Arizona counties.
// Nothing here is a real person or a real record.

(function () {
  // Deterministic PRNG so the dataset is stable across reloads.
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rnd = mulberry32(20260610);
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const between = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));

  const FIRST = ['Marcus','Daniel','Andre','Jerome','Travis','Carlos','Devon','Tyler','Brandon','Shawn',
    'Derrick','Antonio','Miguel','Jordan','Keith','Ricardo','Damian','Curtis','Lamar','Victor',
    'Crystal','Tanya','Monica','Jasmine','Rebecca','Sandra','Latoya','Vanessa','Angela','Renee',
    'Dustin','Cody','Wyatt','Hunter','Garrett','Trevor','Mason','Logan','Caleb','Austin'];
  const LAST = ['Whitfield','Ramos','Delgado','Hawkins','Brennan','Castillo','Okafor','Vega','Sanderson','Pruitt',
    'Mercer','Calloway','Estrada','Tran','Bowen','Acosta','Reyes','Holloway','Salazar','Fontaine',
    'Ackerman','Munoz','Boyd','Cervantes','Driscoll','Yates','Nakamura','Childress','Ibarra','Schaefer',
    'Lott','Aguirre','Booker','Ferrell','Quintero','Mathis','Bautista','Crowder','Espinoza','Tillman'];

  // facility -> primary county it releases into (most releases route to home county)
  const FACILITIES = [
    { name: 'ASPC-Lewis',      unit: 'Buckley',   county: 'Maricopa' },
    { name: 'ASPC-Perryville', unit: 'Santa Cruz',county: 'Maricopa' },
    { name: 'ASPC-Eyman',      unit: 'Browning',  county: 'Pinal' },
    { name: 'ASPC-Florence',   unit: 'Central',   county: 'Pinal' },
    { name: 'ASPC-Tucson',     unit: 'Rincon',    county: 'Pima' },
    { name: 'ASPC-Phoenix',    unit: 'Flamenco',  county: 'Maricopa' },
    { name: 'ASPC-Yuma',       unit: 'Cheyenne',  county: 'Yuma' },
    { name: 'ASPC-Douglas',    unit: 'Gila',      county: 'Cochise' },
    { name: 'ASPC-Safford',    unit: 'Graham',    county: 'Graham' },
    { name: 'ASPC-Winslow',    unit: 'Kaibab',    county: 'Navajo' },
  ];
  const COUNTIES = ['Maricopa','Pima','Pinal','Yuma','Cochise','Graham','Navajo','Yavapai','Mohave','Coconino'];
  // realistic-ish weighting toward population centers
  const COUNTY_WEIGHTS = { Maricopa: 42, Pima: 18, Pinal: 10, Yuma: 6, Cochise: 5, Yavapai: 5, Mohave: 4, Navajo: 4, Graham: 3, Coconino: 3 };

  const OFFENSE_CLASS = ['Class 4','Class 5','Class 6','Class 3','Class 2'];
  const CUSTODY = ['Minimum','Medium','Close'];
  const SUPERVISION = ['Community Supervision','Standard Probation','Absolute Discharge'];

  function weightedCounty() {
    const entries = Object.entries(COUNTY_WEIGHTS);
    const total = entries.reduce((s, [, w]) => s + w, 0);
    let r = rnd() * total;
    for (const [c, w] of entries) { if ((r -= w) <= 0) return c; }
    return 'Maricopa';
  }

  const TODAY = new Date(2026, 5, 10); // June 10 2026, matches prototype "now"
  const DAY_MS = 86400000;
  const HORIZON_DAYS = 180;

  // Build a per-day base volume curve with mild weekly seasonality (fewer on weekends)
  // and a couple of soft humps to make the Horizon read as real.
  function dayVolume(dayIdx) {
    const date = new Date(TODAY.getTime() + dayIdx * DAY_MS);
    const dow = date.getDay();
    let base = 4.2;
    if (dow === 0 || dow === 6) base *= 0.35;          // weekends light (releases skew weekdays)
    base *= 1 + 0.35 * Math.sin((dayIdx / 180) * Math.PI * 2.0);  // slow seasonal wave
    base *= 1 + 0.18 * Math.sin((dayIdx / 30) * Math.PI * 2.0);   // monthly ripple
    base += (rnd() - 0.5) * 1.4;                                   // jitter
    return Math.max(0, Math.round(base));
  }

  // Generate the records, distributed across the horizon by the volume curve.
  let id = 4821;
  const records = [];
  for (let d = 0; d < HORIZON_DAYS; d++) {
    const n = dayVolume(d);
    const releaseDate = new Date(TODAY.getTime() + d * DAY_MS);
    for (let k = 0; k < n; k++) {
      const fac = pick(FACILITIES);
      // 65% release to facility's home county, else a weighted county
      const county = rnd() < 0.62 ? fac.county : weightedCounty();
      const first = pick(FIRST);
      const last = pick(LAST);
      const score = Math.min(99, Math.max(31, Math.round(
        58 + (rnd() - 0.5) * 50 + (county === 'Maricopa' ? 8 : 0)
      )));
      records.push({
        id: 'AZ-' + (id++),
        docNumber: String(between(180000, 399999)),
        first, last,
        name: first + ' ' + last,
        facility: fac.name,
        unit: fac.unit,
        county,
        releaseDate: releaseDate.toISOString().slice(0, 10),
        releaseDayIdx: d,
        custody: pick(CUSTODY),
        offenseClass: pick(OFFENSE_CLASS),
        supervision: pick(SUPERVISION),
        sentenceYears: (between(6, 96) / 12), // 0.5 - 8 yrs
        score,
        age: between(21, 58),
      });
    }
  }

  // Daily aggregate for the Release Horizon
  const dailyCounts = [];
  for (let d = 0; d < HORIZON_DAYS; d++) {
    const date = new Date(TODAY.getTime() + d * DAY_MS);
    dailyCounts.push({
      dayIdx: d,
      date: date.toISOString().slice(0, 10),
      count: records.filter(r => r.releaseDayIdx === d).length,
    });
  }

  function daysUntil(isoDate) {
    const d = new Date(isoDate + 'T00:00:00');
    return Math.round((d - TODAY) / DAY_MS);
  }

  window.PO_DATA = {
    TODAY,
    HORIZON_DAYS,
    COUNTIES,
    FACILITIES,
    OFFENSE_CLASS,
    records,
    dailyCounts,
    daysUntil,
    totalReleases: records.length,
  };
})();
