class Settings extends Phaser.Scene {

    constructor() {
        super("settingScene");
    }

    preload() {

    }

    create() {

        // create transition overlay
        this.fader = this.add.rectangle (
            0, 0, game.config.width, game.config.height,
            0x000000
        ).setOrigin(0,0).setAlpha(1).setDepth(999);
        this.fading = "in";
        this.intent = false;

        this.backdrop = this.add.sprite(0, 0, "settingsBack").setOrigin(0,0);

        this.volSelect = true;

        let menuConfig = {
            fontFamily: 'Chelsea Market',
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

        this.add.text (
            centerX, centerY-3*textSpacer, 
            'Settings', menuConfig
        ).setOrigin(0.5);

        menuConfig.fontSize = '20px';
        menuConfig.color = '#facade';

        this.musText = this.add.text (
            centerX*.75, centerY+3*textSpacer, 
            'Music', menuConfig
        ).setOrigin(0.5);

        this.sfxText = this.add.text (
            centerX*1.25, centerY+3*textSpacer, 
            'SFX', menuConfig
        ).setOrigin(0.5);

        this.add.text (
            centerX, centerY+4*textSpacer, 
            '← and → to toggle setting, ↑ and ↓ to change', menuConfig
        ).setOrigin(0.5);

        menuConfig.color = '#e7d97d';

        this.add.text (
            centerX, centerY+5*textSpacer, 
            'Press [X] to return to menu', menuConfig
        ).setOrigin(0,0.5);

        this.initHeight = 260;
        this.musBar = this.add.rectangle(centerX*.75, centerY+2.5*textSpacer, 3*textSpacer, this.initHeight, 0xfacade).setOrigin(0.5, 1);
        this.sfxBar = this.add.rectangle(centerX*1.25, centerY+2.5*textSpacer, 3*textSpacer, this.initHeight, 0xfacade).setOrigin(0.5, 1);

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyBACK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    }

    update() {

        //ui update
        {
            this.musBar.setScale(1, game.settings.musicVolume);
            this.sfxBar.setScale(1, game.settings.effectVolume);
        
            if(this.volSelect){
                this.musBar.fillColor = 0xffe605;
                this.musText.setFill('#ffe605');
                this.sfxBar.fillColor = 0xfacade;
                this.sfxText.setFill('#facade');
            }else{
                this.musBar.fillColor = 0xfacade;
                this.musText.setFill('#facade');
                this.sfxBar.fillColor = 0xffe605;
                this.sfxText.setFill('#ffe605');
            }
        }

        if (this.fading == "in") {
            
            if (this.fader.alpha - game.settings.t8nSpeed <= 0) {
                // js lets me do this and im crazy enough to do it
                this.fading = false;
                this.fader.setAlpha(0);
                console.log(this.fader.alpha);
            } else {
                this.fader.setAlpha(this.fader.alpha - game.settings.t8nSpeed);
            }

        } else if (this.fading == "out") {

            if (this.fader.alpha + game.settings.t8nSpeed >= 1) {
                this.fading = false;
                this.fader.setAlpha(1);
                if (this.intent != false) {
                    switch (this.intent) {
                        case "menu":
                            this.scene.start("menuScene");
                            break;
                    }
                }
            } else {
                this.fader.setAlpha(this.fader.alpha + game.settings.t8nSpeed);
            }

        } else {

            //changes which setting is toggled
            if (Phaser.Input.Keyboard.JustDown(keyLEFT) || Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
                if (this.volSelect) {
                    this.volSelect = false;//sets to Effect Volume
                } else {
                    this.volSelect = true;//sets to Music Volume
                }
            }

            if (Phaser.Input.Keyboard.JustDown(keyUP)) {
                if (this.volSelect) {
                    game.settings.musicVolume += .1;
                    if (game.settings.musicVolume > 1) {
                        game.settings.musicVolume = 1;
                    }
                    game.settings.bgm.volume = .6*game.settings.musicVolume;
                } else {
                    game.settings.effectVolume += .1
                    if (game.settings.effectVolume > 1) {
                        game.settings.effectVolume = 1;
                    }
                    this.sound.play("sfxJump", {volume: 0.4*game.settings.effectVolume});
                }
            }

            if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
                if (this.volSelect) {
                    game.settings.musicVolume -= .1
                    if (game.settings.musicVolume < 0) {
                        game.settings.musicVolume = 0;
                    }
                    game.settings.bgm.volume = .6*game.settings.musicVolume;
                } else {
                    game.settings.effectVolume -= .1;
                    if (game.settings.effectVolume < 0) {
                        game.settings.effectVolume = 0;
                    }
                    this.sound.play("sfxJump", {volume: 0.4*game.settings.effectVolume});
                }
            }

            //X returns to menu
            if(Phaser.Input.Keyboard.JustDown(keyBACK)) {
                this.fading = "out";
                this.intent = "menu";
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
}