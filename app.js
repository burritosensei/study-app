// ============================================================
// Study App - Flashcard Study App
// ============================================================

// --- Utilities ---

const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const esc = (s) => {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
};

function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    return dp[m][n];
}

const ARTICLES = /^(the|a|an|el|la|los|las|un|una|unos|unas|le|les|un|une|des|du|de la|de los|de las|der|die|das|ein|eine|il|lo|gli|i|le|un|uno|una|o|a|os|as|um|uma)\s+/i;
const stripArticle = s => s.replace(ARTICLES, '').trim();

function fuzzyMatch(input, answer) {
    const norm = s => s.toLowerCase().trim().replace(/\s+/g, ' ');
    const a = norm(input), b = norm(answer);
    if (!a) return { match: false, exact: false };
    if (a === b) return { match: true, exact: true };
    if (b.length >= 4 && levenshtein(a, b) <= Math.max(1, Math.floor(b.length * 0.2)))
        return { match: true, exact: false };
    // Allow omitting or mismatching leading articles
    const as = stripArticle(a), bs = stripArticle(b);
    if (as && as === bs) return { match: true, exact: false };
    if (bs.length >= 4 && levenshtein(as, bs) <= Math.max(1, Math.floor(bs.length * 0.2)))
        return { match: true, exact: false };
    return { match: false, exact: false };
}

function formatTime(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}

// --- Effects ---

function showConfetti() {
    const ct = document.getElementById('confetti-container');
    const colors = ['#7c6cff', '#22d3ee', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb7185', '#818cf8'];
    for (let i = 0; i < 60; i++) {
        const p = document.createElement('div');
        p.className = 'confetti-particle';
        const drift = (Math.random() - 0.5) * 250;
        const rot = Math.random() * 720;
        const dur = (Math.random() * 1.5 + 1.5);
        const del = Math.random() * 0.4;
        const size = Math.random() * 8 + 4;
        Object.assign(p.style, {
            left: Math.random() * 100 + '%',
            width: size + 'px',
            height: (size * (Math.random() > 0.5 ? 1 : 0.5)) + 'px',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            '--drift': drift + 'px',
            '--rotation': rot + 'deg',
            '--duration': dur + 's',
            '--delay': del + 's',
            animationDuration: dur + 's',
            animationDelay: del + 's',
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        });
        ct.appendChild(p);
    }
    setTimeout(() => ct.innerHTML = '', 4000);
}

function showMasteredCelebration() {
    // White flash
    const flash = document.createElement('div');
    flash.id = 'mastered-flash';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 500);

    // White embers rising
    const ct = document.getElementById('confetti-container');
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'confetti-particle';
        const shade = Math.floor(Math.random() * 100 + 155);
        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const drift = (Math.random() - 0.5) * 80;
        Object.assign(p.style, {
            left: x + '%',
            bottom: '-10px',
            top: 'auto',
            width: size + 'px',
            height: size + 'px',
            backgroundColor: `rgb(${shade},${shade},${shade})`,
            borderRadius: '50%',
            boxShadow: `0 0 ${Math.random() * 4 + 2}px rgba(255,255,255,0.6)`,
            animationName: 'emberRise',
            animationDuration: (Math.random() * 1.5 + 1) + 's',
            animationDelay: (Math.random() * 0.3) + 's',
            animationTimingFunction: 'ease-out',
            animationFillMode: 'forwards',
            '--drift': drift + 'px',
        });
        ct.appendChild(p);
    }
    setTimeout(() => { for (const c of ct.querySelectorAll('.confetti-particle')) c.remove(); }, 3000);

    // Toast
    showToast('MASTERED \uD83D\uDD25', 'mastered');
}

function showMiniConfetti(el) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ct = document.getElementById('confetti-container');
    const colors = ['#34d399', '#22d3ee', '#fbbf24', '#7c6cff'];
    for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.className = 'confetti-particle';
        const drift = (Math.random() - 0.5) * 100;
        Object.assign(p.style, {
            left: (rect.left + rect.width / 2) + 'px',
            top: rect.top + 'px',
            width: '5px', height: '5px',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            '--drift': drift + 'px',
            '--rotation': (Math.random() * 360) + 'deg',
            animationDuration: '1s',
            animationDelay: (Math.random() * 0.15) + 's',
            borderRadius: '50%',
            position: 'fixed',
        });
        ct.appendChild(p);
    }
    setTimeout(() => { for (const c of ct.querySelectorAll('.confetti-particle')) c.remove(); }, 1500);
}

