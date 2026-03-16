(async () => {
    // ══════════════════════════════════════════════════════
    //  LOAD CONFIG FROM API
    // ══════════════════════════════════════════════════════
    const CFG = await fetch('/api/config').then((res) => res.json());

    console.log("CFG: ", CFG)
    // ── Apply all config to DOM ──
    function applyConfig() {
        // Hero
        document.getElementById('hero-name').textContent = CFG.name + '!';
        document.getElementById('hero-subtitle').textContent = CFG.heroSubtitle;
        document.title = `Hey ${CFG.name} 🎂`;
        document.getElementById('letter-text').textContent = CFG.letterText;

        // Scene 1 label
        document.getElementById('scene1-label').textContent = CFG.scene1Label;

        // WhatsApp contact
        document.getElementById('wa-avatar').textContent = CFG.contactEmoji;
        document.getElementById('wa-name').textContent = CFG.whatsappName;
        document.getElementById('contact-msg-text').textContent = CFG.contactMessage;

        // Scene 4 (SO)
        document.getElementById('so-word').textContent = CFG.scene4Word;
        document.getElementById('scene4-sub').textContent = CFG.scene4Sub;

        // Portrait
        // portrait uses real image — no emoji needed
        document.getElementById('portrait-name').textContent = CFG.name + '!';
        document.getElementById('portrait-sub').textContent = CFG.portraitSub;

        // Birthday message
        document.getElementById('birthday-msg').textContent = CFG.birthdayMessage;

        // Balloons caption
        document.getElementById('balloons-caption').textContent = CFG.balloonsCaption;

        // Final
        document.getElementById('final-msg').textContent = CFG.finalMessage;
        document.getElementById('final-footer').textContent = '— ' + CFG.finalFooter + ', ' + CFG.name + ' —';
        document.getElementById('replay-btn').textContent = CFG.replayLabel;

        // Build scene 2 HTML (letter reveal)
        buildReveal('reveal-2', CFG.scene2Lines);

        // Build scene 3 HTML (letter reveal)
        buildReveal('reveal-3', CFG.scene3Lines);
    }

    function buildReveal(id, lines) {
        const el = document.getElementById(id);
        el.innerHTML = '';
        lines.forEach((line, li) => {
            if (line === '') { el.appendChild(document.createElement('br')); el.appendChild(document.createElement('br')); return; }

            // Parse tags: <em>, <strong>, <big>, <soft>
            const frag = document.createDocumentFragment();
            // Replace special tags with spans
            const processed = line
                .replace(/<em>(.*?)<\/em>/g, (_, t) => `__EM__${t}__/EM__`)
                .replace(/<strong>(.*?)<\/strong>/g, (_, t) => `__STRONG__${t}__/STRONG__`)
                .replace(/<big>(.*?)<\/big>/g, (_, t) => `__BIG__${t}__/BIG__`)
                .replace(/<soft>(.*?)<\/soft>/g, (_, t) => `__SOFT__${t}__/SOFT__`);

            // Split into parts
            const parts = processed.split(/(__(?:EM|STRONG|BIG|SOFT)__.*?__\/(?:EM|STRONG|BIG|SOFT)__)/);
            parts.forEach(part => {
                const emMatch = part.match(/^__EM__(.*?)__\/EM__$/);
                const strongMatch = part.match(/^__STRONG__(.*?)__\/STRONG__$/);
                const bigMatch = part.match(/^__BIG__(.*?)__\/BIG__$/);
                const softMatch = part.match(/^__SOFT__(.*?)__\/SOFT__$/);

                let wrapTag = null, wrapClass = null, text = part;
                if (emMatch) { text = emMatch[1]; wrapTag = 'em'; }
                if (strongMatch) { text = strongMatch[1]; wrapTag = 'strong'; }
                if (bigMatch) { text = bigMatch[1]; wrapTag = null; wrapClass = 'big-word'; }
                if (softMatch) { text = softMatch[1]; wrapTag = null; wrapClass = 'soft-italic'; }

                // Each word/char becomes a span for reveal
                const words = text.split(/(\s+)/);
                words.forEach(word => {
                    if (!word) return;
                    const span = document.createElement('span');
                    span.textContent = word;
                    if (wrapTag) {
                        const wrapper = document.createElement(wrapTag);
                        wrapper.appendChild(span);
                        frag.appendChild(wrapper);
                    } else if (wrapClass) {
                        const wrapper = document.createElement('span');
                        wrapper.className = wrapClass;
                        wrapper.appendChild(span);
                        frag.appendChild(wrapper);
                    } else {
                        frag.appendChild(span);
                    }
                });
            });
            el.appendChild(frag);
        });
    }

    // ══════════════════════════════════
    //  STARS
    // ══════════════════════════════════
    const starsEl = document.getElementById('stars');
    for (let i = 0; i < 160; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        const size = Math.random() * 2.5 + .5;
        s.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}vw;top:${Math.random() * 100}vh;animation-duration:${Math.random() * 4 + 2}s;animation-delay:${Math.random() * 5}s`;
        starsEl.appendChild(s);
    }

    // ══════════════════════════════════
    //  FX CANVAS
    // ══════════════════════════════════
    const cvs = document.getElementById('fx-canvas');
    const ctx = cvs.getContext('2d');
    let particles = [];
    function resizeCvs() { cvs.width = innerWidth; cvs.height = innerHeight; }
    resizeCvs(); addEventListener('resize', resizeCvs);
    const FX_COLORS = ['#e8c97e', '#e8829a', '#c8b8d8', '#f8d8a8', '#a890d8', '#f0b0c8', '#d8f0a0', '#b0e8f0'];

    function spawnFx(n, type) {
        for (let i = 0; i < n; i++) {
            particles.push({
                x: Math.random() * cvs.width,
                y: type === 'burst' ? cvs.height * .5 : Math.random() * cvs.height * .3 - 20,
                vx: type === 'burst' ? (Math.random() - .5) * 6 : (Math.random() - .5) * 2.5,
                vy: type === 'burst' ? (Math.random() - .5) * 6 : Math.random() * 2.5 + .8,
                size: Math.random() * 7 + 3,
                color: FX_COLORS[Math.floor(Math.random() * FX_COLORS.length)],
                rot: Math.random() * Math.PI * 2, rotV: (Math.random() - .5) * .1,
                life: 1, decay: Math.random() * .007 + .003,
                shape: Math.random() > .5 ? 'rect' : 'ellipse',
            });
        }
    }

    function drawFx() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => {
            ctx.save(); ctx.globalAlpha = p.life * .9; ctx.translate(p.x, p.y); ctx.rotate(p.rot);
            ctx.fillStyle = p.color; ctx.beginPath();
            if (p.shape === 'rect') ctx.fillRect(-p.size / 2, -p.size * .25, p.size, p.size * .5);
            else { ctx.ellipse(0, 0, p.size, p.size * .45, 0, 0, Math.PI * 2); ctx.fill(); }
            ctx.fill(); ctx.restore();
            p.x += p.vx + Math.sin(p.rot) * .4; p.y += p.vy; p.rot += p.rotV; p.life -= p.decay;
        });
        requestAnimationFrame(drawFx);
    }
    drawFx();

    // ══════════════════════════════════
    //  PROGRESS DOTS
    // ══════════════════════════════════
    const SCENE_IDS = ['scene-0', 'scene-1', 'scene-2', 'scene-3', 'scene-so', 'scene-portrait', 'scene-birthday', 'scene-balloons', 'scene-final'];
    const dotsEl = document.getElementById('progress-dots');
    SCENE_IDS.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = 'pdot' + (i === 0 ? ' current' : '');
        d.onclick = () => goToScene(i);
        dotsEl.appendChild(d);
    });
    function updateDots(idx) {
        document.querySelectorAll('.pdot').forEach((d, i) => {
            d.className = 'pdot' + (i < idx ? ' done' : '') + (i === idx ? ' current' : '');
        });
    }

    // ══════════════════════════════════
    //  SCENE ENGINE
    // ══════════════════════════════════
    let currentScene = 0;
    let initialized = new Set([0]);

    function goToScene(idx) {
        const scenes = document.querySelectorAll('.scene');
        scenes.forEach(s => { s.classList.remove('active'); s.style.display = 'none'; });
        const target = scenes[idx];
        target.style.display = 'flex';
        requestAnimationFrame(() => { target.classList.add('active'); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
        currentScene = idx; updateDots(idx);
        if (!initialized.has(idx)) { initialized.add(idx); initScene(idx); }
    }

    function nextScene() { if (currentScene < SCENE_IDS.length - 1) goToScene(currentScene + 1); }

    function initScene(idx) {
        switch (idx) {
            case 1: startTyping(); break;
            case 2: revealLetters('reveal-2', () => setTimeout(nextScene, 3500)); break;
            case 3: revealLetters('reveal-3', () => setTimeout(nextScene, 4000)); break;
            case 4: setTimeout(nextScene, 5000); break;
            case 5: initPortrait(); break;
            case 6: spawnFx(120, 'fall'); setTimeout(nextScene, 5500); break;
            case 7: buildBalloons(); break;
            case 8: spawnFx(80, 'fall'); break;
        }
    }

    // Initialize immediately (DOM is ready since script is at end of HTML)
    document.querySelectorAll('.scene').forEach((s, i) => { if (i !== 0) s.style.display = 'none'; });
    applyConfig();

    // Attach event listeners
    const envelope = document.getElementById('envelope');
    if (envelope) {
        envelope.addEventListener('click', openEnvelope);
    }

    const replayBtn = document.getElementById('replay-btn');
    if (replayBtn) {
        replayBtn.addEventListener('click', replayAll);
    }

    // ══════════════════════════════════
    //  SCENE 0: ENVELOPE
    // ══════════════════════════════════
    function openEnvelope() {
        const env = document.getElementById('envelope');
        if (env.classList.contains('open')) return;
        env.classList.add('open'); spawnFx(50, 'fall');
        setTimeout(nextScene, 1700);
    }

    // ══════════════════════════════════
    //  SCENE 1: WHATSAPP + FINGER TAP
    // ══════════════════════════════════
    function updateClock() {
        const el = document.getElementById('sb-time');
        if (!el) return;
        const now = new Date();
        el.textContent = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
    }
    setInterval(updateClock, 10000);
    updateClock();

    function startTyping() {
        const inputEl = document.getElementById('wa-input');
        const sendBtn = document.getElementById('wa-send-btn');
        const micBtn = document.getElementById('wa-mic');
        const typingBub = document.getElementById('wa-typing');
        const bubbleOut = document.getElementById('bubble-out');
        const bubbleTxt = document.getElementById('bubble-text');
        const bubbleTicks = document.getElementById('bubble-ticks');
        const bubbleIn = document.getElementById('bubble-in');
        const statusEl = document.getElementById('wa-status');
        const finger = document.getElementById('finger-cursor');

        // Reset
        inputEl.value = ''; sendBtn.style.animation = '';
        sendBtn.classList.remove('tapped'); sendBtn.style.background = '';
        typingBub.classList.remove('show');
        bubbleOut.style.opacity = '0'; bubbleTxt.textContent = '';
        bubbleTxt.className = ''; bubbleTicks.className = 'bubble-ticks'; bubbleTicks.textContent = '✓';
        bubbleIn.style.opacity = '0'; micBtn.style.display = ''; finger.style.cssText = '';

        const MSG = CFG.whatsappMessage;

        // t=400  → received bubble appears
        setTimeout(() => { bubbleIn.style.opacity = '1'; }, 400);

        // t=900  → status → "typing…"
        setTimeout(() => { statusEl.textContent = 'typing…'; }, 900);

        // t=1100 → 3-dot bubble
        setTimeout(() => { typingBub.classList.add('show'); }, 1100);

        // t=2000 → type into input bar
        let i = 0;
        setTimeout(() => {
            typingBub.classList.remove('show'); micBtn.style.display = 'none';
            const iv = setInterval(() => {
                if (i >= MSG.length) {
                    clearInterval(iv); statusEl.textContent = 'online';
                    // Reveal send button
                    sendBtn.classList.add('show');
                    // Animate finger after send button appears
                    setTimeout(() => animateFinger(sendBtn, finger), 600);
                    return;
                }
                inputEl.value += MSG[i]; inputEl.scrollLeft = inputEl.scrollWidth; i++;
            }, 44);
        }, 2000);
    }

    function animateFinger(sendBtn, finger) {
        // Position finger over the send button
        const btnRect = sendBtn.getBoundingClientRect();
        const barRect = sendBtn.closest('.wa-input-bar').getBoundingClientRect();

        // Place relative to the input bar (parent is relative)
        const relLeft = btnRect.left - barRect.left + btnRect.width / 2 - 14;
        const relTop = btnRect.top - barRect.top + btnRect.height / 2 - 28;

        finger.style.left = relLeft + 'px';
        finger.style.top = relTop + 'px';
        finger.style.opacity = '0';
        finger.style.display = 'block';

        // Fly in
        finger.style.animation = 'fingerMoveIn 0.55s cubic-bezier(.34,1.2,.64,1) forwards';

        setTimeout(() => {
            // Tap animation
            finger.style.animation = 'fingerTap 0.3s ease forwards';
            sendBtn.style.background = '#008f70';
            sendBtn.style.transform = 'scale(0.85)';
            // Trigger send logic
            setTimeout(() => {
                sendBtn.style.background = '';
                sendBtn.style.transform = '';
                // Finger leaves
                finger.style.animation = 'fingerLeave 0.4s ease forwards';
                setTimeout(() => { finger.style.display = 'none'; }, 420);
                // Do the actual send
                doSend();
            }, 250);
        }, 600);
    }

    function doSend() {
        const inputEl = document.getElementById('wa-input');
        const sendBtn = document.getElementById('wa-send-btn');
        const bubbleOut = document.getElementById('bubble-out');
        const bubbleTxt = document.getElementById('bubble-text');
        const bubbleTicks = document.getElementById('bubble-ticks');
        const waBody = document.getElementById('wa-body');

        const msg = inputEl.value;
        inputEl.value = ''; sendBtn.classList.remove('show');

        bubbleTxt.textContent = msg; bubbleOut.style.opacity = '1'; bubbleTicks.textContent = '✓';
        waBody.scrollTop = waBody.scrollHeight;

        setTimeout(() => { bubbleTicks.textContent = '✓✓'; }, 400);
        setTimeout(() => { bubbleTicks.classList.add('read'); }, 900);

        // Strike through
        setTimeout(() => {
            bubbleTxt.className = 'strike-wrap';
            requestAnimationFrame(() => bubbleTxt.classList.add('strike'));
        }, 1400);

        setTimeout(nextScene, 2900);
    }

    // Legacy click handler (kept for manual override)
    let sendClicked = false;
    function hitSend() { if (!sendClicked) { sendClicked = true; doSend(); } }

    // ══════════════════════════════════
    //  LETTER REVEAL
    // ══════════════════════════════════
    function revealLetters(id, cb) {
        const el = document.getElementById(id);
        if (!el) return;
        const spans = el.querySelectorAll('span');
        spans.forEach((s, i) => setTimeout(() => s.classList.add('shown'), i * 140));
        if (cb) setTimeout(cb, spans.length * 140 + 800);
    }

    // ══════════════════════════════════
    //  SCENE 5: PORTRAIT
    // ══════════════════════════════════
    function initPortrait() {
        const frame = document.getElementById('portrait-frame');
        // Remove old sparkles
        frame.querySelectorAll('.sparkle-orbit').forEach(e => e.remove());
        const sparks = ['✨', '⭐', '💛', '🌸', '💫', '🌟', '💕'];
        sparks.forEach((ch, i) => {
            const el = document.createElement('div');
            el.className = 'sparkle-orbit';
            el.style.cssText = `position:absolute;font-size:1.1rem;top:50%;left:50%;transform-origin:0 0;animation:sparkOrbit ${6 + i * 1.2}s linear ${-i * 1.5}s infinite`;
            el.textContent = ch; frame.appendChild(el);
        });
        setTimeout(nextScene, 6000);
    }

    const sparkStyle = document.createElement('style');
    sparkStyle.textContent = `
@keyframes sparkOrbit{from{transform:rotate(0deg) translateX(160px) rotate(0deg);opacity:.9}to{transform:rotate(360deg) translateX(160px) rotate(-360deg);opacity:.6}}
@media(max-width:540px){@keyframes sparkOrbit{from{transform:rotate(0deg) translateX(130px) rotate(0deg);opacity:.9}to{transform:rotate(360deg) translateX(130px) rotate(-360deg);opacity:.6}}}`;
    document.head.appendChild(sparkStyle);

    // ══════════════════════════════════
    //  SCENE 7: BALLOONS
    // ══════════════════════════════════
    const BALLOON_COLORS = [
        ['#e8829a', '#c0506a'], ['#e8c97e', '#c0a050'], ['#a890d8', '#8060b0'],
        ['#90d8c8', '#60b0a0'], ['#f8a0c0', '#d07090'], ['#90b8f8', '#6090d0'],
        ['#c8e870', '#a0c050'], ['#f8b870', '#d09050'], ['#d890e8', '#b060c0'],
    ];
    function buildBalloons() {
        const container = document.getElementById('balloon-container');
        container.innerHTML = '';
        const count = Math.max(8, Math.min(18, Math.floor(innerWidth / 65)));
        for (let i = 0; i < count; i++) {
            const [fill, dark] = BALLOON_COLORS[i % BALLOON_COLORS.length];
            const size = 48 + Math.random() * 42, delay = Math.random() * 3.5, dur = 7 + Math.random() * 7, strH = 55 + Math.random() * 70;
            const b = document.createElement('div'); b.className = 'balloon';
            b.style.animationDuration = dur + 's'; b.style.animationDelay = delay + 's';
            const body = document.createElement('div'); body.className = 'balloon-body';
            body.style.cssText = `width:${size}px;height:${size * 1.2}px;background:radial-gradient(circle at 35% 28%,${fill},${dark})`;
            const str = document.createElement('div'); str.className = 'balloon-string';
            str.style.cssText = `height:${strH}px;background:linear-gradient(${fill}80,transparent)`;
            b.appendChild(body); b.appendChild(str); container.appendChild(b);
        }
        spawnFx(100, 'burst'); setTimeout(nextScene, 9000);
    }

    // ══════════════════════════════════
    //  REPLAY
    // ══════════════════════════════════
    function replayAll() {
        sendClicked = false; initialized = new Set([0]);
        document.querySelectorAll('.scene').forEach((s, i) => { s.classList.remove('active'); s.style.display = i === 0 ? 'flex' : 'none'; });
        document.querySelectorAll('.letter-reveal span').forEach(s => s.classList.remove('shown'));
        document.getElementById('envelope').classList.remove('open');
        const f = (id, fn) => { const e = document.getElementById(id); if (e) fn(e); };
        f('wa-input', e => e.value = '');
        f('wa-send-btn', e => { e.classList.remove('show', 'tapped'); e.style.background = ''; e.style.transform = ''; });
        f('bubble-out', e => e.style.opacity = '0');
        f('bubble-text', e => { e.textContent = ''; e.className = ''; });
        f('bubble-in', e => e.style.opacity = '0');
        f('wa-typing', e => e.classList.remove('show'));
        f('wa-mic', e => e.style.display = '');
        f('wa-status', e => e.textContent = 'online');
        f('finger-cursor', e => { e.style.display = ''; e.style.animation = ''; e.style.opacity = '0'; });
        currentScene = 0; updateDots(0);
        document.getElementById('scene-0').classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
})();