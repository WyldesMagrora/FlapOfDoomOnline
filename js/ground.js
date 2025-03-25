class Ground extends Phaser.GameObjects.TileSprite {
    constructor(scene, y) {
        super(
            scene, 
            0, 
            y, 
            config.GROUND_WIDTH, 
            config.GROUND_HEIGHT, 
            'ground'
        );
        
        // Füge Ground zur Szene hinzu
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // true = statisch
        
        // Setze Ursprung auf die obere linke Ecke
        this.setOrigin(0, 0);
        
        // Setze Position
        this.y = y;
    }
    
    update() {
        // Bewege den Boden nach links, um eine Scrolling-Illusion zu erzeugen
        this.tilePositionX += config.GAME_SPEED;
    }
}
