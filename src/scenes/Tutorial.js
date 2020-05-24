class Tutorial extends Phaser.Scene {

    constructor() {
        super("tutorialScene");
    }
    
    preload() {

		// load temp images
		//this.load.image("player", "assets/char.png");
        //this.load.image("platform", "assets/rampsmall.png");
        this.load.image("backDrop", "assets/ware.png");
        this.load.image("voidStatic", "assets/voidStatic.png");

        // load sprite atlas
        this.load.atlas("sprites", "assets/spritesheet.png", "assets/sprites.json");

        // load void spritesheet
        /*this.load.spritesheet("void", "assets/voidAnim.png", {
            frameWidth: 1280, frameHeight :867,
            startFrame: 0, endFrame: 29
        });*/ //check
        
    }

    create() {

        /**********************
         *  set up constants  *
         **********************/

        this.BG_DEPTH= -999;
        this.PLATFORM_DEPTH = -998;
        this.BOX_DEPTH = -994;
        this.SHELF_DEPTH = -995;
        this.MESS_DEPTH = -995;
        this.CUSTOMER_DEPTH = -995;
        this.TEXT_DEPTH = -996;
        this.TEXTBACK_DEPTH = -997;

        /**********************
         *  set up variables  *
         **********************/

        this.score = 0;   

        // boolean that determines whether a box or shelf comes next
        this.madeBox = false;

        //separate gameover variables depending on death
        this.gameoverBot = false;

        this.platWidth = 320;
        this.platDist = 140;

        //makes text not directly overlap objects
        this.promptOffset = 50;

        //opens tutorial end
        this.finish = 4;
        this.checkBox = false;
        this.checkMess = false;
        this.checkCust = false;
        this.checkShelf = false;

        /****************
         * text configs *
         ****************/

        this.scoreBoardConfig = {
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

        this.gameOverHeaderConfig = {
            fontFamily: 'Helvetica',
            fontSize: '50px',
            color: '#fbe33c',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
            },
            fixedWidth: 0
        }

        this.gameOverInfoConfig = {
            fontFamily: 'Helvetica',
            fontSize: '30px',
            color: '#facade',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
            },
            fixedWidth: 0
        }

        this.gameOverInstructionsConfig = {
            fontFamily: 'Helvetica',
            fontSize: '30px',
            color: '#e7d97d',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
            },
            fixedWidth: 0
        }

        this.instructionConfig = {
            fontFamily: 'Helvetica',
            fontSize: '15px',
            color: '#e7d97d',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
            },
            fixedWidth: 0
        }

        /*********************
         * create animations *
         *********************/
        
        /*this.anims.create({
            key: "voidAnim",
            repeat: -1,
            frames: this.anims.generateFrameNumbers("void", { start: 0, end: 29, first: 0}),
            frameRate: 30
        });*/ //check
        
		this.anims.create({
			key: "playerRun",
			frames: this.anims.generateFrameNames("sprites", {
				prefix: "run",
				start: 1,
				end: 10,
                zeroPad: 0
			}),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
			key: "boxRun",
			frames: this.anims.generateFrameNames("sprites", {
				prefix: "boxRun",
				start: 1,
				end: 10,
                zeroPad: 0
			}),
            frameRate: 16,
            repeat: -1
        });

        this.anims.create({
			key: "playerIdle",
			frames: [{ key: "sprites", frame: "char" }]
        });

        this.anims.create({
			key: "boxIdle",
			frames: [{ key: "sprites", frame: "charBox2" }]
        });
        
        this.anims.create({
			key: "playerAir",
			frames: [{ key: "sprites", frame: "jump" }]
        });

        this.anims.create({
			key: "boxAir",
			frames: [{ key: "sprites", frame: "jumpbox" }]
        });
        
        this.anims.create({
			key: "playerShelve",
			frames: this.anims.generateFrameNames("sprites", {
				prefix: "shelving",
				start: 1,
				end: 4,
                zeroPad: 0
			}),
            frameRate: 5,
            repeat: -1
        });
        
        this.anims.create({
			key: "playerClean",
			frames: this.anims.generateFrameNames("sprites", {
				prefix: "clean",
				start: 1,
				end: 4,
                zeroPad: 0
			}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({ 
			key: "smell",
			frames: this.anims.generateFrameNames("sprites", {
				prefix: "mess",
				start: 1,
				end: 6,
                zeroPad: 0
			}),
            frameRate: 20, //flag
            repeat: -1
        });

        this.anims.create({
			key: "customerBump",
			frames: this.anims.generateFrameNames("sprites", {
				prefix: "customerMad",
				start: 1,
				end: 11,
                zeroPad: 0
			}),
            frameRate: 20,
            repeat: 0
        }); 

        /*****************
         * set up timers *
         *****************/
        
        // speed timer
        this.speedTimer = this.time.addEvent ({
            delay: 1000,
            callback: this.scoreUp /*(this.score, this.speed)*/,
            callbackScope: this,
            loop: true
        });

        /**********************************************************
         * setup world bounds with vertical pockets for game over *
         **********************************************************/

        this.physics.world.setBounds(0, -100, game.config.width, game.config.height+200);

        /**************************
         * add warehouse backdrop *
         **************************/

        this.background = this.add.tileSprite(0, 0, 1280, 720, "backDrop").setOrigin(0,0);
        this.background.setDepth(this.BG_DEPTH);

        /**************
         * add player *
         **************/

		this.player = new Player(this, game.config.width-100, 50, "sprites", "char").setOrigin(0.5);
        this.physics.add.existing(this.player);

        // setup player physics
		this.player.body.bounce.x = 0.0;
        this.player.body.bounce.y = 0.0;
        this.player.body.collideWorldBounds = true; 

        // set player body size, 10 pixel gap on left + right
        this.player.body.setSize(40, 70);
        this.player.body.setOffset(5, 10);

        /************
         * add ooze *
         ************/

       /* this.ooze = new Ooze(this, 0, 0, "voidStatic", 0).setOrigin(0, 1);
        this.physics.add.existing(this.ooze);
        this.ooze.body.allowGravity = false;
        this.ooze.body.immovable = true;*/ //check

        /******************
         * add scoreboard *
         ******************/

        this.scoreBoard = this.add.text(0, 0, this.score, this.scoreBoardConfig);

        /********************
         * collision groups *
         ********************/

        this.platforms = this.physics.add.group();
        this.boxes = this.physics.add.group();
        this.shelves = this.physics.add.group();
        this.fullShelves = this.physics.add.group();
        this.messes = this.physics.add.group();
        this.customers = this.physics.add.group();
        this.agCustomers = this.physics.add.group();

        this.physics.add.collider(this.player, this.platforms, this.playerHitPlatform, null, this);
        this.physics.add.collider(this.player, this.boxes, this.playerGrabBox, null, this);
        this.physics.add.collider(this.player, this.shelves, this.playerShelving, null, this);
        this.physics.add.collider(this.player, this.messes, this.playerCleaning, null, this);
        this.physics.add.collider(this.player, this.customers, this.playerBumping, null, this);

        /***********************
         * construct platforms *
         ***********************/

        this.makePlatform(this.platWidth, 150, 0);
        this.makePlatform(2*this.platWidth, 150, 1); //box
        this.makePlatform(3*this.platWidth, 150, 0);
        this.makePlatform(4*this.platWidth, 150, 0);

        this.makePlatform(50, 150+this.platDist, 0);
        this.makePlatform(50+this.platWidth, 150+this.platDist, 0);
        this.makePlatform(50+2*this.platWidth, 150+this.platDist, 2); //mess
        this.makePlatform(50+3*this.platWidth, 150+this.platDist, 0);

        this.makePlatform(this.platWidth, 150+2*this.platDist, 0);
        this.makePlatform(2*this.platWidth, 150+2*this.platDist, 0);
        this.makePlatform(3*this.platWidth, 150+2*this.platDist, 3); //customer
        this.makePlatform(4*this.platWidth, 150+2*this.platDist, 0);

        this.makePlatform(50, 150+3*this.platDist, 1); //shelf
        this.makePlatform(50+this.platWidth, 150+3*this.platDist, 0);
        this.makePlatform(50+2*this.platWidth, 150+3*this.platDist, 0);
        this.makePlatform(50+3*this.platWidth, 150+3*this.platDist, 0);
        this.makePlatform(50+4*this.platWidth, 150+3*this.platDist, 0);

        /***************
         * assign keys *
         **************/

        keyJUMP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyINTERACT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

    }

    update(time, delta) {

        this.makeText(game.config.width-100-this.promptOffset, 50+this.promptOffset,140,90,1,1,
            "Welcome to Work",
            "Move with ← and →",
            "Use [Z] to jump");

        // if player hasn't died yet
        if (!this.gameoverBot) {

            // update player
            this.player.update();
            this.player.isJump = true;

            // update ooze
            //this.ooze.update(); //check

            //flip sprite when player turns
            if (this.player.isTurn) { 
                //console.log('turning');
                this.player.toggleFlipX();
                this.player.isTurn = false;
            }

            // check if player died
            // give player some leeway so they don't get eaten by particles
            if (this.player.y >150+2*this.platDist&&this.player.x >game.config.width-100&&this.finish<=0) {
                this.gameoverBot = true;
                this.physics.world.setBounds(0, -100, game.config.width+50, game.config.height+200);
            }

            // if player *just* died, perform,, the rituals
            if (this.gameoverBot) {

                // turn off player movement
                this.player.body.velocity.x = 300;
                this.player.body.velocity.y = 0;
                this.player.body.bounce.x = 0;
                this.player.body.bounce.y = 0;
                this.player.body.allowGravity = false;

                // hide scoreboard
                this.scoreBoard.setVisible(false);

                // final score
                this.finScore = this.score;

                // text spacer for game over text
                let textSpacer = 60;

                // create game over text
                // note 2 cam from cam: clean this up, remove magic #s -love, cam
                this.add.rectangle (
                    game.config.width/2, game.config.height/2,
                    500, 360, 0x000000
                ).setOrigin(0.5);
                
                this.add.text (
                    game.config.width/2, (game.config.height/2)-(2*textSpacer),
                    "Training Complete!", this.gameOverHeaderConfig
                ).setOrigin(0.5);

                this.add.text (
                    game.config.width/2, (game.config.height/2)-(textSpacer),
                    "Now you're ready",
                    this.gameOverInfoConfig
                ).setOrigin(0.5);
                
                this.add.text (
                    game.config.width/2, game.config.height/2,
                    "to begin working here!",
                    this.gameOverInfoConfig
                ).setOrigin(0.5);

                this.add.text (
                    game.config.width/2, game.config.height/2+textSpacer,
                    "Press ↑ to start your shift", this.gameOverInstructionsConfig
                ).setOrigin(0.5);

                this.add.text (
                    game.config.width/2, game.config.height/2+2*textSpacer,
                    "Press ↓ to return to menu", this.gameOverInstructionsConfig
                ).setOrigin(0.5);
                
            }
    
        // else, if player's dead
        } else {

            // reset scene on player input
            if (Phaser.Input.Keyboard.JustDown(keyUP)) {
                game.settings.bgm.stop();
                game.settings.tutorOpen = false;
                this.scene.start("playScene");           
            }

            // exit to menu on player input
            if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
                this.scene.start("menuScene");
            }

        } 

        // prevent ooze from going off screen
        /*if (this.ooze.y > game.config.height+100) {
            this.stopOoze();
        }*/        

    }

    // cleanUp()
    // removes off-screen objects
    /*cleanUp() {

        // clean up platforms
        this.platforms.children.each(function(platform) {
            if (platform.y < -platform.height) {
                platform.destroy();
            }
        }, this);

        // clean up boxes
        this.boxes.children.each(function(box) {
            if (box.y < this.ooze.y-box.height) {
                box.destroy();
            }
        }, this);

        // clean up shelves
        this.shelves.children.each(function(shelf) {
            if (shelf.y < this.ooze.y-shelf.height) {
                shelf.destroy();
            }
        }, this);

        // clean up full shelves
        this.fullShelves.children.each(function(fullShelf) {
            if (fullShelf.y < this.ooze.y-fullShelf.height) {
                fullShelf.destroy();
            }
        }, this);

        // clean up messes
        this.messes.children.each(function(mess) {
            if (mess.y < this.ooze.y-mess.height) {
                mess.destroy();
            }
        }, this);

        // clean up customers
        this.customers.children.each(function(customer) {
            if (customer.y < this.ooze.y-customer.height) {
                customer.destroy();
            }
        }, this);

        // clean up angry customers
        this.agCustomers.children.each(function(agCustomer) {
            if (agCustomer.y < this.ooze.y-agCustomer.height) {
                if (!this.gameOverBot && !this.gameOverBot) {
                    agCustomer.destroy();
                }
                //turn on if you want ooze to move when customer hits top of screen
                //this.oozeCreep();
            }
        }, this);

    }*/ //check

    // scoreUp()
    //  increase score every second
    scoreUp() {
        
        if (!this.gameOverBot) {
        
            // increment score
            this.score++;

            // update scoreBoard
            this.scoreBoard.setText(this.score);
    
        }
    }

    /******************
     * ooze functions *
     ******************/

    // oozeCreep()
    //  makes the ooze creep down the screen an amount determined by
    //  game.settings.oozeSpeed and game.settings.oozeDrop
   /* oozeCreep() {
        this.ooze.body.setVelocityY(game.settings.oozeSpeed);
        let timer = this.time.delayedCall(game.settings.oozeDrop, this.stopOoze, [], this);
    }

    // stopOoze()
    //  stop ooze immediately
    stopOoze() {
        this.ooze.body.setVelocityY(0);
    }*/ //check

    /******************************
     * player collision callbacks *
     ******************************/

    playerHitPlatform(player, platform) {

        // make sure player is on top of platform
        if ((player.y + player.height/2 -1) < platform.y) {
            player.isJump = false;
        }
    }

    playerGrabBox(player, box) {
        if(!this.checkBox){
        this.makeText(2*this.platWidth,150-this.promptOffset,260,90,1,1,
            "Take Boxes to Shelves",
            "Use [X] to pick up",
            "You move slower while carrying Boxes");
        }
        if (!player.hasBox && Phaser.Input.Keyboard.JustDown(keyINTERACT)) {
            player.hasBox = true;
            this.finish -= 1;
            box.destroy();
        }
        this.checkBox = true;
    }

    playerShelving(player, shelf) { //will not work if player is moving (bug or feature?)
        if(!this.checkShelf){
            this.makeText(50+this.promptOffset, 150+3*this.platDist-this.promptOffset,165,90,0,1,//check
                "Bring Boxes here",
                "Use [X] to shelve Boxes",
                "It takes a little time to do");
            }
        if(player.hasBox && Phaser.Input.Keyboard.JustDown(keyINTERACT)){
            player.hasBox = false;
            player.isShelve = true;
            let timer = this.time.delayedCall(500, () => { //flag balance
                player.isShelve = false;
                //spawn full shelf sprite
                this.spawnFullShelf(shelf.x, shelf.y);
                this.madeBox = false;
                this.finish -= 1;
                shelf.destroy();
            }, null, this);
        }
    }

    playerCleaning(player, mess){
        if(!this.checkMess){
            this.makeText(50+2*this.platWidth, 150+this.platDist-this.promptOffset,220,90,0,1,//check
                "Clean up Messes you encounter",
                "Use [X] to clean",
                "Cleaning takes time");
            }
        if(Phaser.Input.Keyboard.JustDown(keyINTERACT)){
            player.isMop = true;
            let timer = this.time.delayedCall(750, () => { //flag balance
                player.isMop = false;
                this.finish -= 1;
                mess.destroy();
            }, null, this);
        }
    }

    playerBumping(player, customer){
        if(!this.checkCust){
            this.finish -= 1;
            this.makeText(3*this.platWidth-this.promptOffset, 150+2*this.platDist-this.promptOffset,225,90,1,1,//check
                "Customers peruse the isles",
                "Make sure to not bump into them",
                "or they will get angry");
        } 
        this.checkCust = true;
        this.spawnAngryCustomer(customer.x,customer.y);
        customer.destroy();
        // creep ooze down
      /*  if (!this.gameOverBot) {
            this.oozeCreep();
        } //turn on if you want ooze to move when customer is bumped*/ //check
    }

    /******************************
     * platform + object spawning *
     ******************************/

    // makePlatform()
    //  spawn platform randomly at bottom of screen
    makePlatform(x, y, obj) {

        let platform = this.platforms.create(x, y, "sprites", "rampsmall");

        platform.setScale(1);
        platform.body.allowGravity = false;
        platform.body.immovable = true;
        platform.body.velocity.y = 0;
        platform.body.checkCollision.left = false;
        platform.body.checkCollision.right = false;
        platform.body.checkCollision.down = false;
        platform.setFrictionX(1);
        platform.setDepth(this.PLATFORM_DEPTH);

        if(obj>0) this.spawnObject(x, y-(platform.height/2), obj);
    }

    spawnObject(x, y, obj) {

        if (obj == 1) {
            if (!this.madeBox) {
                if (!this.player.hasBox) {
                    this.spawnBox(x, y);
                    this.madeBox = true;
                } else {
                    this.madeBox = true;
                }
            } else {
                this.spawnShelf(x, y); 
                this.madeBox = false;
            }
        } else if (obj == 2) {
            this.spawnMess(x, y);
        } else if (obj == 3){ 
            this.spawnCustomer(x, y);
        } else console.log(obj+' is an invalid object code');
        
    }

    spawnBox(x, y) {

        let box = this.boxes.create(x, y, "sprites", "Box");

        box.setScale(1);
        box.setOrigin(.5,1);
        box.body.allowGravity = false;
        box.body.immovable = true;
        box.body.velocity.y = 0;
        box.body.checkCollision.up = false;
        box.body.checkCollision.left = false;
        box.body.checkCollision.right = false;
        box.body.checkCollision.down = false;
        box.setFrictionX(1);
        box.setDepth(this.BOX_DEPTH);

    }

    spawnShelf(x, y) {

        let shelf = this.shelves.create(x, y, "sprites", "ShelfEmpty"); //change size of sprite??

        shelf.setScale(1);
        shelf.setOrigin(.5,1);
        shelf.body.allowGravity = false;
        shelf.body.immovable = true;
        shelf.body.velocity.y = 0;
        shelf.body.checkCollision.up = false;
        shelf.body.checkCollision.left = false;
        shelf.body.checkCollision.right = false;
        shelf.body.checkCollision.down = false;
        shelf.setFrictionX(1);
        shelf.setDepth(this.SHELF_DEPTH);

    }

    spawnFullShelf(x, y) {

        let shelf = this.fullShelves.create(x, y, "sprites", "ShelfFull");

        shelf.setScale(1);
        shelf.setOrigin(.5,1);
        shelf.body.allowGravity = false;
        shelf.body.immovable = true;
        shelf.body.velocity.y = 0;
        shelf.body.checkCollision.up = false;
        shelf.body.checkCollision.left = false;
        shelf.body.checkCollision.right = false;
        shelf.body.checkCollision.down = false;
        shelf.setFrictionX(1);
        shelf.setDepth(this.SHELF_DEPTH);

    }

    spawnMess(x, y) {

        let mess = this.messes.create(x, y, "sprites", "mess1");

        mess.setScale(1);
        mess.setOrigin(.5,1);
        mess.body.allowGravity = false;
        mess.body.immovable = true;
        mess.body.velocity.y = 0;
        mess.body.checkCollision.up = false;
        mess.body.checkCollision.left = false;
        mess.body.checkCollision.right = false;
        mess.body.checkCollision.down = false;
        mess.setFrictionX(1);
        mess.anims.play("smell", true);
        mess.setDepth(this.MESS_DEPTH);

    }

    spawnCustomer(x, y) {

        let customer = this.customers.create(x, y, "sprites", "customerIdle");

        customer.setScale(1);
        customer.setOrigin(.5,1);
        customer.body.allowGravity = false;
        customer.body.immovable = true;
        customer.body.velocity.y = 0;
        customer.setFrictionX(1);
        customer.setDepth(this.CUSTOMER_DEPTH);

    }

    spawnAngryCustomer(x,y) {
   
        let agCustomer = this.agCustomers.create(x, y, "sprites", "customerAngry");

        agCustomer.setScale(1);
        agCustomer.setOrigin(.5,1);
        agCustomer.body.allowGravity = false;
        agCustomer.body.immovable = true;
        agCustomer.body.velocity.y = 0;
        agCustomer.body.checkCollision.up = false;
        agCustomer.body.checkCollision.left = false;
        agCustomer.body.checkCollision.right = false;
        agCustomer.body.checkCollision.down = false;
        agCustomer.setFrictionX(1);
        agCustomer.anims.play('customerBump'); //flag
        agCustomer.setDepth(this.CUSTOMER_DEPTH);
   
    }

    makeText(x,y,width,height,originX,originY,line1,line2,line3){
        let back = this.add.rectangle (
            x, y, width, height, 0x000000
        ).setOrigin(originX, originY).setDepth(this.TEXTBACK_DEPTH);
        
        let textX = x;
        if(originX == 1)textX = x-5;
        else if(originX == 0)textX = x+5;
        else textX = x;

        let text1 = this.add.text (
            textX, y-(height*2/3),
            line1, this.instructionConfig
        ).setOrigin(originX, originY).setDepth(this.TEXT_DEPTH);
        let text2 = this.add.text (
            textX, y-(height/3),
            line2, this.instructionConfig
        ).setOrigin(originX, originY).setDepth(this.TEXT_DEPTH);
        let text3 = this.add.text (
            textX, y,
            line3, this.instructionConfig
        ).setOrigin(originX, originY).setDepth(this.TEXT_DEPTH);
    }

}