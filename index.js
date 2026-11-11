// 1. Navigation: kompakter Zustand beim Scrollen
const navbar = document.getElementById('navbar');
const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// 2. Mobiles Menü
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

function setMenu(open) {
    hamburger.classList.toggle('active', open);
    navLinks.classList.toggle('active', open);
    document.body.classList.toggle('menu-open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Menü schliessen' : 'Menü öffnen');
}

hamburger.addEventListener('click', () => setMenu(!navLinks.classList.contains('active')));

// Menü schliessen, wenn ein Link geklickt oder Escape gedrückt wird
document.querySelectorAll('.nav-links a, .nav-cta, .nav-logo').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setMenu(false);
});

// 3. Die drei Schwellen als Auswahl
const tabs = Array.from(document.querySelectorAll('.track [role="tab"]'));
const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));

function selectTab(index, focus) {
    tabs.forEach((tab, i) => {
        const active = i === index;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[i].hidden = !active;
    });
    if (focus) tabs[index].focus();
}

tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(i, false));
    tab.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') selectTab((i + 1) % tabs.length, true);
        if (e.key === 'ArrowLeft') selectTab((i - 1 + tabs.length) % tabs.length, true);
    });
});
if (tabs.length) selectTab(0, false);

// 4. Gewählte Schwelle ins Kontaktformular übernehmen
document.querySelectorAll('[data-schwelle]').forEach(link => {
    link.addEventListener('click', () => {
        const radio = document.querySelector(
            '#composer input[name="schwelle"][value="' + link.dataset.schwelle + '"]');
        if (radio) radio.checked = true;
    });
});

// 5. Kontakt: E-Mail-Entwurf vorbereiten (es wird nichts gespeichert oder versendet)
const composer = document.getElementById('composer');
const MAIL = 'sepideh_karimi@icloud.com';

if (composer) {
    composer.addEventListener('submit', e => {
        e.preventDefault();
        const name = composer.elements['name'].value.trim();
        const text = composer.elements['text'].value.trim();
        const chosen = composer.querySelector('input[name="schwelle"]:checked');

        const lines = ['Hallo Sepideh', ''];
        lines.push(text || 'Ich möchte dich gerne für ein erstes Kennenlernen kontaktieren.');
        if (chosen) lines.push('', 'Wo ich gerade stehe: ' + chosen.value);
        lines.push('', 'Herzliche Grüsse', name);

        window.location.href = 'mailto:' + MAIL +
            '?subject=' + encodeURIComponent('Kennenlernen Mamani') +
            '&body=' + encodeURIComponent(lines.join('\n'));
    });
}

// 6. E-Mail-Adresse kopieren
const copyBtn = document.getElementById('copy-mail');
if (copyBtn) {
    if (!navigator.clipboard) {
        copyBtn.hidden = true;
    } else {
        const label = copyBtn.textContent.trim();
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(copyBtn.dataset.mail).then(() => {
                copyBtn.textContent = 'Adresse kopiert';
                setTimeout(() => { copyBtn.textContent = label; }, 2500);
            });
        });
    }
}