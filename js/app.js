// Main Application Controller & Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Engines
    if (window.confettiEngine) window.confettiEngine.init('confetti-canvas');
    if (window.fireworksEngine) window.fireworksEngine.init('fireworks-canvas');
    if (window.customizer) window.customizer.init();

    const surpriseOverlay = document.getElementById('surprise-overlay');
    const giftBoxBtn = document.getElementById('gift-box-btn');
    const btnMusicToggle = document.getElementById('btn-music-toggle');
    const btnConfettiBlast = document.getElementById('btn-confetti-blast');
    const btnFireworksToggle = document.getElementById('btn-fireworks-toggle');

    // Cake & Candle Elements
    const cakeElement = document.getElementById('birthday-cake');
    const btnBlowCandles = document.getElementById('btn-blow-candles');
    const btnCutCake = document.getElementById('btn-cut-cake');
    const btnRelightCandles = document.getElementById('btn-relight-candles');
    const candleFlames = document.querySelectorAll('.flame');
    const candleSmokes = document.querySelectorAll('.smoke');
    const cakeStatusMsg = document.getElementById('cake-status-msg');

    let candlesBlown = false;
    let cakeCut = false;
    let balloonSpawnInterval = null;

    // =========================================================================
    // SCENE 1: UNBOXING SURPRISE
    // =========================================================================
    function openSurprise() {
        if (surpriseOverlay.classList.contains('opened')) return;
        surpriseOverlay.classList.add('opened');

        // Play Sound FX & Polyphonic Music
        if (window.birthdayAudio) {
            window.birthdayAudio.playFanfare();
            setTimeout(() => {
                window.birthdayAudio.startBirthdayMusic();
                updateMusicButtonState(true);
            }, 800);
        }

        // Grand Visual Celebration
        if (window.confettiEngine) {
            window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 180);
            window.confettiEngine.startCelebrationFountain(6000);
        }

        if (window.fireworksEngine) {
            window.fireworksEngine.startGrandShow(8000);
        }

        // Start Ambient Balloon Generator
        startBalloonSpawner();
    }

    if (giftBoxBtn) {
        giftBoxBtn.addEventListener('click', openSurprise);
    }
    if (surpriseOverlay) {
        surpriseOverlay.addEventListener('click', (e) => {
            if (e.target.closest('#gift-box-btn') || e.target.classList.contains('tap-to-open-badge')) {
                openSurprise();
            }
        });
    }

    // =========================================================================
    // SCENE 2: INTERACTIVE CANDLE BLOWING & CAKE CUTTING
    // =========================================================================
    function blowOutCandles() {
        if (candlesBlown) return;
        candlesBlown = true;

        if (window.birthdayAudio) {
            window.birthdayAudio.playBlowEffect();
            setTimeout(() => window.birthdayAudio.playSparkle(), 400);
        }

        candleFlames.forEach(flame => flame.classList.add('extinguished'));
        candleSmokes.forEach(smoke => {
            smoke.classList.add('active');
            setTimeout(() => smoke.classList.remove('active'), 1800);
        });

        if (cakeStatusMsg) {
            cakeStatusMsg.innerHTML = '🎉 <strong>Wish made!</strong> The candles are blown out! Now click <em>"Cut the Cake"</em> 🍰';
        }

        if (window.confettiEngine) {
            const rect = cakeElement.getBoundingClientRect();
            window.confettiEngine.burst(rect.left + rect.width / 2, rect.top, 80);
        }

        if (btnBlowCandles) btnBlowCandles.style.display = 'none';
        if (btnRelightCandles) btnRelightCandles.style.display = 'inline-flex';
        if (btnCutCake) btnCutCake.style.display = 'inline-flex';
    }

    function relightCandles() {
        candlesBlown = false;
        candleFlames.forEach(flame => flame.classList.remove('extinguished'));
        if (window.birthdayAudio) window.birthdayAudio.playSparkle();

        if (cakeStatusMsg) {
            cakeStatusMsg.textContent = '✨ Candles are glowing! Make your secret wish and blow them out!';
        }

        if (btnBlowCandles) btnBlowCandles.style.display = 'inline-flex';
        if (btnRelightCandles) btnRelightCandles.style.display = 'none';
    }

    function cutCake() {
        if (cakeCut) return;
        cakeCut = true;
        if (cakeElement) cakeElement.classList.add('is-cut');

        if (window.birthdayAudio) {
            window.birthdayAudio.playFanfare();
        }

        if (window.confettiEngine) {
            const rect = cakeElement.getBoundingClientRect();
            window.confettiEngine.burst(rect.left + rect.width / 2, rect.top + 60, 140);
        }

        if (cakeStatusMsg) {
            cakeStatusMsg.innerHTML = '🎂 <strong>YAY! Sweetest slice for the sweetest Didi!</strong> May your life be filled with endless sweetness and smiles! 💕';
        }

        if (btnCutCake) {
            btnCutCake.textContent = 'Cake Cut! 🍰✨';
            btnCutCake.disabled = true;
        }
    }

    if (btnBlowCandles) btnBlowCandles.addEventListener('click', blowOutCandles);
    if (btnRelightCandles) btnRelightCandles.addEventListener('click', relightCandles);
    if (btnCutCake) btnCutCake.addEventListener('click', cutCake);

    // Clicking directly on the cake/candles
    if (cakeElement) {
        cakeElement.addEventListener('click', () => {
            if (!candlesBlown) {
                blowOutCandles();
            } else if (!cakeCut) {
                cutCake();
            }
        });
    }

    // =========================================================================
    // SCENE 3: WISHING STAR BUBBLES
    // =========================================================================
    const starBubbles = document.querySelectorAll('.star-bubble');
    const wishRevealBox = document.getElementById('wish-reveal-box');

    const wishesList = [
        "🌟 May your smile continue to brighten up every room you enter!",
        "💎 Wishing you a year packed with success, good health, and abundant prosperity!",
        "🛍️ May you get unlimited shopping sprees and all your favorite dresses!",
        "💖 Thank you for being my constant protector, best advisor, and favorite person!",
        "🌈 May all your dreams and secret prayers come true this year!",
        "✨ Always remember: You are the coolest, most beautiful, and inspiring Didi ever!"
    ];

    starBubbles.forEach((bubble, index) => {
        bubble.addEventListener('click', () => {
            starBubbles.forEach(b => b.classList.remove('opened'));
            bubble.classList.add('opened');

            if (window.birthdayAudio) window.birthdayAudio.playSparkle();

            const rect = bubble.getBoundingClientRect();
            if (window.confettiEngine) {
                window.confettiEngine.burst(rect.left + rect.width / 2, rect.top, 35);
            }

            if (wishRevealBox) {
                wishRevealBox.innerHTML = `<span>${wishesList[index % wishesList.length]}</span>`;
                wishRevealBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });

    // =========================================================================
    // SCENE 4: FLOATING BALLOONS INTERACTIVITY
    // =========================================================================
    function startBalloonSpawner() {
        if (balloonSpawnInterval) clearInterval(balloonSpawnInterval);
        
        // Spawn an initial cluster
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                if (window.confettiEngine) window.confettiEngine.spawnBalloon();
            }, i * 400);
        }

        balloonSpawnInterval = setInterval(() => {
            if (window.confettiEngine && Math.random() > 0.3) {
                window.confettiEngine.spawnBalloon();
            }
        }, 2200);
    }

    // Listen for clicks on balloons in the window
    window.addEventListener('pointerdown', (e) => {
        if (window.confettiEngine) {
            window.confettiEngine.checkBalloonClick(e.clientX, e.clientY);
        }
    });

    // =========================================================================
    // HUD CONTROLS (Audio, Confetti, Fireworks)
    // =========================================================================
    function updateMusicButtonState(playing) {
        if (!btnMusicToggle) return;
        if (playing) {
            btnMusicToggle.innerHTML = '🎵';
            btnMusicToggle.title = 'Mute Birthday Music';
            btnMusicToggle.classList.add('active');
        } else {
            btnMusicToggle.innerHTML = '🔇';
            btnMusicToggle.title = 'Play Birthday Music';
            btnMusicToggle.classList.remove('active');
        }
    }

    if (btnMusicToggle) {
        btnMusicToggle.addEventListener('click', () => {
            if (!window.birthdayAudio) return;
            if (!window.birthdayAudio.isPlayingMusic) {
                window.birthdayAudio.startBirthdayMusic();
                updateMusicButtonState(true);
            } else {
                const muted = window.birthdayAudio.toggleMute();
                updateMusicButtonState(!muted);
            }
        });
    }

    if (btnConfettiBlast) {
        btnConfettiBlast.addEventListener('click', () => {
            if (window.confettiEngine) {
                window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.4, 150);
                if (window.birthdayAudio) window.birthdayAudio.playPop();
            }
        });
    }

    if (btnFireworksToggle) {
        btnFireworksToggle.addEventListener('click', () => {
            if (window.fireworksEngine) {
                window.fireworksEngine.startGrandShow(6000);
                if (window.birthdayAudio) window.birthdayAudio.playSparkle();
            }
        });
    }
});
