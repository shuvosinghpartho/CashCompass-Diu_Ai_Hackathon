const CONFIG = {
  APP_NAME: 'CashCompass',
  VERSION: '1.0.0',
  API_BASE_URL: 'http://localhost:8000/api/v1',
  ANIMATION_DURATION: 1200,
  SAFE_BALANCE_THRESHOLD: 500,
  DEFAULT_PERSONA: 'salaried',
  CURRENCY_SYMBOL: '৳'
};

const RISK_LEVELS = {
  CRITICAL: { label: 'CRITICAL PRESSURE', colorClass: 'high' },
  MODERATE: { label: 'MODERATE RISK', colorClass: 'amber' },
  SAFE: { label: 'HEALTHY BUFFER', colorClass: 'green' }
};