// Fireworks Simulation Engine
class FireworksEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.fireworks = [];
        this.sparks = [];
        this.running = true;
        this.autoLaunchInterval = null;
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

    launch(startX = Math.random() * (this.canvas.width - 200) + 100, targetX = Math.random() * (this.canvas.width - 200) + 100, targetY = Math.random() * (this.canvas.height * 0.45) + 60) {
        if (!this.canvas) return;
        const color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 65%)`;
        this.fireworks.push({
            x: startX,
            y: this.canvas.height,
            targetX: targetX,
            targetY: targetY,
            speed: 4.5,
            angle: Math.atan2(targetY - this.canvas.height, targetX - startX),
            distanceToTarget: Math.hypot(targetX - startX, targetY - this.canvas.height),
            distanceTraveled: 0,
            coordinates: [],
            coordinateCount: 3,
            color: color,
            brightness: Math.floor(Math.random() * 20) + 60
        });
    }

    createSparks(x, y, color) {
        const count = 65;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
            const speed = Math.random() * 7 + 2;
            this.sparks.push({
                x: x,
                y: y,
                coordinates: [],
                coordinateCount: 4,
                angle: angle,
                speed: speed,
                friction: 0.95,
                gravity: 0.7,
                hue: Math.floor(Math.random() * 50) + 300, // pink/gold/purple palette or random
                brightness: Math.floor(Math.random() * 30) + 60,
                alpha: 1,
                decay: Math.random() * 0.015 + 0.01,
                color: color || `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`
            });
        }
    }

    startGrandShow(durationMs = 8000) {
        if (this.autoLaunchInterval) clearInterval(this.autoLaunchInterval);
        
        // Immediate volley
        for (let i = 0; i < 3; i++) {
            setTimeout(() => this.launch(), i * 300);
        }

        this.autoLaunchInterval = setInterval(() => {
            this.launch();
            if (Math.random() > 0.4) {
                setTimeout(() => this.launch(), 200);
            }
        }, 800);

        if (durationMs > 0) {
            setTimeout(() => {
                if (this.autoLaunchInterval) {
                    clearInterval(this.autoLaunchInterval);
                    this.autoLaunchInterval = null;
                }
            }, durationMs);
        }
    }

    stopShow() {
        if (this.autoLaunchInterval) {
            clearInterval(this.autoLaunchInterval);
            this.autoLaunchInterval = null;
        }
    }

    loop() {
        if (!this.ctx || !this.canvas) return;

        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalCompositeOperation = 'lighter';

        // Update & draw fireworks
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const fw = this.fireworks[i];
            fw.coordinates.push([fw.x, fw.y]);
            if (fw.coordinates.length > fw.coordinateCount) fw.coordinates.shift();

            const vx = Math.cos(fw.angle) * fw.speed * 2.2;
            const vy = Math.sin(fw.angle) * fw.speed * 2.2;
            fw.distanceTraveled = Math.hypot(fw.targetX - fw.x, fw.targetY - fw.y);

            if (fw.distanceTraveled < 15 || fw.y <= fw.targetY) {
                this.createSparks(fw.targetX, fw.targetY, fw.color);
                this.fireworks.splice(i, 1);
                continue;
            }

            fw.x += vx;
            fw.y += vy;

            this.ctx.beginPath();
            const lastCoord = fw.coordinates[fw.coordinates.length - 1] || [fw.x, fw.y];
            this.ctx.moveTo(lastCoord[0], lastCoord[1]);
            this.ctx.lineTo(fw.x, fw.y);
            this.ctx.strokeStyle = fw.color;
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }

        // Update & draw sparks
        for (let i = this.sparks.length - 1; i >= 0; i--) {
            const s = this.sparks[i];
            s.coordinates.push([s.x, s.y]);
            if (s.coordinates.length > s.coordinateCount) s.coordinates.shift();

            s.speed *= s.friction;
            s.x += Math.cos(s.angle) * s.speed;
            s.y += Math.sin(s.angle) * s.speed + s.gravity;
            s.alpha -= s.decay;

            if (s.alpha <= 0) {
                this.sparks.splice(i, 1);
                continue;
            }

            this.ctx.beginPath();
            const lastCoord = s.coordinates[s.coordinates.length - 1] || [s.x, s.y];
            this.ctx.moveTo(lastCoord[0], lastCoord[1]);
            this.ctx.lineTo(s.x, s.y);
            this.ctx.strokeStyle = s.color;
            this.ctx.lineWidth = 2;
            this.ctx.globalAlpha = Math.max(0, s.alpha);
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
        }

        requestAnimationFrame(() => this.loop());
    }
}

window.fireworksEngine = new FireworksEngine();
