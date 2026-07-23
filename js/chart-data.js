/* Static symbol database used by the advanced chart page.
   Exposed as globals so both the search box and the symbol list can use it. */
  window.NB_ICONS = {
    crypto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v18M11 3v18M7 7h6.5a3 3 0 0 1 0 6H7m0 0h7a3 3 0 0 1 0 6H7"/></svg>',
    forex: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 9a3.2 3.2 0 0 1 3-2c1.8 0 3.2 1.3 3.2 3s-1.4 3-3.2 3a3.2 3.2 0 0 1-3-2M7 10.5h4M7 13h4"/></svg>',
    metal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9 9.5c0-1.1 1.3-2 3-2s3 .8 3 1.8c0 2.4-6 1.2-6 3.6 0 1 1.3 1.8 3 1.8s3-.9 3-2"/></svg>',
    index: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/></svg>',
    stock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 16V10M12 16V7M16 16v-5"/></svg>',
    oil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c3 3.5 5 6.8 5 9.8a5 5 0 0 1-10 0C7 8.8 9 5.5 12 2z"/></svg>'
  };
  window.NB_CATEGORY_META = {
    crypto: { label: 'ارز دیجیتال', color: 'var(--crypto)' },
    forex: { label: 'فارکس', color: 'var(--currency)' },
    metal: { label: 'فلزات گران‌بها', color: 'var(--gold-accent)' },
    index: { label: 'شاخص‌های جهانی', color: 'var(--index)' },
    stock: { label: 'سهام آمریکا', color: 'var(--crypto)' },
    oil: { label: 'انرژی', color: 'var(--oil)' }
  };
  window.NB_SYMBOL_DB = [
    { symbol: 'BINANCE:BTCUSDT', label: 'بیت‌کوین (BTC/USDT)', name: 'بیت‌کوین', cat: 'crypto' },
    { symbol: 'BINANCE:ETHUSDT', label: 'اتریوم (ETH/USDT)', name: 'اتریوم', cat: 'crypto' },
    { symbol: 'BINANCE:BNBUSDT', label: 'بایننس‌کوین (BNB/USDT)', name: 'بایننس کوین', cat: 'crypto' },
    { symbol: 'BINANCE:SOLUSDT', label: 'سولانا (SOL/USDT)', name: 'سولانا', cat: 'crypto' },
    { symbol: 'BINANCE:XRPUSDT', label: 'ریپل (XRP/USDT)', name: 'ریپل', cat: 'crypto' },
    { symbol: 'BINANCE:DOGEUSDT', label: 'دوج‌کوین (DOGE/USDT)', name: 'دوج کوین', cat: 'crypto' },
    { symbol: 'BINANCE:ADAUSDT', label: 'کاردانو (ADA/USDT)', name: 'کاردانو', cat: 'crypto' },
    { symbol: 'BINANCE:TONUSDT', label: 'تون‌کوین (TON/USDT)', name: 'تون کوین', cat: 'crypto' },
    { symbol: 'OANDA:XAUUSD', label: 'طلا (XAU/USD)', name: 'طلا', cat: 'metal' },
    { symbol: 'OANDA:XAGUSD', label: 'نقره (XAG/USD)', name: 'نقره', cat: 'metal' },
    { symbol: 'FX:EURUSD', label: 'یورو / دلار (EUR/USD)', name: 'یورو به دلار', cat: 'forex' },
    { symbol: 'FX:GBPUSD', label: 'پوند / دلار (GBP/USD)', name: 'پوند به دلار', cat: 'forex' },
    { symbol: 'FX:USDJPY', label: 'دلار / ین (USD/JPY)', name: 'دلار به ین', cat: 'forex' },
    { symbol: 'FX_IDC:USDIRR', label: 'دلار / تومان', name: 'دلار به تومان', cat: 'forex' },
    { symbol: 'TVC:USOIL', label: 'نفت خام آمریکا (WTI)', name: 'نفت خام', cat: 'oil' },
    { symbol: 'TVC:UKOIL', label: 'نفت برنت (Brent)', name: 'نفت برنت', cat: 'oil' },
    { symbol: 'FOREXCOM:SPXUSD', label: 'شاخص S&P 500', name: 'اس اند پی ۵۰۰', cat: 'index' },
    { symbol: 'FOREXCOM:NSXUSD', label: 'شاخص نزدک ۱۰۰', name: 'نزدک', cat: 'index' },
    { symbol: 'FOREXCOM:DJI', label: 'شاخص داوجونز', name: 'داوجونز', cat: 'index' },
    { symbol: 'NASDAQ:AAPL', label: 'اپل (AAPL)', name: 'اپل', cat: 'stock' },
    { symbol: 'NASDAQ:TSLA', label: 'تسلا (TSLA)', name: 'تسلا', cat: 'stock' },
    { symbol: 'NASDAQ:MSFT', label: 'مایکروسافت (MSFT)', name: 'مایکروسافت', cat: 'stock' },
    { symbol: 'NASDAQ:NVDA', label: 'انویدیا (NVDA)', name: 'انویدیا', cat: 'stock' },
    { symbol: 'NASDAQ:AMZN', label: 'آمازون (AMZN)', name: 'آمازون', cat: 'stock' },
    { symbol: 'NASDAQ:GOOGL', label: 'گوگل (GOOGL)', name: 'گوگل', cat: 'stock' }
  ];
