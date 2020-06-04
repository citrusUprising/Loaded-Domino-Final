class Customer extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame) {

        super(scene, x, y, texture, frame);

        scene.add.existing(this);

        // save scene in var so we can reference it
        this.scene = scene;

        //this.anims.play("customerWalk", true);
        this.isFlipped = false;
        this.run = 4000; //the duration a customer walks in one direction

            this.turnTimer = this.scene.time.addEvent ({
                delay: this.run,
                callback: this.flip,
                callbackScope: this,
                loop: true
            });

    }

    update(){
        //updates scroll
        if(!this.scene.gameoverTop&&!this.scene.gameoverBot) this.body.velocity.y = this.scene.scroll*this.scene.platMod;
        else this.body.velocity.y = 0;

        //checks for death
        if (this.y < this.scene.ooze.y-this.height) {
            this.destroy();
        }else{
             //flips to walk
            if (this.isFlipped) {
                this.setFlipX(true);
                this.body.velocity.x = -50;
            } else {
                this.setFlipX(false);
                this.body.velocity.x = 50;
            }
        }


    }

    flip(){
        this.isFlipped = !this.isFlipped
    }
}