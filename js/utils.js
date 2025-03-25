// Hilfsfunktionen
const Utils = {
    // Prüft, ob ein Partikeleffekt freigeschaltet werden kann
    canUnlockParticle: function(effectName, playerData) {
        if (effectName === "default") {
            return true;
        }
        
        const effect = PARTICLE_EFFECTS[effectName];
        if (!effect.requires) {
            return true;
        }
        
        // Prüfe alle Voraussetzungen
        for (const req of effect.requires) {
            if (BIRD_SKINS[req] && !playerData.unlockedBirds[req]) {
                return false;
            }
            if (BACKGROUND_SKINS[req] && !playerData.unlockedBackgrounds[req]) {
                return false;
            }
            if (PARTICLE_EFFECTS[req] && !playerData.unlockedParticles[req]) {
                return false;
            }
        }
        return true;
    },
    
    // Erstellt eine abgerundete Rechteckform mit Transparenz
    createRoundedRect: function(scene, x, y, width, height, radius, fillColor, alpha) {
        const graphics = scene.add.graphics();
        graphics.fillStyle(fillColor, alpha);
        graphics.fillRoundedRect(x, y, width, height, radius);
        return graphics;
    },
    
    // Erstellt einen Button mit Hover-Effekt
    createButton: function(scene, x, y, width, height, text, textSize, callback) {
        const button = scene.add.container(x, y);
        
        // Hintergrund
        const bg = Utils.createRoundedRect(scene, -width/2, -height/2, width, height, 25, 0xFFFFFF, 0.5);
        button.add(bg);
        
        // Text
        const textObj = scene.add.text(0, 0, text, {
            fontFamily: 'Arial',
            fontSize: textSize,
            color: '#FFFFFF'
        }).setOrigin(0.5);
        button.add(textObj);
        
        // Interaktivität
        button.setSize(width, height);
        button.setInteractive({ useHandCursor: true });
        
        // Hover-Effekte
        button.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(0xFFFFFF, 0.8);
            bg.fillRoundedRect(-width/2, -height/2, width, height, 25);
        });
        
        button.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(0xFFFFFF, 0.5);
            bg.fillRoundedRect(-width/2, -height/2, width, height, 25);
        });
        
        // Klick-Event
        button.on('pointerdown', callback);
        
        return button;
    },
    
    // Erstellt ein Overlay mit Transparenz
    createOverlay: function(scene, alpha = 0.5) {
        const overlay = scene.add.rectangle(
            config.SCREEN_WIDTH / 2,
            config.SCREEN_HEIGHT / 2,
            config.SCREEN_WIDTH,
            config.SCREEN_HEIGHT,
            0x000000,
            alpha
        );
        return overlay;
    },
    
    // Formatiert Zahlen mit Tausendertrennzeichen
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
};
