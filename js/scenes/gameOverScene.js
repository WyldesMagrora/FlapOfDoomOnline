class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.score = data.score;
    }

    create() {
        // Background
        this.add.image(0, 0, `background-${playerData.currentBackground}`).setOrigin(0).setDisplaySize(config.SCREEN_WIDTH, config.SCREEN_HEIGHT);

        // Overlay
        this.add.rectangle(0, 0, config.SCREEN_WIDTH, config.SCREEN_HEIGHT, 0x000000, 0.7).setOrigin(0);

        // Game Over text
        this.add.image(config.SCREEN_WIDTH / 2, config.SCREEN_HEIGHT / 3, 'gameover').setOrigin(0.5);

        // Score
        this.add.text(config.SCREEN_WIDTH / 2, config.SCREEN_HEIGHT / 2, `Score: ${this.score}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Restart button
        const restartButton = this.add.text(config.SCREEN_WIDTH / 2, config.SCREEN_HEIGHT * 2 / 3, 'Restart', { fontSize: '24px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Menu button
        const menuButton = this.add.text(config.SCREEN_WIDTH / 2, config.SCREEN_HEIGHT * 2 / 3 + 50, 'Menu', { fontSize: '24px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive();

        menuButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });

        // Check if score is high enough for name input
        if (this.score >= 10) {
            this.time.delayedCall(1000, () => {
                this.scene.start('NameInputScene', { score: this.score });
            });
        }
    }
}
