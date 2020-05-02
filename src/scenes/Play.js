class Play extends Phaser.Scene {

    constructor() {
        super("playScene");
    }
    
    preload() {

		// load temp images
		//this.load.image("player", "assets/char.png");
        //this.load.image("platform", "assets/rampsmall.png");
        this.load.image("backDrop", "assets/ware.png");
        this.load.image("void", "assets/void.png");

        // load sprite atlas
        this.load.atlas("sprites", "assets/spritesheet.png", "assets/sprites.json");
        this.load.spritesheet("void1", "assets/void1.png", {frameWidth: 960, frameHeight :1050, startFrame: 0,
            endFrame: 6});
    }

    create(){

        // create warehouse backdrop
        this.background = this.add.tileSprite(0, 0, 960, 540, "backDrop").setOrigin(0,0);
        this.background.setDepth(-999);

        this.anims.create({
            key: 'voider',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('void1', { start: 0, end: 6, first: 0}),
            frameRate: 12
        });
        
		// create animations
		this.anims.create({
			key: "playerRun",
			frames: this.anims.generateFrameNames("sprites", {
				prefix: "run",
				start: 1,
				end: 24,
                zeroPad: 0
			}),
            frameRate: 60,
            repeat: -1
        });

        this.anims.create({
			key: "playerIdle",
			frames: this.anims.generateFrameNames("sprites", {
				prefix: "run",
				start: 1,
				end: 1,
                zeroPad: 0
			}),
		});

        //sets up music
        let musicPlayConfig = {
            mute: false,
            volume: .6,
            loop: true
        }

        musicPlayConfig.volume = .6;

         if (!game.settings.playing) {
            this.bgm = this.sound.add('gameMusic', musicPlayConfig);
            this.bgm.play();
        }
        game.settings.playing = true;
        
        //speed of scrolling
        this.scroll = 1;
        this.platMod = -60;   
        this.score = 0;   

        //platform generation
        this.xL = 0;
        this.xR = game.config.width;
        
        this.speedTimer = this.time.addEvent ({
            delay: 1000,
            callback: this.scoreUp/*(this.score, this.speed)*/,
            callbackScope: this,
            loop: true
        });

		// group for platform collisions
        this.platforms = this.physics.add.group(); //shift to platform class??
        
        // starting platform
		this.platforms.create(game.config.width/2, game.config.height+50, "sprites", "rampsmall").setScale(1);
		
		// iterate through platforms group, set variables
		this.platforms.children.each(function(platform) {
			platform.body.allowGravity = false;
            platform.body.immovable = true;
            platform.body.velocity.y = this.platMod*this.scroll;
            platform.setFrictionX(1);
		}, this);

        // add timer for spawning platforms (possibly temporary method?)
        this.platformTimer = this.time.addEvent ({
            delay: 3000, 
            callback: this.makePlatform,
            callbackScope: this,
            loop: true
        });

        //sets world bounds with vertical pockets for game over
        this.physics.world.setBounds(0, -100, game.config.width, game.config.height+200);

		// add player with physics
		this.player = new Player(this, game.config.width/2, 150, "sprites", "run1");
		this.physics.add.existing(this.player);
		
		this.player.body.bounce.x = 0.0;
        this.player.body.bounce.y = 0.0;
        this.player.body.collideWorldBounds = true; 

		// add collisions
        this.physics.add.collider(this.player, this.platforms, this.playerHitPlatform, null, this);

        //separate gameover variables depending on death
        this.gameoverTop = false;
        this.gameoverBot = false;

        // OOZE or VOID creation
        this.void = new Ooze(this, 0, 0, 'void', 0).setOrigin(0, 1);

        let menuConfig = {
            fontFamily: 'Helvetica',
            fontSize: '30px',
            backgroundColor: '#000000',
            color: '#facade',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
            },
            fixedWidth: 100
        }

        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 80;


        this.scoreBoard = this.add.text (0, 0, this.score, menuConfig);

        // assign keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

    }

    update() {

        this.platforms.children.each(function(platform) {
            platform.setDepth(-998);
        }, this);
        
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
                //console.log('turning');
                this.player.toggleFlipX();
                this.player.isTurn = false;
            }

            // check if player died
            if (this.player.y < this.void.y) {

                //console.log("game over, eaten by void");
                this.finScore = this.score;
                this.gameoverTop = true;
                this.sound.play("sfxConsume", {volume: 0.25});

            } else if (this.player.y > game.config.height+50) {

                //console.log("game over, fell off screen");
                this.finScore = this.score;
                this.gameoverBot = true;
                this.sound.play("sfxFall", {volume: 0.25});

            }

            this.scoreBoard.setText(this.score);
    
        // else, if player's dead
        } else {

            this.bgm.volume =.2;

            // game over!
            //this.menuConfig.fixedWidth = 0; //flag

            let GOConfig = {
                fontFamily: 'Helvetica',
                fontSize: '50px',
                color: '#e81e40',
                align: 'center',
                padding: {
                    top: 10,
                    bottom: 10,
                },
                fixedWidth: 0
            }
            let textSpacer = 60;

            this.scoreBoard.setVisible(false);

            //Game Over stats
            this.add.rectangle(game.config.width/2, game.config.height/2, 500, 360, 0x000000).setOrigin(.5);
            this.add.text (game.config.width/2, game.config.height/2-2*textSpacer, 'Game Over', GOConfig).setOrigin(0.5);
            GOConfig.fontSize = '30px';
            GOConfig.color = '#facade';
            if(this.gameoverTop)this.add.text (game.config.width/2, game.config.height/2-textSpacer, 'You succumbed to anxiety', GOConfig).setOrigin(0.5);
            else if (this.gameoverBot)this.add.text (game.config.width/2, game.config.height/2-textSpacer, 'You fell to your death', GOConfig).setOrigin(0.5);
            this.add.text (game.config.width/2, game.config.height/2, 'You worked for a total of '+this.finScore+' seconds', GOConfig).setOrigin(0.5);
            GOConfig.color = '#de7183';
            this.add.text (game.config.width/2, game.config.height/2+textSpacer, 'Press ↑ to try again', GOConfig).setOrigin(0.5);
            this.add.text (game.config.width/2, game.config.height/2+2*textSpacer, 'Press ↓ to return to menu', GOConfig).setOrigin(0.5);

            if (this.gameoverTop)game.settings.oozeSpeed = 10;

            // turn off player movement
            this.player.body.velocity.x = 0;
		    this.player.body.velocity.y = 0;
		    this.player.body.bounce.x = 0;
            this.player.body.bounce.y = 0;
            this.player.body.allowGravity = false;

            // stop platforms
            this.platformTimer.paused = true;

            // stop ooze/void
            //game.settings.oozeSpeed = 0;

            this.platforms.children.each(function(platform) {
                platform.body.velocity.y = 0;
            }, this);

            // reset scene
            if (Phaser.Input.Keyboard.JustDown(keyUP)) {
                game.settings.oozeSpeed = 0;
                this.bgm.volume =.6;
                this.scene.restart();           
            }
            if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
                game.settings.playing = false;
                this.bgm.stop();
                game.settings.oozeSpeed = 0;
                this.scene.start("menuScene");
            }
        } 

        //moves void, but not past screen
        if(this.void.y < game.config.height+100&&!this.gameoverBot)this.void.update();
        else  game.settings.oozeSpeed = 0;

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

        let sx = Phaser.Math.RND.between(this.xL, this.xR);
        this.xL = sx-(game.config.width*2/3);
        if (this.xL < -25)this.xL = -25;
        this.xR = sx+(game.config.width*2/3);
        if (this.xR > game.config.width+25)this.xR = game.config.width+25;
        //console.log(sx);

        let platform = this.platforms.create(sx, game.config.height+50, "sprites", "rampsmall");

        platform.setScale(1);
        platform.body.allowGravity = false;
        platform.body.immovable = true;
        platform.body.velocity.y = this.platMod*this.scroll;
        platform.setFrictionX(1);

    }

    scoreUp() {
        
        if (!this.gameOverBot && !this.gameOverTop) {
        
            this.score++;
        
            if ((this.scroll < 2) && (this.score%20 == 0) && (this.score > 0)) {
                
                this.scroll += 0.2;
                this.platformTimer.timeScale = 1 + (0.2*this.scroll);
                
                //update speed of existing platforms
                //code provided by Ben Rosien in the discord channel
                this.platforms.getChildren().forEach(function (platform) {
                    platform.body.velocity.y = this.scroll*this.platMod;
                }, this);

                game.settings.oozeSpeed = 0;

            } else if ((this.score%20 == 10) && (this.void.y < (game.config.height/4))) {
        
                game.settings.oozeSpeed = 0.05;
        
            }
    
        }
    
    }

}