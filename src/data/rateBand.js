const BASE_RATE_BANDS = {
  home: { low: 8.0, high: 11.0 },
  lap: { low: 9.0, high: 13.0 },
  gold: { low: 9.0, high: 15.0 },
  personal: { low: 10.5, high: 16.0 },
  business: { low: 14.0, high: 20.0 },
  twoWheeler: { low: 11.0, high: 18.0 },
};


export function getBaseRateBand(loanTyp) {
  const base = BASE_RATE_BANDS[loanTyp] ?? [];
  if(base.length === 0) {
    alert(`Invalid loan type: ${loanTyp}`);
  }
  return base;
}