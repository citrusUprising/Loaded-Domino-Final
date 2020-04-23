class Platform extends Phaser.GameObjects.Sprite{
	
    constructor(scene, x, y, w, h, texture, frame){
        super(scene, x, y, texture, frame);
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
    }
    
    update(){
        
    }

}
