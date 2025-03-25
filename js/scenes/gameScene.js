class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.bird = null;
        this.pipes = null;
        this.ground = null;
        this.score = 0;
        this.scoreText = null;
        this.isGameOver = false;
    }

    create() {
        // Set up background
        this.background = this.add.tileSprite(0, 0, config.SCREEN_WIDTH, config.SCREEN_HEIGHT, `background-${playerData.currentBackground}`).setOrigin(0);

        // Create bird
        this.bird = new Bird(this, config.SCREEN_WIDTH / 6, config.SCREEN_HEIGHT / 2);

        // Create pipes
        this.pipes = this.physics.add.group();
        this.timedEvent = this.time.addEvent({
            delay: 1500,
            callback: this.addRowOfPipes,
            callbackScope: this,
            loop: true
        });

        // Create ground
        this.ground = new Ground(this, 0, config.SCREEN_HEIGHT - config.GROUND_HEIGHT);

        // Set up collisions
        this.physics.add.collider(this.bird, this.ground, this.hitGround, null, this);
        this.physics.add.collider(this.bird, this.pipes, this.hitPipe, null, this);

        // Set up score
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

        // Set up input
        this.input.on('pointerdown', this.jump, this);
        this.input.keyboard.on('keydown-SPACE', this.jump, this);

        // Particle system
        this.particleSystem = new ParticleSystem(this);
    }

    update() {
        if (this.isGameOver) return;

        this.background.tilePositionX += 0.5;
        this.ground.update();
        this.bird.update();

        // Check if bird has passed through pipes
        this.pipes.children.entries.forEach((pipe) => {
            if (!pipe.scored && pipe.x < this.bird.x) {
                pipe.scored = true;
                this.addScore();
            }
        });

        // Emit particles
        if (this.bird.body.velocity.y > 0) {
            this.bird.emitParticles();
        }

        this.particleSystem.update();
    }

    jump() {
        this.bird.jump();
    }

    addRowOfPipes() {
        const hole = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < 8; i++) {
            if (i !== hole && i !== hole + 1) {
                const pipe = new Pipe(this, 400, i * 60 + 10);
                this.pipes.add(pipe);
            }
        }
    }

    addScore() {
        this.score++;
        this.scoreText.setText('Score: ' + this.score);
        playerData.addCoins(config.COIN_REWARD);
        this.sound.play('point');
    }

    hitGround() {
        this.gameOver();
    }

    hitPipe() {
        this.gameOver();
    }

    gameOver() {
        this.isGameOver = true;
        this.physics.pause();
        this.sound.play('hit');
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.start('GameOverScene', { score: this.score });
            },
            loop: false
        });
    }
}
