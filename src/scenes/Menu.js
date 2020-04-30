class Menu extends Phaser.Scene {

    constructor() {
        super("menuScene");
    }
    
    preload() {
        // load title screen images
        this.load.image('title', './assets/tempTitle.png');
        this.load.image('back', './assets/back.png');
        this.load.audio('menuMusic', './assets/OnMyWay.mp3');
        this.load.audio('gameMusic', './assets/TheShowMustBeGo.mp3');
    }
    
    create() {

        // add title backdrop
        this.backdrop = this.add.tileSprite(0, 0, 960, 540, "back").setOrigin(0,0);

        let musicConfig = {
            mute: false,
            volume: .4,
            loop: true
        }

        
        if(!game.settings.tutorOpen){
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
            color: '#facade',
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
        this.titleCard = this.add.tileSprite (
            game.config.width/2, game.config.height/2-2*textSpacer,
            470, 175, "title"
        ).setOrigin(.5, .5);

       /* this.add.text(centerX, centerY-2*textSpacer, 
            'SHELVING CRISIS', titleConfig).setOrigin(0.5);*/

        // add titlescreen text
        this.add.text (
            centerX, centerY, 
            'Press ← to start Tutorial', menuConfig
        ).setOrigin(0.5);

        this.add.text (
            centerX, centerY+textSpacer, 
            'Press → to start Game', menuConfig
        ).setOrigin(0.5); 
        
        // titlescreen keyboard controls
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    
    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // go to tutorial
            //this.sound.play('name');
            game.settings.tutorOpen = true;
            this.scene.start("tutorialScene");
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            //go to game
            //this.sound.play('name');
            game.settings.bgm.stop();
            game.settings.tutorOpen = false;
            this.scene.start("playScene");
        }

        // scroll backdrop and titlecard
        this.backdrop.tilePositionX -= 2;
        this.backdrop.tilePositionY -= 1;
        this.titleCard.tilePositionX += 3;

    }

}