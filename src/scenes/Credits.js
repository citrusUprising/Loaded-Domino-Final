class Credits extends Phaser.Scene {

    constructor() {
        super("creditScene");
    }

    preload() {

    }

    create() {

        this.backdrop = this.add.sprite(0, 0, "settingsBack").setOrigin(0,0);

        let menuConfig = {
            fontFamily: 'Helvetica',
            fontSize: '30px',
            color: '#e7d97d',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
            },
            fixedWidth: 0
        }

        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 40;

        this.omw = 'On My Way by Kevin MacLeod'
        this.tsmbg = 'The Show Must Be Go by Kevin MacLeod'

        this.add.text (
            centerX, centerY-3*textSpacer, 
            'Credits', menuConfig
        ).setOrigin(0.5);

        menuConfig.fontSize = '20px';
        menuConfig.color = '#facade';
        
        this.add.text (
            centerX*(.66), centerY-2*textSpacer, 
            'Coding: Sean Noelle, Camellia Shea', menuConfig
        ).setOrigin(0.5);

        this.add.text (
            centerX*(.66), centerY-textSpacer, 
            'Art Assets: Josepheng Xiong', menuConfig
        ).setOrigin(0.5);
        
        this.add.text (
            centerX*(.66), centerY, 
            'SFX: Camellia Shea', menuConfig
        ).setOrigin(0.5);

        this.add.text (
            centerX*(.66), centerY+textSpacer, 
            'Debugging: Camellia Shea', menuConfig
        ).setOrigin(0.5);

        menuConfig.color = '#de7183';

        this.add.text (
            centerX*1.33, centerY-2*textSpacer, 
            'Music', menuConfig
        ).setOrigin(0.5);

        menuConfig.color = '#facade';
        
        this.add.text (
            centerX*1.33, centerY-textSpacer, 
            'Menu: '+this.omw, menuConfig
        ).setOrigin(0.5);
        console.log(this.omw+': https://incompetech.filmmusic.io/song/4163-on-my-way');

        this.add.text (
            centerX*1.33, centerY, 
            'Game: '+this.tsmbg, menuConfig
        ).setOrigin(0.5);
        console.log(this.tsmbg+': https://incompetech.filmmusic.io/song/4509-the-show-must-be-go');

        this.add.text (
            centerX*1.33, centerY+textSpacer, 
            'License: Attribution 4.0 International (CC BY 4.0)', menuConfig
        ).setOrigin(0.5);
        console.log('License: http://creativecommons.org/licenses/by/4.0/');

        this.add.text (
            centerX, centerY+3*textSpacer, 
            'Hit F12 for links', menuConfig
        ).setOrigin(0.5);

        menuConfig.color = '#de7183';

        this.add.text (
            centerX, centerY+4*textSpacer, 
            'Press [X] to return to menu', menuConfig
        ).setOrigin(0.5);

        keyBACK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    }

    update() {

            //back returns to menu
            if(Phaser.Input.Keyboard.JustDown(keyBACK)) {
                this.scene.start("menuScene");
            }
            /*
            //right starts game
            if(Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
                game.settings.bgm.stop();
                game.settings.tutorOpen = false;
                this.scene.start("playScene");
            }
            */
        
    }
}