# CashCompass Frontend

## Frontend File Structure

```text
cashcompass-frontend/
|
|-- index.html                           # Main dashboard & application layout
|
|-- assets/
|   |-- images/
|   |   |-- cashcompass-logo.svg         # CashCompass navigation mark
|   |   |-- favicon.ico                  # Browser tab icon
|   |   `-- avatar-placeholder.png       # User profile persona avatars
|   `-- icons/
|       |-- alert-triangle.svg           # Liquidity risk warning indicator icon
|       |-- trend-down.svg               # Cash-flow drop indicators
|       |-- shield-check.svg             # Verified status & buffer vault icon
|       `-- wallet.svg                   # Balance & MFS card icon
|
|-- css/
|   |-- main.css                         # Global base styles, reset, and theme variables
|   |-- layout.css                       # Grid, flexbox containers, sidebar & responsive navigation
|   |-- components.css                   # Buttons, cards, alert banners, modal dialogs, badges
|   |-- forecast-chart.css               # Styling for canvas chart tooltips and zone highlights
|   `-- responsive.css                   # Mobile, tablet, and desktop responsive breakpoints
|
|-- js/
|   |-- app.js                           # Application bootstrapper and event orchestrator
|   |-- config/
|   |   `-- constants.js                 # API base URLs, threshold constants, status codes
|   |-- data/
|   |   `-- mock_data.js                 # Offline fallback data (Rahim & Tanvir personas for local testing)
|   |-- services/
|   |   |-- api.js                       # Native Fetch API wrappers for backend communication
|   |   `-- state.js                     # Simple reactive-like state store for selected user & chart data
|   |-- components/
|   |   |-- chart_renderer.js            # Chart rendering logic (via Chart.js CDN or custom SVG/Canvas)
|   |   |-- risk_card.js                 # Liquidity crunch risk score & badge visual updates
|   |   |-- shap_breakdown.js            # Top-3 spending leaks horizontal bar visualizer
|   |   |-- bangla_coach.js              # Plain-language advisory card & audio/text toggle renderer
|   |   `-- action_vault.js              # One-click emergency buffer vault interaction handler
|   `-- utils/
|       |-- formatters.js                # BDT currency formatter (e.g., ৳1,500), dates, percentage helpers
|       `-- dom_helpers.js               # Element selector shortcuts, class togglers, safe text setters
|
`-- README.md                            # Setup guide (how to run using Live Server or local HTTP server)
```

## Experience

CashCompass is a single-page application with distinct forecast, explainability, reserve vault, coach, responsible-AI, and mobile wallet screens. The workspace stays within the viewport; the mobile navigation menu scrolls internally. Light and dark themes are persisted in the browser.

The forecast view supports 7-, 14-, and 30-day horizons with CSV export. Explainability recommendations change with the selected persona. The reserve supports selectable contribution amounts and savings goals. The coach includes Bangla audio and a cycle checklist. Wallet activity can be filtered and exported, with balance masking and copy-number controls. The audit view explains included/excluded signals and exports a governance record.

All financial actions use persona mock data in browser memory/session storage. They do not connect to a payment network or move real money. The forecast chart loads Chart.js from its CDN; the remaining workspace stays usable if that connection is unavailable.

## Run Locally

From the workspace root, serve the frontend folder with:

```sh
python3 -m http.server 4173 --directory cashcompass-frontend
```

Then open `http://localhost:4173`. VS Code Live Server also works when started from `index.html`.

