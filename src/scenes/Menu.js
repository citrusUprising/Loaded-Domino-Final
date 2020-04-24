class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene");
    }
    
    preload(){
        /*this.load.audio('name', 'path');*/
        /*this.load.image('name', 'path');*/
        this.load.image('title', './assets/tempTitle.png');
        this.load.image('back', './assets/tempBack.png');
    }
    
    create(){

        this.backdrop = this.add.tileSprite(0, 0, 960, 540, "back").setOrigin(0,0);

        let titleConfig = {
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
        }

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

        this.titleCard = this.add.tileSprite
        (game.config.width/2, game.config.height/2-2*textSpacer, 470, 175, "title")
        .setOrigin(.5,.5);

       /* this.add.text(centerX, centerY-2*textSpacer, 
            'SHELVING CRISIS', titleConfig).setOrigin(0.5);*/
        this.add.text(centerX, centerY, 
            'Press ← to start Tutorial', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY+textSpacer, 
            'Press → to start Game', menuConfig).setOrigin(0.5); 
        
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyLEFT)){
            //tutorial
            //this.sound.play('name');
            this.scene.start("tutorialScene");
        }
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)){
            //game
            //this.sound.play('name');
            this.scene.start("playScene");
        }

        this.backdrop.tilePositionX -= 2;
        this.backdrop.tilePositionY -= 1;
        this.titleCard.tilePositionX +=3;
    }

}