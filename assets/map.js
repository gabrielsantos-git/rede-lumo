(() => {
    const svg = document.querySelector('#brasil-map svg');
    const select = document.getElementById('state-select');
    const results = document.getElementById('state-results');

    if (!svg || !select || !results) return;

    // O viewBox original (0 0 1080 1080) sobra bastante espaço vazio ao redor
    // do desenho do Brasil. Ajusta o viewBox ao contorno real do mapa para
    // que ele preencha o card desde o topo, sem margens invisíveis.
    (() => {
        const bbox = svg.getBBox();
        const pad = Math.max(bbox.width, bbox.height) * 0.02;
        svg.setAttribute(
            'viewBox',
            `${bbox.x - pad} ${bbox.y - pad} ${bbox.width + pad * 2} ${bbox.height + pad * 2}`
        );
    })();

    const paths = Array.from(svg.querySelectorAll('path[id^="BR-"]'));
    const labels = Array.from(svg.querySelectorAll('text[id]'));

    function stateCode(el) {
        return el.id.replace('BR-', '').toLowerCase();
    }

    // Marca no mapa apenas os estados onde a Rede Lumo está presente
    paths.forEach((path) => {
        const code = stateCode(path);
        if (LUMO_STATES[code]) {
            path.classList.add('has-schools');
            path.setAttribute('tabindex', '0');
            path.setAttribute('role', 'button');
            path.setAttribute('aria-label', LUMO_STATES[code].name);
        }
    });

    labels.forEach((label) => {
        const code = label.id.toLowerCase();
        if (LUMO_STATES[code]) {
            label.classList.add('has-schools');
        }
    });

    // Popula o select com os estados que têm escolas
    Object.keys(LUMO_STATES)
        .sort((a, b) => LUMO_STATES[a].name.localeCompare(LUMO_STATES[b].name))
        .forEach((code) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = LUMO_STATES[code].name;
            select.appendChild(option);
        });

    function renderState(code) {
        const data = LUMO_STATES[code];

        if (!data) {
            results.innerHTML = '<p class="brasil-results-empty">Ainda não temos escolas da Rede Lumo nesse estado, mas estamos em expansão!</p>';
            return;
        }

        // Cria uma lista única de todas as unidades, sem separação por redes
        const allUnits = data.networks.flatMap((net) => net.units);
        const unitsHtml = allUnits.map((unit) => `<li>${unit}</li>`).join('');

        results.innerHTML = `
            <div class="brasil-results-card">
                <h4 class="brasil-results-state">${data.name}</h4>
                <span class="brasil-results-count">${allUnits.length} ${allUnits.length === 1 ? 'unidade' : 'unidades'}</span>
                <ul class="brasil-results-list">${unitsHtml}</ul>
            </div>
        `;
    }

    const SWAP_TRANSITION_MS = 220;

    // Anima a saída do conteúdo atual antes de trocar pelo novo,
    // e a entrada do novo conteúdo em seguida.
    function swapResults(code) {
        results.classList.add('is-swapping');
        window.setTimeout(() => {
            renderState(code);
            void results.offsetHeight; // força reflow para a transição de entrada rodar
            results.classList.remove('is-swapping');
        }, SWAP_TRANSITION_MS);
    }

    function selectState(code) {
        paths.forEach((p) => p.classList.remove('active'));
        labels.forEach((l) => l.classList.remove('active'));

        const activePath = paths.find((p) => stateCode(p) === code);
        const activeLabel = labels.find((l) => l.id.toLowerCase() === code);
        if (activePath) activePath.classList.add('active');
        if (activeLabel) activeLabel.classList.add('active');

        select.value = code;
        swapResults(code);
    }

    paths.forEach((path) => {
        const code = stateCode(path);
        if (!LUMO_STATES[code]) return;
        path.addEventListener('click', () => selectState(code));
        path.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectState(code);
            }
        });
    });

    labels.forEach((label) => {
        const code = label.id.toLowerCase();
        if (!LUMO_STATES[code]) return;
        label.addEventListener('click', () => selectState(code));
    });

    select.addEventListener('change', (e) => {
        if (e.target.value) selectState(e.target.value);
    });
})();
