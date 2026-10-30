// Alert tiers from the Google SRE Workbook (multiwindow, multi-burn-rate alerts): the share of
// the error budget spent within the long window that should trigger the alert.
var OHSLO_TIERS = [
  { severity: 'page', budgetPct: 2, longH: 1, shortMin: 5 },
  { severity: 'page', budgetPct: 5, longH: 6, shortMin: 30 },
  { severity: 'ticket', budgetPct: 10, longH: 72, shortMin: 360 }
];

function ohsloCalc(i) {
  var windowH = i.windowDays * 24;
  var allowed = 1 - i.sloPct / 100;            // allowed error ratio
  var budgetMin = windowH * 60 * allowed;      // downtime-equivalent minutes per window

  var periods = [
    { label: 'Per day', min: 24 * 60 * allowed },
    { label: 'Per week', min: 7 * 24 * 60 * allowed },
    { label: 'Per ' + i.windowDays + '-day window', min: budgetMin },
    { label: 'Per year', min: 365 * 24 * 60 * allowed }
  ];

  var requests = i.reqPerSec > 0 ? i.reqPerSec * windowH * 3600 : 0;
  var failedAllowed = requests * allowed;

  var burnRate = allowed > 0 ? (i.errorRatePct / 100) / allowed : Infinity;
  var remaining = Math.max(0, Math.min(100, i.remainingPct)) / 100;
  // Hours until the remaining budget is gone at the current burn rate.
  var hoursLeft = burnRate > 0 ? remaining * windowH / burnRate : Infinity;

  var tiers = OHSLO_TIERS.map(function (t) {
    var threshold = (t.budgetPct / 100) * windowH / t.longH;
    return {
      severity: t.severity,
      budgetPct: t.budgetPct,
      longH: t.longH,
      shortMin: t.shortMin,
      burnRate: threshold,
      errorRatio: threshold * allowed,
      // Time to exhaust a full budget at exactly the threshold burn rate.
      exhaustH: windowH / threshold
    };
  });

  return {
    allowed: allowed,
    budgetMin: budgetMin,
    periods: periods,
    requests: requests,
    failedAllowed: failedAllowed,
    burnRate: burnRate,
    hoursLeft: hoursLeft,
    tiers: tiers,
    valid: i.sloPct > 0 && i.sloPct < 100 && i.windowDays > 0
  };
}
