// Main Application Controller & Interactive Story Engine

// Global Surprise Opener
window.openSurprise = function(event) {
    if (event && event.stopPropagation) event.stopPropagation();
    const overlay = document.getElementById('surprise-overlay');
    if (!overlay || overlay.classList.contains('opened')) return;
    overlay.classList.add('opened');

    setTimeout(() => {
        if (overlay) overlay.style.display = 'none';
    }, 850);

    // Play Sound FX & Polyphonic Music
    if (window.birthdayAudio) {
        window.birthdayAudio.playFanfare();
        setTimeout(() => {
            window.birthdayAudio.startBirthdayMusic();
            const btnMusic = document.getElementById('btn-music-toggle');
            if (btnMusic) {
                btnMusic.innerHTML = '🎵';
                btnMusic.classList.add('active');
            }
        }, 800);
    }

    // Initial Celebration Burst
    if (window.confettiEngine) {
        window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 160);
        window.confettiEngine.startCelebrationFountain(5000);
    }

    if (window.fireworksEngine) {
        window.fireworksEngine.startGrandShow(6000);
    }

    // Start Ambient Floating Balloons
    if (typeof window.startBalloonSpawner === 'function') {
        window.startBalloonSpawner();
    }

    // Start Smooth Cinematic Auto-Scrolling & Interactive Celebration Tour!
    if (typeof window.startCinematicTour === 'function') {
        setTimeout(() => {
            window.startCinematicTour();
        }, 2200);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Engines
    if (window.confettiEngine) window.confettiEngine.init('confetti-canvas');
    if (window.fireworksEngine) window.fireworksEngine.init('fireworks-canvas');
    if (window.customizer) window.customizer.init();

    const surpriseOverlay = document.getElementById('surprise-overlay');
    const giftBoxBtn = document.getElementById('gift-box-btn');
    const tapToOpenBtn = document.getElementById('tap-to-open-btn');
    const btnMusicToggle = document.getElementById('btn-music-toggle');
    const btnConfettiBlast = document.getElementById('btn-confetti-blast');
    const btnFireworksToggle = document.getElementById('btn-fireworks-toggle');
    const btnReplayTour = document.getElementById('btn-replay-tour');

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
    let tourActive = false;

    // Balloon Spawner
    window.startBalloonSpawner = function() {
        if (balloonSpawnInterval) clearInterval(balloonSpawnInterval);
        
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
    };

    // =========================================================================
    // CAKE CEREMONY FUNCTIONS
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
            cakeStatusMsg.innerHTML = '🎉 <strong>Wish made!</strong> The candles are blown out! 🍰';
        }

        if (window.confettiEngine && cakeElement) {
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

        if (window.confettiEngine && cakeElement) {
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

    function activateStarWish(index) {
        if (!starBubbles || starBubbles.length === 0) return;
        const bubble = starBubbles[index % starBubbles.length];
        starBubbles.forEach(b => b.classList.remove('opened'));
        bubble.classList.add('opened');

        if (window.birthdayAudio) window.birthdayAudio.playSparkle();

        const rect = bubble.getBoundingClientRect();
        if (window.confettiEngine) {
            window.confettiEngine.burst(rect.left + rect.width / 2, rect.top, 40);
        }

        if (wishRevealBox) {
            wishRevealBox.innerHTML = `<span>${wishesList[index % wishesList.length]}</span>`;
        }
    }

    starBubbles.forEach((bubble, index) => {
        bubble.addEventListener('click', () => activateStarWish(index));
    });

    // =========================================================================
    // CINEMATIC GUIDED AUTO-SCROLL TOUR & GRAND FINALE CRACKERS
    // =========================================================================
    function smoothScrollTo(element, blockPosition = 'center') {
        if (!element) return;
        element.scrollIntoView({
            behavior: 'smooth',
            block: blockPosition
        });
    }

    window.startCinematicTour = function() {
        if (tourActive) return;
        tourActive = true;

        const cakeStation = document.getElementById('cake-station');
        const memoriesSection = document.getElementById('memories-section');
        const wishesSection = document.getElementById('wishes-jar-section');
        const letterSection = document.getElementById('letter-section');
        const footerSection = document.getElementById('footer-section');

        // Step 1: Scroll to Cake Station (T+0s)
        smoothScrollTo(cakeStation, 'center');

        // Step 1b: Blow Candles automatically (T+1.4s)
        setTimeout(() => {
            blowOutCandles();
        }, 1400);

        // Step 1c: Cut Cake automatically (T+3.0s)
        setTimeout(() => {
            cutCake();
        }, 3000);

        // Step 2: Scroll to Sister Memories Polaroid Deck (T+6.0s)
        setTimeout(() => {
            smoothScrollTo(memoriesSection, 'center');
            const cards = document.querySelectorAll('.polaroid-card');
            cards.forEach((card, idx) => {
                setTimeout(() => {
                    card.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
                    card.style.transform = 'translateY(-10px) scale(1.04)';
                    setTimeout(() => {
                        card.style.transform = '';
                    }, 800);
                }, idx * 450);
            });
        }, 6000);

        // Step 3: Scroll to Wishing Star Jar (T+10.0s)
        setTimeout(() => {
            smoothScrollTo(wishesSection, 'center');
            setTimeout(() => {
                activateStarWish(0);
                setTimeout(() => activateStarWish(3), 1600);
            }, 800);
        }, 10000);

        // Step 4: Scroll to Royal Birthday Letter (T+14.0s)
        setTimeout(() => {
            smoothScrollTo(letterSection, 'center');
            if (window.birthdayAudio) window.birthdayAudio.playSparkle();
        }, 14000);

        // Step 5: Scroll to Footer & GRAND FINALE CRACKER BLITZ (T+18.5s)
        setTimeout(() => {
            smoothScrollTo(footerSection, 'center');

            // --- FULL SPEED CRACKERS & FIREWORKS BLITZ ---
            setTimeout(() => {
                if (window.fireworksEngine) {
                    window.fireworksEngine.startMegaCrackerBlitz(20000);
                }
                if (window.confettiEngine) {
                    // Massive multi-corner confetti cannons
                    window.confettiEngine.burst(window.innerWidth * 0.2, window.innerHeight * 0.5, 120);
                    window.confettiEngine.burst(window.innerWidth * 0.8, window.innerHeight * 0.5, 120);
                    window.confettiEngine.burst(window.innerWidth * 0.5, window.innerHeight * 0.4, 180);
                    window.confettiEngine.startCelebrationFountain(12000);

                    // Rapid balloon swarm
                    for (let i = 0; i < 8; i++) {
                        setTimeout(() => window.confettiEngine.spawnBalloon(), i * 250);
                    }
                }
                if (window.birthdayAudio) {
                    window.birthdayAudio.playFanfare();
                }
                tourActive = false;
            }, 600);
        }, 18500);
    };

    if (btnReplayTour) {
        btnReplayTour.addEventListener('click', () => {
            window.startCinematicTour();
        });
    }

    // =========================================================================
    // SURPRISE UNBOXING LISTENERS
    // =========================================================================
    if (giftBoxBtn) {
        giftBoxBtn.addEventListener('click', window.openSurprise);
        giftBoxBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.openSurprise(e);
            }
        });
    }

    if (tapToOpenBtn) {
        tapToOpenBtn.addEventListener('click', window.openSurprise);
    }

    if (surpriseOverlay) {
        surpriseOverlay.addEventListener('click', window.openSurprise);
    }

    // Listen for clicks on floating balloons
    window.addEventListener('pointerdown', (e) => {
        if (window.confettiEngine) {
            window.confettiEngine.checkBalloonClick(e.clientX, e.clientY);
        }
    });

    // HUD Music & Confetti Controls
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
                window.fireworksEngine.startMegaCrackerBlitz(8000);
                if (window.birthdayAudio) window.birthdayAudio.playSparkle();
            }
        });
    }

    // =========================================================================
    // IMAGE VISIBILITY & ERROR SAFEGUARDS
    // =========================================================================
    document.querySelectorAll('.polaroid-img').forEach(img => {
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }

        img.addEventListener('error', () => {
            img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ff758c"/><stop offset="100%" stop-color="%23ff7eb3"/></linearGradient></defs><rect width="400" height="300" fill="url(%23g)"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="sans-serif" font-size="36">🎂✨</text><text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="sans-serif" font-size="18" font-weight="bold">Happy Birthday Didi!</text></svg>';
        });
    });
});
