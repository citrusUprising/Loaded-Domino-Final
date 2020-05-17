class Player extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame) {

        super(scene, x, y, texture, frame);

        scene.add.existing(this);

        // save scene in var so we can reference it
        this.scene = scene;

        this.speed = 300;
        this.jumpHeight = -450;
        this.hasBox = false;

        //this.speedUp = 400;
        //this.maxSpeed = 800;

        this.isJump = true; 
        this.isTurn = false;
        this.isRight = true;
        this.isShelve = false;
        this.isMop = false;

    }

    update() {

        //// player movement ////

        // speed up in direction if holding left or right
        if (keyLEFT.isDown && !keyRIGHT.isDown) {
            //this.body.acceleration.x = -this.speedUp;
            this.body.velocity.x = -this.speed; //flag audio?
        } else if (keyRIGHT.isDown && !keyLEFT.isDown) {
            //this.body.acceleration.x = this.speedUp;
            this.body.velocity.x = this.speed; //flag audio?
        }

        //limit speed if carrying a box
        if(this.isShelve||this.isMop)this.speed = 0;
        else if(this.hasBox)this.speed = 250;
        else this.speed = 300;

        /*
        // limit speed to this.maxSpeed
        if (this.body.velocity.x > this.maxSpeed) {
            this.body.velocity.x = this.maxSpeed;
        } else if (this.body.velocity.x < -this.maxSpeed) {
            this.body.velocity.x = -this.maxSpeed;
        }
        */
       if(this.isShelve)this.anims.play("playerShelve");
       else if(this.isMop)this.anims.play("playerClean");
       else{
            if (this.isJump) {
                if(this.hasBox)this.anims.play("boxAir", true);
                else this.anims.play("playerAir", true);
            } else if(keyLEFT.isDown || keyRIGHT.isDown){
                if(this.hasBox)this.anims.play("boxRun", true);
                else this.anims.play("playerRun", true); //flag error, rapidly switches between run and jump
            }else{
                if(this.hasBox)this.anims.play("boxIdle");
                else this.anims.play("playerIdle");
            }
        }


        if (this.isRight && keyLEFT.isDown && !keyRIGHT.isDown) {
            this.isTurn = true;
            this.isRight = false;
        } else if (!this.isRight && keyRIGHT.isDown && !keyLEFT.isDown) {
            this.isTurn = true;
            this.isRight = true;
        } else {
            this.isTurn = false;
        }

        // player will slow to a stop with no input
        /*
        if (!keyLEFT.isDown && !keyRIGHT.isDown) {
            if (this.body.velocity.x < 0) {
                this.body.acceleration.x = this.speedUp;
            }
            if (this.body.velocity.x > 0) {
                this.body.acceleration.x = -this.speedUp; 
            }
        }
        */

        // player will stop with no input
        if (!keyLEFT.isDown && !keyRIGHT.isDown) {
            this.body.velocity.x = 0;
        }

        // jump!
        if (!this.isJump && !this.isShelve && !this.isMop && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.body.velocity.y = this.jumpHeight;
            this.isJump = true;
            this.scene.sound.play("sfxJump", {volume: 0.4*game.settings.effectVolume});
        }
        
    }

}