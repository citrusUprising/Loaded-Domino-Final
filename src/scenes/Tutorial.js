class Tutorial extends Phaser.Scene{
    constructor(){
        super("tutorialScene");/*currently undefined*/
    }
      
    preload(){

    }

    create(){

        this.comeplete = false;

        //console.log(this);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update(){
        this.comeplete = true;

        if(this.comeplete){
            if(Phaser.Input.Keyboard.JustDown(keyLEFT)){//left returns to menu
                this.scene.start("menuScene");
            }
            if(Phaser.Input.Keyboard.JustDown(keyRIGHT)){//right starts game
                this.scene.start("playScene");
            }
        }
    }
}