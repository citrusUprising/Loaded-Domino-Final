class Settings extends Phaser.Scene {

    constructor() {
        super("settingScene");
    }

    preload() {

    }

    create() {

        this.volSelect = true;

        let menuConfig = {
            fontFamily: 'Helvetica',
            fontSize: '30px',
            backgroundColor: '#000000',
            color: '#e81e40',
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
            centerX, centerY-5*textSpacer, 
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
            'SPACE to toggle setting, ↑ to increase, ↓ to decrease', menuConfig
        ).setOrigin(0.5);

        menuConfig.color = '#de7183';

        this.add.text (
            centerX, centerY+5*textSpacer, 
            '← Menu   → Start Shift', menuConfig
        ).setOrigin(0.5);

        this.initHeight = 260;
        this.musBar = this.add.rectangle(centerX*.75, centerY+2.5*textSpacer, 3*textSpacer, this.initHeight, 0xfacade).setOrigin(0.5, 1);
        this.sfxBar = this.add.rectangle(centerX*1.25, centerY+2.5*textSpacer, 3*textSpacer, this.initHeight, 0xfacade).setOrigin(0.5, 1);

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyJUMP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }

    update() {

        //ui update
        {
            this.musBar.setScale(1, game.settings.musicVolume);
            this.sfxBar.setScale(1, game.settings.effectVolume);
        
            if(this.volSelect){
                this.musBar.fillColor = 0xf71669;
                this.musText.setFill('#f71669');
                this.sfxBar.fillColor = 0xfacade;
                this.sfxText.setFill('#facade');
            }else{
                this.musBar.fillColor = 0xfacade;
                this.musText.setFill('#facade');
                this.sfxBar.fillColor = 0xf71669;
                this.sfxText.setFill('#f71669');
            }
        }

           //changes which setting is toggled
           if(Phaser.Input.Keyboard.JustDown(keyJUMP)){
                if(this.volSelect)this.volSelect = false;//sets to Effect Volume
               else this.volSelect = true;//sets to Music Volume
            }

           if(Phaser.Input.Keyboard.JustDown(keyUP)){
            if(this.volSelect){
                game.settings.musicVolume += .1
                if(game.settings.musicVolume > 1)game.settings.musicVolume=1;
                game.settings.bgm.volume =.6*game.settings.musicVolume;
                }else{
                game.settings.effectVolume += .1
                if(game.settings.effectVolume > 1)game.settings.effectVolume=1;
                this.sound.play("sfxJump", {volume: 0.4*game.settings.effectVolume});
                }
            }

           if(Phaser.Input.Keyboard.JustDown(keyDOWN)){
            if(this.volSelect){
                game.settings.musicVolume -= .1
                if(game.settings.musicVolume < 0)game.settings.musicVolume=0;
                game.settings.bgm.volume =.6*game.settings.musicVolume;
                }else{
                game.settings.effectVolume -= .1
                if(game.settings.effectVolume < 0)game.settings.effectVolume=0;
                this.sound.play("sfxJump", {volume: 0.4*game.settings.effectVolume});
                }
            }

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