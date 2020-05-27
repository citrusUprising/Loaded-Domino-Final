class Menu extends Phaser.Scene {

    constructor() {
        super("menuScene");
    }
    
    preload() {

        /*
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
        */

    }
    
    create() {

        // menu cursor location
        this.selected = "play";

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

        // menu text config
        let menuConfig = {
            fontFamily: 'Helvetica',
            fontSize: '30px',
            align: 'left',
            backgroundColor: '#000000',
            color: '#de7183',
            padding: {
                top: 10,
                bottom: 10,
            },
            fixedWidth: 0
        }

        //Location markers and text spacing
        let centerX = game.config.width/2 - 120;
        let centerY = game.config.height/2;
        
        this.textSpacer = 80;

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
            'Clock In', menuConfig
        )

        this.add.text (
            centerX, centerY+this.textSpacer, 
            'Training', menuConfig
        )

        this.add.text (
            centerX, centerY+2*this.textSpacer, 
            'Settings', menuConfig
        ) 

        this.add.text (
            centerX, centerY+3*this.textSpacer, 
            "Credits", menuConfig
        )
        
        // add selector
        this.selectorText = this.add.text (
            centerX-40, centerY, 
            ' • ', menuConfig
        )


        // titlescreen keyboard controls
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keySELECT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z); //check debugging only
    
    }

    update() {

        //if (Phaser.Input.Keyboard.JustDown(keySPACE)) {//check debugging only
            // go to tutorial
            //this.sound.play('name');
        //    game.settings.tutorOpen = true;
        //    this.scene.start("tutorialScene");
        //}

        if (Phaser.Input.Keyboard.JustDown(keyUP)) {
            switch (this.selected) {
                case "tutorial":
                    this.selected = "play";
                    this.selectorText.y -= this.textSpacer;
                    break;
                case "settings":
                    this.selected = "tutorial";
                    this.selectorText.y -= this.textSpacer;
                    break;
                case "credits":
                    this.selected = "settings";
                    this.selectorText.y -= this.textSpacer;
                    break;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            switch (this.selected) {
                case "play":
                    this.selected = "tutorial";
                    this.selectorText.y += this.textSpacer;
                    break;
                case "tutorial":
                    this.selected = "settings";
                    this.selectorText.y += this.textSpacer;
                    break;
                case "settings":
                    this.selected = "credits";
                    this.selectorText.y += this.textSpacer;
                    break;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(keySELECT)) {
            switch (this.selected) {
                case "play":
                    game.settings.bgm.stop();
                    game.settings.tutorOpen = false;
                    this.scene.start("playScene");
                    break;
                case "tutorial":
                    game.settings.tutorOpen = true;
                    this.scene.start("tutorialScene");
                    break;
                case "settings":
                    game.settings.tutorOpen = true;
                    this.scene.start("settingScene");
                    break;
                case "credits":
                    game.settings.tutorOpen = true;
                    this.scene.start("creditScene");
                    break;
            }
        }

        /*
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
        */

    }
}