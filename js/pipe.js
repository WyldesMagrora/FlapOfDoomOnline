class Pipe extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, isInverted = false) {
        super(scene, x, y, 'pipe');
        
        // Füge Pipe zur Szene hinzu
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // true = statisch
        
        // Setze Größe
        this.displayWidth = config.PIPE_WIDTH;
        this.displayHeight = config.PIPE_HEIGHT;
        
        // Drehe die Pipe um, wenn nötig
        if (isInverted) {
            this.setFlipY(true);
        }
        
        // Markiere, ob der Spieler bereits einen Punkt für diese Pipe bekommen hat
        this.scored = false;
    }
    
    update() {
        // Bewege die Pipe nach links
        this.x -= config.GAME_SPEED;
        this.body.x = this.x - this.width / 2;
        
        // Entferne die Pipe, wenn sie aus dem Bildschirm fliegt
        if (this.x < -this.width) {
            this.destroy();
        }
    }
}

class PipePair {
    constructor(scene, x) {
        // Zufällige Größe für die untere Pipe
        const size = Phaser.Math.Between(100, 300);
        
        // Erstelle untere Pipe
        this.lowerPipe = new Pipe(
            scene, 
            x, 
            scene.game.config.height - size
        );
        
        // Erstelle obere Pipe
        this.upperPipe = new Pipe(
            scene, 
            x, 
            scene.game.config.height - size - config.PIPE_GAP - config.PIPE_HEIGHT,
            true
        );
        
        // Speichere Referenz zur Szene
        this.scene = scene;
        
        // Status für Punktezählung
        this.scored = false;
    }
    
    update() {
        // Aktualisiere beide Pipes
        this.lowerPipe.update();
        this.upperPipe.update();
        
        // Prüfe, ob der Spieler einen Punkt bekommt
        if (!this.scored && this.lowerPipe.x < this.scene.bird.x) {
            this.scored = true;
            this.scene.addScore();
        }
    }
    
    isOffScreen() {
        return this.lowerPipe.x < -this.lowerPipe.width;
    }
    
    destroy() {
        this.lowerPipe.destroy();
        this.upperPipe.destroy();
    }
}
