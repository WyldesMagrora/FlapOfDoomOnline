// Spielkonfiguration
const config = {
    // Gameplay Konstanten
    SCREEN_WIDTH: 400,
    SCREEN_HEIGHT: 600,
    SPEED: 20,
    GRAVITY: 2.5,
    GAME_SPEED: 15,
    
    // Asset Pfade
    ASSET_PATH: 'assets',
    SPRITE_PATH: 'assets/sprites',
    AUDIO_PATH: 'assets/audio',
    
    // Spielobjekt-Größen
    GROUND_WIDTH: 2 * 400, // 2 * SCREEN_WIDTH
    GROUND_HEIGHT: 100,
    PIPE_WIDTH: 80,
    PIPE_HEIGHT: 500,
    PIPE_GAP: 150,
    
    // Farben
    COLORS: {
        WHITE: 0xFFFFFF,
        BLACK: 0x000000,
        NIGHT_BLUE: 0x191970,
        DARK_BLUE: 0x00008B,
        GRASS_GREEN: 0x228B22,
        LIGHT_GREEN: 0x90EE90,
        PIPE_GREEN: 0x43CD80
    },
    
    // Spielerdaten
    COIN_REWARD: 5,
    
    // Partikelfarben
    PARTICLE_COLORS: {
        white: 0xFFFFFF,
        yellow: 0xFFFF00,
        blue: 0x00BFFF,
        red: 0xFF4500,
        purple: 0x9370DB
    },
    
    // Konami Code
    KONAMI_CODE: [
        38, 38, 40, 40, 37, 39, 37, 39, 66, 65
    ] // UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A
};

// Bird Skins
const BIRD_SKINS = {
    "default": {
        price: 0,
        files: ["down.png", "Middle.png", "up.png"],
        description: "Standard Vogel"
    },
    "blue": {
        price: 215,
        files: ["bluebird-downflap.png", "bluebird-midflap.png", "bluebird-upflap.png"],
        description: "Eiskalter Flieger"
    },
    "red": {
        price: 390,
        files: ["redbird-downflap.png", "redbird-midflap.png", "redbird-upflap.png"],
        description: "Feuriger Phönix"
    },
    "yellow": {
        price: 560,
        files: ["yellowbird-downflap.png", "yellowbird-midflap.png", "yellowbird-upflap.png"],
        description: "Goldener Blitz"
    }
};

// Hintergrund Skins
const BACKGROUND_SKINS = {
    "day": {
        price: 0,
        files: ["background-day.png"],
        description: "Sonniger Tag"
    },
    "night": {
        price: 500,
        files: ["background-night.png"],
        description: "Sternenklare Nacht"
    },
    "midnight": {
        price: 1250,
        files: ["background-midnight.png"],
        description: "Mystische Mitternacht"
    }
};

// Partikeleffekte
const PARTICLE_EFFECTS = {
    "default": {
        price: 0,
        color: "white",
        description: "Keine Partikel",
        maxParticles: 0
    },
    "stardust": {
        price: 250,
        color: "yellow",
        description: "Funkelnde Sterne",
        maxParticles: 6,
        requires: ["blue", "red", "yellow"]
    },
    "ice": {
        price: 325,
        color: "blue",
        description: "Eisige Aura",
        maxParticles: 8,
        requires: ["stardust", "night"]
    },
    "fire": {
        price: 650,
        color: "red",
        description: "Feurige Spur",
        maxParticles: 10,
        requires: ["ice", "midnight"]
    },
    "magic": {
        price: 850,
        color: "purple",
        description: "Magische Essenz",
        maxParticles: 12,
        requires: ["fire"]
    }
};
