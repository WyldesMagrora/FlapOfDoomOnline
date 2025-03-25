class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
        this.konamiIndex = 0;
        this.easterEggUnlocked = false;
    }
    
    create() {
        // Hintergrund basierend auf aktuellem Skin
        this.createBackground();
        
        // Transparentes Overlay
        this.createOverlay();
        
        // Logo
        this.createLogo();
        
        // Menü-Optionen
        this.createMenuOptions();
        
        // Münzen-Anzeige
        this.createCoinsDisplay();
        
        // Konami-Code Listener
        this.setupKonamiCode();
    }
    
    createBackground() {
        // Wähle Hintergrund basierend auf Spielerdaten
        const bgKey = `background-${playerData.currentBackground}`;
        this.background = this.add.image(0, 0, bgKey)
            .setOrigin(0, 0)
            .setDisplaySize(config.SCREEN_WIDTH, config.SCREEN_HEIGHT);
    }
    
    createOverlay() {
        // Transparentes Overlay für bessere Lesbarkeit
        this.overlay = this.add.rectangle(
            config.SCREEN_WIDTH / 2,
            config.SCREEN_HEIGHT / 2,
            config.SCREEN_WIDTH,
            config.SCREEN_HEIGHT,
            0x000000,
            0.4
        );
    }
    
    createLogo() {
        // Logo oben mittig
        this.logo = this.add.image(
            config.SCREEN_WIDTH / 2,
            config.SCREEN_HEIGHT / 4,
            'logo'
        ).setOrigin(0.5);
    }
    
    createMenuOptions() {
        // Menü-Optionen
        const options = [
            { text: "Spielen (SPACE)", key: "play" },
            { text: "Shop (S)", key: "shop" },
            { text: "Über uns (A)", key: "about" },
            { text: "Beenden (Q)", key: "quit" }
        ];
        
        this.menuButtons = [];
        
        options.forEach((option, i) => {
            // Erstelle Button mit Glaseffekt
            const button = Utils.createButton(
                this,
                config.SCREEN_WIDTH / 2,
                config.SCREEN_HEIGHT / 2 + i * 60,
                300,
                50,
                option.text,
                24,
                () => this.handleMenuSelection(option.key)
            );
            
            this.menuButtons.push(button);
        });
        
        // Tastatur-Eingaben
        this.input.keyboard.on('keydown', (event) => {
            switch(event.keyCode) {
                case Phaser.Input.Keyboard.KeyCodes.SPACE:
                    this.handleMenuSelection('play');
                    break;
                case Phaser.Input.Keyboard.KeyCodes.S:
                    this.handleMenuSelection('shop');
                    break;
                case Phaser.Input.Keyboard.KeyCodes.A:
                    this.handleMenuSelection('about');
                    break;
                case Phaser.Input.Keyboard.KeyCodes.Q:
                    this.handleMenuSelection('quit');
                    break;
            }
        });
    }
    
    createCoinsDisplay() {
        // Münzen-Anzeige in der oberen rechten Ecke
        this.coinIcon = this.add.image(
            config.SCREEN_WIDTH - 100,
            30,
            'coin'
        ).setScale(0.8);
        
        this.coinText = this.add.text(
            config.SCREEN_WIDTH - 80,
            20,
            Utils.formatNumber(playerData.coins),
            {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#ffffff'
            }
        );
    }
    
    setupKonamiCode() {
        // Konami-Code Listener
        this.input.keyboard.on('keydown', (event) => {
            this.checkKonamiCode(event.keyCode);
        });
    }
    
    checkKonamiCode(keyCode) {
        // Prüfe, ob der aktuelle Tastendruck dem nächsten Schritt im Konami-Code entspricht
        if (keyCode === config.KONAMI_CODE[this.konamiIndex]) {
            this.konamiIndex++;
            
            // Wenn der komplette Code eingegeben wurde
            if (this.konamiIndex === config.KONAMI_CODE.length) {
                this.activateEasterEgg();
                this.konamiIndex = 0;
            }
        } else {
            // Zurücksetzen bei falscher Eingabe
            this.konamiIndex = 0;
        }
    }
    
    activateEasterEgg() {
        // Easter Egg aktivieren
        this.easterEggUnlocked = true;
        
        // Soundeffekt
        this.sound.play('point');
        
        // Gib dem Spieler 1000 Münzen
        playerData.addCoins(1000);
        
        // Aktualisiere Münzenanzeige
        this.coinText.setText(Utils.formatNumber(playerData.coins));
        
        // Zeige Effekt
        this.showEasterEggEffect();
    }
    
    showEasterEggEffect() {
        // Erstelle einen Partikeleffekt
        const particles = this.add.particles('coin');
        
        const emitter = particles.createEmitter({
            x: config.SCREEN_WIDTH / 2,
            y: config.SCREEN_HEIGHT / 2,
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            lifespan: 1000,
            quantity: 50,
            blendMode: 'ADD'
        });
        
        // Stoppe den Emitter nach kurzer Zeit
        this.time.delayedCall(1000, () => {
            emitter.stop();
            
            // Entferne Partikel nach dem Ausblenden
            this.time.delayedCall(1000, () => {
                particles.destroy();
            });
        });
    }
    
    handleMenuSelection(option) {
        switch(option) {
            case 'play':
                this.scene.start('GameScene');
                break;
            case 'shop':
                this.scene.start('ShopScene');
                break;
            case 'about':
                this.showErrorMessage();
                break;
            case 'quit':
                // In einem Browser können wir nicht wirklich beenden,
                // aber wir können eine Nachricht anzeigen
                if (window.confirm('Möchtest du das Spiel wirklich beenden?')) {
                    window.close();
                }
                break;
        }
    }
    
    showErrorMessage() {
        // Zeige Fehlermeldung
        const errorText = this.add.text(
            config.SCREEN_WIDTH / 2,
            config.SCREEN_HEIGHT - 50,
            "Error 404 - Class not Found",
            {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#ff0000'
            }
        ).setOrigin(0.5);
        
        // Entferne nach 2 Sekunden
        this.time.delayedCall(2000, () => {
            errorText.destroy();
        });
    }
}
