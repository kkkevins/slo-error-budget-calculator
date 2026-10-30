# SLO Error Budget Calculator

Turn an SLO target into an error budget, see how fast the current error rate burns it, and generate multiwindow, multi-burn-rate alerting rules for Prometheus.

**Use it online:** [opshubs.space/tools/slo-error-budget-calculator/](https://opshubs.space/tools/slo-error-budget-calculator/)

The online page also explains the formula, the assumptions behind each default and how to measure your own numbers.

## What it does

- Allowed downtime and failed requests per day, week and SLO window
- Current burn rate and time until the budget is exhausted
- Multiwindow, multi-burn-rate alert thresholds in the style of the Google SRE Workbook
- Ready-to-paste Prometheus alerting rules

Useful when you are writing your first SLO or replacing noisy threshold alerts.

## Run it locally

Everything runs in the browser with no dependencies, build step or tracking. Clone the repo and open `index.html`.

The calculation logic lives in `calc.js` and has no DOM dependencies. To run the tests (Node.js 18 or newer):

```sh
node test.js
```

It prints a success line when all assertions pass.

## Files

| File | Purpose |
|---|---|
| `index.html` | Standalone calculator page |
| `calc.js` | Pure calculation function |
| `test.js` | Unit tests for `calc.js` |

## Feedback

Found a wrong assumption or have real-world numbers that disagree with the estimate? Open an issue. Corrections backed by documentation or measurements are very welcome.

More free ops tools: [opshubs.space/tools](https://opshubs.space/tools/)

## License

MIT
