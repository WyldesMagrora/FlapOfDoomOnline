class Bird extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        // Starte mit dem ersten Frame der Animation
        super(scene, x, y, 'bird', 0);
        
        // Füge Bird zur Szene hinzu
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Physikalische Eigenschaften
        this.body.gravity.y = config.GRAVITY * 100;
        this.speed = config.SPEED;
        
        // Animation
        this.animationTimer = 0;
        this.animationSpeed = 5;
        this.currentFrame = 0;
        
        // Lade den aktuellen Skin
        this.loadSkin(playerData.currentBird);
        
        // Kollisionsbox anpassen
        this.body.setSize(this.width * 0.8, this.height * 0.8);
        this.body.setOffset(this.width * 0.1, this.height * 0.1);
        
        // Partikeleffekte
        this.particleSystem = scene.particleSystem;
    }
    
    loadSkin(skinName) {
        // Hole Skin-Informationen
        const skin = BIRD_SKINS[skinName];
        
        // Speichere Skin-Name
        this.currentSkin = skinName;
        
        // Setze Textur und Frame
        this.setTexture(skinName + '_bird');
        this.setFrame(0);
        
        // Erstelle Animation für diesen Skin
        if (!this.scene.anims.exists(skinName + '_flap')) {
            this.scene.anims.create({
                key: skinName + '_flap',
                frames: this.scene.anims.generateFrameNumbers(skinName + '_bird', { start: 0, end: 2 }),
                frameRate: 10,
                repeat: -1
            });
        }
        
        // Starte Animation
        this.play(skinName + '_flap');
    }
    
    update() {
        // Rotiere den Vogel basierend auf der Geschwindigkeit
        const velocity = this.body.velocity.y;
        let angle = -velocity * 0.02;
        angle = Phaser.Math.Clamp(angle, -30, 45);
        this.setRotation(Phaser.Math.DegToRad(angle));
        
        // Verhindere, dass der Vogel über den oberen Bildschirmrand fliegt
        if (this.y < 0) {
            this.y = 0;
            this.body.velocity.y = 0;
        }
        
        // Emittiere Partikel bei Fallbewegung
        if (this.body.velocity.y > 0) {
            this.emitParticles();
        }
    }
    
    bump() {
        // Springe nach oben
        this.body.velocity.y = -this.speed * 10;
        
        // Spiele Sound
        this.scene.sound.play('wing');
    }
    
    emitParticles() {
        // Emittiere Partikel basierend auf dem aktuellen Effekt
        if (playerData.currentParticleEffect !== "default") {
            const effect = PARTICLE_EFFECTS[playerData.currentParticleEffect];
            if (effect.maxParticles > 0) {
                this.particleSystem.emit(
                    this.x,
                    this.y + 15,
                    Math.floor(effect.maxParticles / 2),
                    playerData.currentParticleEffect
                );
            }
        }
    }
}
