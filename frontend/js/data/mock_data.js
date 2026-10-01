const MOCK_DATA = {
  salaried: {
    persona_id: 'salaried',
    name: 'Rahim Ahmed',
    role: 'Salaried Professional (৳25k/mo)',
    current_balance: 14250,
    burn_rate_percent: 64,
    deficit_date: 'Oct 23',
    days_left: 8,
    risk_percent: 87,
    risk_level: 'CRITICAL',
    avoidable_fees: 385,
    digital_rerouteable: 2400,
    forecast: {
      labels: Array.from({ length: 30 }, (_, i) => `Oct ${i + 1}`),
      historical: [25000, 24200, 22000, 19500, 18000, 16800, 15400, 14250],
      p50: [null, null, null, null, null, null, null, 14250, 12800, 11000, 9500, 7800, 6200, 4800, 3100, 1900, 800, -200, -850, -1450, -1200, -900, 0, 500, 1200, 2000, 25000, 24000, 23000, 22000],
      p10: [null, null, null, null, null, null, null, 14250, 11500, 9200, 7400, 5300, 3600, 2100, 500, -800, -1900, -2800, -3200, -3500, -3100, -2800, -1500, -500, 500, 1200, 23000, 22000, 21000, 20000],
      p90: [null, null, null, null, null, null, null, 14250, 13400, 12200, 11100, 9900, 8500, 7200, 5900, 4800, 3800, 2900, 2100, 1500, 1800, 2400, 3200, 4000, 4500, 5200, 27000, 26000, 25000, 24500]
    },
    shap_factors: [
      { label: 'Food & Discretionary Surge', impact: '+42% Deficit Impact', percent: 82, fillClass: 'fill-red', icon: 'fa-utensils' },
      { label: 'High Cash-Out Velocity', impact: '+28% Deficit Impact', percent: 64, fillClass: 'fill-orange', icon: 'fa-money-bill-wave' },
      { label: 'Upcoming Unbuffered Utility Bill', impact: '+19% Deficit Impact', percent: 45, fillClass: 'fill-amber', icon: 'fa-bolt' }
    ],
    recommendations: [
      { title: 'Pay the utility bill directly', detail: 'Use merchant payment to avoid an unnecessary cash-out before payday.', impact: 'Up to ৳385 fee savings', route: 'mfs-wallet', action: 'Open wallet' },
      { title: 'Protect a first ৳500 buffer', detail: 'Move a small amount into the reserve so it stays separate from daily spending.', impact: '8 days to next income', route: 'reserve-vault', action: 'Build reserve' },
      { title: 'Set a short-term food cap', detail: 'Reduce discretionary purchases by ৳150 a day until the next salary cycle.', impact: 'Potential ৳1,200 cushion', route: 'coach', action: 'View action plan' }
    ],
    coach_bangla: 'রহিম ভাই, আপনার খরচ করার বর্তমান গতি অনুযায়ী আগামী <strong>২৩শে অক্টোবর</strong> এর মধ্যে ওয়ালেট ব্যালেন্স শূন্যে নেমে যাওয়ার তীব্র ঝুঁকি রয়েছে। দ্বিতীয় সপ্তাহে ক্যাশ-আউট ফি বাবদ ৳৩৮৫ অতিরিক্ত খরচ হয়েছে। আপনি যদি আসন্ন ইউটিলিটি বিলটি সরাসরি ওয়ালেট থেকে দেন এবং অপ্রয়োজনীয় ক্যাশ-আউট বন্ধ রাখেন, তবে মাস শেষে আপনার ওয়ালেটে <strong>৳১,২০০</strong> নিরাপদ উদ্বৃত্ত থাকবে।',
    potential_savings: 1200
  },
  student: {
    persona_id: 'student',
    name: 'Tanvir Hasan',
    role: 'Freelance Designer • Volatile Inflow',
    current_balance: 8400,
    burn_rate_percent: 41,
    deficit_date: 'Oct 28',
    days_left: 13,
    risk_percent: 42,
    risk_level: 'MODERATE',
    avoidable_fees: 190,
    digital_rerouteable: 1100,
    forecast: {
      labels: Array.from({ length: 30 }, (_, i) => `Oct ${i + 1}`),
      historical: [9000, 8800, 12000, 11200, 10500, 9600, 8900, 8400],
      p50: [null, null, null, null, null, null, null, 8400, 7800, 7200, 6500, 6100, 5400, 4900, 4200, 3800, 3100, 2500, 1900, 1400, 800, 400, 100, 1500, 8000, 7600, 7200, 6800, 6500, 6100],
      p10: [null, null, null, null, null, null, null, 8400, 7100, 6300, 5400, 4800, 3900, 3200, 2400, 1800, 1100, 400, -200, -700, -1100, -1400, -1600, 200, 6000, 5500, 5200, 4800, 4500, 4100],
      p90: [null, null, null, null, null, null, null, 8400, 8200, 7900, 7500, 7100, 6800, 6300, 5900, 5600, 5100, 4700, 4200, 3800, 3400, 3000, 2800, 3500, 10500, 10100, 9700, 9300, 8900, 8500]
    },
    shap_factors: [
      { label: 'Irregular Freelance Payout Timing', impact: '+31% Volatility Risk', percent: 68, fillClass: 'fill-orange', icon: 'fa-clock' },
      { label: 'E-commerce & Ride-Sharing Spend', impact: '+22% Drain Factor', percent: 52, fillClass: 'fill-amber', icon: 'fa-cart-shopping' },
      { label: 'Micro Cash Withdrawals at Agents', impact: '+14% Drain Factor', percent: 34, fillClass: 'fill-amber', icon: 'fa-wallet' }
    ],
    recommendations: [
      { title: 'Create a payout-day buffer', detail: 'Move part of each irregular client payment into reserve when it arrives.', impact: 'Stabilize 13-day runway', route: 'reserve-vault', action: 'Build reserve' },
      { title: 'Use direct merchant payments', detail: 'Pay shops from the wallet instead of withdrawing cash for each purchase.', impact: 'Up to ৳190 fee savings', route: 'mfs-wallet', action: 'Open wallet' },
      { title: 'Set a ride-share weekly cap', detail: 'Trim ride-share and online spending by ৳100 per day on low-income weeks.', impact: 'Potential ৳850 cushion', route: 'coach', action: 'View action plan' }
    ],
    coach_bangla: 'তানভীর, আপনার ফ্রিল্যান্স আয়ের প্রবাহ অনিয়মিত হওয়ায় আগামী <strong>২৮শে অক্টোবর</strong> এর দিকে ক্যাশ ব্যালেন্সে টান পড়তে পারে। রাইড শেয়ারিং ও অনলাইন কেনাকাটায় প্রতিদিনের গড় খরচ ৳২০০ কমালে এবং <strong>৳৫০০ সেফটি বাফার</strong> আলাদা রাখলে মাস শেষে আপনার একাউন্ট পজিটিভ থাকবে।',
    potential_savings: 850
  }
};