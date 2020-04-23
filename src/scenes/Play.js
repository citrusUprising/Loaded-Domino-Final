class Play extends Phaser.Scene{
    constructor(){
        super("playScene");/*currently undefined*/
    }
    
    preload(){
		// load temp images
		this.load.image("player", "assets/player-temp.png");
    }

    create(){
		this.player = new Player(this, 20, 20, "player", 0);
		this.physics.add.existing(this.player);
		
		this.player.body.velocity.x = 100;
		this.player.body.velocity.y = 100;
		this.player.body.bounce.x = 1;
		this.player.body.bounce.y = 1;
		this.player.body.collideWorldBounds = true;
    }

    update(){
		
    }
}
