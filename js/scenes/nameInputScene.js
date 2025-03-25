class NameInputScene extends Phaser.Scene {
    constructor() {
        super('NameInputScene');
        this.playerName = '';
    }

    init(data) {
        this.score = data.score;
    }

    create() {
        // Background
        this.add.image(0, 0, `background-${playerData.currentBackground}`).setOrigin(0).setDisplaySize(config.SCREEN_WIDTH, config.SCREEN_HEIGHT);

        // Overlay
        this.add.rectangle(0, 0, config.SCREEN_WIDTH, config.SCREEN_HEIGHT, 0x000000, 0.7).setOrigin(0);

        // Instructions
        this.add.text(config.SCREEN_WIDTH / 2, config.SCREEN_HEIGHT / 3, 'Gib deinen Namen ein:', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Name input text
        this.nameText = this.add.text(config.SCREEN_WIDTH / 2, config.SCREEN_HEIGHT / 2, '', { fontSize: '28px', fill: '#fff' }).setOrigin(0.5);

        // Submit button
        this.submitButton = this.add.text(config.SCREEN_WIDTH / 2, config.SCREEN_HEIGHT * 2 / 3, 'Speichern', { fontSize: '24px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.submitScore());

        // Tastatur-Eingabe
        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
                this.submitScore();
            } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.BACKSPACE) {
                this.playerName = this.playerName.slice(0, -1);
                this.nameText.setText(this.playerName);
            } else if (event.keyCode >= 48 && event.keyCode <= 90) {
                this.playerName += event.key;
                this.nameText.setText(this.playerName);
            }
        });
    }

    submitScore() {
        if (this.playerName.trim() === '') {
            this.playerName = 'Anonym';
        }
        
        // Speichere Score
        playerData.saveScore(this.playerName, this.score);
        
        // Zurück zum Menü
        this.scene.start('MenuScene');
    }
}
