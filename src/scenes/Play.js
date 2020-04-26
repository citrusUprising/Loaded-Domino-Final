class Play extends Phaser.Scene {

    constructor() {
        super("playScene");
    }
    
    preload() {
		// load temp images
		this.load.image("player", "assets/char.png");
        this.load.image("platform", "assets/rampsmall.png");
        this.load.image("backDrop", "assets/ware.png");
    }

    create(){

        // create warehouse backdrop
        this.background = this.add.tileSprite(0, 0, 960, 540, "backDrop").setOrigin(0,0);
        //speed of scrolling
        this.scroll = 1;         

		// group for platform collisions
        this.platforms = this.physics.add.group(); //shift to platform class??
        
        // starting platform
		this.platforms.create(game.config.width/2, game.config.height+50, "platform").setScale(1);
		
		// iterate through platforms group, set variables
		this.platforms.children.each(function(platform) {
			platform.body.allowGravity = false;
            platform.body.immovable = true;
            platform.body.velocity.y = -100;
            platform.setFrictionX(1);
		}, this);

        // add timer for spawning platforms (possibly temporary method?)
        this.platformTimer = this.time.addEvent ({
            delay: 2000,
            callback: this.makePlatform,
            callbackScope: this,
            loop: true
        });

        //sets world bounds with vertical pockets for game over
        this.physics.world.setBounds(0, -100, game.config.width, game.config.height+200);

		// add player with physics
		this.player = new Player(this, game.config.width/2, 150, "player", 0);
		this.physics.add.existing(this.player);
		
		this.player.body.bounce.x = 0.0;
        this.player.body.bounce.y = 0.0;
        this.player.body.collideWorldBounds = true; //currently prevents player from falling through world bottom, remedy

		// add collisions
        this.physics.add.collider(this.player, this.platforms, this.playerHitPlatform, null, this);

        //separate gameover variables depending on death
        this.gameoverTop = false;
        this.gameoverBot = false;

        // assign keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
		
    }

    update() {

        // if player hasn't died yet
        if (!this.gameoverTop && !this.gameoverBot) {
 
            // update scrolling background
            this.background.tilePositionY += this.scroll;
 
            // update player
            this.player.update();
            this.player.isJump = true;

            // destroy off-screen platforms 
            this.platforms.children.each(function(platform) {
                if (platform.y < -platform.height) {
                    platform.destroy();
                }
            }, this);

            //flip sprite when player turns
            if (this.player.isTurn) { 
                console.log('turning');
                this.player.toggleFlipX();
                this.player.isTurn = false;
            }
            
            // check if player died
            if (this.player.y < -50) { //to be changed to collision with ooze //(this.player.body.overlapY>0)
                console.log("game over, eaten by void"); //prints infinitely, adjust
                this.gameoverTop=true;
                //this.scene.restart();
            } else if (this.player.y > game.config.height+50) {
                console.log("game over, fell of screen"); //prints infinitely, adjust
                this.gameoverBot=true;
                //this.scene.restart();
            }
    
        // else, if player's dead
        } else {

            // game over!

            // turn off player movement
            this.player.body.velocity.x = 0;
		    this.player.body.velocity.y = 0;
		    this.player.body.bounce.x = 0;
            this.player.body.bounce.y = 0;
            this.player.body.allowGravity = false;

            // stop platforms
            this.platformTimer.paused = true;

            this.platforms.children.each(function(platform) {
                platform.body.velocity.y = 0;
            }, this);

            // reset scene
            if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
                this.scene.restart();
            }
            if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                this.scene.start("menuScene");
            }
        }

    }

    // callback if player lands on platform
    playerHitPlatform(player, platform) {

        // make sure player is on top of platform
        if ((player.y + player.height) < platform.y) {
            player.isJump = false;
        }

    }

    // spawn platform randomly at bottom of screen
    makePlatform() {

        let sx = Phaser.Math.RND.between(-50, game.config.width+50);
        console.log(sx);

        let platform = this.platforms.create(sx, game.config.height+50, "platform");

        platform.setScale(1);
        platform.body.allowGravity = false;
        platform.body.immovable = true;
        platform.body.velocity.y = -100;
        platform.setFrictionX(1);

    }

}