// ==================== SERVER ACTIVITY BACKGROUND ====================
// Fondo animado de actividad de servidor para Urra Hosting

class ServerActivity {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.bars = [];
        this.barCount = 50;
        this.barWidth = 0;
        this.init();
    }

    init() {
        this.canvas.id = 'bg-server';
        this.canvas.style.cssText = 'position: fixed; top: 0; left: 0; z-index: -1; opacity: 0.35; pointer-events: none;';
        document.body.prepend(this.canvas);
        
        this.resize();
        this.createBars();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }

    createBars() {
        this.barWidth = this.canvas.width / this.barCount;
        this.bars = Array(this.barCount).fill(0).map(() => ({
            height: Math.random(),
            target: Math.random(),
            speed: 0.03 + Math.random() * 0.04,
            pulsePhase: Math.random() * Math.PI * 2
        }));
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.bars.forEach((bar, i) => {
            // Animación suave hacia el objetivo
            bar.height += (bar.target - bar.height) * bar.speed;
            
            // Cambiar objetivo aleatoriamente
            if (Math.random() < 0.015) {
                bar.target = Math.random();
            }
            
            // Efecto de pulso sutil
            bar.pulsePhase += 0.05;
            const pulse = Math.sin(bar.pulsePhase) * 0.1 + 1;
            
            // Dibujar barra
            const x = i * this.barWidth;
            const barHeight = bar.height * this.canvas.height * 0.75 * pulse;
            const y = this.canvas.height - barHeight;
            
            // Gradiente más vibrante
            const gradient = this.ctx.createLinearGradient(x, y, x, this.canvas.height);
            gradient.addColorStop(0, 'rgba(249, 115, 22, 0.85)');
            gradient.addColorStop(0.5, 'rgba(249, 115, 22, 0.5)');
            gradient.addColorStop(1, 'rgba(249, 115, 22, 0.15)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, y, this.barWidth - 1.5, barHeight);
            
            // Línea superior más brillante con glow
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = 'rgba(249, 115, 22, 0.6)';
            this.ctx.strokeStyle = 'rgba(249, 115, 22, 1)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + this.barWidth - 1.5, y);
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
            
            // Highlight en barras altas
            if (bar.height > 0.7) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                this.ctx.fillRect(x, y, this.barWidth - 1.5, 3);
            }
        });
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createBars();
    }
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    new ServerActivity();
    console.log('%c🚀 Server Activity Background Loaded', 'background: #F97316; color: white; padding: 8px; font-weight: bold;');
});
