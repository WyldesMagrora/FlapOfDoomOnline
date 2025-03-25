class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }
    
    preload() {
        // Lade minimale Assets für den Ladebildschirm
        this.load.image('logo', 'assets/sprites/logo.png');
        this.load.image('loading-background', 'assets/sprites/background-night.png');
    }
    
    create() {
        // Konfiguriere Physik-Einstellungen
        this.physics.world.setBounds(0, 0, config.SCREEN_WIDTH, config.SCREEN_HEIGHT);
        
        // Prüfe, ob die Spielerdaten geladen wurden
        if (!playerData) {
            console.warn("Spielerdaten konnten nicht geladen werden, verwende Standardwerte");
            playerData = new PlayerData();
        }
        
        // Überprüfe Systemanforderungen
        this.checkSystemRequirements();
        
        // Wechsle zur PreloadScene
        this.scene.start('PreloadScene');
    }
    
    checkSystemRequirements() {
        // Prüfe Browser-Kompatibilität
        const canvas = document.createElement('canvas');
        const isCanvasSupported = !!(canvas.getContext && canvas.getContext('2d'));
        
        if (!isCanvasSupported) {
            console.error("Dein Browser unterstützt kein Canvas-Element, das Spiel könnte nicht richtig funktionieren.");
            // Zeige Warnung im Spiel
            this.showCompatibilityWarning();
        }
        
        // Prüfe WebGL-Unterstützung
        const isWebGLSupported = !!(
            window.WebGLRenderingContext && 
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
        
        if (!isWebGLSupported) {
            console.warn("WebGL wird nicht unterstützt. Das Spiel verwendet den Canvas-Renderer.");
        }
    }
    
    showCompatibilityWarning() {
        // Erstelle Warnung im DOM
        const warningDiv = document.createElement('div');
        warningDiv.style.position = 'absolute';
        warningDiv.style.top = '10px';
        warningDiv.style.left = '10px';
        warningDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        warningDiv.style.color = 'white';
        warningDiv.style.padding = '10px';
        warningDiv.style.borderRadius = '5px';
        warningDiv.style.zIndex = '1000';
        warningDiv.textContent = 'Dein Browser unterstützt möglicherweise nicht alle Funktionen des Spiels.';
        
        document.body.appendChild(warningDiv);
        
        // Entferne Warnung nach 5 Sekunden
        setTimeout(() => {
            warningDiv.remove();
        }, 5000);
    }
}
class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }
    
    preload() {
        // Lade minimale Assets für den Ladebildschirm
        this.load.image('logo', 'assets/sprites/logo.png');
        this.load.image('loading-background', 'assets/sprites/background-night.png');
    }
    
    create() {
        // Konfiguriere Physik-Einstellungen
        this.physics.world.setBounds(0, 0, config.SCREEN_WIDTH, config.SCREEN_HEIGHT);
        
        // Prüfe, ob die Spielerdaten geladen wurden
        if (!playerData) {
            console.warn("Spielerdaten konnten nicht geladen werden, verwende Standardwerte");
            playerData = new PlayerData();
        }
        
        // Überprüfe Systemanforderungen
        this.checkSystemRequirements();
        
        // Wechsle zur PreloadScene
        this.scene.start('PreloadScene');
    }
    
    checkSystemRequirements() {
        // Prüfe Browser-Kompatibilität
        const canvas = document.createElement('canvas');
        const isCanvasSupported = !!(canvas.getContext && canvas.getContext('2d'));
        
        if (!isCanvasSupported) {
            console.error("Dein Browser unterstützt kein Canvas-Element, das Spiel könnte nicht richtig funktionieren.");
            // Zeige Warnung im Spiel
            this.showCompatibilityWarning();
        }
        
        // Prüfe WebGL-Unterstützung
        const isWebGLSupported = !!(
            window.WebGLRenderingContext && 
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
        
        if (!isWebGLSupported) {
            console.warn("WebGL wird nicht unterstützt. Das Spiel verwendet den Canvas-Renderer.");
        }
    }
    
    showCompatibilityWarning() {
        // Erstelle Warnung im DOM
        const warningDiv = document.createElement('div');
        warningDiv.style.position = 'absolute';
        warningDiv.style.top = '10px';
        warningDiv.style.left = '10px';
        warningDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        warningDiv.style.color = 'white';
        warningDiv.style.padding = '10px';
        warningDiv.style.borderRadius = '5px';
        warningDiv.style.zIndex = '1000';
        warningDiv.textContent = 'Dein Browser unterstützt möglicherweise nicht alle Funktionen des Spiels.';
        
        document.body.appendChild(warningDiv);
        
        // Entferne Warnung nach 5 Sekunden
        setTimeout(() => {
            warningDiv.remove();
        }, 5000);
    }
}
