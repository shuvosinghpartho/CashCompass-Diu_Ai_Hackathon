const ApiService = {
  fetchForecast: async (personaId) => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/forecast/${personaId}`);
      if (!response.ok) throw new Error('Network response not ok');
      return await response.json();
    } catch (err) {
      console.warn('[ApiService] Backend offline. Yielding synthetic fallback data.', err);
      return MOCK_DATA[personaId];
    }
  },

  postBufferLock: async (personaId, amount) => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/vault/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: personaId, amount })
      });
      return await response.json();
    } catch (err) {
      console.warn('[ApiService] Vault action processed via local state simulation.', err);
      return { success: true, amount, simulated: true };
    }
  }
};