function showToast(message, type = 'info') {
    const ct = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    const icons = { success: '\u2713', error: '\u2717', info: '\u2139', xp: '\u26A1' };
    t.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${esc(message)}</span>`;
    ct.appendChild(t);
    requestAnimationFrame(() => t.classList.add('toast-show'));
    setTimeout(() => {
        t.classList.remove('toast-show');
        setTimeout(() => t.remove(), 300);
    }, 2500);
}

// --- XP / Levels ---

const LEVELS = [
    { level: 1, xp: 0, title: 'Beginner' },
    { level: 2, xp: 100, title: 'Student' },
    { level: 3, xp: 300, title: 'Learner' },
    { level: 4, xp: 600, title: 'Scholar' },
    { level: 5, xp: 1000, title: 'Adept' },
    { level: 6, xp: 1800, title: 'Expert' },
    { level: 7, xp: 3000, title: 'Master' },
    { level: 8, xp: 5000, title: 'Sage' },
    { level: 9, xp: 8000, title: 'Guru' },
    { level: 10, xp: 12000, title: 'Enlightened' },
];

function getLevel(xp) {
    let cur = LEVELS[0], nxt = LEVELS[1];
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (xp >= LEVELS[i].xp) {
            cur = LEVELS[i];
            nxt = LEVELS[i + 1] || null;
            break;
        }
    }
    const progress = nxt ? (xp - cur.xp) / (nxt.xp - cur.xp) : 1;
    return { current: cur, next: nxt, xp, progress };
}

// --- Storage ---

const STORAGE_KEY = 'studyapp_data';

function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const d = JSON.parse(raw);
            // Migrate: ensure all cards have stats
            (d.decks || []).forEach(deck => {
                (deck.cards || []).forEach(card => {
                    if (!card.stats) card.stats = { correct: 0, incorrect: 0, streak: 0, bestStreak: 0, lastSeen: null };
                    if (!card.stats.learnStatus) card.stats.learnStatus = 'new';
                });
            });
            if (!d.specialChars) d.specialChars = '\u00e1 \u00e9 \u00ed \u00f3 \u00fa \u00f1 \u00fc \u00bf \u00a1';
            if (!d.folders) d.folders = [];
            if (!d.folderState) d.folderState = {};
            return d;
        }
    } catch (e) { /* ignore */ }
    return { decks: [], xp: 0, totalStudied: 0, specialChars: '\u00e1 \u00e9 \u00ed \u00f3 \u00fa \u00f1 \u00fc \u00bf \u00a1', folders: [], folderState: {} };
}

function saveData(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { /* quota */ }
}

// --- Card helpers ---

function newCard(front, back) {
    return {
        id: uid(), front, back,
        stats: { correct: 0, incorrect: 0, streak: 0, bestStreak: 0, lastSeen: null, learnStatus: 'new' }
    };
}

function cardStrength(card) {
    const s = card.stats;
    if (s.correct === 0 && s.incorrect === 0) return 'new';
    if (s.streak >= 4) return 'mastered';
    if (s.streak >= 2) return 'familiar';
    return 'learning';
}

function isWeak(card) {
    const s = card.stats;
    if (s.correct === 0 && s.incorrect === 0) return false; // not yet studied
    return s.streak < 2 || s.incorrect > s.correct;
}

function deckMastery(deck) {
    if (!deck.cards.length) return 0;
    const mastered = deck.cards.filter(c => cardStrength(c) === 'mastered').length;
    return mastered / deck.cards.length;
}

function getPromptAndAnswer(card, direction) {
    let dir = direction;
    if (dir === 'random') dir = Math.random() > 0.5 ? 'front-to-back' : 'back-to-front';
    if (dir === 'back-to-front') return { prompt: card.back, answer: card.front, promptLabel: 'Back', answerLabel: 'Front' };
    return { prompt: card.front, answer: card.back, promptLabel: 'Front', answerLabel: 'Back' };
}

// ============================================================
// MAIN APP
// ============================================================

class StudyApp {
    constructor() {
        this.data = loadData();
        this.root = document.getElementById('app');
        this.view = 'dashboard';
        this.params = {};
        this.session = null;
        this.matchState = null;
        this._modal = null;

        // Restore navigation state
        const sessionModes = ['flip', 'learn', 'quiz', 'focus', 'match', 'diagnostic', 'results'];
        try {
            const nav = JSON.parse(localStorage.getItem('studyapp_nav'));
            if (nav && nav.view) {
                if (sessionModes.includes(nav.view) && nav.params?.deckId) {
                    // Don't resume mid-session — go to the deck page
                    this.view = 'deck';
                    this.params = { deckId: nav.params.deckId };
                } else {
                    this.view = nav.view;
                    this.params = nav.params || {};
                }
            }
        } catch (e) { /* ignore */ }

        document.addEventListener('keydown', (e) => this._onKey(e));
        this.render();
    }

    save() { saveData(this.data); }

    addXP(amount) {
        const oldLevel = getLevel(this.data.xp).current.level;
        this.data.xp += amount;
        this.save();
        const newLevel = getLevel(this.data.xp).current.level;
        if (newLevel > oldLevel) {
            showConfetti();
            showToast(`Level up! You're now ${getLevel(this.data.xp).current.title}`, 'xp');
        }
    }

    navigate(view, params = {}) {
        this.view = view;
        this.params = params;
        this.session = null;
        this.matchState = null;
        this._modal = null;
        try { localStorage.setItem('studyapp_nav', JSON.stringify({ view, params })); } catch (e) { /* ignore */ }
        this.render();
        window.scrollTo(0, 0);
    }

    render() {
        const views = {
            dashboard: () => this._renderDashboard(),
            deck: () => this._renderDeck(),
            'mode-select': () => this._renderModeSelect(),
            flip: () => this._renderFlip(),
            learn: () => this._renderLearn(),
            quiz: () => this._renderQuiz(),
            focus: () => this._renderFocus(),
            match: () => this._renderMatch(),
            diagnostic: () => this._renderDiagnostic(),
            results: () => this._renderResults(),
        };
        (views[this.view] || views.dashboard)();
    }

    _getDeck(id) {
        return this.data.decks.find(d => d.id === (id || this.params.deckId));
    }

    // --- Fade/render utility ---
    _fadeAndRender(fn) {
        const container = this.root.querySelector('.container');
        if (container) {
            container.style.transition = 'opacity 0.08s ease';
            container.style.opacity = '0';
            setTimeout(() => fn(), 80);
        } else {
            fn();
        }
    }

    // --- Helpers ---
    _timeAgo(ts) {
        const diff = Date.now() - ts;
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return hrs === 1 ? '1 hour ago' : `${hrs} hours ago`;
        const days = Math.floor(hrs / 24);
        if (days === 1) return 'yesterday';
        if (days < 30) return `${days} days ago`;
        const months = Math.floor(days / 30);
        return months === 1 ? '1 month ago' : `${months} months ago`;
    }

    _specialCharsHTML(inputId) {
        const deck = this._getDeck();
        const chars = (deck?.specialChars || '').split(/\s+/).filter(Boolean);
        if (chars.length === 0) return '';
        return `<div class="special-chars-row">${chars.map(ch =>
            `<button class="special-char-btn" type="button" onmousedown="event.preventDefault()" onclick="app._insertChar('${inputId}','${esc(ch)}')">${esc(ch)}</button>`
        ).join('')}</div>`;
    }

    _insertChar(inputId, ch) {
        const inp = $('#' + inputId);
        if (!inp) return;
        const start = inp.selectionStart;
        const end = inp.selectionEnd;
        inp.value = inp.value.slice(0, start) + ch + inp.value.slice(end);
        inp.focus();
        inp.selectionStart = inp.selectionEnd = start + ch.length;
    }

    // --- Header ---
    _headerHTML() {
        const lv = getLevel(this.data.xp);
        return `
        <header class="header">
            <div class="header-logo" onclick="app.navigate('dashboard')">
                <span class="logo-icon">\u26A1</span> Study App
            </div>
            <div class="header-xp">
                <div class="xp-badge">
                    <span class="xp-icon">\u26A1</span>
                    <span class="xp-amount">${this.data.xp} XP</span>
                </div>
                <div class="xp-progress-mini">
                    <div class="xp-progress-mini-fill" style="width:${Math.round(lv.progress * 100)}%"></div>
                </div>
                <div class="level-badge">Lv${lv.current.level} ${esc(lv.current.title)}</div>
            </div>
        </header>`;
    }

    // ============================================================
    // DASHBOARD
    // ============================================================
    _deckCardHTML(d, folderId) {
        const ct = { new: 0, learning: 0, proficient: 0, mastered: 0 };
        d.cards.forEach(c => ct[c.stats.learnStatus || 'new']++);
        const total = d.cards.length || 1;
        const segments = [
            { pct: ct.mastered / total * 100, cls: 'seg-mastered' },
            { pct: ct.proficient / total * 100, cls: 'seg-proficient' },
            { pct: ct.learning / total * 100, cls: 'seg-learning' },
            { pct: ct.new / total * 100, cls: 'seg-new' },
        ];
        const labels = [];
        if (ct.mastered) labels.push(`${ct.mastered} Mastered`);
        if (ct.proficient) labels.push(`${ct.proficient} Proficient`);
        if (ct.learning) labels.push(`${ct.learning} Learning`);
        if (ct.new) labels.push(`${ct.new} New`);
        const countStr = d.cards.length === 0 ? 'No cards yet' : `${d.cards.length} card${d.cards.length !== 1 ? 's' : ''}`;
        const lastStudied = d.lastStudied ? this._timeAgo(d.lastStudied) : null;
        const allMastered = d.cards.length > 0 && ct.mastered === d.cards.length;
        const folderArg = folderId ? `'${folderId}'` : 'null';
        return `
        <div class="deck-card ${allMastered ? 'deck-card-mastered' : ''}" onclick="app.navigate('deck', {deckId:'${d.id}'})">
            <button class="deck-card-move-btn" onclick="event.stopPropagation();app._showMoveDeckModal('${d.id}',${folderArg})">Move</button>
            <div class="deck-card-name">${esc(d.name)} ${allMastered ? '<span class="status-tag tag-mastered" style="font-size:0.6rem;vertical-align:middle;margin-left:6px">MASTERED</span>' : ''}</div>
            <div class="deck-card-count">${countStr}</div>
            <div class="deck-card-progress deck-seg-bar">
                ${segments.map(s => s.pct > 0 ? `<div class="deck-seg ${s.cls}" style="width:${s.pct.toFixed(1)}%"></div>` : '').join('')}
            </div>
            <div class="deck-card-mastery">${labels.join(' \u00B7 ') || 'No progress yet'}</div>
            ${lastStudied ? `<div class="deck-card-last-studied">Last studied: ${lastStudied}</div>` : ''}
        </div>`;
    }

    _renderDashboard() {
        const decks = this.data.decks;
        const folders = this.data.folders || [];
        const folderState = this.data.folderState || {};
        const totalCards = decks.reduce((s, d) => s + d.cards.length, 0);
        const totalMastered = decks.reduce((s, d) => s + d.cards.filter(c => cardStrength(c) === 'mastered').length, 0);

        const folderedIds = new Set(folders.flatMap(f => f.deckIds));
        const looseDecks = decks.filter(d => !folderedIds.has(d.id));

        const foldersHTML = folders.map(folder => {
            const isOpen = folderState[folder.id] !== false;
            const folderDecks = folder.deckIds.map(id => decks.find(d => d.id === id)).filter(Boolean);
            const folderCardCount = folderDecks.reduce((s, d) => s + d.cards.length, 0);
            return `
            <div class="folder-section" id="folder-${folder.id}">
                <div class="folder-header" onclick="app._toggleFolder('${folder.id}')">
                    <span class="folder-chevron ${isOpen ? 'open' : ''}">&#x25BE;</span>
                    <button class="folder-name-btn" onclick="event.stopPropagation();app._renameFolder('${folder.id}')">${esc(folder.name)}</button>
                    <span class="folder-meta">${folderDecks.length} deck${folderDecks.length !== 1 ? 's' : ''} &middot; ${folderCardCount} card${folderCardCount !== 1 ? 's' : ''}</span>
                    <button class="folder-delete-btn" onclick="event.stopPropagation();app._deleteFolder('${folder.id}')" title="Delete group">&#x2715;</button>
                </div>
                <div class="folder-content-wrap ${isOpen ? 'open' : ''}">
                    <div class="folder-content-inner">
                        <div class="folder-deck-grid">${folderDecks.map(d => this._deckCardHTML(d, folder.id)).join('')}</div>
                        <div class="folder-end-line"></div>
                    </div>
                </div>
            </div>`;
        }).join('');

        this.root.innerHTML = `
        ${this._headerHTML()}
        <div class="container view-enter">
            <div class="dashboard-hero">
                <h1>Your Study Decks</h1>
                <p>Choose a deck to study or create a new one</p>
            </div>

            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-value">${decks.length}</div>
                    <div class="stat-label">Decks</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${totalCards}</div>
                    <div class="stat-label">Cards</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${totalMastered}</div>
                    <div class="stat-label">Mastered</div>
                </div>
            </div>

            ${folders.length > 0 ? `<div class="folders-section">${foldersHTML}</div>` : ''}
            <div class="section-row">
                <div class="section-title">Your Decks</div>
                <div class="section-actions">
                    <button class="btn btn-secondary btn-sm" onclick="app._showNewDeckModal()">+ New Deck</button>
                    <button class="btn btn-secondary btn-sm" onclick="app._importDeckFile()">\u2191 Import</button>
                    <button class="btn btn-secondary btn-sm" onclick="app._showNewFolderModal()">+ New Group</button>
                </div>
            </div>
            <div class="deck-grid">
                ${looseDecks.map(d => this._deckCardHTML(d, null)).join('')}
            </div>
            <input type="file" id="deck-file-input" accept=".json" class="hidden" onchange="app._handleDeckFileImport(event)">
        </div>`;
    }

    _showNewDeckModal() {
        this._showModal('Create New Deck', `
            <div class="input-group">
                <label>Deck Name</label>
                <input class="input" id="modal-deck-name" placeholder="e.g. Spanish Vocab" autofocus>
            </div>
        `, () => {
            const name = ($('#modal-deck-name')?.value || '').trim();
            if (!name) return showToast('Enter a deck name', 'error');
            const deck = { id: uid(), name, cards: [], created: Date.now(), lastStudied: null, specialChars: 'á é í ó ú ñ ü ¿ ¡' };
            this.data.decks.push(deck);
            this.save();
            this._closeModal();
            this.navigate('deck', { deckId: deck.id });
            showToast('Deck created!', 'success');
        });
        setTimeout(() => $('#modal-deck-name')?.focus(), 100);
    }

    _showNewFolderModal() {
        this._showModal('New Group', `
            <div class="input-group">
                <label>Group Name</label>
                <input class="input" id="modal-folder-name" placeholder="e.g. Languages" autofocus>
            </div>
        `, () => {
            const name = ($('#modal-folder-name')?.value || '').trim();
            if (!name) return showToast('Enter a group name', 'error');
            const folder = { id: uid(), name, deckIds: [] };
            this.data.folders.push(folder);
            this.data.folderState[folder.id] = true;
            this.save();
            this._closeModal();
            this._renderDashboard();
            showToast('Group created!', 'success');
        });
        setTimeout(() => $('#modal-folder-name')?.focus(), 100);
    }

    _toggleFolder(folderId) {
        const current = this.data.folderState[folderId] !== false;
        const isOpen = !current;
        this.data.folderState[folderId] = isOpen;
        this.save();

        const section = document.getElementById(`folder-${folderId}`);
        if (!section) return;
        const wrap = section.querySelector('.folder-content-wrap');
        const chevron = section.querySelector('.folder-chevron');
        if (wrap) wrap.classList.toggle('open', isOpen);
        if (chevron) chevron.classList.toggle('open', isOpen);
    }

    _renameFolder(folderId) {
        const folder = this.data.folders.find(f => f.id === folderId);
        if (!folder) return;
        this._showModal('Rename Group', `
            <div class="input-group">
                <label>Group Name</label>
                <input class="input" id="modal-folder-rename" value="${esc(folder.name)}" autofocus>
            </div>
        `, () => {
            const name = ($('#modal-folder-rename')?.value || '').trim();
            if (!name) return showToast('Enter a group name', 'error');
            folder.name = name;
            this.save();
            this._closeModal();
            this._renderDashboard();
        });
        setTimeout(() => {
            const inp = $('#modal-folder-rename');
            if (inp) { inp.focus(); inp.select(); }
        }, 100);
    }

    _deleteFolder(folderId) {
        const idx = this.data.folders.findIndex(f => f.id === folderId);
        if (idx < 0) return;
        this.data.folders.splice(idx, 1);
        delete this.data.folderState[folderId];
        this.save();
        this._renderDashboard();
        showToast('Group deleted \u2014 decks moved back to home', 'success');
    }

    _showMoveDeckModal(deckId, currentFolderId) {
        const deck = this.data.decks.find(d => d.id === deckId);
        if (!deck) return;
        const folders = this.data.folders || [];
        const optionsHTML = [
            `<label class="move-option ${!currentFolderId ? 'move-option-selected' : ''}">
                <input type="radio" name="move-folder" value="" ${!currentFolderId ? 'checked' : ''}> Home (no group)
            </label>`,
            ...folders.map(f => `
            <label class="move-option ${currentFolderId === f.id ? 'move-option-selected' : ''}">
                <input type="radio" name="move-folder" value="${f.id}" ${currentFolderId === f.id ? 'checked' : ''}> ${esc(f.name)}
            </label>`)
        ].join('');
        this._showModal(`Move "${esc(deck.name)}"`, `
            <div class="move-options">${optionsHTML}</div>
        `, () => {
            const selected = document.querySelector('input[name="move-folder"]:checked');
            if (!selected) return;
            this._moveDeckToFolder(deckId, selected.value || null);
            this._closeModal();
        });
    }

    _moveDeckToFolder(deckId, targetFolderId) {
        this.data.folders.forEach(f => { f.deckIds = f.deckIds.filter(id => id !== deckId); });
        if (targetFolderId) {
            const folder = this.data.folders.find(f => f.id === targetFolderId);
            if (folder) folder.deckIds.push(deckId);
        }
        this.save();
        this._renderDashboard();
    }

    // ============================================================
    // DECK EDITOR
    // ============================================================
    _renderDeck() {
        const deck = this._getDeck();
        if (!deck) return this.navigate('dashboard');

        const counts = { new: 0, learning: 0, proficient: 0, mastered: 0 };
        deck.cards.forEach(c => counts[c.stats.learnStatus || 'new']++);

        this.root.innerHTML = `
        ${this._headerHTML()}
        <div class="container view-enter">
            <div class="back-row">
                <button class="back-btn" onclick="app.navigate('dashboard')">\u2190 Back to decks</button>
            </div>

            <div class="deck-header">
                <input class="deck-title-edit" value="${esc(deck.name)}" onchange="app._renameDeck(this.value)" />
                <div class="deck-menu-wrap">
                    <button class="btn btn-ghost btn-icon" onclick="app._toggleDeckMenu()" title="Settings"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button>
                    <div class="deck-dropdown hidden" id="deck-dropdown">
                        <button class="deck-dropdown-item" onclick="app._exportDeck('${deck.id}')">Export Deck</button>
                        <button class="deck-dropdown-item" onclick="app._resetProgress('${deck.id}')">Reset Progress</button>
                        <button class="deck-dropdown-item deck-dropdown-danger" onclick="app._deleteDeck('${deck.id}')">Delete Deck</button>
                    </div>
                </div>
            </div>
            <div class="deck-study-row mb-24">
                <button class="btn btn-secondary" onclick="app._showDiagConfig('${deck.id}')" ${deck.cards.length < 4 ? 'disabled' : ''}>Quick Check</button>
                <button class="btn btn-secondary" onclick="app._startMode('learn')" ${deck.cards.length < 4 ? 'disabled' : ''}>Learn</button>
                <button class="btn btn-secondary" onclick="app._startProficientReview('${deck.id}')" ${counts.proficient === 0 ? 'disabled' : ''}>Mastery Review</button>
                <button class="btn btn-secondary" onclick="app._startMode('quiz')" ${deck.cards.length === 0 ? 'disabled' : ''}>Quiz</button>
                <button class="btn btn-secondary" onclick="app._showStudyModal('${deck.id}')" ${deck.cards.length === 0 ? 'disabled' : ''}>More</button>
            </div>

            ${(() => {
                const total = deck.cards.length || 1;
                const hasProgress = counts.learning + counts.proficient + counts.mastered > 0;
                const statsMargin = hasProgress ? 'margin-bottom:16px' : 'margin-bottom:24px';
                const segs = [
                    { pct: counts.mastered / total * 100, cls: 'seg-mastered' },
                    { pct: counts.proficient / total * 100, cls: 'seg-proficient' },
                    { pct: counts.learning / total * 100, cls: 'seg-learning' },
                    { pct: counts.new / total * 100, cls: 'seg-new' },
                ];
                let html = `<div class="dashboard-stats" style="grid-template-columns:repeat(4,1fr);${statsMargin}">
                    <div class="stat-card"><div class="stat-value" style="color:var(--text-muted)">${counts.new}</div><div class="stat-label">New</div></div>
                    <div class="stat-card"><div class="stat-value" style="color:var(--warning)">${counts.learning}</div><div class="stat-label">Learning</div></div>
                    <div class="stat-card"><div class="stat-value" style="color:var(--success)">${counts.proficient}</div><div class="stat-label">Proficient</div></div>
                    <div class="stat-card stat-card-mastered"><div class="stat-value mastered-value">${counts.mastered}</div><div class="stat-label" style="color:rgba(255,255,255,0.6)">Mastered</div></div>
                </div>`;
                if (!hasProgress) return html;
                const lastStudied = deck.lastStudied ? this._timeAgo(deck.lastStudied) : null;
                const barContent = segs.map(s => s.pct > 0 ? `<div class="deck-seg ${s.cls}" style="width:${s.pct.toFixed(1)}%"></div>` : '').join('');
                return html + `<div class="deck-progress-bar mb-24">
                    <div class="deck-seg-bar deck-card-progress" style="height:8px;border-radius:4px">${barContent}</div>
                    ${lastStudied ? `<div class="deck-card-last-studied" style="margin-top:6px;opacity:1">Last studied: ${lastStudied}</div>` : ''}
                </div>`;
            })()}

            <div class="panel mb-24">
                <div class="section-title mb-16">Add Cards</div>
                <div class="add-card-form">
                    <div class="input-group">
                        <label>Front</label>
                        <input class="input" id="add-front" placeholder="Question / Term">
                    </div>
                    <div class="input-group">
                        <label>Back</label>
                        <input class="input" id="add-back" placeholder="Answer / Definition">
                    </div>
                    <button class="btn btn-primary" onclick="app._addCard()">Add</button>
                </div>
                <div class="import-section">
                    <button class="btn btn-ghost btn-sm" onclick="app._toggleImport()">Import multiple cards</button>
                    <div id="import-area" class="hidden mt-8">
                        <textarea class="input" id="import-text" rows="4" placeholder="Paste cards: one per line, front and back separated by TAB or semicolon (;)"></textarea>
                        <button class="btn btn-secondary btn-sm mt-8" onclick="app._importCards()">Import</button>
                    </div>
                </div>
            </div>

            <div class="panel mb-24">
                <div class="section-title mb-12">Special Characters</div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
                    <button class="btn btn-sm btn-secondary" onclick="app._setCharPreset('spanish')">Spanish</button>
                    <button class="btn btn-sm btn-secondary" onclick="app._setCharPreset('french')">French</button>
                    <button class="btn btn-sm btn-secondary" onclick="app._setCharPreset('german')">German</button>
                    <button class="btn btn-sm btn-secondary" onclick="app._setCharPreset('italian')">Italian</button>
                    <button class="btn btn-sm btn-secondary" onclick="app._setCharPreset('portuguese')">Portuguese</button>
                    <button class="btn btn-sm btn-ghost" onclick="app._setCharPreset('clear')">Clear</button>
                </div>
                <input class="input" id="deck-chars-input" value="${esc(deck.specialChars || '')}" placeholder="Space-separated, e.g. á é ñ" oninput="app._updateDeckChars(this.value);app._updateCharsPreview()">
                <div id="chars-preview-inline" class="mt-8"></div>
            </div>

            <div class="card-list-header">
                <div class="section-title">${deck.cards.length} Card${deck.cards.length !== 1 ? 's' : ''}</div>
                <div class="card-filter-row">
                    ${['all','new','learning','proficient','mastered'].map(f =>
                        `<button class="card-filter-btn ${(this._deckFilter || 'all') === f ? 'active' : ''}" onclick="app._setDeckFilter('${f}')">${f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</button>`
                    ).join('')}
                </div>
            </div>
            ${deck.cards.length === 0 ? `
                <div class="empty-state">
                    <div class="empty-state-icon">\uD83C\uDCCF</div>
                    <div class="empty-state-text">No cards yet</div>
                    <div class="empty-state-hint">Add your first card above to get started</div>
                </div>
            ` : (() => {
                const filter = this._deckFilter || 'all';
                const filtered = filter === 'all' ? deck.cards : deck.cards.filter(c => (c.stats.learnStatus || 'new') === filter);
                return filtered.length === 0 ? `
                    <div class="empty-state" style="padding:24px">
                        <div class="empty-state-text">No ${filter} cards</div>
                    </div>
                ` : `
                    <div class="card-list">
                        ${filtered.map(c => {
                            const ls = c.stats.learnStatus || 'new';
                            return `
                            <div class="card-list-item">
                                <div class="card-list-front">${esc(c.front)}</div>
                                <div class="card-list-back">${esc(c.back)}</div>
                                <span class="status-tag tag-${ls}">${ls}</span>
                                <div class="card-list-actions">
                                    <button class="btn btn-ghost btn-sm" onclick="app._editCard('${deck.id}','${c.id}')">Edit</button>
                                    <button class="btn btn-ghost btn-sm" style="color:var(--error)" onclick="app._deleteCard('${deck.id}','${c.id}')">Del</button>
                                </div>
                            </div>`;
                        }).join('')}
                    </div>
                `;
            })()}
        </div>`;

        // Enter key to add card
        const frontEl = $('#add-front');
        const backEl = $('#add-back');
        if (frontEl) frontEl.addEventListener('keydown', e => { if (e.key === 'Enter') backEl?.focus(); });
        if (backEl) backEl.addEventListener('keydown', e => { if (e.key === 'Enter') this._addCard(); });

        this._updateCharsPreview();
    }

    _updateCharsPreview() {
        const input = $('#deck-chars-input');
        const preview = $('#chars-preview-inline');
        if (!preview) return;
        const chars = (input?.value || '').split(/\s+/).filter(Boolean);
        preview.innerHTML = chars.length > 0
            ? `<div class="special-chars-row">${chars.map(ch => `<span class="special-char-btn" style="pointer-events:none">${esc(ch)}</span>`).join('')}</div>`
            : '';
    }

    _setCharPreset(preset) {
        const presets = {
            spanish:    'á é í ó ú ñ ü ¿ ¡',
            french:     'à â æ ç é è ê ë î ï ô œ ù û ü ÿ',
            german:     'ä ö ü ß Ä Ö Ü',
            italian:    'à è é ì î ò ó ù',
            portuguese: 'ã â á à ç é ê í ó ô õ ú',
            clear:      '',
        };
        const deck = this._getDeck();
        if (!deck) return;
        deck.specialChars = presets[preset] ?? '';
        this.save();
        const input = $('#deck-chars-input');
        if (input) input.value = deck.specialChars;
        this._updateCharsPreview();
    }

    _setDeckFilter(filter) {
        this._deckFilter = filter;
        this._renderDeck();
    }

    _showStudyModal(deckId) {
        const deck = this._getDeck(deckId);
        if (!deck) return;
        const counts = { new: 0, learning: 0, proficient: 0, mastered: 0 };
        deck.cards.forEach(c => counts[c.stats.learnStatus || 'new']++);
        const weakCount = deck.cards.filter(isWeak).length;
        const canMatch = deck.cards.length >= 4;
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal" style="max-width:560px">
                <h2 style="text-align:center;margin-bottom:4px">More Study Modes</h2>
                <p style="text-align:center;color:var(--text-muted);font-size:0.85rem;margin-bottom:20px">${deck.cards.length} cards in ${esc(deck.name)}</p>
                <div class="mode-grid study-modal-grid">
                    <div class="mode-card" onclick="app._closeModal();app._startMode('flip')">
                        <span class="mode-card-icon">\uD83D\uDCDC</span>
                        <div class="mode-card-name">Flip</div>
                        <div class="mode-card-desc">${deck.cards.length} cards</div>
                    </div>
                    <div class="mode-card ${weakCount === 0 ? 'disabled' : ''}" onclick="app._closeModal();app._startMode('focus')">
                        <span class="mode-card-icon">\uD83C\uDFAF</span>
                        <div class="mode-card-name">Focus</div>
                        <div class="mode-card-desc">${weakCount > 0 ? weakCount + ' weak cards' : 'No weak cards'}</div>
                    </div>
                    <div class="mode-card ${!canMatch ? 'disabled' : ''}" onclick="app._closeModal();app._startMode('match')">
                        <span class="mode-card-icon">\uD83E\uDDE9</span>
                        <div class="mode-card-name">Match</div>
                        <div class="mode-card-desc">${deck.cards.length} cards</div>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) this._closeModal(); });
        this._modal = overlay;
    }

    _renameDeck(name) {
        const deck = this._getDeck();
        if (deck && name.trim()) { deck.name = name.trim(); this.save(); }
    }

    _toggleDeckMenu() {
        const dd = $('#deck-dropdown');
        if (!dd) return;
        const isOpen = !dd.classList.contains('hidden');
        dd.classList.toggle('hidden');
        if (!isOpen) {
            const close = (e) => {
                if (!e.target.closest('.deck-menu-wrap')) {
                    dd.classList.add('hidden');
                    document.removeEventListener('click', close);
                }
            };
            setTimeout(() => document.addEventListener('click', close), 0);
        }
    }

    _updateDeckChars(val) {
        const deck = this._getDeck();
        if (deck) { deck.specialChars = val.trim(); this.save(); }
    }

    _showDeckCharsModal(deckId) {
        const deck = this._getDeck(deckId);
        if (!deck) return;
        this._showModal('Special Characters', `
            <div class="input-group">
                <label>Characters</label>
                <input class="input" id="modal-deck-chars" value="${esc(deck.specialChars || '')}" placeholder="e.g. \u00e1 \u00e9 \u00ed \u00f3 \u00fa \u00f1 \u00fc \u00bf \u00a1">
                <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px">Space-separated. Shown as buttons below typed-answer inputs when studying this deck.</div>
            </div>
            <div class="mt-16" id="chars-preview"></div>
        `, () => {
            const val = ($('#modal-deck-chars')?.value || '').trim();
            deck.specialChars = val;
            this.save();
            this._closeModal();
            showToast('Characters saved', 'success');
        });
        const inp = $('#modal-deck-chars');
        const preview = $('#chars-preview');
        const updatePreview = () => {
            const chars = (inp?.value || '').split(/\s+/).filter(Boolean);
            if (preview) preview.innerHTML = chars.length > 0
                ? `<div class="special-chars-row">${chars.map(ch => `<span class="special-char-btn" style="pointer-events:none">${esc(ch)}</span>`).join('')}</div>`
                : '<div style="color:var(--text-muted);font-size:0.85rem">No characters configured</div>';
        };
        if (inp) { inp.addEventListener('input', updatePreview); updatePreview(); }
        setTimeout(() => inp?.focus(), 100);
    }

    _deleteDeck(id) {
        if (!confirm('Delete this entire deck?')) return;
        this.data.decks = this.data.decks.filter(d => d.id !== id);
        this.save();
        this.navigate('dashboard');
        showToast('Deck deleted', 'info');
    }

    _addCard() {
        const deck = this._getDeck();
        const front = ($('#add-front')?.value || '').trim();
        const back = ($('#add-back')?.value || '').trim();
        if (!front || !back) return showToast('Fill in both sides', 'error');
        deck.cards.push(newCard(front, back));
        this.save();
        this._renderDeck();
        showToast('Card added!', 'success');
        setTimeout(() => $('#add-front')?.focus(), 50);
    }

    _editCard(deckId, cardId) {
        const deck = this._getDeck(deckId);
        const card = deck?.cards.find(c => c.id === cardId);
        if (!card) return;
        this._showModal('Edit Card', `
            <div class="input-group mb-16">
                <label>Front</label>
                <input class="input" id="modal-edit-front" value="${esc(card.front)}">
            </div>
            <div class="input-group">
                <label>Back</label>
                <input class="input" id="modal-edit-back" value="${esc(card.back)}">
            </div>
        `, () => {
            const f = ($('#modal-edit-front')?.value || '').trim();
            const b = ($('#modal-edit-back')?.value || '').trim();
            if (!f || !b) return showToast('Fill in both sides', 'error');
            card.front = f;
            card.back = b;
            this.save();
            this._closeModal();
            this._renderDeck();
            showToast('Card updated', 'success');
        });
    }

    _deleteCard(deckId, cardId) {
        const deck = this._getDeck(deckId);
        if (!deck) return;
        deck.cards = deck.cards.filter(c => c.id !== cardId);
        this.save();
        this._renderDeck();
        showToast('Card removed', 'info');
    }

    _toggleImport() {
        const el = $('#import-area');
        if (el) el.classList.toggle('hidden');
    }

    _importCards() {
        const deck = this._getDeck();
        const text = ($('#import-text')?.value || '').trim();
        if (!text) return;
        const lines = text.split('\n').filter(l => l.trim());
        let added = 0;
        for (const line of lines) {
            const sep = line.includes('\t') ? '\t' : ';';
            const parts = line.split(sep).map(s => s.trim());
            if (parts.length >= 2 && parts[0] && parts[1]) {
                deck.cards.push(newCard(parts[0], parts[1]));
                added++;
            }
        }
        this.save();
        this._renderDeck();
        showToast(`Imported ${added} cards!`, 'success');
    }

    _exportDeck(deckId) {
        const deck = this._getDeck(deckId);
        if (!deck) return;
        const exportData = {
            name: deck.name,
            cards: deck.cards.map(c => ({ front: c.front, back: c.back })),
            exportedAt: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = deck.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.json';
        a.click();
        URL.revokeObjectURL(url);
        showToast('Deck exported!', 'success');
    }

    _importDeckFile() {
        const input = $('#deck-file-input');
        if (input) { input.value = ''; input.click(); }
    }

    _handleDeckFileImport(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (!data.name || !Array.isArray(data.cards) || data.cards.length === 0) {
                    return showToast('Invalid deck file', 'error');
                }
                const deck = {
                    id: uid(),
                    name: data.name,
                    cards: data.cards.map(c => newCard(c.front || '', c.back || '')).filter(c => c.front && c.back),
                    created: Date.now(),
                    lastStudied: null,
                };
                if (deck.cards.length === 0) return showToast('No valid cards found', 'error');
                this.data.decks.push(deck);
                this.save();
                this.navigate('deck', { deckId: deck.id });
                showToast(`Imported "${deck.name}" with ${deck.cards.length} cards!`, 'success');
            } catch (err) {
                showToast('Could not read file', 'error');
            }
        };
        reader.readAsText(file);
    }

    _resetProgress(deckId) {
        const deck = this._getDeck(deckId);
        if (!deck) return;
        if (!confirm(`Reset all progress for "${deck.name}"? Card stats will be wiped but cards will remain.`)) return;
        deck.cards.forEach(c => {
            c.stats = { correct: 0, incorrect: 0, streak: 0, bestStreak: 0, lastSeen: null, learnStatus: 'new' };
        });
        deck.lastStudied = null;
        this.save();
        this._renderDeck();
        showToast('Progress reset!', 'info');
    }

    // ============================================================
    // MODE SELECT
    // ============================================================
    _renderModeSelect() {
        const deck = this._getDeck();
        if (!deck) return this.navigate('dashboard');
        const weakCount = deck.cards.filter(isWeak).length;
        const canMatch = deck.cards.length >= 4;

        this.root.innerHTML = `
        ${this._headerHTML()}
        <div class="container view-enter">
            <div class="back-row">
                <button class="back-btn" onclick="app.navigate('deck',{deckId:'${deck.id}'})">\u2190 Back to deck</button>
            </div>
            <div class="mode-select-title">Study: ${esc(deck.name)}</div>
            <div class="mode-select-sub">${deck.cards.length} cards</div>

            <div class="mode-grid">
                <div class="mode-card" onclick="app._startMode('flip')">
                    <span class="mode-card-icon">\uD83D\uDCDC</span>
                    <div class="mode-card-name">Flip</div>
                    <div class="mode-card-desc">Classic flashcard flipping with self-rating</div>
                </div>
                <div class="mode-card" onclick="app._startMode('learn')">
                    <span class="mode-card-icon">\uD83C\uDF93</span>
                    <div class="mode-card-name">Learn</div>
                    <div class="mode-card-desc">Small chunks with mastery before moving on</div>
                </div>
                <div class="mode-card" onclick="app._startMode('quiz')">
                    <span class="mode-card-icon">\u270D\uFE0F</span>
                    <div class="mode-card-name">Quiz</div>
                    <div class="mode-card-desc">Type your answers and get instant feedback</div>
                </div>
                <div class="mode-card ${weakCount === 0 ? 'disabled' : ''}" onclick="app._startMode('focus')">
                    <span class="mode-card-icon">\uD83C\uDFAF</span>
                    <div class="mode-card-name">Focus</div>
                    <div class="mode-card-desc">${weakCount > 0 ? weakCount + ' weak cards need attention' : 'No weak cards!'}</div>
                </div>
                <div class="mode-card ${!canMatch ? 'disabled' : ''}" onclick="app._startMode('match')">
                    <span class="mode-card-icon">\uD83E\uDDE9</span>
                    <div class="mode-card-name">Match</div>
                    <div class="mode-card-desc">Memory game - match fronts to backs</div>
                </div>
            </div>
        </div>`;

    }

    _startMode(mode) {
        this.navigate(mode, { deckId: this.params.deckId });
    }

    // --- Shared direction picker HTML ---
    _dirPickerHTML(currentDir) {
        const opts = [
            { val: 'front-to-back', label: 'Front \u2192 Back' },
            { val: 'back-to-front', label: 'Back \u2192 Front' },
            { val: 'random', label: 'Random' },
        ];
        return `<div class="direction-picker-inline">
            ${opts.map(o => `<button class="dir-opt ${currentDir === o.val ? 'active' : ''}"
                onclick="app._changeDir('${o.val}')">${o.label}</button>`).join('')}
        </div>`;
    }

    _changeDir(dir) {
        if (!this.session) return;
        this.session.direction = dir;
        this.session.flipped = false;
        this.session.hasSeenAnswer = false;
        if (this.session.b1Flipped !== undefined) this.session.b1Flipped = false;
        if (this.session.phase === 'block2' || this.session.phase === 'block3') {
            this.session.answered = false;
            this.session.choices = null;
        }
        this.render();
    }

    // ============================================================
    // FLIP MODE — casual browsing, no stats/XP/progress tracking
    // ============================================================
    _flipActiveCards(s) {
        return s.hideKnown
            ? s.allCards.filter(c => s.marks[c.id] !== 'know')
            : s.allCards;
    }

    _renderFlip() {
        const deck = this._getDeck();
        if (!deck || deck.cards.length === 0) return this.navigate('dashboard');

        if (!this.session) {
            const allCards = shuffle([...deck.cards]);
            this.session = {
                allCards,
                index: 0,
                flipped: false,
                direction: 'front-to-back',
                shuffled: true,
                originalOrder: [...deck.cards],
                marks: {},        // { [cardId]: 'know' | 'learning' }
                hideKnown: false,
            };
        }
        const s = this.session;
        const activeCards = this._flipActiveCards(s);

        // All-known empty state
        if (activeCards.length === 0) {
            this.root.innerHTML = `${this._headerHTML()}<div class="container view-enter">
                <div class="back-row"><button class="back-btn" onclick="app.navigate('deck',{deckId:'${deck.id}'})">\u2190 Exit</button></div>
                <div class="results-container">
                    <div class="results-icon">\u2705</div>
                    <div class="results-title">All cards known!</div>
                    <div class="results-subtitle">Turn off Hide known or reset marks to keep browsing.</div>
                    <div class="flex gap-8 justify-center mt-8">
                        <button class="btn btn-secondary" onclick="app._flipToggleHideKnown()">Show all</button>
                        <button class="btn btn-ghost" onclick="app._flipResetMarks()">Reset marks</button>
                    </div>
                </div>
            </div>`;
            return;
        }

        // Clamp index
        if (s.index >= activeCards.length) s.index = activeCards.length - 1;
        if (s.index < 0) s.index = 0;

        const card = activeCards[s.index];
        const { prompt, answer, promptLabel, answerLabel } = getPromptAndAnswer(card, s.direction);
        const mark = s.marks[card.id];

        const knownCount = Object.values(s.marks).filter(v => v === 'know').length;
        const learningCount = Object.values(s.marks).filter(v => v === 'learning').length;
        const totalMarked = knownCount + learningCount;

        const markBadgeHTML = mark === 'know'
            ? `<div class="flip-mark-badge flip-mark-know">\u2713 Know it</div>`
            : mark === 'learning'
            ? `<div class="flip-mark-badge flip-mark-learning">\u25CF Still learning</div>`
            : '';

        const markButtonsHTML = s.flipped ? `
            <div class="rating-buttons flip-mark-buttons feedback-enter" id="flip-mark-buttons">
                <button class="rating-btn flip-btn-know${mark === 'know' ? ' flip-mark-active-know' : ''}" onclick="app._flipMarkKnow()">\u2713 Know it</button>
                <button class="rating-btn flip-btn-learning${mark === 'learning' ? ' flip-mark-active-learning' : ''}" onclick="app._flipMarkLearning()">\u25CF Still learning</button>
            </div>` : '';

        this.root.innerHTML = `
        ${this._headerHTML()}
        <div class="container view-enter">
            <div class="study-header">
                <button class="back-btn" onclick="app.navigate('deck',{deckId:'${deck.id}'})">\u2190 Exit</button>
                <div class="flip-mark-counts">
                    ${knownCount > 0 ? `<span class="flip-count-know">\u2713 ${knownCount}</span>` : ''}
                    ${learningCount > 0 ? `<span class="flip-count-learning">\u25CF ${learningCount}</span>` : ''}
                </div>
                <div style="min-width:60px"></div>
            </div>

            <div class="flip-toolbar">
                ${this._dirPickerHTML(s.direction)}
                <button class="btn btn-sm ${s.shuffled ? 'btn-primary' : 'btn-secondary'}" onclick="app._flipToggleShuffle()">
                    \uD83D\uDD00 ${s.shuffled ? 'Shuffled' : 'In order'}
                </button>
                <button class="btn btn-sm ${s.hideKnown ? 'btn-primary' : 'btn-secondary'}" onclick="app._flipToggleHideKnown()">
                    ${s.hideKnown ? 'Showing unknown' : 'Hide known'}
                </button>
                ${totalMarked > 0 ? `<button class="btn btn-sm btn-ghost" onclick="app._flipResetMarks()">Reset marks</button>` : ''}
            </div>

            ${markBadgeHTML}

            <div class="card-flip-area" onclick="app._flipCard()">
                <div class="card-flip-container">
                    <div class="card-flip ${s.flipped ? 'flipped' : ''}" id="study-card">
                        <div class="card-face card-front-face">
                            <div class="card-face-label">${esc(promptLabel)}</div>
                            <div class="card-face-text">${esc(prompt)}</div>
                            <div class="card-tap-hint">Tap to flip</div>
                        </div>
                        <div class="card-face card-back-face">
                            <div class="card-face-label">${esc(answerLabel)}</div>
                            <div class="card-face-text">${esc(answer)}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flip-nav" id="flip-nav">
                <button class="btn btn-secondary" onclick="app._flipPrev()" ${s.index <= 0 ? 'disabled' : ''}>\u2190 Prev</button>
                <span class="flip-nav-pos">${s.index + 1} / ${activeCards.length}</span>
                <button class="btn btn-secondary" onclick="app._flipNext()" ${s.index >= activeCards.length - 1 ? 'disabled' : ''}>Next \u2192</button>
            </div>

            ${markButtonsHTML}
        </div>`;
    }

    _flipCard() {
        if (!this.session) return;
        const s = this.session;
        s.flipped = !s.flipped;
        const el = $('#study-card');
        if (el) el.classList.toggle('flipped', s.flipped);

        if (s.flipped) {
            // Inject mark buttons after flip animation completes
            setTimeout(() => {
                if (!this.root.querySelector('#flip-mark-buttons')) {
                    const nav = this.root.querySelector('#flip-nav');
                    if (nav) {
                        const activeCards = this._flipActiveCards(s);
                        const card = activeCards[s.index];
                        const mark = card ? s.marks[card.id] : undefined;
                        nav.insertAdjacentHTML('afterend', `
                            <div class="rating-buttons flip-mark-buttons feedback-enter" id="flip-mark-buttons">
                                <button class="rating-btn flip-btn-know${mark === 'know' ? ' flip-mark-active-know' : ''}" onclick="app._flipMarkKnow()">\u2713 Know it</button>
                                <button class="rating-btn flip-btn-learning${mark === 'learning' ? ' flip-mark-active-learning' : ''}" onclick="app._flipMarkLearning()">\u25CF Still learning</button>
                            </div>`);
                    }
                }
            }, 400);
        } else {
            // Remove mark buttons when flipping back to front
            const buttons = this.root.querySelector('#flip-mark-buttons');
            if (buttons) buttons.remove();
        }
    }

    _flipPrev() {
        const s = this.session;
        if (!s || s.index <= 0) return;
        s.index--;
        s.flipped = false;
        this._fadeAndRender(() => this._renderFlip());
    }

    _flipNext() {
        const s = this.session;
        if (!s) return;
        const activeCards = this._flipActiveCards(s);
        if (s.index >= activeCards.length - 1) return;
        s.index++;
        s.flipped = false;
        this._fadeAndRender(() => this._renderFlip());
    }

    _flipToggleShuffle() {
        const s = this.session;
        if (!s) return;
        const activeCards = this._flipActiveCards(s);
        const currentId = activeCards[s.index]?.id;
        s.shuffled = !s.shuffled;
        s.allCards = s.shuffled ? shuffle([...s.originalOrder]) : [...s.originalOrder];
        const newActive = this._flipActiveCards(s);
        const newIdx = currentId ? newActive.findIndex(c => c.id === currentId) : 0;
        s.index = newIdx >= 0 ? newIdx : 0;
        s.flipped = false;
        this._fadeAndRender(() => this._renderFlip());
    }

    _flipToggleHideKnown() {
        const s = this.session;
        if (!s) return;
        const activeCards = this._flipActiveCards(s);
        const currentId = activeCards[s.index]?.id;
        s.hideKnown = !s.hideKnown;
        const newActive = this._flipActiveCards(s);
        // If current card is now hidden (was just marked know), go to nearest
        const newIdx = currentId ? newActive.findIndex(c => c.id === currentId) : 0;
        s.index = newIdx >= 0 ? newIdx : 0;
        s.flipped = false;
        this._fadeAndRender(() => this._renderFlip());
    }

    _flipMarkKnow() {
        const s = this.session;
        if (!s) return;
        const activeCards = this._flipActiveCards(s);
        const card = activeCards[s.index];
        if (!card) return;
        // Toggle: clicking again removes the mark
        s.marks[card.id] = s.marks[card.id] === 'know' ? undefined : 'know';

        if (s.hideKnown && s.marks[card.id] === 'know') {
            // Card disappears from active view — clamp and re-render
            const newActive = this._flipActiveCards(s);
            s.index = Math.min(s.index, Math.max(0, newActive.length - 1));
            s.flipped = false;
            this._fadeAndRender(() => this._renderFlip());
        } else {
            this._flipUpdateMarkUI(s, card.id);
        }
    }

    _flipMarkLearning() {
        const s = this.session;
        if (!s) return;
        const activeCards = this._flipActiveCards(s);
        const card = activeCards[s.index];
        if (!card) return;
        // Toggle: clicking again removes the mark
        s.marks[card.id] = s.marks[card.id] === 'learning' ? undefined : 'learning';
        this._flipUpdateMarkUI(s, card.id);
    }

    _flipResetMarks() {
        const s = this.session;
        if (!s) return;
        s.marks = {};
        s.flipped = false;
        this._fadeAndRender(() => this._renderFlip());
    }

    _flipUpdateMarkUI(s, cardId) {
        const mark = s.marks[cardId];

        // Update mark badge
        const existingBadge = this.root.querySelector('.flip-mark-badge');
        if (existingBadge) existingBadge.remove();
        const cardFlipArea = this.root.querySelector('.card-flip-area');
        if (mark && cardFlipArea) {
            cardFlipArea.insertAdjacentHTML('beforebegin',
                mark === 'know'
                    ? `<div class="flip-mark-badge flip-mark-know">\u2713 Know it</div>`
                    : `<div class="flip-mark-badge flip-mark-learning">\u25CF Still learning</div>`
            );
        }

        // Update mark button active states
        const btns = this.root.querySelectorAll('#flip-mark-buttons .rating-btn');
        if (btns.length >= 2) {
            btns[0].className = `rating-btn flip-btn-know${mark === 'know' ? ' flip-mark-active-know' : ''}`;
            btns[1].className = `rating-btn flip-btn-learning${mark === 'learning' ? ' flip-mark-active-learning' : ''}`;
        }

        // Update header counts
        const knownCount = Object.values(s.marks).filter(v => v === 'know').length;
        const learningCount = Object.values(s.marks).filter(v => v === 'learning').length;
        const totalMarked = knownCount + learningCount;
        const countEl = this.root.querySelector('.flip-mark-counts');
        if (countEl) {
            countEl.innerHTML =
                (knownCount > 0 ? `<span class="flip-count-know">\u2713 ${knownCount}</span>` : '') +
                (learningCount > 0 ? `<span class="flip-count-learning">\u25CF ${learningCount}</span>` : '');
        }

        // Show/hide Reset button in toolbar
        const toolbar = this.root.querySelector('.flip-toolbar');
        if (toolbar) {
            const existingReset = toolbar.querySelector('[onclick*="flipResetMarks"]');
            if (totalMarked > 0 && !existingReset) {
                toolbar.insertAdjacentHTML('beforeend',
                    `<button class="btn btn-sm btn-ghost" onclick="app._flipResetMarks()">Reset marks</button>`);
            } else if (totalMarked === 0 && existingReset) {
                existingReset.remove();
            }
        }
    }

    // ============================================================
    // LEARN MODE
    // ============================================================
    _renderLearn() {
        const deck = this._getDeck();
        if (!deck || deck.cards.length < 4) {
            showToast('Need at least 4 cards for Learn mode', 'error');
            return this.navigate('deck', { deckId: this.params.deckId });
        }

        if (!this.session) return this._renderLearnConfig(deck);
        switch (this.session.phase) {
            case 'block1': return this._renderLearnBlock1(deck);
            case 'block2': return this._renderLearnBlock2(deck);
            case 'block3': return this._renderLearnBlock3(deck);
            case 'summary': return this._renderLearnSummary(deck);
        }
    }

    // ---- Learn Config ----
    _renderLearnConfig(deck) {
        const isProfReview = this.params.proficientReview;
        const counts = { new: 0, learning: 0, proficient: 0, mastered: 0 };
        deck.cards.forEach(c => counts[c.stats.learnStatus || 'new']++);
        const backTarget = isProfReview
            ? `app.navigate('deck',{deckId:'${deck.id}'})`
            : `app.navigate('deck',{deckId:'${deck.id}'})`;
        const backLabel = isProfReview ? 'Back to deck' : 'Back to modes';

        if (isProfReview) {
            if (counts.proficient === 0) {
                this.root.innerHTML = `${this._headerHTML()}<div class="container view-enter">
                    <div class="back-row"><button class="back-btn" onclick="${backTarget}">\u2190 ${backLabel}</button></div>
                    <div class="results-container"><div class="results-icon">\u2705</div>
                    <div class="results-title">No Terms Ready for Review</div>
                    <div class="results-subtitle">Study more to build up proficient or mastered terms.</div>
                    <button class="btn btn-primary btn-lg" onclick="${backTarget}">Back</button></div></div>`;
                return;
            }
            this.root.innerHTML = `${this._headerHTML()}<div class="container view-enter">
                <div class="back-row"><button class="back-btn" onclick="${backTarget}">\u2190 ${backLabel}</button></div>
                <div class="learn-config panel panel-glow">
                    <div class="text-center mb-24">
                        <div style="font-size:2.5rem">\uD83C\uDFC6</div>
                        <h2 class="mt-8">Mastery Review</h2>
                        <p style="color:var(--text-secondary)">${counts.proficient} proficient terms to review</p>
                        <p style="color:var(--text-muted);font-size:0.85rem" class="mt-8">Skips flashcards. 1 strike = learning flag. Clean = Mastered.</p>
                    </div>
                    <div class="section-title justify-center mb-8" style="display:flex">Direction</div>
                    <div class="direction-picker-inline" style="justify-content:center;display:flex" class="mb-24">
                        <button class="dir-opt active" data-dir="front-to-back" onclick="app._learnSetConfigDir(this)">Front \u2192 Back</button>
                        <button class="dir-opt" data-dir="back-to-front" onclick="app._learnSetConfigDir(this)">Back \u2192 Front</button>
                        <button class="dir-opt" data-dir="random" onclick="app._learnSetConfigDir(this)">Random</button>
                    </div>
                    <div class="text-center mt-24"><button class="btn btn-primary btn-lg" onclick="app._startLearnChunk('proficient-review')">Start Review</button></div>
                </div></div>`;
            this._learnConfigDir = 'front-to-back';
            return;
        }

        const hasNew = counts.new > 0;
        const hasLearning = counts.learning > 0;
        if (!hasNew && !hasLearning) {
            this.root.innerHTML = `${this._headerHTML()}<div class="container view-enter">
                <div class="back-row"><button class="back-btn" onclick="${backTarget}">\u2190 ${backLabel}</button></div>
                <div class="results-container"><div class="results-icon">\u2705</div>
                <div class="results-title">All Caught Up!</div>
                <div class="results-subtitle">No new or learning terms. Try reviewing proficient terms from the deck page.</div>
                <button class="btn btn-primary btn-lg" onclick="${backTarget}">Back</button></div></div>`;
            return;
        }
        const autoInclude = !hasNew;
        this.root.innerHTML = `${this._headerHTML()}<div class="container view-enter">
            <div class="back-row"><button class="back-btn" onclick="${backTarget}">\u2190 ${backLabel}</button></div>
            <div class="learn-config panel panel-glow">
                <div class="text-center mb-24">
                    <div style="font-size:2.5rem">\uD83C\uDF93</div>
                    <h2 class="mt-8">Learn</h2>
                    <p style="color:var(--text-secondary)">Flashcards \u2192 Multiple Choice \u2192 Written</p>
                </div>
                <div class="dashboard-stats mb-24" style="grid-template-columns:repeat(4,1fr)">
                    <div class="stat-card"><div class="stat-value" style="color:var(--text-muted)">${counts.new}</div><div class="stat-label">New</div></div>
                    <div class="stat-card"><div class="stat-value" style="color:var(--warning)">${counts.learning}</div><div class="stat-label">Learning</div></div>
                    <div class="stat-card"><div class="stat-value" style="color:var(--success)">${counts.proficient}</div><div class="stat-label">Proficient</div></div>
                    <div class="stat-card stat-card-mastered"><div class="stat-value mastered-value">${counts.mastered}</div><div class="stat-label" style="color:rgba(255,255,255,0.6)">Mastered</div></div>
                </div>
                <div class="section-title justify-center mb-8" style="display:flex">Chunk Type</div>
                <div class="learn-mode-picker mb-24">
                    <button class="learn-mode-opt ${autoInclude ? '' : 'active'}" onclick="app._learnSetConfigMode('new',this)" ${!hasNew ? 'disabled' : ''}>
                        New Terms Only
                    </button>
                    <button class="learn-mode-opt ${autoInclude ? 'active' : ''}" onclick="app._learnSetConfigMode('include-learning',this)">
                        Include Learning
                    </button>
                </div>
                <div class="section-title justify-center mb-8" style="display:flex">Direction</div>
                <div class="direction-picker-inline mb-24" style="justify-content:center;display:flex">
                    <button class="dir-opt active" data-dir="front-to-back" onclick="app._learnSetConfigDir(this)">Front \u2192 Back</button>
                    <button class="dir-opt" data-dir="back-to-front" onclick="app._learnSetConfigDir(this)">Back \u2192 Front</button>
                    <button class="dir-opt" data-dir="random" onclick="app._learnSetConfigDir(this)">Random</button>
                </div>
                <div class="text-center"><button class="btn btn-primary btn-lg" onclick="app._startLearnChunk()">Start Chunk</button></div>
            </div></div>`;
        this._learnConfigMode = autoInclude ? 'include-learning' : 'new';
        this._learnConfigDir = 'front-to-back';
    }

    _learnSetConfigMode(mode, el) {
        this._learnConfigMode = mode;
        $$('.learn-mode-opt').forEach(b => b.classList.remove('active'));
        el.classList.add('active');
    }
    _learnSetConfigDir(el) {
        this._learnConfigDir = el.dataset.dir;
        $$('.dir-opt').forEach(b => b.classList.remove('active'));
        el.classList.add('active');
    }

    _startLearnChunk(modeOverride) {
        const deck = this._getDeck();
        if (!deck) return;
        const mode = modeOverride || this._learnConfigMode || 'new';
        const direction = this._learnConfigDir || 'front-to-back';
        let eligible;
        if (mode === 'proficient-review') {
            eligible = deck.cards.filter(c => (c.stats.learnStatus || 'new') === 'proficient');
        } else if (mode === 'include-learning') {
            eligible = deck.cards.filter(c => { const ls = c.stats.learnStatus || 'new'; return ls === 'new' || ls === 'learning'; });
        } else {
            eligible = deck.cards.filter(c => (c.stats.learnStatus || 'new') === 'new');
            if (eligible.length === 0) eligible = deck.cards.filter(c => { const ls = c.stats.learnStatus || 'new'; return ls === 'new' || ls === 'learning'; });
        }
        let chunkCards = eligible.slice(0, 8);
        if (chunkCards.length === 0) {
            showToast('No more terms available', 'info');
            this.session = null;
            this.render();
            return;
        }
        // Pad to at least 4 by pulling random cards from the rest of the deck
        if (chunkCards.length < 4) {
            const chunkIds = new Set(chunkCards.map(c => c.id));
            const fillers = shuffle(deck.cards.filter(c => !chunkIds.has(c.id))).slice(0, 4 - chunkCards.length);
            chunkCards = [...chunkCards, ...fillers];
        }
        const startPhase = mode === 'proficient-review' ? 'block2' : 'block1';
        this.session = {
            deckId: deck.id, mode, direction,
            phase: startPhase,
            chunkCards,
            b1Index: 0, b1Flipped: false,
            pool: startPhase === 'block2' ? [...chunkCards] : [],
            fillerPool: new Set(), fillerConfirmed: new Set(),
            dotStates: new Array(chunkCards.length).fill(null),
            dotCardIds: new Array(chunkCards.length).fill(null),
            dotsFilledCount: 0,
            currentCard: null, currentIsFiller: false,
            choices: null, correctChoiceIndex: -1, correctAnswer: '',
            selectedChoiceIndex: -1,
            answered: false, lastCorrect: null, lastAnswer: '', lastTyped: '',
            blockWrongCounts: {}, chunkLearningFlags: new Set(),
            delays: {}, lastShownId: null,
            startTime: Date.now(), results: [],
        };
        if (startPhase === 'block2') {
            this._learnPickAndRender();
        } else {
            this.render();
        }
    }

    _startProficientReview(deckId) {
        this.navigate('learn', { deckId, proficientReview: true });
    }

    // ---- Block Header (tabs + dots) ----
    _learnBlockHeaderHTML() {
        const s = this.session;
        const blockNum = s.phase === 'block1' ? 1 : s.phase === 'block2' ? 2 : 3;
        const blocks = s.mode === 'proficient-review' ? [2, 3] : [1, 2, 3];
        const tabs = blocks.map(n =>
            `<div class="learn-block-tab ${n === blockNum ? 'active' : n < blockNum ? 'completed' : ''}"></div>`
        ).join('');
        const dots = s.dotStates.map(st => {
            const cls = st === 'green' ? ' dot-green' : st === 'yellow' ? ' dot-yellow' : '';
            return `<div class="learn-dot${cls}"></div>`;
        }).join('');
        return `<div class="learn-block-tabs">${tabs}</div><div class="learn-dots-row">${dots}</div>`;
    }

    // ---- Block 1: Flashcards ----
    _renderLearnBlock1(deck) {
        const s = this.session;
        if (s.b1Index >= s.chunkCards.length) return this._learnAdvanceBlock();
        const card = s.chunkCards[s.b1Index];
        const { prompt, answer, promptLabel, answerLabel } = getPromptAndAnswer(card, s.direction);
        this.root.innerHTML = `${this._headerHTML()}<div class="container view-enter">
            <div class="study-header">
                <button class="back-btn" onclick="app.navigate('deck',{deckId:'${deck.id}'})">\u2190 Exit</button>
                <div style="flex:1"></div>
            </div>
            ${this._learnBlockHeaderHTML()}
            <div class="flip-toolbar">${this._dirPickerHTML(s.direction)}</div>
            <div class="card-flip-area" onclick="app._learnB1Flip()">
                <div class="card-flip-container">
                    <div class="card-flip ${s.b1Flipped ? 'flipped' : ''}" id="learn-card">
                        <div class="card-face card-front-face">
                            <div class="card-face-label">${esc(promptLabel)}</div>
                            <div class="card-face-text">${esc(prompt)}</div>
                            <div class="card-tap-hint">Tap to flip</div>
                        </div>
                        <div class="card-face card-back-face">
                            <div class="card-face-label">${esc(answerLabel)}</div>
                            <div class="card-face-text">${esc(answer)}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-center mt-16">
                <button class="btn btn-success btn-lg" onclick="app._learnB1GotIt()">Got it \u2192</button>
            </div>
        </div>`;
    }

    _learnB1Flip() {
        if (!this.session) return;
        this.session.b1Flipped = !this.session.b1Flipped;
        const el = $('#learn-card');
        if (el) el.classList.toggle('flipped', this.session.b1Flipped);
    }

    _learnB1GotIt() {
        const s = this.session;
        if (!s) return;
        s.dotStates[s.b1Index] = 'green';
        s.dotsFilledCount++;
        s.b1Index++;
        s.b1Flipped = false;
        this.addXP(5);
        this._fadeAndRender(() => this.render());
    }

    // ---- Advance Block ----
    _learnAdvanceBlock() {
        const s = this.session;
        if (s.phase === 'block1') s.phase = 'block2';
        else if (s.phase === 'block2') s.phase = 'block3';
        else { s.phase = 'summary'; return this.render(); }
        s.pool = [...s.chunkCards];
        s.fillerPool = new Set();
        s.fillerConfirmed = new Set();
        s.dotStates = new Array(s.chunkCards.length).fill(null);
        s.dotCardIds = new Array(s.chunkCards.length).fill(null);
        s.dotsFilledCount = 0;
        s.blockWrongCounts = {};
        s.delays = {};
        s.lastShownId = null;
        s.currentCard = null;
        s.currentIsFiller = false;
        s.choices = null;
        s.answered = false;
        s.lastCorrect = null;
        this._learnPickAndRender();
    }

    _learnPickAndRender() {
        const s = this.session;
        if (s.pool.length === 0) return this._learnAdvanceBlock();
        const pick = this._pickNextLearnQuestion();
        if (!pick) return this._learnAdvanceBlock();
        s.currentCard = pick.card;
        s.currentIsFiller = pick.isFiller;
        s.answered = false;
        s.lastCorrect = null;
        s.choices = null;
        s.lastTyped = '';
        s.selectedChoiceIndex = -1;
        this.render();
    }

    // ---- Pick Next Question ----
    _pickNextLearnQuestion() {
        const s = this.session;
        // Decrement all active delays (each question shown counts as one step)
        for (const id in s.delays) { if (s.delays[id] > 0) s.delays[id]--; }

        if (s.pool.length === 0) return null;

        const pick = (arr, exId) => {
            const f = exId ? arr.filter(c => c.id !== exId) : arr;
            const p = f.length > 0 ? f : arr;
            return p[Math.floor(Math.random() * p.length)];
        };

        // Bug 3 fix: only use fillers when ALL pool terms are in delay cooldown
        const available = s.pool.filter(c => !s.delays[c.id] || s.delays[c.id] <= 0);
        const fillerIds = [...s.fillerPool].filter(id => !s.fillerConfirmed.has(id));
        const fillerCards = fillerIds.map(id => s.chunkCards.find(c => c.id === id)).filter(Boolean);

        if (available.length > 0) {
            // Fresh unanswered terms exist — always prefer them over fillers
            return { card: pick(available, s.lastShownId), isFiller: false };
        }

        // All pool terms are in delay cooldown
        if (fillerCards.length > 0) {
            // Use a filler to fill the gap
            return { card: pick(fillerCards, s.lastShownId), isFiller: true };
        }

        // No fillers available — show a cooled-down pool term anyway (pick lowest delay)
        const byDelay = [...s.pool].sort((a, b) => (s.delays[a.id] || 0) - (s.delays[b.id] || 0));
        return { card: pick(byDelay.slice(0, Math.ceil(byDelay.length / 2)), s.lastShownId), isFiller: false };
    }

    // ---- Generate MC Choices ----
    _generateLearnChoices(card) {
        const deck = this._getDeck();
        const dir = this.session.direction;
        const { answer } = getPromptAndAnswer(card, dir);
        const others = deck.cards.filter(c => c.id !== card.id).map(c => getPromptAndAnswer(c, dir).answer).filter(a => a !== answer);
        const distractors = shuffle([...new Set(others)]).slice(0, 3);
        while (distractors.length < 3) distractors.push('\u2014');
        const choices = shuffle([answer, ...distractors]);
        return { choices, correctIndex: choices.indexOf(answer), answer };
    }

    // ---- Block 2: Multiple Choice ----
    _renderLearnBlock2(deck) {
        const s = this.session;
        if (!s.currentCard) return this._learnPickAndRender();
        const card = s.currentCard;
        const { prompt, promptLabel } = getPromptAndAnswer(card, s.direction);
        if (!s.choices) {
            const gen = this._generateLearnChoices(card);
            s.choices = gen.choices;
            s.correctChoiceIndex = gen.correctIndex;
            s.correctAnswer = gen.answer;
        }
        this.root.innerHTML = `${this._headerHTML()}<div class="container view-enter">
            <div class="study-header">
                <button class="back-btn" onclick="app.navigate('deck',{deckId:'${deck.id}'})">\u2190 Exit</button>
                <div style="flex:1"></div>
            </div>
            ${this._learnBlockHeaderHTML()}
            <div class="flip-toolbar">${this._dirPickerHTML(s.direction)}</div>
            ${s.currentIsFiller ? '<div class="learn-filler-badge">Review</div>' : ''}
            <div class="quiz-prompt"><div class="quiz-prompt-label">${esc(promptLabel)}</div><div class="quiz-prompt-text">${esc(prompt)}</div></div>
            <div class="learn-mc-grid">
                ${s.choices.map((ch, i) => {
                    let cls = 'learn-mc-btn';
                    if (s.answered) {
                        if (i === s.correctChoiceIndex) cls += ' mc-correct';
                        else if (i === s.selectedChoiceIndex && !s.lastCorrect) cls += ' mc-incorrect';
                        else cls += ' mc-disabled';
                    }
                    return `<button class="${cls}" onclick="app._learnMCAnswer(${i})" ${s.answered ? 'disabled' : ''}>${esc(ch)}</button>`;
                }).join('')}
            </div>
            ${s.answered && !s.lastCorrect ? '<div class="flex justify-center mt-16"><button class="btn btn-primary" onclick="app._learnNext()">Next</button></div>' : ''}
        </div>`;
    }

    _learnMCIDK() {
        const s = this.session;
        if (!s || s.answered) return;
        s.answered = true;
        s.selectedChoiceIndex = -1;
        s.lastCorrect = false;
        this._learnHandleAnswer(s.currentCard, false, s.currentIsFiller);
        this._fadeAndRender(() => this.render());
    }

    _learnMCAnswer(index) {
        const s = this.session;
        if (!s || s.answered) return;
        s.answered = true;
        s.selectedChoiceIndex = index;
        s.lastCorrect = index === s.correctChoiceIndex;
        this._learnHandleAnswer(s.currentCard, s.lastCorrect, s.currentIsFiller);
        this._fadeAndRender(() => this.render());
        if (s.lastCorrect) setTimeout(() => this._learnNext(), 800);
    }

    // ---- Block 3: Written Response ----
    _renderLearnBlock3(deck) {
        const s = this.session;
        if (!s.currentCard) return this._learnPickAndRender();
        const card = s.currentCard;
        const { prompt, answer, promptLabel } = getPromptAndAnswer(card, s.direction);
        s.correctAnswer = answer;
        this.root.innerHTML = `${this._headerHTML()}<div class="container view-enter">
            <div class="study-header">
                <button class="back-btn" onclick="app.navigate('deck',{deckId:'${deck.id}'})">\u2190 Exit</button>
                <div style="flex:1"></div>
            </div>
            ${this._learnBlockHeaderHTML()}
            <div class="flip-toolbar">${this._dirPickerHTML(s.direction)}</div>
            ${s.currentIsFiller ? '<div class="learn-filler-badge">Review</div>' : ''}
            <div class="quiz-prompt"><div class="quiz-prompt-label">${esc(promptLabel)}</div><div class="quiz-prompt-text">${esc(prompt)}</div></div>
            ${!s.answered ? `
                <div class="quiz-input-row">
                    <input class="quiz-input" id="learn-typed" placeholder="Type your answer..." autofocus autocomplete="off">
                    <button class="btn btn-primary" onclick="app._learnWrittenSubmit()">Check</button>
                </div>
                ${this._specialCharsHTML('learn-typed')}
                <div class="idk-row flex justify-center mt-8"><button class="btn btn-ghost btn-sm" onclick="app._learnWrittenIDK()">I don't know</button></div>
            ` : `
                <div class="quiz-input-row"><input class="quiz-input ${s.lastCorrect ? 'correct' : 'incorrect'}" value="${esc(s.lastTyped)}" disabled></div>
                <div class="quiz-feedback ${s.lastCorrect ? 'correct' : 'incorrect'}">
                    ${s.lastCorrect ? 'Correct!' : `Incorrect <span class="correct-answer">Correct: ${esc(s.correctAnswer)}</span>`}
                </div>
                <div class="flex justify-center mt-16 gap-8">
                    ${!s.lastCorrect ? '<button class="btn btn-ghost btn-sm" onclick="app._learnOverrideCorrect()">I was correct</button>' : ''}
                    <button class="btn btn-primary" id="learn-next" onclick="app._learnNext()">Next</button>
                </div>
            `}
        </div>`;
        if (!s.answered) {
            const inp = $('#learn-typed');
            if (inp) { inp.focus(); inp.addEventListener('keydown', e => { if (e.key === 'Enter') this._learnWrittenSubmit(); }); }
        } else { setTimeout(() => $('#learn-next')?.focus(), 50); }
    }

    _learnWrittenSubmit() {
        const s = this.session;
        if (!s || s.answered) return;
        const input = ($('#learn-typed')?.value || '').trim();
        if (!input) return;
        s.lastTyped = input;
        const result = fuzzyMatch(input, s.correctAnswer);
        s.answered = true;
        s.lastCorrect = result.match;
        this._learnHandleAnswer(s.currentCard, result.match, s.currentIsFiller);
        this._fadeAndRender(() => this.render());
    }

    _learnWrittenIDK() {
        const s = this.session;
        if (!s || s.answered) return;
        s.lastTyped = '';
        s.answered = true;
        s.lastCorrect = false;
        this._learnHandleAnswer(s.currentCard, false, s.currentIsFiller);
        this._fadeAndRender(() => this.render());
    }

    _learnOverrideCorrect() {
        const s = this.session;
        if (!s || !s.currentCard) return;
        const card = s.currentCard;
        const isFiller = s.currentIsFiller;

        // Undo the wrong-answer stats
        card.stats.incorrect = Math.max(0, card.stats.incorrect - 1);
        card.stats.correct++;
        card.stats.streak = 1;
        card.stats.bestStreak = Math.max(card.stats.bestStreak, 1);

        if (!isFiller) {
            // Bug 1 fix: reset strike count to 0 — override erases the wrong entirely
            s.blockWrongCounts[card.id] = 0;
            // Always clear the learning flag (strike count is 0, threshold can never be met retroactively)
            s.chunkLearningFlags.delete(card.id);
            delete s.delays[card.id];

            if (s.pool.some(c => c.id === card.id)) {
                // Card still in pool — move to fillerPool and fill next dot green
                s.pool = s.pool.filter(c => c.id !== card.id);
                s.fillerPool.add(card.id);
                const nextDot = s.dotStates.indexOf(null);
                if (nextDot >= 0) {
                    s.dotStates[nextDot] = 'green'; // always green since strike count is 0
                    s.dotCardIds[nextDot] = card.id;
                }
                s.dotsFilledCount++;
            } else {
                // Bug 2 fix: card was already removed from pool (e.g. mastery-review demotion)
                // find its existing dot and correct the color
                const dotIdx = s.dotCardIds.indexOf(card.id);
                if (dotIdx >= 0) s.dotStates[dotIdx] = 'green';
                s.fillerPool.add(card.id);
            }
        } else {
            // Filler override: confirm it
            s.fillerConfirmed.add(card.id);
        }

        s.lastCorrect = true;
        this.save();
        this._fadeAndRender(() => this.render());
    }

    // ---- Shared Answer Logic ----
    _learnHandleAnswer(card, correct, isFiller) {
        const s = this.session;
        s.lastShownId = card.id;
        if (correct) { card.stats.correct++; card.stats.streak++; card.stats.bestStreak = Math.max(card.stats.bestStreak, card.stats.streak); }
        else { card.stats.incorrect++; card.stats.streak = 0; }
        card.stats.lastSeen = Date.now();
        this.data.totalStudied = (this.data.totalStudied || 0) + 1;

        // Strike threshold: 3 wrongs for normal learn, 2 for mastery review
        const threshold = s.mode === 'proficient-review' ? 2 : 3;

        if (correct) {
            if (isFiller) {
                s.fillerConfirmed.add(card.id);
            } else {
                // Pool card correct: remove from pool, fill dot
                s.pool = s.pool.filter(c => c.id !== card.id);
                s.fillerPool.add(card.id);
                const nextDot = s.dotStates.indexOf(null);
                if (nextDot >= 0) {
                    s.dotStates[nextDot] = s.chunkLearningFlags.has(card.id) ? 'yellow' : 'green';
                    s.dotCardIds[nextDot] = card.id;
                }
                s.dotsFilledCount++;
                this.addXP(10);
            }
        } else {
            // Wrong answer — strikes count whether pool or filler
            s.blockWrongCounts[card.id] = (s.blockWrongCounts[card.id] || 0) + 1;
            const hitThreshold = s.blockWrongCounts[card.id] >= threshold;

            if (hitThreshold) {
                s.chunkLearningFlags.add(card.id);
                // Mastery review: also immediately demote the card's persistent status
                if (s.mode === 'proficient-review') {
                    const cur = card.stats.learnStatus || 'new';
                    if (cur === 'mastered') card.stats.learnStatus = 'proficient';
                    else if (cur === 'proficient') card.stats.learnStatus = 'learning';
                }
            }

            if (isFiller) {
                // Update existing dot: force yellow if threshold hit, else green → yellow
                const idx = s.dotCardIds.indexOf(card.id);
                if (idx >= 0) {
                    if (hitThreshold || s.dotStates[idx] === 'green') s.dotStates[idx] = 'yellow';
                }
            } else {
                if (hitThreshold) {
                    // Immediately remove from pool — stops indefinite cycling
                    s.pool = s.pool.filter(c => c.id !== card.id);
                    s.fillerPool.add(card.id);
                    delete s.delays[card.id];
                    const nextDot = s.dotStates.indexOf(null);
                    if (nextDot >= 0) {
                        s.dotStates[nextDot] = 'yellow';
                        s.dotCardIds[nextDot] = card.id;
                    }
                    s.dotsFilledCount++;
                } else {
                    // Below threshold: delay and keep in pool
                    const minDelay = Math.min(3, Math.max(s.pool.length - 1, 1));
                    s.delays[card.id] = Math.floor(Math.random() * 2) + minDelay;
                }
                this.addXP(2);
            }
        }
        s.results.push({ card, correct, isFiller });
        this.save();
    }

    _learnNext() { this._fadeAndRender(() => this._learnPickAndRender()); }

    // ---- Summary ----
    _renderLearnSummary(deck) {
        const s = this.session;
        let newMasteredCount = 0;
        s.chunkCards.forEach(card => {
            const flagged = s.chunkLearningFlags.has(card.id);
            const current = card.stats.learnStatus || 'new';
            if (s.mode === 'proficient-review') {
                if (flagged) {
                    if (current === 'mastered') card.stats.learnStatus = 'proficient';
                    else if (current === 'proficient') card.stats.learnStatus = 'learning';
                } else {
                    if (current !== 'mastered') newMasteredCount++;
                    card.stats.learnStatus = 'mastered';
                }
            } else {
                if (flagged) {
                    // Mastered cards demote to proficient; others become learning
                    if (current === 'mastered') card.stats.learnStatus = 'proficient';
                    else card.stats.learnStatus = 'learning';
                } else {
                    card.stats.learnStatus = 'proficient';
                }
            }
        });
        deck.lastStudied = Date.now();
        this.save();

        const counts = { new: 0, learning: 0, proficient: 0, mastered: 0 };
        deck.cards.forEach(c => counts[c.stats.learnStatus || 'new']++);
        const total = deck.cards.length || 1;
        const chunkProf = s.chunkCards.filter(c => !s.chunkLearningFlags.has(c.id)).length;
        const chunkLearn = s.chunkCards.filter(c => s.chunkLearningFlags.has(c.id)).length;
        if (newMasteredCount > 0) showMasteredCelebration();
        else showConfetti();

        this.root.innerHTML = `${this._headerHTML()}<div class="container view-enter">
            <div class="results-container" style="max-width:600px">
                <div class="results-icon">\uD83C\uDF93</div>
                <div class="results-title">Chunk Complete!</div>
                <div class="results-subtitle">${s.chunkCards.length} terms studied</div>
                <div class="results-stats mb-24">
                    <div class="results-stat"><div class="results-stat-value text-success">${chunkProf}</div><div class="results-stat-label">${s.mode === 'proficient-review' ? 'Mastered' : 'Proficient'}</div></div>
                    <div class="results-stat"><div class="results-stat-value text-warning">${chunkLearn}</div><div class="results-stat-label">Learning</div></div>
                </div>
                <div class="section-title mb-8">Deck Progress</div>
                <div class="learn-summary-bar mb-8">
                    <div class="learn-bar-seg bar-mastered" style="width:${(counts.mastered / total * 100).toFixed(1)}%"></div>
                    <div class="learn-bar-seg bar-proficient" style="width:${(counts.proficient / total * 100).toFixed(1)}%"></div>
                    <div class="learn-bar-seg bar-learning" style="width:${(counts.learning / total * 100).toFixed(1)}%"></div>
                </div>
                <div class="learn-summary-counts mb-24">
                    <span class="lsc-item"><span class="lsc-dot" style="background:#000;border:1px solid rgba(255,255,255,0.5)"></span>${counts.mastered} Mastered</span>
                    <span class="lsc-item"><span class="lsc-dot" style="background:var(--success)"></span>${counts.proficient} Proficient</span>
                    <span class="lsc-item"><span class="lsc-dot" style="background:var(--warning)"></span>${counts.learning} Learning</span>
                    <span class="lsc-item"><span class="lsc-dot" style="background:var(--text-muted)"></span>${counts.new} Remaining</span>
                </div>
                <div class="results-actions">
                    <button class="btn btn-secondary" onclick="app.navigate('deck',{deckId:'${deck.id}'})">Back to Deck</button>
                    <button class="btn btn-primary" onclick="app._learnContinue()">Continue</button>
                </div>
            </div>
        </div>`;
    }

    _learnContinue() {
        const prevMode = this.session.mode;
        const prevDir = this.session.direction;
        this._learnConfigMode = prevMode;
        this._learnConfigDir = prevDir;
        this.session = null;
        this._startLearnChunk(prevMode === 'proficient-review' ? 'proficient-review' : undefined);
    }

    // ============================================================
    // QUIZ MODE
    // ============================================================
    _renderQuiz() {
        const deck = this._getDeck();
        if (!deck || deck.cards.length === 0) return this.navigate('dashboard');

        if (!this.session) {
            this.session = {
                cards: shuffle(deck.cards),
                index: 0,
                answered: false,
                lastCorrect: null,
                lastAnswer: '',
                results: [],
                streak: 0,
                startTime: Date.now(),
                direction: 'front-to-back',
            };
        }

        const s = this.session;
        const dir = s.direction;

        if (s.index >= s.cards.length) {
            return this._showResults(deck);
        }

        const card = s.cards[s.index];
        const { prompt, answer, promptLabel, answerLabel } = getPromptAndAnswer(card, dir);
        const progress = (s.index / s.cards.length * 100).toFixed(0);

        this.root.innerHTML = `
        ${this._headerHTML()}
        <div class="container view-enter">
            <div class="study-header">
                <button class="back-btn" onclick="app.navigate('deck',{deckId:'${deck.id}'})">\u2190 Exit</button>
                <div class="study-progress">
                    <div class="progress-bar"><div class="progress-bar-fill" style="width:${progress}%"></div></div>
                    <div class="progress-text">${s.index + 1} / ${s.cards.length}</div>
                </div>
                <div class="streak-display ${s.streak >= 3 ? 'on-fire' : 'neutral'}">
                    ${s.streak >= 3 ? '\uD83D\uDD25' : ''} ${s.streak}
                </div>
            </div>

            <div class="flip-toolbar">${this._dirPickerHTML(dir)}</div>

            <div class="quiz-prompt">
                <div class="quiz-prompt-label">${esc(promptLabel)}</div>
                <div class="quiz-prompt-text">${esc(prompt)}</div>
            </div>

            ${!s.answered ? `
                <div class="quiz-input-row">
                    <input class="quiz-input" id="quiz-answer" placeholder="Type your answer..." autofocus autocomplete="off">
                    <button class="btn btn-primary" onclick="app._submitQuiz()">Check</button>
                </div>
                ${this._specialCharsHTML('quiz-answer')}
                <div class="idk-row flex justify-center mt-8"><button class="btn btn-ghost btn-sm" onclick="app._skipQuiz()">I don't know</button></div>
            ` : `
                <div class="quiz-input-row">
                    <input class="quiz-input ${s.lastCorrect ? 'correct' : 'incorrect'}" value="${esc(s.lastTyped || '')}" disabled>
                </div>
                <div class="quiz-feedback ${s.lastCorrect ? 'correct' : 'incorrect'}">
                    ${s.lastCorrect
                        ? (s.lastExact ? 'Correct!' : 'Close enough!')
                        : `Incorrect <span class="correct-answer">Correct answer: ${esc(s.lastAnswer)}</span>`}
                </div>
                <div class="flex justify-center mt-16">
                    <button class="btn btn-primary btn-lg" id="quiz-next" onclick="app._nextQuiz()">Next \u2192</button>
                </div>
            `}
        </div>`;

        if (!s.answered) {
            const inp = $('#quiz-answer');
            if (inp) {
                inp.focus();
                inp.addEventListener('keydown', e => { if (e.key === 'Enter') this._submitQuiz(); });
            }
        } else {
            setTimeout(() => $('#quiz-next')?.focus(), 50);
        }
    }

    _submitQuiz() {
        const s = this.session;
        if (!s || s.answered) return;
        const input = ($('#quiz-answer')?.value || '').trim();
        if (!input) return;

        const card = s.cards[s.index];
        const { answer } = getPromptAndAnswer(card, s.direction);
        const result = fuzzyMatch(input, answer);

        s.answered = true;
        s.lastCorrect = result.match;
        s.lastExact = result.exact;
        s.lastAnswer = answer;
        s.lastTyped = input;

        if (result.match) {
            card.stats.correct++;
            card.stats.streak++;
            card.stats.bestStreak = Math.max(card.stats.bestStreak, card.stats.streak);
            s.streak++;
            this.addXP(15 + (s.streak >= 3 ? s.streak * 2 : 0));
            if (s.streak > 0 && s.streak % 5 === 0) showConfetti();
        } else {
            card.stats.incorrect++;
            card.stats.streak = 0;
            s.streak = 0;
            this.addXP(2);
        }
        card.stats.lastSeen = Date.now();
        s.results.push({ card, correct: result.match });
        this.data.totalStudied = (this.data.totalStudied || 0) + 1;
        this.save();

        // Partial update — no full re-render flash
        const inp = $('#quiz-answer');
        if (inp) {
            inp.disabled = true;
            inp.classList.add(result.match ? 'correct' : 'incorrect');
        }
        const checkBtn = this.root.querySelector('.quiz-input-row .btn');
        if (checkBtn) checkBtn.remove();
        const specialRow = this.root.querySelector('.special-chars-row');
        if (specialRow) specialRow.remove();
        const idkRow = this.root.querySelector('.idk-row');
        if (idkRow) idkRow.remove();
        const inputRow = this.root.querySelector('.quiz-input-row');
        if (inputRow) {
            inputRow.insertAdjacentHTML('afterend', `
                <div class="quiz-feedback ${result.match ? 'correct' : 'incorrect'} feedback-enter">
                    ${result.match
                        ? (result.exact ? 'Correct!' : 'Close enough!')
                        : `Incorrect <span class="correct-answer">Correct answer: ${esc(answer)}</span>`}
                </div>
                <div class="flex justify-center mt-16">
                    <button class="btn btn-primary btn-lg" id="quiz-next" onclick="app._nextQuiz()">Next \u2192</button>
                </div>`);
        }
        const streakEl = this.root.querySelector('.streak-display');
        if (streakEl) {
            streakEl.className = `streak-display ${s.streak >= 3 ? 'on-fire' : 'neutral'}`;
            streakEl.innerHTML = `${s.streak >= 3 ? '\uD83D\uDD25' : ''} ${s.streak}`;
        }
        setTimeout(() => $('#quiz-next')?.focus(), 50);
    }

    _nextQuiz() {
        const s = this.session;
        s.index++;
        s.answered = false;
        s.lastCorrect = null;
        s.lastTyped = '';
        this._fadeAndRender(() => this._renderQuiz());
    }

    _skipQuiz() {
        const s = this.session;
        if (!s || s.answered) return;
        s.answered = true;
        s.lastCorrect = false;
        s.lastExact = false;
        s.lastTyped = '';
        const card = s.cards[s.index];
        const { answer } = getPromptAndAnswer(card, s.direction);
        s.lastAnswer = answer;
        card.stats.incorrect++;
        card.stats.streak = 0;
        s.streak = 0;
        card.stats.lastSeen = Date.now();
        s.results.push({ card, correct: false });
        this.data.totalStudied = (this.data.totalStudied || 0) + 1;
        this.addXP(2);
        this.save();

        const inp = $('#quiz-answer');
        if (inp) { inp.disabled = true; inp.classList.add('incorrect'); }
        const checkBtn = this.root.querySelector('.quiz-input-row .btn');
        if (checkBtn) checkBtn.remove();
        const specialRow = this.root.querySelector('.special-chars-row');
        if (specialRow) specialRow.remove();
        const idkRow = this.root.querySelector('.idk-row');
        if (idkRow) idkRow.remove();
        const inputRow = this.root.querySelector('.quiz-input-row');
        if (inputRow) {
            inputRow.insertAdjacentHTML('afterend', `
                <div class="quiz-feedback incorrect feedback-enter">
                    Incorrect <span class="correct-answer">Correct answer: ${esc(answer)}</span>
                </div>
                <div class="flex justify-center mt-16">
                    <button class="btn btn-primary btn-lg" id="quiz-next" onclick="app._nextQuiz()">Next \u2192</button>
                </div>`);
        }
        const streakEl = this.root.querySelector('.streak-display');
        if (streakEl) {
            streakEl.className = 'streak-display neutral';
            streakEl.innerHTML = ' 0';
        }
        setTimeout(() => $('#quiz-next')?.focus(), 50);
    }

    // ============================================================
    // FOCUS MODE
    // ============================================================
    _renderFocus() {
        const deck = this._getDeck();
        if (!deck) return this.navigate('dashboard');

        const weakCards = deck.cards.filter(isWeak);
        if (weakCards.length === 0) {
            this.root.innerHTML = `
            ${this._headerHTML()}
            <div class="container view-enter">
                <div class="back-row">
                    <button class="back-btn" onclick="app.navigate('deck',{deckId:'${deck.id}'})">\u2190 Back</button>
                </div>
                <div class="results-container">
                    <div class="results-icon">\uD83C\uDF1F</div>
                    <div class="results-title">No Weak Cards!</div>
                    <div class="results-subtitle">You're doing great. All cards are in good shape.</div>
                    <button class="btn btn-primary btn-lg" onclick="app.navigate('deck',{deckId:'${deck.id}'})">Back to Deck</button>
                </div>
            </div>`;
            return;
        }

        if (!this.session) {
            this.session = {
                cards: shuffle(weakCards),
                index: 0,
                answered: false,
                lastCorrect: null,
                lastAnswer: '',
                results: [],
                streak: 0,
                startTime: Date.now(),
                direction: 'front-to-back',
                style: 'quiz', // 'quiz' | 'flip'
                flipped: false,
                hasSeenAnswer: false,
            };
        }

        const s = this.session;
        const dir = s.direction;

        if (s.index >= s.cards.length) {
            return this._showResults(deck);
        }

        const card = s.cards[s.index];
        const { prompt, answer, promptLabel, answerLabel } = getPromptAndAnswer(card, dir);
        const progress = (s.index / s.cards.length * 100).toFixed(0);

        const styleToggle = `
            <div class="focus-style-toggle">
                <button class="dir-opt ${s.style === 'quiz' ? 'active' : ''}" onclick="app._setFocusStyle('quiz')">Quiz</button>
                <button class="dir-opt ${s.style === 'flip' ? 'active' : ''}" onclick="app._setFocusStyle('flip')">Flip</button>
            </div>`;

        let bodyHTML = '';

        if (s.style === 'quiz') {
            bodyHTML = `
            <div class="quiz-prompt">
                <div class="quiz-prompt-label">${esc(promptLabel)}</div>
                <div class="quiz-prompt-text">${esc(prompt)}</div>
            </div>

            ${!s.answered ? `
                <div class="quiz-input-row">
                    <input class="quiz-input" id="focus-answer" placeholder="Type your answer..." autofocus autocomplete="off">
                    <button class="btn btn-primary" onclick="app._submitFocus()">Check</button>
                </div>
                ${this._specialCharsHTML('focus-answer')}
                <div class="idk-row flex justify-center mt-8"><button class="btn btn-ghost btn-sm" onclick="app._skipFocus()">I don't know</button></div>
            ` : `
                <div class="quiz-input-row">
                    <input class="quiz-input ${s.lastCorrect ? 'correct' : 'incorrect'}" value="${esc(s.lastTyped || '')}" disabled>
                </div>
                <div class="quiz-feedback ${s.lastCorrect ? 'correct' : 'incorrect'}">
                    ${s.lastCorrect
                        ? 'Nice! You\'re getting stronger!'
                        : `Keep going! Answer: ${esc(s.lastAnswer)}`}
                </div>
                <div class="flex justify-center mt-16">
                    <button class="btn btn-primary btn-lg" id="focus-next" onclick="app._nextFocus()">Next \u2192</button>
                </div>
            `}`;
        } else {
            bodyHTML = `
            <div class="card-flip-area" onclick="app._focusFlip()">
                <div class="card-flip-container">
                    <div class="card-flip ${s.flipped ? 'flipped' : ''}" id="focus-card">
                        <div class="card-face card-front-face">
                            <div class="card-face-label">${esc(promptLabel)}</div>
                            <div class="card-face-text">${esc(prompt)}</div>
                            <div class="card-tap-hint">Tap to flip</div>
                        </div>
                        <div class="card-face card-back-face">
                            <div class="card-face-label">${esc(answerLabel)}</div>
                            <div class="card-face-text">${esc(answer)}</div>
                        </div>
                    </div>
                </div>
            </div>

            ${s.hasSeenAnswer ? `
                <div class="rating-buttons">
                    <button class="rating-btn rating-again" onclick="app._rateFocus(false)">Didn't know</button>
                    <button class="rating-btn rating-good" onclick="app._rateFocus(true)">Got it!</button>
                </div>
            ` : ''}`;
        }

        this.root.innerHTML = `
        ${this._headerHTML()}
        <div class="container view-enter">
            <div class="study-header">
                <button class="back-btn" onclick="app.navigate('deck',{deckId:'${deck.id}'})">\u2190 Exit</button>
                <div class="study-progress">
                    <div class="progress-bar" style="--gradient:var(--gradient-warm)">
                        <div class="progress-bar-fill" style="width:${progress}%;background:var(--gradient-warm)"></div>
                    </div>
                    <div class="progress-text">Focus: ${s.index + 1} / ${s.cards.length}</div>
                </div>
                <div class="streak-display ${s.streak >= 3 ? 'on-fire' : 'neutral'}">
                    ${s.streak >= 3 ? '\uD83D\uDD25' : ''} ${s.streak}
                </div>
            </div>

            <div class="flip-toolbar">
                ${this._dirPickerHTML(dir)}
                ${styleToggle}
            </div>

            <div class="learn-phase-label" style="color:var(--warning)">Strengthening Weak Cards</div>

            ${bodyHTML}
        </div>`;

        if (s.style === 'quiz') {
            if (!s.answered) {
                const inp = $('#focus-answer');
                if (inp) {
                    inp.focus();
                    inp.addEventListener('keydown', e => { if (e.key === 'Enter') this._submitFocus(); });
                }
            } else {
                setTimeout(() => $('#focus-next')?.focus(), 50);
            }
        }
    }

    _setFocusStyle(style) {
        if (!this.session) return;
        this.session.style = style;
        this.session.answered = false;
        this.session.flipped = false;
        this.session.hasSeenAnswer = false;
        this.session.lastCorrect = null;
        this.session.lastTyped = '';
        this._renderFocus();
    }

    _focusFlip() {
        const s = this.session;
        if (!s) return;
        s.flipped = !s.flipped;
        const el = $('#focus-card');
        if (el) el.classList.toggle('flipped', s.flipped);
        if (s.flipped && !s.hasSeenAnswer) {
            s.hasSeenAnswer = true;
            // Inject rating buttons after flip animation — no full re-render
            setTimeout(() => {
                const container = this.root.querySelector('.container');
                if (!container || container.querySelector('.rating-buttons')) return;
                const flipArea = container.querySelector('.card-flip-area');
                if (flipArea) {
                    flipArea.insertAdjacentHTML('afterend', `
                        <div class="rating-buttons feedback-enter">
                            <button class="rating-btn rating-again" onclick="app._rateFocus(false)">Didn't know</button>
                            <button class="rating-btn rating-good" onclick="app._rateFocus(true)">Got it!</button>
                        </div>`);
                }
            }, 400);
        }
    }

    _rateFocus(correct) {
        const s = this.session;
        if (!s) return;
        const card = s.cards[s.index];

        if (correct) {
            card.stats.correct++;
            card.stats.streak++;
            card.stats.bestStreak = Math.max(card.stats.bestStreak, card.stats.streak);
            s.streak++;
            this.addXP(20 + (s.streak >= 3 ? s.streak * 2 : 0));
        } else {
            card.stats.incorrect++;
            card.stats.streak = 0;
            s.streak = 0;
            this.addXP(3);
        }
        card.stats.lastSeen = Date.now();
        s.results.push({ card, correct });
        this.data.totalStudied = (this.data.totalStudied || 0) + 1;
        this.save();

        s.index++;
        s.flipped = false;
        s.hasSeenAnswer = false;
        this._fadeAndRender(() => this._renderFocus());
    }

    _submitFocus() {
        const s = this.session;
        if (!s || s.answered) return;
        const input = ($('#focus-answer')?.value || '').trim();
        if (!input) return;

        const card = s.cards[s.index];
        const { answer } = getPromptAndAnswer(card, s.direction);
        const result = fuzzyMatch(input, answer);

        s.answered = true;
        s.lastCorrect = result.match;
        s.lastAnswer = answer;
        s.lastTyped = input;

        if (result.match) {
            card.stats.correct++;
            card.stats.streak++;
            card.stats.bestStreak = Math.max(card.stats.bestStreak, card.stats.streak);
            s.streak++;
            this.addXP(20 + (s.streak >= 3 ? s.streak * 2 : 0));
        } else {
            card.stats.incorrect++;
            card.stats.streak = 0;
            s.streak = 0;
            this.addXP(3);
        }
        card.stats.lastSeen = Date.now();
        s.results.push({ card, correct: result.match });
        this.data.totalStudied = (this.data.totalStudied || 0) + 1;
        this.save();

        // Partial update — no full re-render flash
        const inp = $('#focus-answer');
        if (inp) {
            inp.disabled = true;
            inp.classList.add(result.match ? 'correct' : 'incorrect');
        }
        const checkBtn = this.root.querySelector('.quiz-input-row .btn');
        if (checkBtn) checkBtn.remove();
        const specialRow = this.root.querySelector('.special-chars-row');
        if (specialRow) specialRow.remove();
        const idkRow = this.root.querySelector('.idk-row');
        if (idkRow) idkRow.remove();
        const inputRow = this.root.querySelector('.quiz-input-row');
        if (inputRow) {
            inputRow.insertAdjacentHTML('afterend', `
                <div class="quiz-feedback ${result.match ? 'correct' : 'incorrect'} feedback-enter">
                    ${result.match
                        ? 'Nice! You\'re getting stronger!'
                        : `Keep going! Answer: ${esc(answer)}`}
                </div>
                <div class="flex justify-center mt-16">
                    <button class="btn btn-primary btn-lg" id="focus-next" onclick="app._nextFocus()">Next \u2192</button>
                </div>`);
        }
        const streakEl = this.root.querySelector('.streak-display');
        if (streakEl) {
            streakEl.className = `streak-display ${s.streak >= 3 ? 'on-fire' : 'neutral'}`;
            streakEl.innerHTML = `${s.streak >= 3 ? '\uD83D\uDD25' : ''} ${s.streak}`;
        }
        setTimeout(() => $('#focus-next')?.focus(), 50);
    }

    _nextFocus() {
        const s = this.session;
        s.index++;
        s.answered = false;
        s.lastCorrect = null;
        s.lastTyped = '';
        s.flipped = false;
        s.hasSeenAnswer = false;
        this._fadeAndRender(() => this._renderFocus());
    }

    _skipFocus() {
        const s = this.session;
        if (!s || s.answered) return;
        s.answered = true;
        s.lastCorrect = false;
        s.lastTyped = '';
        const card = s.cards[s.index];
        const { answer } = getPromptAndAnswer(card, s.direction);
        s.lastAnswer = answer;
        card.stats.incorrect++;
        card.stats.streak = 0;
        s.streak = 0;
        card.stats.lastSeen = Date.now();
        s.results.push({ card, correct: false });
        this.data.totalStudied = (this.data.totalStudied || 0) + 1;
        this.addXP(3);
        this.save();

        const inp = $('#focus-answer');
        if (inp) { inp.disabled = true; inp.classList.add('incorrect'); }
        const checkBtn = this.root.querySelector('.quiz-input-row .btn');
        if (checkBtn) checkBtn.remove();
        const specialRow = this.root.querySelector('.special-chars-row');
        if (specialRow) specialRow.remove();
        const idkRow = this.root.querySelector('.idk-row');
        if (idkRow) idkRow.remove();
        const inputRow = this.root.querySelector('.quiz-input-row');
        if (inputRow) {
            inputRow.insertAdjacentHTML('afterend', `
                <div class="quiz-feedback incorrect feedback-enter">
                    Keep going! Answer: ${esc(answer)}
                </div>
                <div class="flex justify-center mt-16">
                    <button class="btn btn-primary btn-lg" id="focus-next" onclick="app._nextFocus()">Next \u2192</button>
                </div>`);
        }
        const streakEl = this.root.querySelector('.streak-display');
        if (streakEl) {
            streakEl.className = 'streak-display neutral';
            streakEl.innerHTML = ' 0';
        }
        setTimeout(() => $('#focus-next')?.focus(), 50);
    }

    // ============================================================
    // DIAGNOSTIC MODE
    // ============================================================
    _showDiagConfig(deckId) {
        this._diagDir = 'front-to-back';
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal" style="max-width:420px">
                <h2 style="text-align:center;margin-bottom:4px">Quick Check</h2>
                <p style="text-align:center;color:var(--text-muted);font-size:0.85rem;margin-bottom:20px">Quickly assess what you know. Correct answers promote New cards to Proficient. Nothing is ever demoted.</p>
                <div class="section-title justify-center mb-8" style="display:flex">Direction</div>
                <div class="direction-picker-inline mb-24" style="justify-content:center;display:flex">
                    <button class="dir-opt active" data-dir="front-to-back" onclick="app._diagSetDir(this)">Front \u2192 Back</button>
                    <button class="dir-opt" data-dir="back-to-front" onclick="app._diagSetDir(this)">Back \u2192 Front</button>
                    <button class="dir-opt" data-dir="random" onclick="app._diagSetDir(this)">Random</button>
                </div>
                <div class="text-center">
                    <button class="btn btn-primary btn-lg" onclick="app._closeModal();app._startDiagnostic('${deckId}')">Start</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) this._closeModal(); });
        this._modal = overlay;
    }

    _diagSetDir(el) {
        this._diagDir = el.dataset.dir;
        $$('.dir-opt').forEach(b => b.classList.remove('active'));
        el.classList.add('active');
    }

    _startDiagnostic(deckId) {
        const deck = this._getDeck(deckId);
        if (!deck || deck.cards.length < 4) return;
        const diagSession = {
            cards: shuffle([...deck.cards]),
            index: 0,
            direction: this._diagDir || 'front-to-back',
            promoted: 0,
            total: deck.cards.length,
        };
        this.view = 'diagnostic';
        this.params = { deckId };
        this.matchState = null;
        this._modal = null;
        this.session = diagSession;
        try { localStorage.setItem('studyapp_nav', JSON.stringify({ view: 'diagnostic', params: { deckId } })); } catch (e) {}
        this.render();
        window.scrollTo(0, 0);
    }

    _renderDiagnostic() {
        const deck = this._getDeck();
        if (!deck) return this.navigate('dashboard');
        const s = this.session;
        if (!s) return this.navigate('deck', { deckId: deck.id });

        if (s.index >= s.cards.length) return this._renderDiagSummary(deck);

        const card = s.cards[s.index];
        const { prompt, answer, promptLabel } = getPromptAndAnswer(card, s.direction);

        const progress = (s.index / s.cards.length * 100).toFixed(0);

        this.root.innerHTML = `${this._headerHTML()}<div class="container view-enter">
            <div class="study-header">
                <button class="back-btn" onclick="app.navigate('deck',{deckId:'${deck.id}'})">\u2190 Exit</button>
                <div class="study-progress">
                    <div class="progress-bar"><div class="progress-bar-fill" style="width:${progress}%"></div></div>
                    <div class="progress-text">${s.index + 1} / ${s.cards.length}</div>
                </div>
                <div style="min-width:40px"></div>
            </div>
            <div class="flip-toolbar">${this._dirPickerHTML(s.direction)}</div>
            <div class="quiz-prompt"><div class="quiz-prompt-label">${esc(promptLabel)}</div><div class="quiz-prompt-text">${esc(prompt)}</div></div>
            <div class="quiz-input-row">
                <input class="quiz-input" id="diag-answer" placeholder="Type your answer..." autofocus autocomplete="off">
                <button class="btn btn-primary" onclick="app._submitDiag()">Next \u2192</button>
            </div>
            ${this._specialCharsHTML('diag-answer')}
            <div class="flex justify-center mt-16">
                <button class="btn btn-ghost" id="diag-skip-btn" onclick="app._diagSkip()">I don't know</button>
            </div>
        </div>`;

        const inp = $('#diag-answer');
        if (inp) {
            inp.focus();
            inp.addEventListener('keydown', e => {
                if (e.key === 'Enter') this._submitDiag();
                if (e.key === 'Tab') { e.preventDefault(); $('#diag-skip-btn')?.focus(); }
            });
        }
    }

    _diagSkip() {
        const s = this.session;
        if (!s) return;
        s.index++;
        this._fadeAndRender(() => this.render());
    }

    _submitDiag() {
        const s = this.session;
        if (!s) return;
        const input = ($('#diag-answer')?.value || '').trim();

        const card = s.cards[s.index];
        const { answer } = getPromptAndAnswer(card, s.direction);
        const correct = fuzzyMatch(input, answer).match;

        // Only promote — never demote
        if (correct && (card.stats.learnStatus || 'new') === 'new') {
            card.stats.learnStatus = 'proficient';
            s.promoted++;
        }
        this.save();

        s.index++;
        this._fadeAndRender(() => this.render());
    }

    _renderDiagSummary(deck) {
        const s = this.session;
        const counts = { new: 0, learning: 0, proficient: 0, mastered: 0 };
        deck.cards.forEach(c => counts[c.stats.learnStatus || 'new']++);

        this.root.innerHTML = `${this._headerHTML()}<div class="container view-enter">
            <div class="results-container" style="max-width:500px">
                <div class="results-icon">\uD83E\uDE7A</div>
                <div class="results-title">Quick Check Complete</div>
                <div class="results-subtitle">${s.promoted} card${s.promoted !== 1 ? 's' : ''} promoted to Proficient</div>
                <div class="results-stats mb-24">
                    <div class="results-stat"><div class="results-stat-value text-success">${counts.proficient}</div><div class="results-stat-label">Proficient</div></div>
                    <div class="results-stat"><div class="results-stat-value text-warning">${counts.learning}</div><div class="results-stat-label">Learning</div></div>
                    <div class="results-stat"><div class="results-stat-value" style="color:var(--text-muted)">${counts.new}</div><div class="results-stat-label">New</div></div>
                    <div class="results-stat"><div class="results-stat-value" class="mastered-value">${counts.mastered}</div><div class="results-stat-label">Mastered</div></div>
                </div>
                <div class="results-actions">
                    <button class="btn btn-secondary" onclick="app.navigate('deck',{deckId:'${deck.id}'})">Back to Deck</button>
                    <button class="btn btn-primary" onclick="app._startMode('learn')">Study Now</button>
                </div>
            </div>
        </div>`;
    }

    // ============================================================
    // MATCH MODE
    // ============================================================
    _renderMatch() {
        const deck = this._getDeck();
        if (!deck || deck.cards.length < 4) return this.navigate('dashboard');

        if (!this.matchState) {
            const count = Math.min(10, deck.cards.length);
            const selected = shuffle(deck.cards).slice(0, count);
            const tiles = shuffle([
                ...selected.map(c => ({ cardId: c.id, type: 'front', text: c.front })),
                ...selected.map(c => ({ cardId: c.id, type: 'back', text: c.back })),
            ]);
            this.matchState = {
                tiles,
                revealed: [], // indices
                matched: new Set(),
                moves: 0,
                startTime: Date.now(),
                totalPairs: count,
                matchedPairs: 0,
                processing: false,
            };
        }

        const m = this.matchState;
        const cols = m.tiles.length <= 8 ? 4 : 5;
        const elapsed = formatTime(Date.now() - m.startTime);

        if (m.matchedPairs >= m.totalPairs) {
            return this._matchComplete(deck);
        }

        this.root.innerHTML = `
        ${this._headerHTML()}
        <div class="container view-enter">
            <div class="back-row">
                <button class="back-btn" onclick="app.navigate('deck',{deckId:'${deck.id}'})">\u2190 Exit</button>
            </div>

            <div class="match-header">
                <div class="match-stat">
                    <div class="match-stat-value">${m.moves}</div>
                    <div class="match-stat-label">Moves</div>
                </div>
                <div class="match-stat">
                    <div class="match-stat-value">${m.matchedPairs}/${m.totalPairs}</div>
                    <div class="match-stat-label">Matched</div>
                </div>
                <div class="match-stat">
                    <div class="match-stat-value" id="match-timer">${elapsed}</div>
                    <div class="match-stat-label">Time</div>
                </div>
            </div>

            <div class="match-grid cols-${cols}">
                ${m.tiles.map((tile, i) => {
                    const isRevealed = m.revealed.includes(i);
                    const isMatched = m.matched.has(tile.cardId + '-' + tile.type);
                    return `
                    <div class="match-tile ${isRevealed ? 'revealed' : ''} ${isMatched ? 'matched' : ''}"
                         onclick="app._matchTap(${i})" data-index="${i}">
                        <div class="match-tile-inner">
                            <div class="match-tile-face match-tile-hidden">?</div>
                            <div class="match-tile-face match-tile-content ${tile.type}-type">${esc(tile.text)}</div>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>`;

        // Start timer update
        this._matchTimer = setInterval(() => {
            const el = $('#match-timer');
            if (el) el.textContent = formatTime(Date.now() - m.startTime);
            else clearInterval(this._matchTimer);
        }, 1000);
    }

    _matchTap(index) {
        const m = this.matchState;
        if (!m || m.processing) return;
        if (m.revealed.includes(index)) return;
        if (m.matched.has(m.tiles[index].cardId + '-' + m.tiles[index].type)) return;

        m.revealed.push(index);
        const tileEl = $(`.match-tile[data-index="${index}"]`);
        if (tileEl) tileEl.classList.add('revealed');

        if (m.revealed.length === 2) {
            m.moves++;
            m.processing = true;
            const [i1, i2] = m.revealed;
            const t1 = m.tiles[i1], t2 = m.tiles[i2];

            if (t1.cardId === t2.cardId && t1.type !== t2.type) {
                // Match!
                m.matched.add(t1.cardId + '-' + t1.type);
                m.matched.add(t2.cardId + '-' + t2.type);
                m.matchedPairs++;
                m.revealed = [];
                m.processing = false;

                const el1 = $(`.match-tile[data-index="${i1}"]`);
                const el2 = $(`.match-tile[data-index="${i2}"]`);
                if (el1) el1.classList.add('matched');
                if (el2) el2.classList.add('matched');

                showMiniConfetti(el1);
                this.addXP(5);

                // Update card stats
                const deck = this._getDeck();
                const card = deck?.cards.find(c => c.id === t1.cardId);
                if (card) {
                    card.stats.correct++;
                    card.stats.streak++;
                    card.stats.lastSeen = Date.now();
                    this.save();
                }

                if (m.matchedPairs >= m.totalPairs) {
                    clearInterval(this._matchTimer);
                    setTimeout(() => this._renderMatch(), 600);
                }
            } else {
                // No match
                const el1 = $(`.match-tile[data-index="${i1}"]`);
                const el2 = $(`.match-tile[data-index="${i2}"]`);
                if (el1) el1.classList.add('wrong');
                if (el2) el2.classList.add('wrong');

                setTimeout(() => {
                    if (el1) { el1.classList.remove('revealed', 'wrong'); }
                    if (el2) { el2.classList.remove('revealed', 'wrong'); }
                    m.revealed = [];
                    m.processing = false;
                }, 900);
            }
        }
    }

    _matchComplete(deck) {
        clearInterval(this._matchTimer);
        const m = this.matchState;
        const time = formatTime(Date.now() - m.startTime);
        const perfect = m.moves === m.totalPairs;
        const stars = m.moves <= m.totalPairs + 2 ? 3 : m.moves <= m.totalPairs * 2 ? 2 : 1;

        this.addXP(50 + (perfect ? 50 : 0));
        if (perfect) showConfetti();

        this.root.innerHTML = `
        ${this._headerHTML()}
        <div class="container view-enter">
            <div class="results-container">
                <div class="results-icon">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
                <div class="results-title">${perfect ? 'Perfect Match!' : 'All Matched!'}</div>
                <div class="results-subtitle">You matched all ${m.totalPairs} pairs</div>

                <div class="results-stats">
                    <div class="results-stat">
                        <div class="results-stat-value text-accent">${m.moves}</div>
                        <div class="results-stat-label">Moves</div>
                    </div>
                    <div class="results-stat">
                        <div class="results-stat-value text-warning">${time}</div>
                        <div class="results-stat-label">Time</div>
                    </div>
                </div>

                <div class="results-xp">\u26A1 +${50 + (perfect ? 50 : 0)} XP</div>

                <div class="results-actions">
                    <button class="btn btn-secondary" onclick="app.navigate('deck',{deckId:'${deck.id}'})">Back to Deck</button>
                    <button class="btn btn-primary" onclick="app.navigate('match',{deckId:'${deck.id}'})">Play Again</button>
                </div>
            </div>
        </div>`;
    }

    // ============================================================
    // RESULTS
    // ============================================================
    _showResults(deck) {
        const s = this.session;
        if (!s) return this.navigate('dashboard');

        const correct = s.results.filter(r => r.correct).length;
        const total = s.results.length;
        const pct = total > 0 ? Math.round(correct / total * 100) : 0;
        const time = formatTime(Date.now() - s.startTime);
        const perfect = total > 0 && correct === total;

        if (perfect && total >= 5) showConfetti();

        const encouragement = pct >= 90 ? 'Outstanding!' :
            pct >= 70 ? 'Great work!' :
            pct >= 50 ? 'Good progress!' :
            'Keep practicing!';

        const emoji = pct >= 90 ? '\uD83C\uDF1F' :
            pct >= 70 ? '\uD83C\uDF89' :
            pct >= 50 ? '\uD83D\uDCAA' :
            '\uD83C\uDF31';

        deck.lastStudied = Date.now();
        this.save();

        this.root.innerHTML = `
        ${this._headerHTML()}
        <div class="container view-enter">
            <div class="results-container">
                <div class="results-icon">${emoji}</div>
                <div class="results-title">${encouragement}</div>
                <div class="results-subtitle">Session complete for ${esc(deck.name)}</div>

                <div class="results-stats">
                    <div class="results-stat">
                        <div class="results-stat-value text-success">${correct}</div>
                        <div class="results-stat-label">Correct</div>
                    </div>
                    <div class="results-stat">
                        <div class="results-stat-value text-error">${total - correct}</div>
                        <div class="results-stat-label">Incorrect</div>
                    </div>
                    <div class="results-stat">
                        <div class="results-stat-value text-accent">${pct}%</div>
                        <div class="results-stat-label">Accuracy</div>
                    </div>
                    <div class="results-stat">
                        <div class="results-stat-value text-warning">${time}</div>
                        <div class="results-stat-label">Time</div>
                    </div>
                </div>

                <div class="results-xp">\u26A1 Session complete!</div>

                <div class="results-actions">
                    <button class="btn btn-secondary" onclick="app.navigate('dashboard')">Dashboard</button>
                    <button class="btn btn-secondary" onclick="app.navigate('deck',{deckId:'${deck.id}'})">Back to Deck</button>
                    <button class="btn btn-primary" onclick="app.navigate('${this.view}',{deckId:'${deck.id}'})">Study Again</button>
                </div>
            </div>
        </div>`;
    }

    // ============================================================
    // MODALS
    // ============================================================
    _showModal(title, bodyHTML, onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal">
                <h2>${esc(title)}</h2>
                <div class="modal-body">${bodyHTML}</div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="app._closeModal()">Cancel</button>
                    <button class="btn btn-primary" id="modal-confirm">Confirm</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) this._closeModal(); });
        this._modal = overlay;
        const confirmBtn = overlay.querySelector('#modal-confirm');
        if (confirmBtn) confirmBtn.addEventListener('click', onConfirm);
        // Enter key to confirm
        overlay.addEventListener('keydown', (e) => { if (e.key === 'Enter') onConfirm(); });
    }

    _closeModal() {
        if (this._modal) {
            this._modal.remove();
            this._modal = null;
        }
    }

    // ============================================================
    // KEYBOARD SHORTCUTS
    // ============================================================
    _onKey(e) {
        if (this._modal) return;

        if (this.view === 'flip' && this.session) {
            if (e.key === ' ') { e.preventDefault(); this._flipCard(); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); this._flipPrev(); }
            if (e.key === 'ArrowRight') { e.preventDefault(); this._flipNext(); }
            if (this.session.flipped) {
                if (e.key === 'k' || e.key === 'K') this._flipMarkKnow();
                if (e.key === 'l' || e.key === 'L') this._flipMarkLearning();
            }
        }

        if (this.view === 'learn' && this.session) {
            if (this.session.phase === 'block1' && e.key === ' ') {
                e.preventDefault();
                this._learnB1Flip();
            }
            if (this.session.phase === 'block2' && !this.session.answered) {
                if (e.key === '1') this._learnMCAnswer(0);
                if (e.key === '2') this._learnMCAnswer(1);
                if (e.key === '3') this._learnMCAnswer(2);
                if (e.key === '4') this._learnMCAnswer(3);
            }
        }


        if (e.key === 'Escape') {
            const deck = this._getDeck();
            if (deck && ['flip', 'learn', 'quiz', 'focus', 'match', 'diagnostic'].includes(this.view)) {
                this.navigate('deck', { deckId: deck.id });
            }
        }
    }

}

// ============================================================
// INIT
// ============================================================
let app;
app = new StudyApp();
