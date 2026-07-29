// هدر بالای صفحه + منوی کشویی (سه‌خط) + پیش‌بارگذاری صفحات برای جابجایی سریع‌تر
(function () {
    var PAGES = [
        { id: 'index',          href: 'index.html',          label: 'اخبار گروه',        icon: '<path d="M4 4h16v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Z"/><path d="M8 8h8M8 12h8M8 16h4"/>' },
        { id: 'calendar',       href: 'calendar.html',       label: 'تقویم تحصیلی',      icon: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>' },
        { id: 'profile',        href: 'profile.html',        label: 'پروفایل دانشجو',    icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>' },
        { id: 'exam-schedule',  href: 'exam-schedule.html',  label: 'برنامه امتحانی',    icon: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>' },
        { id: 'current-grades', href: 'current-grades.html', label: 'کارنامه ترم جاری',  icon: '<path d="M4 20V10M12 20V4M20 20v-7"/>' }
    ];

    function icon(inner) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
    }

    function buildHeader() {
        var root = document.getElementById('site-header-root');
        if (!root) return;
        var active = document.body.getAttribute('data-page') || '';

        var items = PAGES.map(function (p) {
            return '<a class="menu-drawer-item' + (p.id === active ? ' active' : '') + '" href="' + p.href + '">' +
                icon(p.icon) + p.label + '</a>';
        }).join('');

        root.innerHTML =
            '<header class="site-header">' +
                '<button class="hamburger-btn" id="menuBtn" aria-label="باز کردن منو"><span></span><span></span><span></span></button>' +
                '<span class="site-header-title">گروه پزشکی پیام‌نور البرز</span>' +
                '<span class="site-header-badge">دانشجویی</span>' +
            '</header>' +
            '<div class="menu-overlay" id="menuOverlay"></div>' +
            '<nav class="menu-drawer" id="menuDrawer">' +
                '<div class="menu-drawer-head"><span>فهرست صفحات</span><button class="menu-close" id="menuCloseBtn" aria-label="بستن">✕</button></div>' +
                '<div class="menu-drawer-body">' + items + '</div>' +
                '<div class="menu-drawer-foot">دانشگاه پیام نور · استان البرز</div>' +
            '</nav>';

        var btn = document.getElementById('menuBtn');
        var overlay = document.getElementById('menuOverlay');
        var drawer = document.getElementById('menuDrawer');
        var closeBtn = document.getElementById('menuCloseBtn');

        function openMenu() { btn.classList.add('open'); overlay.classList.add('open'); drawer.classList.add('open'); }
        function closeMenu() { btn.classList.remove('open'); overlay.classList.remove('open'); drawer.classList.remove('open'); }

        btn.addEventListener('click', function () {
            drawer.classList.contains('open') ? closeMenu() : openMenu();
        });
        overlay.addEventListener('click', closeMenu);
        closeBtn.addEventListener('click', closeMenu);
    }

    // بعد از بارگذاری کامل صفحه‌ی فعلی، بقیه‌ی صفحات را در پس‌زمینه پیش‌بارگذاری می‌کند
    // تا با باز کردن هر کدام از منو، تقریباً بی‌درنگ نمایش داده شوند.
    function prefetchOtherPages() {
        var active = document.body.getAttribute('data-page') || '';
        PAGES.forEach(function (p) {
            if (p.id === active) return;
            var link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = p.href;
            document.head.appendChild(link);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        buildHeader();
        if ('requestIdleCallback' in window) {
            requestIdleCallback(prefetchOtherPages, { timeout: 2000 });
        } else {
            setTimeout(prefetchOtherPages, 800);
        }
    });
})();
