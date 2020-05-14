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

        // load void spritesheet
        this.load.spritesheet("void1", "assets/void1.png", {
            frameWidth: 960, frameHeight :1050,
            startFrame: 0, endFrame: 29
        });
    }

    create(){

        //speed of scrolling
        this.scroll = 1;

        //mltiplier applied to platform scrolling speed, otherwise platforms go down and are WAY slower than the background
        this.platMod = -80; //flag (-60 @ 540p)   
        
        // create warehouse backdrop
        this.background = this.add.tileSprite(0, 0, 960, 540, "backDrop").setOrigin(0,0).setScale(4/3); //flag remove set scale on asset change
        this.background.setDepth(-999);
        //this.physics.add.existing(this.background);
        //this.background.body.allowGravity = false;
       // this.background.body.immovable = true;
        //this.background.body.checkCollision.none = true;
        //this.background.body.setVelocityY(this.scroll*this.platMod);

        this.anims.create({
            key: 'voider',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('void1', { start: 0, end: 29, first: 0}),
            frameRate: 25
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
        
        this.anims.create({
			key: "playerAir",
			frames: [{ key: "sprites", frame: "jump" }]
        });

        /*
        this.anims.create({
			key: "playerWork",
			frames: this.anims.generateFrameNames("sprites", {
				prefix: "work",
				start: 1,
				end: 24,
                zeroPad: 0
			}),
            frameRate: 60,
            repeat: -1
        });
        */

        this.anims.create({
			key: "smell",
			frames: this.anims.generateFrameNames("sprites", {
				prefix: "mess",
				start: 1,
				end: 2,
                zeroPad: 0
			}),
            frameRate: 15, //flag
            repeat: -1
        });

        this.anims.create({
			key: "customerBump",
			frames: this.anims.generateFrameNames("sprites", {
				prefix: "customer",
				start: 1,
				end: 14,
                zeroPad: 0
			}),
            frameRate: 20,//flag
            repeat: 0
        });  

        //sets up music
        let musicPlayConfig = {
            mute: false,
            volume: .6*game.settings.musicVolume,
            loop: true
        }

        musicPlayConfig.volume = .6*game.settings.musicVolume;

        if (!game.settings.playing) {
            this.bgm = this.sound.add('gameMusic', musicPlayConfig);
            this.bgm.play();
        }
        game.settings.playing = true;
        
        this.score = 0;   

        // boolean that determines whether a box or shelf comes next
        this.madeBox = false;

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

        //group for box collisions
        this.boxes = this.physics.add.group();

        //group for shelf collisions
        this.shelves = this.physics.add.group();

        //group for full shelf existance
        this.fullShelves = this.physics.add.group();

        //group for mess collisions
        this.messes = this.physics.add.group();

        //group for customer collisions
        this.customers = this.physics.add.group();

        //group for angry customers
        this.agCustomers = this.physics.add.group();
        
        // starting platform
		this.platforms.create(game.config.width/2, game.config.height+50, "sprites", "rampsmall").setScale(1);
		
		// iterate through platforms group, set variables
		this.platforms.children.each(function(platform) {
			platform.body.allowGravity = false;
            platform.body.immovable = true;
            platform.body.velocity.y = this.platMod*this.scroll;
            platform.body.checkCollision.left = false;
            platform.body.checkCollision.right = false;
            platform.body.checkCollision.down = false;
            platform.setFrictionX(1);
        }, this);
        
        // iterate through boxes group, set variables
		this.boxes.children.each(function(box) {
			box.body.allowGravity = false;
            box.body.immovable = true;
            box.body.velocity.y = this.platMod*this.scroll;
            box.body.checkCollision.up = false;
            box.body.checkCollision.left = false;
            box.body.checkCollision.right = false;
            box.body.checkCollision.down = false;
            box.setFrictionX(1);
        }, this);
        
        // iterate through shelves group, set variables
		this.shelves.children.each(function(shelf) {
			shelf.body.allowGravity = false;
            shelf.body.immovable = true;
            shelf.body.velocity.y = this.platMod*this.scroll;
            shelf.body.checkCollision.up = false;
            shelf.body.checkCollision.left = false;
            shelf.body.checkCollision.right = false;
            shelf.body.checkCollision.down = false;
            shelf.setFrictionX(1);
        }, this);

        // iterate through full shelves group, set variables
            this.fullShelves.children.each(function(fullShelf) {
			fullShelf.body.allowGravity = false;
            fullShelf.body.immovable = true;
            fullShelf.body.velocity.y = this.platMod*this.scroll;
            fullShelf.body.checkCollision.up = false;
            fullShelf.body.checkCollision.left = false;
            fullShelf.body.checkCollision.right = false;
            fullShelf.body.checkCollision.down = false;
            fullShelf.setFrictionX(1);
        }, this);
        
        //iterate throuhg messes group, set variables
        this.messes.children.each(function(mess) {
			mess.body.allowGravity = false;
            mess.body.immovable = true;
            mess.body.velocity.y = this.platMod*this.scroll;
            mess.body.checkCollision.up = false;
            mess.body.checkCollision.left = false;
            mess.body.checkCollision.right = false;
            mess.body.checkCollision.down = false;
            mess.setFrictionX(1);
        }, this);

        //iterate throuhg customer group, set variables
        this.customers.children.each(function(customer) {
			customer.body.allowGravity = false;
            customer.body.immovable = true;
            customer.body.velocity.y = this.platMod*this.scroll;
            customer.setFrictionX(1);
        }, this);

        //iterate throuhg angry customer group, set variables
        this.agCustomers.children.each(function(agCustomer) {
			agCustomer.body.allowGravity = false;
            agCustomer.body.immovable = true;
            agCustomer.body.velocity.y = this.platMod*this.scroll;
            agCustomer.body.checkCollision.up = false;
            agCustomer.body.checkCollision.left = false;
            agCustomer.body.checkCollision.right = false;
            agCustomer.body.checkCollision.down = false;
            agCustomer.setFrictionX(1);
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
		this.player = new Player(this, game.config.width/2, 150, "sprites", "run1").setOrigin(0.5);
        this.physics.add.existing(this.player);

        // set player body size, 10 pixel gap on left + right
        this.player.body.setSize(60, 60, 10, 0);

		this.player.body.bounce.x = 0.0;
        this.player.body.bounce.y = 0.0;
        this.player.body.collideWorldBounds = true; 

		// add collisions
        this.physics.add.collider(this.player, this.platforms, this.playerHitPlatform, null, this);
        this.physics.add.collider(this.player, this.boxes, this.playerGrabBox, null, this);
        this.physics.add.collider(this.player, this.shelves, this.playerShelving, null, this);
        this.physics.add.collider(this.player, this.messes, this.playerCleaning, null, this);
        this.physics.add.collider(this.player, this.customers, this.playerBumping, null, this);

        //separate gameover variables depending on death
        this.gameoverTop = false;
        this.gameoverBot = false;

        // ooze creation
        this.ooze = new Ooze(this, 0, 0, 'void', 0).setOrigin(0, 1).setScale(4/3); //flag remove set scale on asset change
        this.physics.add.existing(this.ooze);
        this.ooze.body.allowGravity = false;
        this.ooze.body.immovable = true;

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

        this.scoreBoard = this.add.text(0, 0, this.score, menuConfig);

        // assign keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

    }

    update(time, delta) {

        this.platforms.children.each(function(platform) {
            platform.setDepth(-998);
        }, this);

        this.boxes.children.each(function(box) {
            box.setDepth(-996);
        }, this);

        this.shelves.children.each(function(shelf) {
            shelf.setDepth(-997);
        }, this);

        this.fullShelves.children.each(function(fullShelf) {
            fullShelf.setDepth(-997);
        }, this);

        this.messes.children.each(function(mess) {
            mess.setDepth(-997);
        }, this);

        this.customers.children.each(function(customer) {
            customer.setDepth(-997);
        }, this);

        this.agCustomers.children.each(function(agCustomer) {
            agCustomer.setDepth(-997);
        }, this);
        
        // if player hasn't died yet
        if (!this.gameoverTop && !this.gameoverBot) {
 
            // update scrolling background
            this.background.tilePositionY += this.scroll*delta*2/33;
 
            // update player
            this.player.update();
            this.player.isJump = true;

            // destroy off-screen platforms 
            this.platforms.children.each(function(platform) {
                if (platform.y < -platform.height) {
                    platform.destroy();
                }
            }, this);

            //destroy boxes and shelves
            this.boxes.children.each(function(box) {
                if (box.y < this.ooze.y-box.height) {
                    box.destroy();
                }
            }, this);

            this.shelves.children.each(function(shelf) {
                if (shelf.y < this.ooze.y-shelf.height) {
                    shelf.destroy();
                    // creep ooze down
                    this.oozeCreep();
                }
            }, this);

            this.messes.children.each(function(mess) {
                if (mess.y < this.ooze.y-mess.height) {
                    mess.destroy();
                    // creep ooze down
                    this.oozeCreep();
                }
            }, this);

            this.customers.children.each(function(customer) {
                if (customer.y < this.ooze.y-customer.height) {
                    customer.destroy();
                }
            }, this);

            this.agCustomers.children.each(function(agCustomer) {
                if (agCustomer.y < this.ooze.y-agCustomer.height) {
                    agCustomer.destroy();
                    // creep ooze down
                    this.oozeCreep();
                }
            }, this);

            //flip sprite when player turns
            if (this.player.isTurn) { 
                //console.log('turning');
                this.player.toggleFlipX();
                this.player.isTurn = false;
            }

            // check if player died
            // give player some leeway so they don't get eaten by particles
            if (this.player.y < this.ooze.y-80) {

                //console.log("game over, eaten by ooze");
                this.finScore = this.score;
                this.gameoverTop = true;
                this.ooze.body.setVelocityY(game.settings.oozeSpeed*10);
                this.sound.play("sfxConsume", {volume: 0.4*game.settings.effectVolume});

            } else if (this.player.y > game.config.height+50) {

                //console.log("game over, fell off screen");
                this.finScore = this.score;
                this.gameoverBot = true;
                this.sound.play("sfxFall", {volume: 0.4*game.settings.effectVolume});

            }

            this.scoreBoard.setText(this.score);
    
        // else, if player's dead
        } else {

            this.bgm.volume =.2*game.settings.musicVolume;

            // game over!
            //this.menuConfig.fixedWidth = 0;

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

            this.boxes.children.each(function(box) {
                box.body.velocity.y = 0;
            }, this);

            this.shelves.children.each(function(shelf) {
                shelf.body.velocity.y = 0;
            }, this);

            this.fullShelves.children.each(function(fullShelf) {
                fullShelf.body.velocity.y = 0;
            }, this);

            this.messes.children.each(function(mess) {
                mess.body.velocity.y = 0;
            }, this);

            this.customers.children.each(function(customer) {
                customer.body.velocity.y = 0;
            }, this);

            this.agCustomers.children.each(function(agCustomer) {
                agCustomer.body.velocity.y = 0;
            }, this);

            // reset scene
            if (Phaser.Input.Keyboard.JustDown(keyUP)) {
                this.bgm.volume =.6*game.settings.musicVolume;
                this.scene.restart();           
            }
            if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
                game.settings.playing = false;
                this.bgm.stop();
                this.scene.start("menuScene");
            }
        } 

        //moves ooze, but not past screen
        //if(this.ooze.y < game.config.height+100&&!this.gameoverBot)this.ooze.update(); //flag ooze limit
        //else  game.settings.oozeSpeed = 0;

        if (this.ooze.y > game.config.height+100) {
            this.stopOoze();
        }

        this.ooze.update();

    }

    // callback if player lands on platform
    playerHitPlatform(player, platform) {

        // make sure player is on top of platform
        if ((player.y + player.height) < platform.y) {
            player.isJump = false;
        }

    }

    playerGrabBox(player, box) {//will not work if player is moving (bug or feature?)
        if(!player.hasBox&&Phaser.Input.Keyboard.JustDown(keyDOWN)){
            player.hasBox = true;
            box.destroy();
        }
    }

    playerShelving(player, shelf) {//will not work if player is moving (bug or feature?)
        if(player.hasBox&&Phaser.Input.Keyboard.JustDown(keyDOWN)){
            player.hasBox = false;
            player.isWork = true;
            let timer = this.time.delayedCall(500, () => {
                player.isWork = false;
                //spawn full shelf sprite
                this.spawnFullShelf(shelf.x, shelf.y)
                shelf.destroy();
            }, null, this);
        }
    }

    playerCleaning(player, mess){
        if(Phaser.Input.Keyboard.JustDown(keyDOWN)){
            player.isWork = true;
            let timer = this.time.delayedCall(750, () => {
                player.isWork = false;
                mess.destroy();
            }, null, this);
        }
    }

    playerBumping(player, customer){
        this.spawnAngryCustomer(customer.x,customer.y);
        customer.destroy();
    }

    // spawn platform randomly at bottom of screen
    makePlatform() {

        let sx = Phaser.Math.RND.between(this.xL, this.xR);
        this.xL = sx-(game.config.width*.5); //flag (*2/3) in 540p
        if (this.xL < -25)this.xL = 0;
        this.xR = sx+(game.config.width*.5); //flag (*2/3) in 540p
        if (this.xR > game.config.width+25)this.xR = game.config.width;
        //console.log(sx);

        let platform = this.platforms.create(sx, game.config.height+100, "sprites", "rampsmall");

        platform.setScale(1);
        platform.body.allowGravity = false;
        platform.body.immovable = true;
        platform.body.velocity.y = this.platMod*this.scroll;
        platform.body.checkCollision.left = false;
        platform.body.checkCollision.right = false;
        platform.body.checkCollision.down = false;
        platform.setFrictionX(1);

        // 30% chance of spawning box / shelf
        let objectChance = 50; //remember to make this 30 again

        let spawnRoll = Phaser.Math.RND.between(0, 100);

        // runs code to determine what object is spawned
        if (spawnRoll <= objectChance) {
            let xRandom = Phaser.Math.RND.between(sx-100, sx+100); // flag make sure number is <= (platform width-largest object width)/2
            if (xRandom < 50) xRandom = 50;
            if (xRandom > game.config.width-50) xRandom = game.config.width-50;
            this.spawnObject(xRandom, game.config.height+100-(platform.height/2));
        }
    }

    scoreUp() {
        
        if (!this.gameOverBot && !this.gameOverTop) {
        
            this.score++;
        
            if ((this.scroll < 2) && (this.score%20 == 0) && (this.score > 0)) {
                
                this.scroll += 0.2;
                this.platformTimer.timeScale = 1 + (0.2*this.scroll);
                
                //update speed of existing platforms and objects
                //code provided by Ben Rosien in the discord channel
            
                this.platforms.getChildren().forEach(function (platform) {
                    platform.body.velocity.y = this.scroll*this.platMod;
                }, this);

                this.boxes.getChildren().forEach(function (box) {
                    box.body.velocity.y = this.scroll*this.platMod;
                }, this);

                this.shelves.getChildren().forEach(function (shelf) {
                    shelf.body.velocity.y = this.scroll*this.platMod;
                }, this);

                this.fullShelves.getChildren().forEach(function (fullShelf) {
                    fullShelf.body.velocity.y = this.scroll*this.platMod;
                }, this);

                this.messes.getChildren().forEach(function (mess) {
                    mess.body.velocity.y = this.scroll*this.platMod;
                }, this);

                this.customers.getChildren().forEach(function (customer) {
                    customer.body.velocity.y = this.scroll*this.platMod;
                }, this);

                this.agCustomers.getChildren().forEach(function (agCustomer) {
                    agCustomer.body.velocity.y = this.scroll*this.platMod;
                }, this);
            
            }
    
        }
    }

    spawnObject(x, y){

        //needs an order
        let boxShelfChance = 3;
        let messChance = 2;
        let customerChance = 1;

        let typeRoll = Phaser.Math.RND.between(1, 3);//change to 1, 3

        if(boxShelfChance === typeRoll){//change to == once other methods implemented
            if (!this.madeBox) {
                this.spawnBox(x, y);
                //console.log("A wild BOX appears!");
                this.madeBox = true;
            } else {
                this.spawnShelf(x, y); 
                //console.log("A wild SHELF appears!");
                this.madeBox = false;
            }
        } else if(messChance === typeRoll){
            this.spawnMess(x, y);
            //console.log("A wild MESS appears!");
        }else if(customerChance === typeRoll){
            this.spawnCustomer(x, y);
            //console.log("A wild CUSTOMER appears!");
        }
        
    }

    spawnBox(x, y){
        let box = this.boxes.create(x, y, "sprites", "Box");

        box.setScale(1);
        box.setOrigin(.5,1);
        box.body.allowGravity = false;
        box.body.immovable = true;
        box.body.velocity.y = this.platMod*this.scroll;
        box.body.checkCollision.up = false;
        box.body.checkCollision.left = false;
        box.body.checkCollision.right = false;
        box.body.checkCollision.down = false;
        box.setFrictionX(1);
    }

    spawnShelf(x, y){
        let shelf = this.shelves.create(x, y, "sprites", "ShelfEmpty"); //change size of sprite??

        shelf.setScale(1);
        shelf.setOrigin(.5,1);
        shelf.body.allowGravity = false;
        shelf.body.immovable = true;
        shelf.body.velocity.y = this.platMod*this.scroll;
        shelf.body.checkCollision.up = false;
        shelf.body.checkCollision.left = false;
        shelf.body.checkCollision.right = false;
        shelf.body.checkCollision.down = false;
        shelf.setFrictionX(1);
    }

    spawnFullShelf(x, y){
        let shelf = this.fullShelves.create(x, y, "sprites", "ShelfFull"); //change size of sprite??

        shelf.setScale(1);
        shelf.setOrigin(.5,1);
        shelf.body.allowGravity = false;
        shelf.body.immovable = true;
        shelf.body.velocity.y = this.platMod*this.scroll;
        shelf.body.checkCollision.up = false;
        shelf.body.checkCollision.left = false;
        shelf.body.checkCollision.right = false;
        shelf.body.checkCollision.down = false;
        shelf.setFrictionX(1);
    }

    spawnMess(x, y){
        let mess = this.messes.create(x, y, "sprites", "mess1");

        mess.setScale(1);
        mess.setOrigin(.5,1);
        mess.body.allowGravity = false;
        mess.body.immovable = true;
        mess.body.velocity.y = this.platMod*this.scroll;
        mess.body.checkCollision.up = false;
        mess.body.checkCollision.left = false;
        mess.body.checkCollision.right = false;
        mess.body.checkCollision.down = false;
        mess.setFrictionX(1);
        mess.anims.play("smell");
    }

    spawnCustomer(x, y){
        let customer = this.customers.create(x, y, "sprites", "customerNeutral");

        customer.setScale(1);
        customer.setOrigin(.5,1);
        customer.body.allowGravity = false;
        customer.body.immovable = true;
        customer.body.velocity.y = this.platMod*this.scroll;
        customer.setFrictionX(1);
    }

    spawnAngryCustomer(x,y){
        let agCustomer = this.agCustomers.create(x, y, "sprites", "customerAngry");

        agCustomer.setScale(1);
        agCustomer.setOrigin(.5,1);
        agCustomer.body.allowGravity = false;
        agCustomer.body.immovable = true;
        agCustomer.body.velocity.y = this.platMod*this.scroll;
        agCustomer.body.checkCollision.up = false;
        agCustomer.body.checkCollision.left = false;
        agCustomer.body.checkCollision.right = false;
        agCustomer.body.checkCollision.down = false;
        agCustomer.setFrictionX(1);
        agCustomer.anims.play('customerBump'); //flag
    }

    oozeCreep() {
        this.ooze.body.setVelocityY(game.settings.oozeSpeed);
        let timer = this.time.delayedCall(game.settings.oozeDrop, this.stopOoze, [], this);
    }

    stopOoze() {
        this.ooze.body.setVelocityY(0);
    }

}