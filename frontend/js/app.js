window.addEventListener('load', () => {
  const loader = document.getElementById('loader-wrapper');
  if (loader) {
    loader.classList.add('fade-out');
    setTimeout(() => loader.remove(), 500); // Remove from DOM after fade out
  }
});

document.addEventListener('DOMContentLoaded', () => {
  let selectedVaultAmount = 500;
  let balanceHidden = false;
  let activityFilter = 'all';
  const routeDetails = {
    forecast: { title: 'Liquidity overview', breadcrumb: 'Overview' },
    explainability: { title: 'Cash-flow drivers', breadcrumb: 'Explainability' },
    'reserve-vault': { title: 'Reserve vault', breadcrumb: 'Protected savings' },
    coach: { title: 'Financial coach', breadcrumb: 'Personal guidance' },
    audit: { title: 'Responsible AI', breadcrumb: 'Trust & transparency' },
    'unified-pull': { title: 'Unified Deposit', breadcrumb: 'MFS Integrations' },
    'mfs-wallet': { title: 'Mobile wallet', breadcrumb: 'Accounts & activity' }
  };

  const initialData = appState.getData();
  RiskCardComponent.render(initialData);
  ChartRenderer.init(initialData.forecast);
  ShapComponent.render(initialData.shap_factors);
  renderRecommendations(initialData);
  BanglaCoachComponent.render(initialData);
  renderWallet();
  ActionVaultComponent.init();

  appState.subscribe((updatedData) => {
    RiskCardComponent.render(updatedData);
    ChartRenderer.update(updatedData.forecast);
    ShapComponent.render(updatedData.shap_factors);
    renderRecommendations(updatedData);
    BanglaCoachComponent.render(updatedData);
    renderWallet();
  });

  const btnSalaried = DOM.get('btnPersonaSalaried');
  const btnStudent = DOM.get('btnPersonaStudent');

  if (btnSalaried && btnStudent) {
    btnSalaried.addEventListener('click', () => {
      setActivePersonaButton(btnSalaried);
      appState.setPersona('salaried');
      DOM.showToast('Simulating: Rahim Ahmed (Salaried ৳25k Persona)', 'info');
    });

    btnStudent.addEventListener('click', () => {
      setActivePersonaButton(btnStudent);
      appState.setPersona('student');
      DOM.showToast('Simulating: Tanvir Hasan (Freelancer Persona)', 'info');
    });
  }

  const btnRun = DOM.get('btnRunSimulation');
  if (btnRun) {
    btnRun.addEventListener('click', () => {
      btnRun.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Re-Calculating...</span>`;
      btnRun.disabled = true;

      setTimeout(() => {
        btnRun.innerHTML = `<i class="fa-solid fa-arrows-rotate"></i> <span>Re-Run Forecast</span>`;
        btnRun.disabled = false;
        ChartRenderer.update(appState.getData().forecast);
        DOM.showToast('30-Day Quantile Forecast refreshed with 90% confidence.', 'success');
      }, 700);
    });
  }

  const btnAudio = DOM.get('btnAudioCoach');
  if (btnAudio) {
    btnAudio.addEventListener('click', () => {
      BanglaCoachComponent.playAudio(appState.getData().coach_bangla);
    });
  }

  document.querySelectorAll('.nav-links .nav-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const hash = link.getAttribute('href');
      if (window.location.hash !== hash) history.pushState({ view: hash }, '', hash);
      setActiveNavigation(hash);
      closeNavigationMenu();
    });
  });
  document.querySelectorAll('[data-route]').forEach((button) => {
    button.addEventListener('click', () => navigateToRoute(button.dataset.route));
  });
  window.addEventListener('popstate', () => setActiveNavigation(window.location.hash || '#forecast'));
  window.addEventListener('hashchange', () => setActiveNavigation(window.location.hash || '#forecast'));
  setActiveNavigation(window.location.hash || '#forecast');

  const navigationToggle = DOM.get('btnToggleNavigation');
  if (navigationToggle) {
    navigationToggle.addEventListener('click', () => {
      const isOpen = DOM.get('sidebar').classList.toggle('nav-open');
      navigationToggle.setAttribute('aria-expanded', String(isOpen));
      navigationToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      navigationToggle.innerHTML = `<i class="fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}"></i>`;
    });
  }

  const themeToggle = DOM.get('btnToggleTheme');
  let savedTheme = 'light';
  try {
    savedTheme = localStorage.getItem('cashcompass-theme') || 'light';
  } catch (error) {
    savedTheme = document.body.dataset.theme || 'light';
  }
  setTheme(savedTheme === 'dark' ? 'dark' : 'light');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTheme(document.body.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }

  const forecastRange = DOM.get('forecastRange');
  if (forecastRange) {
    forecastRange.addEventListener('change', () => {
      ChartRenderer.setRange(forecastRange.value);
      DOM.setText('forecastHorizonLabel', `${forecastRange.value}-Day Cash-Flow Horizon`);
    });
  }

  const exportForecastButton = DOM.get('btnExportForecast');
  if (exportForecastButton) {
    exportForecastButton.addEventListener('click', () => {
      const { labels, historical, p50, p10, p90 } = appState.getData().forecast;
      const days = Number(forecastRange?.value || 30);
      const rows = [['Day', 'Actual balance (BDT)', 'Median forecast', 'Downside estimate', 'Upside estimate']];
      for (let index = 0; index < Math.min(days, labels.length); index += 1) {
        rows.push([labels[index], historical[index] ?? '', p50[index] ?? '', p10[index] ?? '', p90[index] ?? '']);
      }
      downloadCsv('cashcompass-forecast.csv', rows);
      DOM.showToast('Forecast exported for offline review.', 'success');
    });
  }

  const exportAuditButton = DOM.get('btnExportAudit');
  if (exportAuditButton) {
    exportAuditButton.addEventListener('click', () => {
      const data = appState.getData();
      downloadJson('cashcompass-audit-record.json', {
        generatedAt: new Date().toISOString(),
        model: 'Cash-flow quantile forecast, demo build',
        persona: data.persona_id,
        risk: { score: data.risk_percent, level: data.risk_level, forecastDeficitDate: data.deficit_date },
        explanatoryDrivers: data.shap_factors.map(({ label, impact, percent }) => ({ label, impact, relativeWeight: percent })),
        safeguards: ['Sensitive identity traits excluded', 'Forecast uncertainty shown to the user', 'No automated credit or lending decision'],
        dataMode: 'Local demonstration data; no server submission'
      });
      DOM.showToast('Audit record prepared for download.', 'success');
    });
  }

  document.querySelectorAll('[data-mfs-action]').forEach((button) => {
    button.addEventListener('click', () => openTransaction(button.dataset.mfsAction));
  });

  const transactionForm = DOM.get('transactionForm');
  if (transactionForm) transactionForm.addEventListener('submit', completeTransaction);
  ['btnCloseTransaction', 'btnCancelTransaction'].forEach((id) => {
    const button = DOM.get(id);
    if (button) button.addEventListener('click', closeTransaction);
  });

  const viewAllButton = DOM.get('btnViewAllActivity');
  if (viewAllButton) {
    viewAllButton.addEventListener('click', () => {
      const expanded = viewAllButton.getAttribute('aria-expanded') === 'true';
      viewAllButton.setAttribute('aria-expanded', String(!expanded));
      viewAllButton.innerHTML = expanded
        ? 'View all <i class="fa-solid fa-arrow-right"></i>'
        : 'Show less <i class="fa-solid fa-arrow-up"></i>';
      applyActivityFilter();
    });
  }

  document.querySelectorAll('[data-transaction-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      activityFilter = button.dataset.transactionFilter;
      document.querySelectorAll('[data-transaction-filter]').forEach((filterButton) => {
        const selected = filterButton === button;
        filterButton.classList.toggle('active', selected);
        filterButton.setAttribute('aria-pressed', String(selected));
      });
      applyActivityFilter();
    });
  });

  const exportTransactionsButton = DOM.get('btnExportTransactions');
  if (exportTransactionsButton) {
    exportTransactionsButton.addEventListener('click', () => {
      const rows = [['Transaction', 'Details', 'Amount']];
      document.querySelectorAll('#transactionList .transaction-row:not([hidden])').forEach((row) => {
        rows.push([
          row.querySelector('.transaction-copy strong')?.textContent || '',
          row.querySelector('.transaction-copy span')?.textContent || '',
          row.querySelector('.transaction-amount')?.textContent || ''
        ]);
      });
      downloadCsv('cashcompass-transactions.csv', rows);
      DOM.showToast('Visible wallet activity exported.', 'success');
    });
  }

  const balanceToggle = DOM.get('btnToggleBalance');
  if (balanceToggle) {
    balanceToggle.addEventListener('click', () => {
      balanceHidden = !balanceHidden;
      renderWallet();
      balanceToggle.setAttribute('aria-label', balanceHidden ? 'Show balance' : 'Hide balance');
      balanceToggle.title = balanceHidden ? 'Show balance' : 'Hide balance';
      balanceToggle.innerHTML = `<i class="fa-regular ${balanceHidden ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
    });
  }

  const copyAccountButton = DOM.get('btnCopyWalletAccount');
  if (copyAccountButton) {
    copyAccountButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(copyAccountButton.dataset.walletAccount);
        DOM.showToast('Wallet number copied.', 'success');
      } catch (error) {
        DOM.showToast('Clipboard access is unavailable in this browser.', 'info');
      }
    });
  }

  document.querySelectorAll('[data-vault-amount]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedVaultAmount = Number(button.dataset.vaultAmount);
      document.querySelectorAll('[data-vault-amount]').forEach((option) => {
        const selected = option === button;
        option.classList.toggle('active', selected);
        option.setAttribute('aria-pressed', String(selected));
      });
      renderWallet();
    });
  });

  const vaultGoalSelect = DOM.get('vaultGoalSelect');
  if (vaultGoalSelect) {
    vaultGoalSelect.addEventListener('change', () => appState.setBufferVaultGoal(vaultGoalSelect.value));
  }

  const coachTasks = Array.from(document.querySelectorAll('[data-coach-task]'));
  coachTasks.forEach((task, index) => {
    try {
      task.checked = sessionStorage.getItem(`cashcompass-coach-task-${index}`) === 'done';
    } catch (error) {
      task.checked = false;
    }
    task.addEventListener('change', () => {
      try {
        sessionStorage.setItem(`cashcompass-coach-task-${index}`, task.checked ? 'done' : 'todo');
      } catch (error) {
        task.dataset.sessionOnly = 'true';
      }
      updateCoachPlanProgress();
    });
  });
  updateCoachPlanProgress();
  const copyPlanButton = DOM.get('btnCopyCoachPlan');
  if (copyPlanButton) {
    copyPlanButton.addEventListener('click', async () => {
      const plan = coachTasks.map((task) => `${task.checked ? '[x]' : '[ ]'} ${task.nextElementSibling.textContent}`).join('\n');
      try {
        await navigator.clipboard.writeText(plan);
        DOM.showToast('Your action plan was copied.', 'success');
      } catch (error) {
        DOM.showToast('Clipboard access is unavailable in this browser.', 'info');
      }
    });
  }

  const digitalPayButton = DOM.get('btnSwitchDigital');
  if (digitalPayButton) {
    digitalPayButton.addEventListener('click', () => {
      document.querySelector('[data-mfs-action="pay"]')?.click();
    });
  }

  // --- MODULE 3: ROUTER OPTIMIZER ---
  const btnCalculateRoute = document.getElementById('btnCalculateRoute');
  const routeResultContainer = document.getElementById('routeResultContainer');
  const routeLoadingState = document.getElementById('routeLoadingState');
  const routeSuccessState = document.getElementById('routeSuccessState');
  const btnAutoRebalance = document.getElementById('btnAutoRebalance');

  if (btnCalculateRoute && routeResultContainer) {
    btnCalculateRoute.addEventListener('click', () => {
      routeResultContainer.style.display = 'block';
      routeLoadingState.style.display = 'flex';
      routeSuccessState.style.display = 'none';
      
      setTimeout(() => {
        routeLoadingState.style.display = 'none';
        routeSuccessState.style.display = 'block';
      }, 1500); // Simulate calculation delay
    });
  }

  if (btnAutoRebalance) {
    btnAutoRebalance.addEventListener('click', () => {
      DOM.showToast('Simulating One-Click Auto-Rebalance across 4 linked wallets...', 'info');
      setTimeout(() => DOM.showToast('Rebalance successful. Balances optimized.', 'success'), 2000);
    });
  }

  // --- MODULE 4: SECURITY SENTINEL ---
  const btnSimulateAttack = document.getElementById('btnSimulateAttack');
  const sentinelWidgetContainer = document.getElementById('sentinelWidgetContainer');
  const sentinelStatusLabel = document.getElementById('sentinelStatusLabel');
  const sentinelStatusIcon = document.getElementById('sentinelStatusIcon');
  const sentinelStatusTitle = document.getElementById('sentinelStatusTitle');
  const sentinelStatusDesc = document.getElementById('sentinelStatusDesc');
  const sentinelFlags = document.getElementById('sentinelFlags');

  if (btnSimulateAttack) {
    btnSimulateAttack.addEventListener('click', () => {
      const isAttack = btnSimulateAttack.textContent.includes('Simulate');
      
      if (isAttack) {
        sentinelWidgetContainer.style.backgroundColor = 'rgba(235, 87, 87, 0.05)';
        sentinelWidgetContainer.style.borderColor = '#eb5757';
        sentinelStatusLabel.textContent = 'ALERT ACTIVE';
        sentinelStatusLabel.style.color = '#eb5757';
        sentinelStatusIcon.className = 'fa-solid fa-triangle-exclamation';
        sentinelStatusIcon.style.color = '#eb5757';
        sentinelStatusTitle.textContent = 'Sybil Score: 0.94';
        sentinelStatusTitle.style.color = '#eb5757';
        sentinelStatusDesc.textContent = 'ALERT: Rapid Micro-Cashout Detected across 3 linked wallets';
        sentinelStatusDesc.style.color = '#eb5757';
        sentinelFlags.style.display = 'flex';
        btnSimulateAttack.textContent = 'Reset / Clear Simulation';
      } else {
        sentinelWidgetContainer.style.backgroundColor = 'rgba(11, 153, 107, 0.05)';
        sentinelWidgetContainer.style.borderColor = 'var(--status-green)';
        sentinelStatusLabel.textContent = 'Sentinel Active';
        sentinelStatusLabel.style.color = 'var(--status-green)';
        sentinelStatusIcon.className = 'fa-solid fa-shield-check';
        sentinelStatusIcon.style.color = 'var(--status-green)';
        sentinelStatusTitle.textContent = 'Sybil Score: 0.04';
        sentinelStatusTitle.style.color = 'var(--text-main)';
        sentinelStatusDesc.textContent = 'Clean / Normal Traffic';
        sentinelStatusDesc.style.color = 'var(--text-neutral)';
        sentinelFlags.style.display = 'none';
        btnSimulateAttack.textContent = 'Simulate Layering Attack';
      }
    });
  }

  function setActivePersonaButton(activeButton) {
    [btnSalaried, btnStudent].forEach((button) => {
      const isActive = button === activeButton;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function setActiveNavigation(hash) {
    const route = hash.replace(/^#/, '');
    const routeInfo = routeDetails[route] || routeDetails.forecast;
    document.body.dataset.view = routeDetails[route] ? route : 'forecast';
    DOM.setText('pageTitle', routeInfo.title);
    DOM.setText('activeCrumb', routeInfo.breadcrumb);

    document.querySelectorAll('.nav-links .nav-link').forEach((link) => {
      const isActive = link.getAttribute('href') === `#${route}`;
      link.closest('.nav-item').classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    if (route === 'forecast') ChartRenderer.resize();
    document.title = `${routeInfo.title} | CashCompass`;
  }

  function navigateToRoute(route) {
    const hash = `#${route}`;
    if (window.location.hash !== hash) history.pushState({ view: hash }, '', hash);
    setActiveNavigation(hash);
    closeNavigationMenu();
  }

  function renderRecommendations(data) {
    const container = DOM.get('recommendationList');
    const primaryDriver = data.shap_factors?.[0];
    if (primaryDriver) {
      DOM.setText('primaryDriver', primaryDriver.label);
      DOM.setText('primaryDriverImpact', primaryDriver.impact);
    }
    if (!container || !Array.isArray(data.recommendations)) return;

    container.replaceChildren();
    data.recommendations.forEach((recommendation) => {
      const item = document.createElement('article');
      item.className = 'recommendation-item';
      const copy = document.createElement('div');
      copy.className = 'recommendation-copy';
      const title = document.createElement('h4');
      title.textContent = recommendation.title;
      const detail = document.createElement('p');
      detail.textContent = recommendation.detail;
      const impact = document.createElement('span');
      impact.className = 'recommendation-impact';
      impact.textContent = recommendation.impact;
      copy.append(title, detail);

      const action = document.createElement('button');
      action.className = 'recommendation-action';
      action.type = 'button';
      action.dataset.route = recommendation.route;
      action.textContent = recommendation.action;
      action.addEventListener('click', () => navigateToRoute(recommendation.route));
      item.append(copy, impact, action);
      container.appendChild(item);
    });
  }

  function closeNavigationMenu() {
    const sidebar = DOM.get('sidebar');
    const navigationToggle = DOM.get('btnToggleNavigation');
    if (!sidebar || !navigationToggle) return;
    sidebar.classList.remove('nav-open');
    navigationToggle.setAttribute('aria-expanded', 'false');
    navigationToggle.setAttribute('aria-label', 'Open navigation menu');
    navigationToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }

  function downloadCsv(filename, rows) {
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const blobUrl = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' }));
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  }

  function downloadJson(filename, data) {
    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const blobUrl = URL.createObjectURL(file);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  }

  function setTheme(theme) {
    document.body.dataset.theme = theme;
    const isDark = theme === 'dark';
    const toggle = DOM.get('btnToggleTheme');
    if (toggle) {
      toggle.innerHTML = `<i class="fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}"></i>`;
      toggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
      toggle.title = `Switch to ${isDark ? 'light' : 'dark'} theme`;
    }
    try {
      localStorage.setItem('cashcompass-theme', theme);
    } catch (error) {
      document.body.dataset.theme = theme;
    }
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = isDark ? '#111714' : '#f3f6f5';
    ChartRenderer.setTheme(theme);
  }

  function renderWallet() {
    const availableBalance = appState.getData().current_balance - appState.bufferVaultBalance;
    DOM.setText('walletBalance', balanceHidden ? '••••••' : Formatters.currency(availableBalance));
    DOM.setText('vaultBalance', `${Formatters.currency(appState.bufferVaultBalance)} / ${Formatters.currency(appState.bufferVaultGoal)}`);

    const progress = DOM.get('vaultProgress');
    if (progress) progress.style.width = `${Math.min(100, appState.bufferVaultBalance / appState.bufferVaultGoal * 100)}%`;

    const vaultButton = DOM.get('btnLockMfsBuffer');
    const goalReached = appState.bufferVaultLocked;
    const canAddSelectedAmount = availableBalance >= selectedVaultAmount && appState.bufferVaultBalance + selectedVaultAmount <= appState.bufferVaultGoal;
    [DOM.get('btnLockBudget'), DOM.get('btnTriggerAutoVault')].forEach((button) => {
      if (button) button.disabled = goalReached || availableBalance < 500;
    });
    if (vaultButton) {
      vaultButton.disabled = goalReached || !canAddSelectedAmount;
      vaultButton.innerHTML = goalReached
        ? '<i class="fa-solid fa-circle-check"></i><span>Goal reached</span>'
        : `<i class="fa-solid fa-lock"></i><span>Move ${Formatters.currency(selectedVaultAmount)}</span>`;
    }
    const autoVaultButton = DOM.get('btnTriggerAutoVault');
    if (autoVaultButton) {
      autoVaultButton.innerHTML = goalReached
        ? '<i class="fa-solid fa-circle-check"></i> Goal Reached'
        : '<i class="fa-solid fa-shield-halved"></i> Apply Pre-emptive Buffer (৳500)';
    }

    const goalSelect = DOM.get('vaultGoalSelect');
    if (goalSelect) goalSelect.value = String(appState.bufferVaultGoal);
  }

  function applyActivityFilter() {
    const expanded = DOM.get('btnViewAllActivity')?.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('#transactionList .transaction-row').forEach((row) => {
      const isFiltered = activityFilter !== 'all' && row.dataset.direction !== activityFilter;
      const isCollapsedExtra = row.hasAttribute('data-extra-activity') && !expanded;
      row.hidden = isFiltered || isCollapsedExtra;
    });
  }

  function updateCoachPlanProgress() {
    const completed = coachTasks.filter((task) => task.checked).length;
    DOM.setText('coachPlanProgress', `${completed} of ${coachTasks.length} complete`);
    const progressBar = DOM.get('coachPlanProgressBar');
    if (progressBar) progressBar.style.width = `${coachTasks.length ? completed / coachTasks.length * 100 : 0}%`;
  }

  function openTransaction(action) {
    const actionDetails = {
      add: { title: 'Add money', description: 'Add funds to your CashCompass wallet.', fee: 'No fee for this demo transaction.' },
      send: { title: 'Send money', description: 'Send money to another wallet.', fee: 'Review the recipient before confirming.' },
      pay: { title: 'Pay merchant', description: 'Make a direct digital payment without cashing out.', fee: 'No cash-out fee for a digital merchant payment.' },
      cashout: { title: 'Cash out', description: 'Withdraw from your wallet through an authorized agent.', fee: 'Agent fees may apply outside this demo.' }
    };
    const details = actionDetails[action];
    if (!details) return;

    DOM.setText('transactionDialogTitle', details.title);
    DOM.setText('transactionDescription', details.description);
    DOM.setText('transactionFeeNote', details.fee);
    DOM.setText('btnConfirmTransaction', 'Confirm');
    DOM.setText('transactionError', '');
    DOM.get('transactionError').hidden = true;
    DOM.get('transactionAmount').value = '500';
    DOM.get('transactionRecipient').value = '';

    const requiresRecipient = action === 'send' || action === 'pay';
    const recipientField = DOM.get('recipientField');
    const recipientInput = DOM.get('transactionRecipient');
    recipientField.hidden = !requiresRecipient;
    recipientInput.required = requiresRecipient;
    recipientInput.placeholder = action === 'pay' ? 'Merchant name' : 'Name or wallet number';
    DOM.get('transactionForm').dataset.action = action;

    const dialog = DOM.get('transactionDialog');
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    DOM.get('transactionAmount').focus();
  }

  function completeTransaction(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const action = form.dataset.action;
    const amount = Number(DOM.get('transactionAmount').value);
    const recipient = DOM.get('transactionRecipient').value.trim();
    const requiresRecipient = action === 'send' || action === 'pay';

    if (!Number.isInteger(amount) || amount < 1 || amount > 50000 || (requiresRecipient && !recipient)) {
      showTransactionError('Enter a valid amount and complete the recipient field.');
      return;
    }

    const delta = action === 'add' ? amount : -amount;
    if (!appState.adjustWalletBalance(delta)) {
      showTransactionError('Insufficient available wallet balance for this transaction.');
      return;
    }

    const actionNames = { add: 'Add money', send: 'Send money', pay: 'Merchant payment', cashout: 'Cash out' };
    const transactionName = action === 'send' ? `Sent to ${recipient}` : action === 'pay' ? recipient : actionNames[action];
    addTransaction(transactionName, actionNames[action], amount, delta > 0);
    closeTransaction();
    DOM.showToast(`${actionNames[action]} complete: ${delta > 0 ? '+' : '−'}${Formatters.currency(amount)}`, 'success');
  }

  function showTransactionError(message) {
    DOM.setText('transactionError', message);
    DOM.get('transactionError').hidden = false;
  }

  function closeTransaction() {
    const dialog = DOM.get('transactionDialog');
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  function addTransaction(title, type, amount, isIncoming) {
    const row = document.createElement('article');
    row.className = 'transaction-row';
    row.dataset.direction = isIncoming ? 'incoming' : 'outgoing';

    const icon = document.createElement('span');
    icon.className = `transaction-icon${isIncoming ? ' incoming' : ''}`;
    const iconElement = document.createElement('i');
    iconElement.className = `fa-solid ${isIncoming ? 'fa-arrow-down' : 'fa-arrow-up'}`;
    icon.appendChild(iconElement);

    const copy = document.createElement('div');
    copy.className = 'transaction-copy';
    const transactionTitle = document.createElement('strong');
    transactionTitle.textContent = title;
    const transactionMeta = document.createElement('span');
    transactionMeta.textContent = `Just now · ${type}`;
    copy.append(transactionTitle, transactionMeta);

    const amountLabel = document.createElement('strong');
    amountLabel.className = `transaction-amount${isIncoming ? ' positive' : ''}`;
    amountLabel.textContent = `${isIncoming ? '+' : '−'}${Formatters.currency(amount)}`;
    row.append(icon, copy, amountLabel);
    DOM.get('transactionList').prepend(row);
    applyActivityFilter();
  }
});