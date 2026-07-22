function initHorizontalCarousel(options) {
    const track = document.querySelector(options.track);
    const prev = document.querySelector(options.prev);
    const next = document.querySelector(options.next);
    if (!track || !prev || !next) return;

    const viewport = track.parentElement;
    const items = Array.from(track.children);
    let current = 0;

    function stepWidth() {
        if (items.length < 2) return items.length ? items[0].getBoundingClientRect().width : 0;
        return items[1].offsetLeft - items[0].offsetLeft;
    }

    /* Mede quantos itens realmente cabem, em vez de assumir por breakpoint.
       Assim o carrossel nunca deixa itens inalcançáveis em larguras intermediárias. */
    function visibleCount() {
        const step = stepWidth();
        if (!step || !viewport) return 1;
        const gap = step - items[0].getBoundingClientRect().width;
        const fits = Math.floor((viewport.getBoundingClientRect().width + gap) / step);
        return Math.min(items.length, Math.max(1, fits));
    }

    function maxIndex() {
        return Math.max(0, items.length - visibleCount());
    }

    function update() {
        current = Math.min(current, maxIndex());
        track.style.transform = `translateX(-${current * stepWidth()}px)`;

        const single = maxIndex() === 0;
        prev.hidden = single;
        next.hidden = single;
    }

    prev.addEventListener('click', () => {
        current = current === 0 ? maxIndex() : current - 1;
        update();
    });

    next.addEventListener('click', () => {
        current = current === maxIndex() ? 0 : current + 1;
        update();
    });

    window.addEventListener('resize', update);
    update();
}

/* Permite rolar horizontalmente com a roda do mouse em contêineres que
   usam overflow-x nativo (ex: linha do tempo), sem precisar de setas. */
function enableWheelHorizontalScroll(selector) {
    const el = document.querySelector(selector);
    if (!el) return;

    el.addEventListener('wheel', (event) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

        const canScrollLeft = el.scrollLeft > 0;
        const canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth;
        if ((event.deltaY < 0 && !canScrollLeft) || (event.deltaY > 0 && !canScrollRight)) return;

        event.preventDefault();
        el.scrollLeft += event.deltaY;
    }, { passive: false });
}
