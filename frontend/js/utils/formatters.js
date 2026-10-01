const Formatters = {
  currency: (val) => {
    if (val === null || val === undefined) return '৳0';
    return `${CONFIG.CURRENCY_SYMBOL}${Number(val).toLocaleString('en-US')}`;
  },

  number: (val) => {
    if (val === null || val === undefined) return '0';
    return Number(val).toLocaleString('en-US');
  },

  percent: (val) => {
    return `${Math.round(val)}%`;
  }
};