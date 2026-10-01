class StateService {
  constructor() {
    this.currentPersona = CONFIG.DEFAULT_PERSONA;
    this.data = this.clonePersonaData(this.currentPersona);
    this.bufferVaultLocked = false;
    this.bufferVaultBalance = 0;
    this.bufferVaultGoal = 5000;
    this.listeners = [];
  }

  clonePersonaData(personaKey) {
    const source = MOCK_DATA[personaKey];
    return typeof structuredClone === 'function'
      ? structuredClone(source)
      : JSON.parse(JSON.stringify(source));
  }

  getPersona() {
    return this.currentPersona;
  }

  getData() {
    return this.data;
  }

  setPersona(personaKey) {
    if (!MOCK_DATA[personaKey]) return;
    this.currentPersona = personaKey;
    this.data = this.clonePersonaData(personaKey);
    this.bufferVaultLocked = false;
    this.bufferVaultBalance = 0;
    this.bufferVaultGoal = 5000;
    this.notify();
  }

  applyBufferVault(amount = 500) {
    if (!Number.isInteger(amount) || amount < 1 || this.bufferVaultBalance + amount > this.bufferVaultGoal || this.data.current_balance - this.bufferVaultBalance < amount) return false;

    this.bufferVaultBalance += amount;
    this.bufferVaultLocked = this.bufferVaultBalance >= this.bufferVaultGoal;
    
    // Shift forecast trajectory upwards by vault amount to simulate resilience
    const p50 = this.data.forecast.p50.map(v => v !== null ? v + amount : null);
    const p10 = this.data.forecast.p10.map(v => v !== null ? v + amount : null);
    this.data.forecast.p50 = p50;
    this.data.forecast.p10 = p10;
    
    this.data.risk_percent = Math.max(5, this.data.risk_percent - Math.max(3, Math.round(amount / 500 * 7)));
    this.data.risk_level = this.data.risk_percent > 65 ? 'CRITICAL' : (this.data.risk_percent > 30 ? 'MODERATE' : 'SAFE');
    
    this.notify();
    return true;
  }

  setBufferVaultGoal(goal) {
    const parsedGoal = Number(goal);
    if (![5000, 10000, 25000].includes(parsedGoal)) return false;
    this.bufferVaultGoal = parsedGoal;
    this.bufferVaultLocked = this.bufferVaultBalance >= this.bufferVaultGoal;
    this.notify();
    return true;
  }

  adjustWalletBalance(delta) {
    if (this.data.current_balance - this.bufferVaultBalance + delta < 0) return false;

    this.data.current_balance += delta;
    ['historical', 'p50', 'p10', 'p90'].forEach((seriesName) => {
      const series = this.data.forecast[seriesName];
      const firstForecastIndex = seriesName === 'historical' ? series.length - 1 : 7;
      for (let index = firstForecastIndex; index < series.length; index += 1) {
        if (series[index] !== null) series[index] += delta;
      }
    });

    this.notify();
    return true;
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.data));
  }
}

const appState = new StateService();