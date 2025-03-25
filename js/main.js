// Phaser-Konfiguration
const gameConfig = {
    type: Phaser.AUTO,
    width: config.SCREEN_WIDTH,
    height: config.SCREEN_HEIGHT,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        BootScene,
        PreloadScene,
        MenuScene,
        GameScene,
        ShopScene,
        GameOverScene,
        NameInputScene,
        PauseScene
    ]
};

// Starte das Spiel
const game = new Phaser.Game(gameConfig);

// Konami-Code Erkennung
let konamiIndex = 0;
const konamiCode = config.KONAMI_CODE;

// Event-Listener für Konami-Code
window.addEventListener('keydown', (event) => {
    // Prüfe, ob der aktuelle Tastendruck dem nächsten Schritt im Konami-Code entspricht
    if (event.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        
        // Wenn der komplette Code eingegeben wurde
        if (konamiIndex === konamiCode.length) {
            // Aktiviere Easter Egg
            playerData.addCoins(1000);
            
            // Spiele Sound, wenn möglich
            const activeScene = game.scene.getScenes(true)[0];
            if (activeScene && activeScene.sound) {
                activeScene.sound.play('point');
            }
            
            // Zeige Effekt, wenn möglich
            if (activeScene && activeScene.showEasterEggEffect) {
                activeScene.showEasterEggEffect();
            }
            
            // Zurücksetzen
            konamiIndex = 0;
        }
    } else {
        // Zurücksetzen bei falscher Eingabe
        konamiIndex = 0;
    }
});

// Verhindere, dass das Spiel pausiert wird, wenn es den Fokus verliert
game.focus = true;

// Konsolen-Nachricht
console.log('FlapOfDoom v1.0 gestartet am: Dienstag, 25. März 2025, 11:47 Uhr MEZ');
