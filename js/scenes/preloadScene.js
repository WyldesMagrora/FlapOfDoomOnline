class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
        this.loadingText = null;
        this.progressBar = null;
        this.progressBox = null;
    }
    
    preload() {
        // Erstelle Ladebildschirm
        this.createLoadingScreen();
        
        // Registriere Fortschritts-Events
        this.registerProgressEvents();
        
        // Lade alle Hintergründe
        this.loadBackgrounds();
        
        // Lade Vogel-Skins
        this.loadBirdSkins();
        
        // Lade UI-Elemente
        this.loadUIElements();
        
        // Lade Spielobjekte
        this.loadGameObjects();
        
        // Lade Soundeffekte
        this.loadSounds();
        
        // Lade Zahlenbilder für Score
        this.loadNumberImages();
    }
    
    create() {
        // Erstelle Animationen
        this.createAnimations();
        
        // Starte Menü-Szene
        this.scene.start('MenuScene');
    }
    
    createLoadingScreen() {
        // Hintergrund
        this.add.image(0, 0, 'loading-background')
            .setOrigin(0)
            .setDisplaySize(config.SCREEN_WIDTH, config.SCREEN_HEIGHT);
        
        // Logo
        const logo = this.add.image(
            config.SCREEN_WIDTH / 2, 
            config.SCREEN_HEIGHT / 3, 
            'logo'
        ).setOrigin(0.5);
        
        // Ladebalken-Hintergrund
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRoundedRect(
            config.SCREEN_WIDTH / 2 - 160,
            config.SCREEN_HEIGHT / 2 + 30,
            320,
            50,
            10
        );
        
        // Ladetext
        this.loadingText = this.add.text(
            config.SCREEN_WIDTH / 2,
            config.SCREEN_HEIGHT / 2,
            'Lade Spiel...',
            {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        
        // Ladebalken
        this.progressBar = this.add.graphics();
    }
    
    registerProgressEvents() {
        // Aktualisiere Ladebalken
        this.load.on('progress', (value) => {
            this.progressBar.clear();
            this.progressBar.fillStyle(0x00ff00, 1);
            this.progressBar.fillRoundedRect(
                config.SCREEN_WIDTH / 2 - 150,
                config.SCREEN_HEIGHT / 2 + 40,
                300 * value,
                30,
                5
            );
            
            // Aktualisiere Text mit Prozent
            this.loadingText.setText(`Lade Spiel... ${Math.floor(value * 100)}%`);
        });
        
        // Zeige Dateiname beim Laden
        this.load.on('fileprogress', (file) => {
            this.loadingText.setText(`Lade: ${file.key}`);
        });
        
        // Bereinige nach dem Laden
        this.load.on('complete', () => {
            this.progressBar.destroy();
            this.progressBox.destroy();
            this.loadingText.setText('Lade abgeschlossen!');
        });
    }
    
    loadBackgrounds() {
        // Lade alle Hintergründe
        this.load.image('background-day', 'assets/sprites/background-day.png');
        this.load.image('background-night', 'assets/sprites/background-night.png');
        this.load.image('background-midnight', 'assets/sprites/background-midnight.png');
    }
    
    loadBirdSkins() {
        // Lade alle Vogel-Skins als Spritesheets
        for (const skin in BIRD_SKINS) {
            const files = BIRD_SKINS[skin].files;
            
            // Lade Einzelbilder für jeden Skin
            for (let i = 0; i < files.length; i++) {
                this.load.image(`${skin}_bird_${i}`, `assets/sprites/${files[i]}`);
            }
            
            // Erstelle Spritesheet für Animation
            this.load.spritesheet(`${skin}_bird`, 
                `assets/sprites/${files[1]}`, // Mittleres Bild als Basis
                { frameWidth: 40, frameHeight: 30 }
            );
        }
    }
    
    loadUIElements() {
        // Lade UI-Elemente
        this.load.image('message', 'assets/sprites/message.png');
        this.load.image('gameover', 'assets/sprites/gameover.png');
        this.load.image('coin', 'assets/sprites/coin.png');
        this.load.image('lock', 'assets/sprites/lock.png');
        this.load.image('unlock', 'assets/sprites/unlock.png');
        this.load.image('selected', 'assets/sprites/selected.png');
    }
    
    loadGameObjects() {
        // Lade Spielobjekte
        this.load.image('ground', 'assets/sprites/base.png');
        this.load.image('pipe', 'assets/sprites/pipe-green.png');
    }
    
    loadSounds() {
        // Lade Soundeffekte
        this.load.audio('wing', 'assets/audio/wing.wav');
        this.load.audio('hit', 'assets/audio/hit.wav');
        this.load.audio('point', 'assets/audio/point.wav');
    }
    
    loadNumberImages() {
        // Lade Zahlenbilder für Score
        for (let i = 0; i < 10; i++) {
            this.load.image(`number_${i}`, `assets/sprites/${i}.png`);
        }
    }
    
    createAnimations() {
        // Erstelle Animationen für jeden Vogel-Skin
        for (const skin in BIRD_SKINS) {
            this.anims.create({
                key: `${skin}_flap`,
                frames: [
                    { key: `${skin}_bird_0` },
                    { key: `${skin}_bird_1` },
                    { key: `${skin}_bird_2` }
                ],
                frameRate: 10,
                repeat: -1
            });
        }
    }
}
