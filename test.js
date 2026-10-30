const fs = require('fs');
eval(fs.readFileSync(require('path').join(__dirname, 'calc.js'), 'utf8'));
const assert = require('assert');
const near = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-6, `${msg}: ${a} vs ${b}`);
const base = { sloPct: 99.9, windowDays: 30, reqPerSec: 100, errorRatePct: 0.5, remainingPct: 100 };

let r = ohsloCalc(base);
near(r.allowed, 0.001, 'allowed');
near(r.budgetMin, 43.2, '30d budget minutes');        // 43m12s
near(r.periods[0].min, 1.44, 'per day');
near(r.requests, 100 * 30 * 86400, 'requests');
near(r.failedAllowed, 259200, 'failed allowed');
near(r.burnRate, 5, 'burn rate');                     // 0.5% / 0.1%
near(r.hoursLeft, 720 / 5, 'hours left');             // 6 days
// SRE workbook values for a 30-day window
near(r.tiers[0].burnRate, 14.4, 'tier1');
near(r.tiers[1].burnRate, 6, 'tier2');
near(r.tiers[2].burnRate, 1, 'tier3');
near(r.tiers[0].errorRatio, 0.0144, 'tier1 ratio');
near(r.tiers[0].exhaustH, 50, 'tier1 exhaust');

// 28-day window scales thresholds
r = ohsloCalc({ ...base, windowDays: 28 });
near(r.tiers[0].burnRate, 13.44, '28d tier1');
near(r.tiers[1].burnRate, 5.6, '28d tier2');

// 7-day window matches OneUptime's 3.36x fast-burn example
near(ohsloCalc({ ...base, windowDays: 7 }).tiers[0].burnRate, 3.36, '7d tier1');

// remaining budget and zero errors
r = ohsloCalc({ ...base, remainingPct: 25 });
near(r.hoursLeft, 0.25 * 720 / 5, 'remaining 25%');
r = ohsloCalc({ ...base, errorRatePct: 0 });
assert.strictEqual(r.burnRate, 0); assert.strictEqual(r.hoursLeft, Infinity);

// 99.99 / 30d = 4.32 min
near(ohsloCalc({ ...base, sloPct: 99.99 }).budgetMin, 4.32, '99.99');
assert.strictEqual(ohsloCalc({ ...base, sloPct: 100 }).valid, false);
console.log('all slo calc tests passed');
