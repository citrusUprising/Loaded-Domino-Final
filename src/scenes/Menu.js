class Menu extends Phaser.Scene {

    constructor() {
        super("menuScene");
    }
    
    preload() {

        // load title screen image
        this.load.image('titleInit', 'assets/titleInit.png')
        this.load.spritesheet("title", "assets/titleScroll.png", {
            frameWidth: 1280, frameHeight :720,
            startFrame: 0, endFrame: 2
        });

        // load music
        this.load.audio('menuMusic', 'assets/bgm/OnMyWay.mp3');
        this.load.audio('gameMusic', 'assets/bgm/TheShowMustBeGo.mp3');

        // load sfx
		this.load.audio("sfxJump", ["assets/sfx/jump.mp3", "assets/sfx/jump.ogg"]);
		this.load.audio("sfxFall", ["assets/sfx/fall.mp3", "assets/sfx/fall.ogg"]);
		this.load.audio("sfxPlatform", ["assets/sfx/platform.mp3", "assets/sfx/platform.ogg"]);
		this.load.audio("sfxConsume", ["assets/sfx/consume.mp3", "assets/sfx/consume.ogg"]);

    }
    
    create() {

        this.backdrop = this.add.sprite(0, 0, "titleInit").setOrigin(0,0);
        
        this.anims.create({
            key: "tsAnimation",
            frames: this.anims.generateFrameNumbers("title", { start: 0, end: 2}),
            frameRate: 3,
            repeat: -1
        });

        this.backdrop.anims.play("tsAnimation");

        let musicConfig = {
            mute: false,
            volume: 0.5*game.settings.musicVolume,
            loop: true
        }

        if (!game.settings.tutorOpen) {
           game.settings.bgm = this.sound.add('menuMusic', musicConfig);
           game.settings.bgm.play();
        }
       /* let titleConfig = {
            fontFamily: 'Helvetica',
            fontSize: '60px',
            backgroundColor: '#000000',
            color: '#ffffff',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
            },
            fixedWidth: 0
        }*/

        // menu text config
        let menuConfig = {
            fontFamily: 'Helvetica',
            fontSize: '30px',
            backgroundColor: '#000000',
            color: '#de7183',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
            },
            fixedWidth: 0
        }

        //Location markers and text spacing
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 80;

        // add titlecard sprite
        /*this.titleCard = this.add.tileSprite (
            game.config.width/2, game.config.height/2-2*textSpacer,
            470, 175, "title"
        ).setOrigin(.5, .5);*/

       /* this.add.text(centerX, centerY-2*textSpacer, 
            'SHELVING CRISIS', titleConfig).setOrigin(0.5);*/

        // add titlescreen text
        
        this.add.text (
            centerX, centerY, 
            'Press ↑ to open Rules', menuConfig
        ).setOrigin(0.5);

        this.add.text (
            centerX, centerY+textSpacer, 
            'Press ← to change Settings', menuConfig
        ).setOrigin(0.5);

        this.add.text (
            centerX, centerY+2*textSpacer, 
            'Press → to start Game', menuConfig
        ).setOrigin(0.5); 

        this.add.text (
            centerX, centerY+3*textSpacer, 
            'Press ↓ to view Credits', menuConfig
        ).setOrigin(0.5); 
        
        // titlescreen keyboard controls
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); //check debugging only
    
    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {//check debugging only
            // go to tutorial
            //this.sound.play('name');
            game.settings.tutorOpen = true;
            this.scene.start("tutorialScene");
        }

        if (Phaser.Input.Keyboard.JustDown(keyUP)) {
            // go to rules
            //this.sound.play('name');
            game.settings.tutorOpen = true;
            this.scene.start("rulesScene");
        }
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // go to Settings
            //this.sound.play('name');
            game.settings.tutorOpen = true;
            this.scene.start("settingScene");
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            //go to game
            //this.sound.play('name');
            game.settings.bgm.stop();
            game.settings.tutorOpen = false;
            this.scene.start("playScene");
        }

        if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            // go to rules
            //this.sound.play('name');
            game.settings.tutorOpen = true;
            this.scene.start("creditScene");
        }

        // scroll backdrop and titlecard
        /*this.backdrop.tilePositionX -= 2;
        this.backdrop.tilePositionY -= 1;
        this.titleCard.tilePositionX += 3;*/

    }
}