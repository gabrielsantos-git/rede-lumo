(function () {
    function setActiveNav() {
        const page = window.location.pathname.split('/').pop() || 'index.html';
        const hash = window.location.hash;

        document.querySelectorAll('header nav a[href]').forEach((link) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            const url = new URL(href, window.location.href);
            const linkPage = url.pathname.split('/').pop() || 'index.html';
            const linkHash = url.hash;

            const pageMatches = linkPage === page;
            const hashMatches = linkHash ? hash === linkHash : true;

            link.classList.toggle('active', pageMatches && hashMatches);
        });
    }

    function initMobileNav() {
        const header = document.querySelector('header');
        const nav = header?.querySelector('nav');
        if (!header || !nav || header.querySelector('.nav-toggle')) return;

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'nav-toggle';
        toggle.setAttribute('aria-label', 'Abrir menu');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<span></span><span></span><span></span>';

        const logo = header.querySelector('a');
        logo?.insertAdjacentElement('afterend', toggle);

        function closeMenu() {
            header.classList.remove('nav-open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Abrir menu');
        }

        toggle.addEventListener('click', () => {
            const open = header.classList.toggle('nav-open');
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        });

        nav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('click', (event) => {
            if (!header.contains(event.target)) closeMenu();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) closeMenu();
        });
    }

    setActiveNav();
    initMobileNav();
    window.addEventListener('hashchange', setActiveNav);
})();
