const ActionVaultComponent = {
  init: () => {
    const btnAutoVault = DOM.get('btnTriggerAutoVault');
    const btnLockBudget = DOM.get('btnLockBudget');
    const btnLockMfsBuffer = DOM.get('btnLockMfsBuffer');

    const handleBufferLock = (amount = 500) => {
      if (!appState.applyBufferVault(amount)) {
        DOM.showToast('এই amount-টি reserve target বা available balance-এর সঙ্গে মিলছে না।', 'info');
        return;
      }

      if (btnAutoVault) {
        btnAutoVault.innerHTML = '<i class="fa-solid fa-circle-check"></i> Buffer Updated';
      }
      DOM.showToast(`৳${amount.toLocaleString('en-US')} reserve-এ যোগ করা হয়েছে।`, 'success');
    };

    if (btnAutoVault) btnAutoVault.addEventListener('click', handleBufferLock);
    if (btnLockBudget) btnLockBudget.addEventListener('click', handleBufferLock);
    if (btnLockMfsBuffer) {
      btnLockMfsBuffer.addEventListener('click', () => {
        const selectedAmount = Number(document.querySelector('[data-vault-amount].active')?.dataset.vaultAmount || 500);
        handleBufferLock(selectedAmount);
      });
    }
  }
};