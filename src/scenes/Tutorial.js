class Tutorial extends Phaser.Scene {

    constructor() {
        super("tutorialScene");
    }

    preload() {

    }

    create() {

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
            centerX, centerY-2*textSpacer, 
            'Keep your job while surviving a panic attack!', menuConfig
        ).setOrigin(0.5);
        
        this.add.text (
            centerX, centerY-textSpacer, 
            'Descend the shelves using (Left) and (Right) to move', menuConfig
        ).setOrigin(0.5);

        this.add.text (
            centerX, centerY, 
            'and Space to jump!', menuConfig
        ).setOrigin(0.5);
        
        this.add.text (
            centerX, centerY+textSpacer, 
            'Be careful not to fall off the shelves', menuConfig
        ).setOrigin(0.5);
        
        this.add.text (
            centerX, centerY+2*textSpacer, 
            'or be consumed by your own existential dread.', menuConfig
        ).setOrigin(0.5);

        this.add.text (
            centerX, centerY+3*textSpacer, 
            '(Left) Menu (Right) Start Shift', menuConfig
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