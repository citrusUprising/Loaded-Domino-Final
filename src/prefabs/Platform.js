class Platform extends Phaser.GameObjects.Sprite{
	
    constructor(scene, x, y, w, h, texture, frame, speed){
        super(scene, x, y, texture, frame);
		this.x = x;
		this.y = y;
		this.width = w;
        this.height = h;
        this.speed = 1;
    }
    
    update(){

        this.y -= this.speed; //moves platform up based on speed

        if (this.y<0) delete this;//destroys platforms past the top of the screen, untested
    }

}
