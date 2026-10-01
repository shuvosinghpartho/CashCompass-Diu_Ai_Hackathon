const ShapComponent = {
  render: (shapFactors) => {
    const container = DOM.get('shapFactorsList');
    if (!container || !shapFactors) return;

    container.innerHTML = '';
    shapFactors.forEach((factor) => {
      const item = document.createElement('div');
      item.className = 'shap-item';
      item.innerHTML = `
        <div class="shap-label-row">
          <span class="shap-feature"><i class="fa-solid ${factor.icon}"></i> ${factor.label}</span>
          <span class="shap-impact text-red">${factor.impact}</span>
        </div>
        <div class="bar-rail">
          <div class="bar-fill ${factor.fillClass}" style="width: 0%;"></div>
        </div>
      `;
      container.appendChild(item);

      // Trigger width animation on next frame
      setTimeout(() => {
        const fillEl = item.querySelector('.bar-fill');
        if (fillEl) fillEl.style.width = `${factor.percent}%`;
      }, 50);
    });
  }
};