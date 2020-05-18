class Tutorial extends Phaser.Scene {

    constructor() {
        super("tutorialScene");
    }

    preload() {
        // load sprite atlas
        this.load.atlas("sprites", "assets/spritesheet.png", "assets/sprites.json");

    }

    create() {

        this.anims.create({ 
			key: "smell",
			frames: this.anims.generateFrameNames("sprites", {
				prefix: "mess",
				start: 1,
				end: 4,
                zeroPad: 0
			}),
            frameRate: 30, //flag
            repeat: -1
        });

        this.anims.create({
			key: "customerBump",
			frames: this.anims.generateFrameNames("sprites", {
				prefix: "customerMad",
				start: 1,
				end: 11,
                zeroPad: 0
			}),
            frameRate: 14,
            repeat: -1
        }); 

        this.comeplete = false;

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

        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 60;

        this.add.text (
            centerX, centerY-5*textSpacer, 
            'Keep your job while surviving a panic attack!', menuConfig
        ).setOrigin(0.5);
        
        this.add.text (
            centerX, centerY-4*textSpacer, 
            'Descend the shelves using ← and → to move', menuConfig
        ).setOrigin(0.5);

        this.add.text (
            centerX, centerY-3*textSpacer, 
            '[Z] to jump, and [X] to interact', menuConfig
        ).setOrigin(0.5);

        this.add.text (
            centerX*3/4, centerY-textSpacer, 
            'Bring Boxes to Shelves', menuConfig
        ).setOrigin(0.5);

        this.box = this.add.sprite((centerX*5/4)-50, centerY-textSpacer, 'sprites', 'Box').setOrigin(.5);
        this.shelf = this.add.sprite((centerX*5/4)+50, centerY-textSpacer, 'sprites', 'ShelfEmpty').setOrigin(.5,.75);

        this.add.text (
            centerX*3/4, centerY, 
            'Clean up messes', menuConfig
        ).setOrigin(0.5);

        this.mess = this.add.sprite(centerX*5/4, centerY, 'sprites', 'mess1').setOrigin(.5);
        this.mess.anims.play('smell');

        this.add.text (
            centerX*3/4, centerY+textSpacer, 
            'Avoid bumping into customers', menuConfig
        ).setOrigin(0.5);

        this.customer = this.add.sprite(centerX*5/4, centerY+textSpacer, 'sprites', 'customerIdle').setOrigin(.5);
        this.customer.anims.play('customerBump');
        
        this.add.text (
            centerX, centerY+3*textSpacer, 
            'Be careful not to fall off the shelves', menuConfig
        ).setOrigin(0.5);
        
        this.add.text (
            centerX, centerY+4*textSpacer, 
            'or be consumed by your own existential dread.', menuConfig
        ).setOrigin(0.5);

        menuConfig.color = '#de7183';

        this.add.text (
            centerX, centerY+5*textSpacer, 
            '← Menu   → Start Shift', menuConfig
        ).setOrigin(0.5);

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    }

    update() {

        this.comeplete = true;

        if (this.comeplete) {

            //left returns to menu
            if(Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                this.scene.start("menuScene");
            }
            //right starts game
            if(Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
                game.settings.bgm.stop();
                game.settings.tutorOpen = false;
                this.scene.start("playScene");
            }

        }
        
    }
}