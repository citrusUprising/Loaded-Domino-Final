class Player extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        this.speed = 200;
        this.speedUp = 400;
        this.isJump = true;
        this.isTurn = true;
        this.isRight = true;

    }
    update(){
        if(keyLEFT.isDown)this.body.acceleration.x=-this.speedUp;//player movement
        if(keyRIGHT.isDown)this.body.acceleration.x=this.speedUp;

        if(this.isRight&&keyLEFT.isDown){
            this.isTurn = true;
            this.isRight = false;
        }
        if(!this.isRight&&keyRIGHT.isDown){
            this.isTurn = true;
            this.isRight = true;
        }
       
        if(!keyLEFT.isDown && !keyRIGHT.isDown){//player will skow to a stop with no input
            if(this.body.velocity.x < 0)this.body.acceleration.x=this.speedUp;
            if(this.body.velocity.x > 0)this.body.acceleration.x=-this.speedUp; 
        } 

        if(!this.isJump&&Phaser.Input.Keyboard.JustDown(keySPACE)){
            this.body.velocity.y = -200;
            this.isJump = true;
        }
    }
}