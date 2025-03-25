class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
    }
    
    emit(x, y, amount = 10, effectType = "default") {
        if (effectType === "default" || 
            !playerData.unlockedParticles[effectType] || 
            PARTICLE_EFFECTS[effectType].maxParticles <= 0) {
            return;
        }
        
        const effect = PARTICLE_EFFECTS[effectType];
        const color = config.PARTICLE_COLORS[effect.color];
        
        for (let i = 0; i < amount; i++) {
            this.createParticle(x, y, color, effectType);
        }
    }
    
    createParticle(x, y, color, effectType) {
        // Zufällige Bewegungsrichtung
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const speed = Phaser.Math.FloatBetween(1, 3);
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;
        
        // Zufällige Größe
        const size = Phaser.Math.Between(2, 4);
        
        // Lebensdauer und Verfallsrate
        const life = 1.0;
        const decayRate = Phaser.Math.FloatBetween(0.02, 0.05);
        
        // Erstelle Partikel als Phaser-Grafik
        const particle = this.scene.add.circle(x, y, size, color, 1);
        
        // Speichere Partikeleigenschaften
        particle.dx = dx;
        particle.dy = dy;
        particle.life = life;
        particle.decayRate = decayRate;
        particle.effectType = effectType;
        
        // Füge zur Partikelliste hinzu
        this.particles.push(particle);
    }
    
    update() {
        // Aktualisiere alle Partikel
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Bewege Partikel
            particle.x += particle.dx;
            particle.y += particle.dy;
            
            // Reduziere Lebensdauer
            particle.life -= particle.decayRate;
            
            // Aktualisiere Transparenz basierend auf Lebensdauer
            particle.alpha = particle.life;
            
            // Reduziere Größe
            particle.radius = Math.max(0, particle.radius - 0.1);
            
            // Entferne tote Partikel
            if (particle.life <= 0) {
                particle.destroy();
                this.particles.splice(i, 1);
            }
        }
    }
    
    clear() {
        // Entferne alle Partikel
        for (const particle of this.particles) {
            particle.destroy();
        }
        this.particles = [];
    }
}
