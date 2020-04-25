class Play extends Phaser.Scene{
    constructor(){
        super("playScene");/*currently undefined*/
    }
    
    preload(){
		// load temp images
		this.load.image("player", "assets/char.png");
        this.load.image("platform", "assets/rampsmall.png");
        this.load.image("backDrop", "assets/ware.png");
    }

    create(){

        this.background = this.add.tileSprite(0, 0, 960, 540, "backDrop").setOrigin(0,0);
        this.scroll = 1; //speed of scrolling
        

		// group for platform collisions
		this.platforms = this.physics.add.group(); //shift to platform class??
		this.platforms.create(400, 400, "platform").setScale(1);
		
		// iterate through platforms group, set variables
		this.platforms.children.each(function(platform) {
			platform.body.allowGravity = false;
            platform.body.immovable = true;
			platform.setFrictionX(1);
		}, this);

        this.physics.world.setBounds(0, -100, game.config.width, game.config.height+200);//sets world bounds with vertical pockets for game over

		// add player with physics
		this.player = new Player(this, 150, 150, "player", 0);
		this.physics.add.existing(this.player);
		
		this.player.body.velocity.x = 150;
		this.player.body.velocity.y = 100;
		this.player.body.bounce.x = 0.2;
        this.player.body.bounce.y = 0.1;
        //this.player.body.maxVelocity = 200;
        this.player.body.collideWorldBounds = true; //currently prevents player from falling through world bottom, remedy

		// add collisions
        this.physics.add.collider(this.player, this.platforms);
        this.isCollided = this.physics.world.collide(this.player, this.platform);
        
        this.gameoverTop = false;//seperate gameover variables depending on death
        this.gameoverBot = false;

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
		
    }

    update(){

        if (!this.gameoverTop&&!this.gameoverBot){ //updates scrolling background
            this.background.tilePositionY += this.scroll;
            this.player.update();
          }

          this.isCollided = this.physics.world.collide(this.player, this.platform);//does not change to true flag
          //console.log(this.isCollided);
          if(this.isCollided) this.player.isJump = false;
          else this.player.isJump = true;
          //add code to change this.player.isJump to false when colliding with a platform and true otherwise

          if(this.player.isTurn){ //flips sprite when player turns
            console.log('turning');
            //this.player.anchor.setTo(.5,.5); //code currently broken
            //this.player.scale.x *= -1; //user hackenstein on html5gamedevs.com https://www.html5gamedevs.com/topic/1582-horizontal-sprite-flip/
            this.player.isTurn = false;
        }
          
		// check if player died
		if (this.player.y < 0) {//to be changed to collision with ooze //(this.player.body.overlapY>0)
            console.log("game over, eaten by void"); //prints infinitely, adjust
            this.gameoverTop=true;
			//this.scene.restart();
		} else if (this.player.y > game.config.height) {
            console.log("game over, fell of screen"); //prints infinitely, adjust
            this.gameoverBot=true;
			//this.scene.restart();
        }
        
        if (this.gameoverTop||this.gameoverBot){ //gameover, turns off player movement, allows scene to be reset with right arrow key
            this.player.body.velocity.x = 0;
		    this.player.body.velocity.y = 0;
		    this.player.body.bounce.x = 0;
            this.player.body.bounce.y = 0;
            this.player.body.allowGravity = false;
            if(Phaser.Input.Keyboard.JustDown(keyRIGHT)){
                this.scene.restart();
            }
            if(Phaser.Input.Keyboard.JustDown(keyLEFT)){//returns to menu
                this.scene.start("menuScene");
            }
        }

    }
}
