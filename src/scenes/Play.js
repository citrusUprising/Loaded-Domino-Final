class Play extends Phaser.Scene{
    constructor(){
        super("playScene");/*currently undefined*/
    }
    
    preload(){
		// load temp images
		this.load.image("player", "assets/player-temp.png");
		this.load.image("platform", "assets/platform-temp.png");
    }

    create(){
		
		// group for platform collisions
		this.platforms = this.physics.add.group();
		this.platforms.create(400, 400, "platform").setScale(4);
		
		// iterate through platforms group, set variables
		this.platforms.children.each(function(platform) {
			platform.body.allowGravity = false;
			platform.body.immovable = true;
			platform.setFrictionX(1);
		}, this);

		// add player with physics
		this.player = new Player(this, 20, 20, "player", 0);
		this.physics.add.existing(this.player);
		
		this.player.body.velocity.x = 150;
		this.player.body.velocity.y = 100;
		this.player.body.bounce.x = 0.2;
		this.player.body.bounce.y = 0.5;

		// add collisions
		this.physics.add.collider(this.player, this.platforms);
		
    }

    update(){
		
		// check if player died
		if (this.player.y < 0) {
			console.log("game over, eaten by void");
			this.scene.restart();
		} else if (this.player.y > game.config.height) {
			console.log("game over, fell of screen");
			this.scene.restart();
		}

    }
}
