// Realistic Physics Confetti & Floating Balloons Engine
class ConfettiEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.balloons = [];
        this.animationFrame = null;
        this.colors = [
            '#ff4d8d', '#ff758c', '#ff7eb3', '#ffd700', '#ffb703',
            '#00f5d4', '#7b2cbf', '#9d4edd', '#48cae4', '#ff007f',
            '#ffffff', '#f72585', '#fee440', '#70e000', '#f15bb5'
        ];
    }

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.loop();
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // Explode a massive batch of confetti particles from a coordinate
    burst(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 120) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 14 + 6;
            const size = Math.random() * 9 + 5;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - Math.random() * 6,
                size: size,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 16,
                drag: 0.94,
                gravity: 0.28,
                wobble: Math.random() * 10,
                wobbleSpeed: Math.random() * 0.1 + 0.05,
                shape: Math.random() > 0.35 ? 'rect' : (Math.random() > 0.5 ? 'circle' : 'star'),
                opacity: 1,
                decay: Math.random() * 0.005 + 0.003
            });
        }
    }

    // Continuous celebration fountain from corners
    startCelebrationFountain(durationMs = 5000) {
        const interval = setInterval(() => {
            this.burst(window.innerWidth * 0.1, window.innerHeight * 0.8, 25);
            this.burst(window.innerWidth * 0.9, window.innerHeight * 0.8, 25);
        }, 350);

        setTimeout(() => clearInterval(interval), durationMs);
    }

    // Spawn floating interactive balloons
    spawnBalloon() {
        const colors = [
            { bg: '#ff4d6d', shine: '#ff8fa3', string: '#ffb3c1' },
            { bg: '#7209b7', shine: '#b5179e', string: '#c77dff' },
            { bg: '#f72585', shine: '#ff70a6', string: '#ff99c8' },
            { bg: '#4361ee', shine: '#4cc9f0', string: '#a0c4ff' },
            { bg: '#ffb703', shine: '#ffd166', string: '#ffe6a7' },
            { bg: '#06d6a0', shine: '#80ed99', string: '#c7f9cc' },
            { bg: '#9b5de5', shine: '#f15bb5', string: '#ffc6ff' }
        ];

        const chosen = colors[Math.floor(Math.random() * colors.length)];
        const radius = Math.random() * 16 + 26;

        this.balloons.push({
            x: Math.random() * (window.innerWidth - 80) + 40,
            y: window.innerHeight + radius + 40,
            r: radius,
            color: chosen.bg,
            shine: chosen.shine,
            stringColor: chosen.string,
            vy: -(Math.random() * 1.5 + 1.2),
            vx: (Math.random() - 0.5) * 0.5,
            wobble: Math.random() * 10,
            wobbleSpeed: Math.random() * 0.03 + 0.02,
            opacity: 0.92,
            popped: false
        });
    }

    // Check click/tap on balloons
    checkBalloonClick(clientX, clientY) {
        for (let i = this.balloons.length - 1; i >= 0; i--) {
            const b = this.balloons[i];
            const dist = Math.hypot(b.x - clientX, b.y - clientY);
            if (dist <= b.r + 15) {
                // Popped!
                if (window.birthdayAudio) window.birthdayAudio.playPop();
                this.burst(b.x, b.y, 40);
                this.balloons.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    loop() {
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Update & Render Confetti
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.vx *= p.drag;
                p.vy = p.vy * p.drag + p.gravity;
                p.x += p.vx + Math.sin(p.wobble) * 1.2;
                p.y += p.vy;
                p.wobble += p.wobbleSpeed;
                p.rotation += p.rotationSpeed;
                p.opacity -= p.decay;

                if (p.opacity <= 0 || p.y > this.canvas.height + 50) {
                    this.particles.splice(i, 1);
                    continue;
                }

                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate((p.rotation * Math.PI) / 180);
                this.ctx.globalAlpha = Math.max(0, p.opacity);
                this.ctx.fillStyle = p.color;

                if (p.shape === 'rect') {
                    this.ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.7);
                } else if (p.shape === 'circle') {
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    this.ctx.fill();
                } else {
                    // Star shape
                    this.drawStar(0, 0, 4, p.size / 2, p.size / 4);
                }

                this.ctx.restore();
            }

            // Update & Render Balloons
            for (let i = this.balloons.length - 1; i >= 0; i--) {
                const b = this.balloons[i];
                b.y += b.vy;
                b.wobble += b.wobbleSpeed;
                b.x += Math.sin(b.wobble) * 0.8 + b.vx;

                if (b.y < -b.r * 2 - 80) {
                    this.balloons.splice(i, 1);
                    continue;
                }

                this.ctx.save();
                this.ctx.globalAlpha = b.opacity;

                // Draw string
                this.ctx.strokeStyle = b.stringColor;
                this.ctx.lineWidth = 1.5;
                this.ctx.beginPath();
                this.ctx.moveTo(b.x, b.y + b.r * 1.15);
                this.ctx.quadraticCurveTo(
                    b.x + Math.sin(b.wobble * 2) * 12,
                    b.y + b.r * 1.15 + 25,
                    b.x + Math.cos(b.wobble) * 6,
                    b.y + b.r * 1.15 + 50
                );
                this.ctx.stroke();

                // Draw Balloon Body (Egg/Oval shape)
                this.ctx.save();
                this.ctx.translate(b.x, b.y);
                this.ctx.scale(1, 1.25);
                this.ctx.fillStyle = b.color;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, b.r, 0, Math.PI * 2);
                this.ctx.fill();

                // Balloon Knot
                this.ctx.fillStyle = b.color;
                this.ctx.beginPath();
                this.ctx.moveTo(-b.r * 0.18, b.r * 0.95);
                this.ctx.lineTo(b.r * 0.18, b.r * 0.95);
                this.ctx.lineTo(0, b.r * 1.12);
                this.ctx.closePath();
                this.ctx.fill();

                // Balloon Highlights / Shine
                this.ctx.fillStyle = b.shine;
                this.ctx.beginPath();
                this.ctx.ellipse(-b.r * 0.35, -b.r * 0.35, b.r * 0.22, b.r * 0.45, Math.PI / 4, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.restore();
                this.ctx.restore();
            }
        }

        this.animationFrame = requestAnimationFrame(() => this.loop());
    }

    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }
        this.ctx.lineTo(cx, cy - outerRadius);
        this.ctx.closePath();
        this.ctx.fill();
    }
}

window.confettiEngine = new ConfettiEngine();
