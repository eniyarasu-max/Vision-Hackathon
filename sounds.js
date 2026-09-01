/**
 * Vision Hackathon — Permanent Background Audio Engine & SFX
 * Plays assets/marvel_theme.mp3 continuously in the background on loop.
 * Non-stoppable & always active across all pages.
 */

const SFX = (() => {
    let ctx = null;
    let masterGain = null;
    let sfxGain = null;

    let bgAudio = null;
    let hasStartedBGM = false;

    function getCtx() {
        if (!ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            ctx = new AudioCtx();
            masterGain = ctx.createGain();
            masterGain.gain.setValueAtTime(0.85, ctx.currentTime);
            masterGain.connect(ctx.destination);

            sfxGain = ctx.createGain();
            sfxGain.gain.setValueAtTime(0.70, ctx.currentTime);
            sfxGain.connect(masterGain);
        }
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        return ctx;
    }

    /** Helper Sound Primitives **/
    function osc(type, freq, gain, start, end) {
        const c = getCtx();
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = type;
        o.frequency.setValueAtTime(freq, start);
        g.gain.setValueAtTime(gain, start);
        g.gain.exponentialRampToValueAtTime(0.0001, end);
        o.connect(g);
        g.connect(sfxGain || masterGain || c.destination);
        o.start(start);
        o.stop(end);
    }

    function sweep(type, freqStart, freqEnd, gain, start, end) {
        const c = getCtx();
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = type;
        o.frequency.setValueAtTime(freqStart, start);
        o.frequency.linearRampToValueAtTime(freqEnd, end);
        g.gain.setValueAtTime(gain, start);
        g.gain.exponentialRampToValueAtTime(0.0001, end);
        o.connect(g);
        g.connect(sfxGain || masterGain || c.destination);
        o.start(start);
        o.stop(end);
    }

    function noise(gain, start, dur) {
        const c = getCtx();
        const bufSize = Math.floor(c.sampleRate * dur);
        const buf = c.createBuffer(1, bufSize, c.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
        const src = c.createBufferSource();
        src.buffer = buf;
        const g = c.createGain();
        g.gain.setValueAtTime(gain, start);
        g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        
        const filter = c.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 3000;
        
        src.connect(filter);
        filter.connect(g);
        g.connect(sfxGain || masterGain || c.destination);
        src.start(start);
        src.stop(start + dur);
    }

    /* =========================================================
       PERMANENT BACKGROUND AUDIO LOOPER
       ========================================================= */
    function initBackgroundMusic() {
        if (!bgAudio) {
            bgAudio = new Audio();
            // Candidate sources matching uploaded file
            bgAudio.src = 'assets/marvel_theme.mp3';
            bgAudio.loop = true;
            bgAudio.volume = 0.55; // Balanced cinematic immersion
            bgAudio.preload = 'auto';
        }

        const startPlayback = () => {
            if (hasStartedBGM) return;
            getCtx();
            bgAudio.play().then(() => {
                hasStartedBGM = true;
                console.log('✓ Marvel background soundtrack active and playing on loop.');
                const visualizer = document.getElementById('marvel-visualizer');
                if (visualizer) {
                    visualizer.querySelectorAll('span').forEach((b, idx) => {
                        b.className = 'w-[2px] bg-primary rounded-full animate-pulse';
                        b.style.height = `${[8, 14, 10, 12][idx]}px`;
                    });
                }
            }).catch(() => {
                // Will retry on next user interaction event
            });
        };

        // Attempt initial autoplay
        startPlayback();

        // Browser policy fallback: Unlock audio on any first interaction
        ['click', 'pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(evt => {
            document.addEventListener(evt, startPlayback, { passive: true });
        });
    }

    return {
        /**
         * Initialize & ensure background music is always playing
         */
        startPermanentBGM() {
            initBackgroundMusic();
        },

        boot() {
            try {
                const c = getCtx();
                const t = c.currentTime;
                sweep('sawtooth', 40, 90, 0.06, t, t + 0.4);
                osc('sine', 220, 0.10, t + 0.1, t + 0.45);
                osc('sine', 330, 0.10, t + 0.25, t + 0.55);
                osc('sine', 440, 0.12, t + 0.40, t + 0.75);
                osc('sine', 660, 0.08, t + 0.55, t + 1.0);
                osc('sine', 880, 0.07, t + 0.72, t + 1.2);
                noise(0.04, t, 0.08);
            } catch (_) {}
        },

        click() {
            try {
                const c = getCtx();
                const t = c.currentTime;
                osc('square', 800, 0.06, t, t + 0.05);
                noise(0.02, t, 0.03);
            } catch (_) {}
        },

        success() {
            try {
                const c = getCtx();
                const t = c.currentTime;
                const notes = [523, 659, 784, 1047];
                notes.forEach((freq, i) => {
                    osc('sine', freq, 0.13, t + i * 0.10, t + i * 0.10 + 0.25);
                });
                osc('triangle', 523, 0.06, t + 0.40, t + 0.90);
                osc('triangle', 659, 0.06, t + 0.40, t + 0.90);
                osc('triangle', 784, 0.06, t + 0.40, t + 0.90);
            } catch (_) {}
        },

        error() {
            try {
                const c = getCtx();
                const t = c.currentTime;
                sweep('sawtooth', 440, 120, 0.14, t, t + 0.35);
                sweep('sawtooth', 440, 120, 0.10, t + 0.05, t + 0.40);
                osc('square', 180, 0.10, t + 0.38, t + 0.55);
                osc('square', 160, 0.10, t + 0.54, t + 0.72);
                noise(0.04, t + 0.38, 0.10);
            } catch (_) {}
        },

        attachClickSounds(selector = 'button, a, [role="button"], input[type="submit"]') {
            const unlock = () => {
                getCtx();
                document.removeEventListener('pointerdown', unlock);
            };
            document.addEventListener('pointerdown', unlock);

            document.querySelectorAll(selector).forEach(el => {
                el.addEventListener('click', () => this.click(), { passive: true });
            });
        },

        /**
         * Inject Non-Stoppable Marvel Hologram HUD Indicator
         */
        injectMarvelHUD() {
            if (document.getElementById('marvel-audio-hud')) return;

            const hud = document.createElement('div');
            hud.id = 'marvel-audio-hud';
            hud.className = 'fixed bottom-5 right-5 z-[9999] flex items-center gap-3 bg-surface-container-lowest/90 backdrop-blur-md border border-primary/40 px-4 py-2.5 rounded-full shadow-[0_0_25px_rgba(240,193,44,0.25)] select-none pointer-events-none';
            hud.innerHTML = `
                <!-- Arc Reactor Glowing Badge -->
                <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/60 text-primary">
                    <span class="material-symbols-outlined text-[18px] animate-pulse">graphic_eq</span>
                    <span class="absolute inset-0 rounded-full border border-dashed border-primary/50 animate-[spin_6s_linear_infinite]"></span>
                </div>

                <!-- Track Info & Visualizer -->
                <div class="flex flex-col pr-1">
                    <div class="flex items-center gap-2">
                        <span class="text-[9px] font-orbitron text-primary tracking-wider uppercase flex items-center gap-1">
                            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span> MARVEL PROTOCOL ACTIVE
                        </span>
                        <!-- Animated Equalizer Bars -->
                        <div class="flex items-end gap-[2px] h-3" id="marvel-visualizer">
                            <span class="w-[2px] h-2 bg-primary rounded-full animate-pulse" style="animation-duration: 0.4s;"></span>
                            <span class="w-[2px] h-3.5 bg-primary rounded-full animate-pulse" style="animation-duration: 0.6s;"></span>
                            <span class="w-[2px] h-2.5 bg-primary rounded-full animate-pulse" style="animation-duration: 0.3s;"></span>
                            <span class="w-[2px] h-3 bg-primary rounded-full animate-pulse" style="animation-duration: 0.5s;"></span>
                        </div>
                    </div>
                    <span class="text-[10px] font-body-md text-on-surface-variant leading-tight">Marvel Avengers OST • Playing</span>
                </div>
            `;

            document.body.appendChild(hud);

            // Automatically start background music
            initBackgroundMusic();
        }
    };
})();

// Expose globally
window.SFX = SFX;
export default SFX;
