const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let bird;
let pipes;
let ground;
let score = 0;
let scoreText;
let gameOver = false;
let spacebar;

function preload() {
    this.load.image('background', 'assets/background-day.png');
    this.load.image('bird', 'assets/yellowbird-midflap.png');
    this.load.image('pipe', 'assets/pipe-green.png');
    this.load.image('ground', 'assets/base.png');
    this.load.audio('wing', 'assets/audio/wing.wav');
    this.load.audio('hit', 'assets/audio/hit.wav');
    this.load.audio('point', 'assets/audio/point.wav');
}

function create() {
    // Background
    this.add.image(200, 300, 'background');

    // Bird
    bird = this.physics.add.sprite(100, 300, 'bird');
    bird.setCollideWorldBounds(true);

    // Pipes
    pipes = this.physics.add.group();

    // Ground
    ground = this.physics.add.staticGroup();
    ground.create(200, 580, 'ground').setScale(2).refreshBody();

    // Score
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    // Collisions
    this.physics.add.collider(bird, ground, hitObstacle, null, this);
    this.physics.add.collider(bird, pipes, hitObstacle, null, this);

    // Input
    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Timer for adding pipes
    this.time.addEvent({ delay: 1500, callback: addPipes, callbackScope: this, loop: true });

    // Sounds
    this.wingSound = this.sound.add('wing');
    this.hitSound = this.sound.add('hit');
    this.pointSound = this.sound.add('point');
}

function update() {
    if (gameOver) {
        return;
    }

    if (Phaser.Input.Keyboard.JustDown(spacebar)) {
        flapBird();
    }

    // Rotate bird based on velocity
    if (bird.body.velocity.y > 0) {
        bird.angle += 1;
    } else {
        bird.angle -= 1;
    }
    bird.angle = Phaser.Math.Clamp(bird.angle, -20, 20);
}

function addPipes() {
    const hole = Math.floor(Math.random() * 5) + 1;
    const bottomPipe = pipes.create(400, hole * 100, 'pipe');
    const topPipe = pipes.create(400, hole * 100 - 450, 'pipe');
    
    bottomPipe.body.velocity.x = -200;
    topPipe.body.velocity.x = -200;
    
    bottomPipe.body.allowGravity = false;
    topPipe.body.allowGravity = false;

    bottomPipe.checkWorldBounds = true;
    topPipe.checkWorldBounds = true;
    bottomPipe.outOfBoundsKill = true;
    topPipe.outOfBoundsKill = true;

    score += 1;
    scoreText.setText('Score: ' + score);
    this.pointSound.play();
}

function hitObstacle() {
    this.physics.pause();
    bird.setTint(0xff0000);
    gameOver = true;
    this.hitSound.play();

    // Game Over text
    this.add.text(200, 300, 'Game Over', { fontSize: '48px', fill: '#000' }).setOrigin(0.5);
    this.add.text(200, 350, 'Press Space to Restart', { fontSize: '24px', fill: '#000' }).setOrigin(0.5);

    // Reset on space key
    this.input.keyboard.once('keydown-SPACE', restartGame, this);
}

function flapBird() {
    bird.setVelocityY(-200);
    this.wingSound.play();
}

function restartGame() {
    score = 0;
    gameOver = false;
    this.scene.restart();
}
