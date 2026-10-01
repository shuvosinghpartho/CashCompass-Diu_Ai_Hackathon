const DOM = {
  get: (id) => document.getElementById(id),
  query: (selector) => document.querySelector(selector),
  queryAll: (selector) => document.querySelectorAll(selector),

  setText: (id, text) => {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
  },

  setHTML: (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  },

  animateCounter: (id, targetVal) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerText = Formatters.number(targetVal);
  },

  showToast: (message, type = 'info') => {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? 'fa-circle-check text-green' : 'fa-bell text-blue';
    const iconElement = document.createElement('i');
    iconElement.className = `fa-solid ${icon}`;
    const messageElement = document.createElement('span');
    messageElement.textContent = message;
    toast.append(iconElement, messageElement);

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};