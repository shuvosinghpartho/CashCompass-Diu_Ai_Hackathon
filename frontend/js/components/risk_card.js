const RiskCardComponent = {
  render: (data) => {
    DOM.animateCounter('valCurrentBalance', data.current_balance);
    DOM.setText('valDeficitDate', data.deficit_date);
    DOM.setHTML('valDaysLeft', `<i class="fa-solid fa-clock"></i> ${data.days_left} Days Before Paycheck`);
    DOM.animateCounter('valRiskPercent', data.risk_percent);
    DOM.animateCounter('valFeeLeakage', data.avoidable_fees);

    const badge = DOM.get('badgeRiskLevel');
    const stressCard = DOM.get('cardStressDate');

    if (badge) {
      const riskMeta = RISK_LEVELS[data.risk_level] || RISK_LEVELS.MODERATE;
      badge.innerText = riskMeta.label;
      badge.className = `risk-badge ${riskMeta.colorClass}`;
    }

    if (stressCard) {
      if (data.risk_level === 'CRITICAL') {
        stressCard.classList.add('warning-border');
      } else {
        stressCard.classList.remove('warning-border');
      }
    }
  }
};