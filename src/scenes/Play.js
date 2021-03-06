class Play extends Phaser.Scene {

    constructor() {
        super("playScene");
    }

    create() {

        /**********************
         *  set up constants  *
         **********************/

        this.BG_DEPTH= -999;
        this.PLATFORM_DEPTH = -998;
        this.BOX_DEPTH = -996;
        this.SHELF_DEPTH = -997;
        this.MESS_DEPTH = -997;
        this.CUSTOMER_DEPTH = -997;

        /**********************
         *  set up variables  *
         **********************/

        this.score = 0;   

        //speed of scrolling
        this.scroll = 1;
        this.diffCheck = 10; //how often speed/item rate is increased //check (10)
        this.speedUp = .1; //how much speed goes up per increase //check (.1)
        this.speedCapInit = 2; //the highest speed can be before bonusTime //check (2)
        this.bonusTime = 300; //determines when speed starts increasing past x2 //check (300)

        // selector babeyy
        this.selected = "restart";

        // multiplier applied to platform scrolling speed
        this.platMod = -80;  

        // boolean that determines whether a box or shelf comes next
        this.madeBox = false;

        //platform generation
        this.xL = 0;
        this.xR = game.config.width;
        this.platNum = 2;//check (2)
        this.platWidth = 320;

        //separate gameover variables depending on death
        this.gameoverTop = false;
        this.gameoverBot = false;

        //item spawning chances
        this.itemDrop = 10; //check (10)
        this.itemPlus = 10; //check (10)
        this.itemMax = 50; //check (50)

        /****************
         * text configs *
         ****************/

        this.scoreBoardConfig = {
            fontFamily: 'Chelsea Market',
            fontSize: '30px',
            color: '#facade',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
            },
            fixedWidth: 100
        }

        this.gameOverHeaderConfig = {
            fontFamily: 'Chelsea Market',
            fontSize: '50px',
            color: '#e81e40',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
            },
            fixedWidth: 0
        }

        this.gameOverInfoConfig = {
            fontFamily: 'Chelsea Market',
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
            fontFamily: 'Chelsea Market',
            fontSize: '30px',
            color: '#facade',
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
        
        this.anims.create({
            key: "voidAnim",
            repeat: -1,
            frames: this.anims.generateFrameNames("void", {
				prefix: "void",
				start: 0,
				end: 29,
                zeroPad: 0
            }),
            frameRate: 30
        });
        
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
			frames: this.anims.generateFrameNames("sprites", { //flag error animation only plays initial frame, causes player to slightly sink
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

        this.anims.create({
            key: 'customerWalk',
            frames: this.anims.generateFrameNames("sprites", {
                prefix: "walk", //flag
                start: 1,
                end: 11,
                zeroPad: 0
            }),
            framerate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'oozeSpike',
            frames: this.anims.generateFrameNames("sprites", {
                prefix: "spike", //flag
                start: 1,
                end: 13,
                zeroPad: 0
            }),
            framerate: 12,
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

        // timer for spawning platforms (possibly temporary method?)
        this.platformTimer = this.time.addEvent ({
            delay: 3000, 
            callback: this.makePlatform,
            callbackScope: this,
            loop: true
        });

        // timer for cleaning up things
        this.cleanUpTimer = this.time.addEvent ({
            delay: 250,
            callback: this.cleanUp,
            callbackScope: this,
            loop: true
        })

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

		this.player = new Player(this, game.config.width/2, 150, "sprites", "jump").setOrigin(0.5);
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

        this.ooze = new Ooze(this, 0, -100, "void", "void0").setOrigin(0, 0.33);
        this.physics.add.existing(this.ooze);
        this.ooze.body.allowGravity = false;
        this.ooze.body.immovable = true;
        this.oozeMass = this.add.rectangle (
            0, -game.config.height + this.ooze.y - 100,
            game.config.width, game.config.height + 100,
            0x000000
        ).setOrigin(0,0);

        /******************
         * add scoreboard *
         ******************/

        this.scoreBack = this.makeBlackboard(0,0,100,65,0);
        this.scoreBoard = this.add.text(0, 0, this.score, this.scoreBoardConfig);


        /***************
         * start music *
         ***************/

        let musicPlayConfig = {
            mute: false,
            volume: 0.5*game.settings.musicVolume,
            loop: true
        }
        //musicPlayConfig.volume = 0.6*game.settings.musicVolume;

        if (!game.settings.playing) {
            this.bgm = this.sound.add('gameMusic', musicPlayConfig);
            this.bgm.play();
        }

        game.settings.playing = true;

        /********************
         * collision groups *
         ********************/

        this.platforms = this.physics.add.group();
        this.boxes = this.physics.add.group();
        this.shelves = this.physics.add.group();
        this.fullShelves = this.physics.add.group();
        this.messes = this.physics.add.group();
        //this.customers = this.physics.add.group(); //flag
        this.customers = new Phaser.GameObjects.Group (this); //flag
        this.agCustomers = this.physics.add.group();

        this.physics.add.collider(this.player, this.platforms, this.playerHitPlatform, null, this);
        this.physics.add.collider(this.player, this.boxes, this.playerGrabBox, null, this);
        this.physics.add.collider(this.player, this.shelves, this.playerShelving, null, this);
        this.physics.add.collider(this.player, this.messes, this.playerCleaning, null, this);
        this.physics.add.collider(this.player, this.customers, this.playerBumping, null, this);

        /**************************
         * make starting platform *
         **************************/

        let plat = this.platforms.create(game.config.width/2, game.config.height+50, "sprites", "rampsmall");
    	plat.body.allowGravity = false;
        plat.body.immovable = true;
        plat.body.velocity.y = this.platMod*this.scroll;
        plat.body.checkCollision.left = false;
        plat.body.checkCollision.right = false;
        plat.body.checkCollision.down = false;
        plat.setFrictionX(1);
        plat.setDepth(this.PLATFORM_DEPTH);

        /***************
         * assign keys *
         **************/

        keyJUMP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyINTERACT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // create transition overlay
        this.fader = this.add.rectangle (
            0, 0, game.config.width, game.config.height,
            0x000000
        ).setOrigin(0,0).setAlpha(1).setDepth(999);
        this.fading = "in";
        this.intent = false;

    }

    update(time, delta) {

        if (this.fading == "in") {
            
            if (this.fader.alpha - game.settings.t8nSpeed <= 0) {
                // js lets me do this and im crazy enough to do it
                this.fading = false;
                this.fader.setAlpha(0);
                console.log(this.fader.alpha);
            } else {
                this.fader.setAlpha(this.fader.alpha - game.settings.t8nSpeed);
            }

        } else if (this.fading == "out") {

            if (this.fader.alpha + game.settings.t8nSpeed >= 1) {
                this.fading = false;
                this.fader.setAlpha(1);
                if (this.intent != false) {
                    switch (this.intent) {
                        case "restart":
                            this.bgm.volume =.5*game.settings.musicVolume;
                            this.scene.restart();
                            break;
                        case "menu":
                            game.settings.playing = false;
                            this.bgm.stop();
                            this.scene.start("menuScene");
                            break;
                    }
                }
            } else {
                this.fader.setAlpha(this.fader.alpha + game.settings.t8nSpeed);
            }

        } else {
            
            //update customers
            this.customers.children.each(function(customer) {
                customer.update();
            }, this); //flag
        
            // if player hasn't died yet
            if (!this.gameoverTop && !this.gameoverBot) {
    
                // update scrolling background
                this.background.tilePositionY += this.scroll*delta*2/33;
    
                // update player
                this.player.update();
                this.player.isJump = true;

                // update ooze
                this.ooze.update();

                //flip sprite when player turns
                if (this.player.isTurn) { 
                    //console.log('turning');
                    this.player.toggleFlipX();
                    this.player.isTurn = false;
                }

                // face angry customers
                this.agCustomers.children.each(function(agCustomer) {
                    if (agCustomer.x < this.player.x) {
                        agCustomer.setFlipX(false);
                    } else {
                        agCustomer.setFlipX(true);
                    }
                }, this);

                // check if player died
                // give player some leeway so they don't get eaten by particles
                if (this.player.y < this.ooze.y-80) {
                    this.gameoverTop = true;
                } else if (this.player.y > game.config.height+50) {
                    this.gameoverBot = true;
                }

                // if player *just* died, perform,, the rituals
                if (this.gameoverTop || this.gameoverBot) {

                    // turn off player movement
                    this.player.body.velocity.x = 0;
                    this.player.body.velocity.y = 0;
                    this.player.body.bounce.x = 0;
                    this.player.body.bounce.y = 0;
                    this.player.body.allowGravity = false;

                    // stop *everything*
                    this.platformTimer.paused = true;
                    this.scroll = 0; //flag

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

                    /*this.customers.children.each(function(customer) {
                        customer.body.velocity.y = 0;
                    }, this);*/ //flag

                    this.agCustomers.children.each(function(agCustomer) {
                        agCustomer.body.velocity.y = 0;
                    }, this);

                    // final score
                    this.finScore = this.score;

                    // quiet bgm
                    this.bgm.volume = 0.2*game.settings.musicVolume;

                    // text spacer for game over text
                    // kludge
                    this.textSpacer = 60;
                    let textSpacer = 60;

                    // create game over text
                    // note 2 cam from cam: clean this up, remove magic #s -love, cam
                    if(this.gameoverTop){
                        this.add.rectangle (
                            game.config.width/2, game.config.height/2,
                            500, 400, 0x000000
                        ).setOrigin(0.5);
                    }else{
                        this.makeBlackboard(
                            game.config.width/2, game.config.height/2,
                            500,400,.5);
                    }
                    
                    this.add.text (
                        game.config.width/2, (game.config.height/2)-(2*textSpacer),
                        "Game Over", this.gameOverHeaderConfig
                    ).setOrigin(0.5);
                    
                    // because im fuckinge crazie
                    let secs;
                    if (this.finScore == 1) {
                        secs = " second";
                    } else {
                        secs = " seconds";
                    }

                    this.add.text (
                        game.config.width/2, game.config.height/2,
                        "after only " + this.finScore + secs + " at work",
                        this.gameOverInfoConfig
                    ).setOrigin(0.5);

                    this.add.text (
                        game.config.width/2-80, game.config.height/2+textSpacer,
                        "Try again", this.gameOverInstructionsConfig
                    )

                    this.add.text (
                        game.config.width/2-80, game.config.height/2+2*textSpacer,
                        "Return to menu", this.gameOverInstructionsConfig
                    );
        
                    // add selector
                    this.selectorText = this.add.sprite (
                        game.config.width/2-90, game.config.height/2+textSpacer, 
                        "selector").setOrigin(1,0);

                    if (this.gameoverTop) {

                        this.add.text (
                            game.config.width/2, game.config.height/2-textSpacer,
                            'You were consumed by the void', this.gameOverInfoConfig
                        ).setOrigin(0.5);

                        // cover screen with ooze
                        this.ooze.body.setVelocityY(game.settings.oozeSpeed*10);
                    
                        // om nom nom ( ิ౪ ิ)っ─∈
                        this.sound.play("sfxConsume", {volume: 0.4*game.settings.effectVolume});
                        
                    } else if (this.gameoverBot) {

                        this.add.text (
                            game.config.width/2, game.config.height/2-textSpacer,
                            'You fell to your death', this.gameOverInfoConfig
                        ).setOrigin(0.5);

                        // aaaaaaaaaaaaaaaaaa
                        this.sound.play("sfxFall", {volume: 0.4*game.settings.effectVolume});
                    
                    }
                    
                }
        
            // else, if player's dead
            } else {

                // handle menu
                if (Phaser.Input.Keyboard.JustDown(keyUP)) {
                    switch (this.selected) {
                        case "menu":
                            this.selected = "restart";
                            this.selectorText.y -= this.textSpacer;
                            this.sound.play("sfxUIClick", {volume: 0.8*game.settings.effectVolume});
                            break;
                    }
                }
        
                if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
                    switch (this.selected) {
                        case "restart":
                            this.selected = "menu";
                            this.selectorText.y += this.textSpacer;
                            this.sound.play("sfxUIClick", {volume: 0.8*game.settings.effectVolume});
                            break;
                    }
                }
        
                if (Phaser.Input.Keyboard.JustDown(keyJUMP)) {
                    switch (this.selected) {
                        case "restart":
                            this.fading = "out";
                            this.intent = "restart";
                            break;
                        case "menu":
                            this.fading = "out";
                            this.intent = "menu";
                            break;
                    }
                }

            } 

            // prevent ooze from going off screen
            if (this.ooze.y > game.config.height) {
                this.stopOoze();
            }

            // move ooze mass where it needs to be
            this.oozeMass.y = this.ooze.y - game.config.height - 100;

        }
    
    }

    // cleanUp()
    // removes off-screen objects
    cleanUp() {

        // clean up platforms
        this.platforms.children.each(function(platform) {
            if (platform.y < this.ooze.y-platform.height) {
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
                
                // creep ooze down
                if (!this.gameoverTop&&!this.gameoverBot) {//flag
                    this.oozeCreep();
                    let warning = this.add.sprite(shelf.x, shelf.y+50, 'spritesheet', 'spike1').setOrigin(.5, 0);
                    warning.anims.play('oozeSpike'); 
                    warning.on('animationcomplete', () => {
                        warning.destroy()
                    });
                } else console.log('ooze continues')
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
                // creep ooze down
                if (!this.gameoverTop&&!this.gameoverBot) {//flag
                    this.oozeCreep();
                    let warning = this.add.sprite(mess.x, mess.y, 'spritesheet', 'spike1').setOrigin(.5, 0);
                    warning.anims.play('oozeSpike'); 
                    warning.on('animationcomplete', () => {
                        warning.destroy()
                    });
                } else console.log('ooze continues')
                mess.destroy();
            }
        }, this);

        // clean up customers
        /*this.customers.children.each(function(customer) {
            if (customer.y < this.ooze.y-customer.height) {
                customer.destroy();
            }
        }, this);*/ //flag

        // clean up angry customers
        this.agCustomers.children.each(function(agCustomer) {
            if (agCustomer.y < this.ooze.y-agCustomer.height) {
                if (!this.gameoverBot && !this.gameoverBot) {
                    agCustomer.destroy();
                }
                //turn on if you want ooze to move when customer hits top of screen
                //this.oozeCreep();
            }
        }, this);

    }

    // scoreUp()
    //  increase score every second
    scoreUp() {
        
        if (!this.gameoverBot && !this.gameoverTop) {
        
            // increment score
            this.score++;

            // update scoreBoard
            this.scoreBoard.setText(this.score);
        
            if ((this.score%this.diffCheck == 0) && (this.score > 0)) {
                 
                if(this.itemDrop<this.itemMax)this.itemDrop += this.itemPlus;

                else if(this.scroll < this.speedCapInit){
                
                // make scrolling + spawning a little faster
                this.scroll += this.speedUp;
                this.platformTimer.timeScale = 1 + (0.3*this.scroll);

                //scale player jump and move to platform speed
                this.player.jumpHeight -= 15; // 90 is = to this.scroll*jumpheight //flag may need balancing
                this.player.speedCap += 50*this.speedUp//check
                
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

                /*this.customers.getChildren().forEach(function (customer) {
                    customer.body.velocity.y = this.scroll*this.platMod;
                }, this);*/ //flag

                this.agCustomers.getChildren().forEach(function (agCustomer) {
                    agCustomer.body.velocity.y = this.scroll*this.platMod;
                }, this);

                }

                else if (this.score >= this.bonusTime){
                    // make scrolling + spawning a little faster
                    this.scroll += this.speedUp/2;
                    this.platformTimer.timeScale = 1 + (0.2*this.scroll);

                    //scale player jump to platform speed
                    this.player.jumpHeight -= 15; // 90 is = to this.scroll*jumpheight //flag may need balancing
                    this.player.speedCap += 50*this.speedUp//check
                
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

                    /*this.customers.getChildren().forEach(function (customer) {
                        customer.body.velocity.y = this.scroll*this.platMod;
                    }, this);*/ //flag

                    this.agCustomers.getChildren().forEach(function (agCustomer) {
                        agCustomer.body.velocity.y = this.scroll*this.platMod;
                    }, this);

                }  
            }
        }
    }

    /******************
     * ooze functions *
     ******************/

    // oozeCreep()
    //  makes the ooze creep down the screen an amount determined by
    //  game.settings.oozeSpeed and game.settings.oozeDrop
    oozeCreep() {
        // shake screen?
        this.sound.play("sfxOops", {volume: 0.2*game.settings.effectVolume});
        this.ooze.body.setVelocityY(game.settings.oozeSpeed);
        let timer = this.time.delayedCall(game.settings.oozeDrop, this.stopOoze, [], this);
    }

    // stopOoze()
    //  stop ooze immediately
    stopOoze() {
        this.ooze.body.setVelocityY(0);
    }

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
        //will not work if player is moving (bug or feature?)
        if (!player.hasBox && Phaser.Input.Keyboard.JustDown(keyINTERACT)) {
            player.hasBox = true;
            box.destroy();
        }
    }

    playerShelving(player, shelf) { //will not work if player is moving (bug or feature?)
        if(player.hasBox && Phaser.Input.Keyboard.JustDown(keyINTERACT)){
            player.hasBox = false;
            player.isShelve = true;
            this.sound.play("sfxShelf", {volume: 0.4*game.settings.effectVolume});
            let timer = this.time.delayedCall(500, () => { //flag balance
                player.isShelve = false;
                //spawn full shelf sprite
                this.spawnFullShelf(shelf.x, shelf.y);
                this.madeBox = false;
                shelf.destroy();
            }, null, this);
        }
    }

    playerCleaning(player, mess){
        if(Phaser.Input.Keyboard.JustDown(keyINTERACT)){
            player.isMop = true;
            this.sound.play("sfxClean", {volume: 0.4*game.settings.effectVolume});
            let timer = this.time.delayedCall(750, () => { //flag balance
                player.isMop = false;
                mess.destroy();
            }, null, this);
        }
    }

    playerBumping(player, customer){
        this.spawnAngryCustomer(customer.x,customer.y);
        customer.destroy();
        // creep ooze down
        if (!this.gameoverTop && !this.gameoverBot) {
            this.oozeCreep();
        } //turn on if you want ooze to move when customer is bumped
    }

    /******************************
     * platform + object spawning *
     ******************************/

    // makePlatform()
    //  spawn platform randomly at bottom of screen
    makePlatform() {

        var i;
        var sx;
        for (i = 0; i < this.platNum; i++) {
            let sx2 = Phaser.Math.RND.between(this.xL, this.xR);
            if(sx == null) sx = sx2;
            else if (sx < sx2-this.platWidth&& sx > sx2-(this.platWidth+this.player.width+10)) sx = sx2 - this.player.width;
            else if(sx > sx2+this.platWidth&& sx < sx2+(this.platWidth+this.player.width+10)) sx = sx2 + this.player.width;
            else sx = sx2;
            this.xL = sx-(game.config.width*.5); //flag (*2/3) in 540p
            if (this.xL < -25)this.xL = 0;
            this.xR = sx+(game.config.width*.5); //flag (*2/3) in 540p
            if (this.xR > game.config.width+25)this.xR = game.config.width;
            //console.log(sx);

            let platform = this.platforms.create(sx, game.config.height+150, "sprites", "rampsmall");

            platform.setScale(1);
            platform.body.allowGravity = false;
            platform.body.immovable = true;
            platform.body.velocity.y = this.    platMod*this.scroll;
            platform.body.checkCollision.left = false;
            platform.body.checkCollision.right = false;
            platform.body.checkCollision.down = false;
            platform.setFrictionX(1);
            platform.setDepth(this.PLATFORM_DEPTH);

            let spawnRoll = Phaser.Math.RND.between(0, 100);

            // runs code to determine what object is spawned
            if (spawnRoll <= this.itemDrop) {
                this.spawnObject(sx, game.config.height+150-(platform.height/2));
            }
        }
    }

    spawnObject(x, y) {

        //needs an order
        let topBound = 67; //check set to 67
        let bottomBound = 34; //check set to 34

        let xRandom = Phaser.Math.RND.between(x-100, x+100); 
                if (xRandom < 50) xRandom = 50;
                if (xRandom > game.config.width-50) xRandom = game.config.width-50;

        let typeRoll = Phaser.Math.RND.between(1, 100); //change to 1, 3

        if (typeRoll<=topBound && typeRoll>=bottomBound) {
            if (!this.madeBox) {
                if (!this.player.hasBox) {
                    this.spawnBox(xRandom, y);
                    this.madeBox = true;
                } else {
                    this.madeBox = true;
                }
            } else {
                this.spawnShelf(xRandom, y); 
                this.madeBox = false;
            }
        } else if (typeRoll > topBound) {
            this.spawnMess(xRandom, y);
        } else if (typeRoll < bottomBound){ 
            this.spawnCustomer(x, y);
        }
        
    }

    spawnBox(x, y) {

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
        box.setDepth(this.BOX_DEPTH);

    }

    spawnShelf(x, y) {

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
        shelf.setDepth(this.SHELF_DEPTH);

    }

    spawnFullShelf(x, y) {

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
        shelf.setDepth(this.SHELF_DEPTH);

    }

    spawnMess(x, y) {

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
        mess.anims.play("smell", true);
        mess.setDepth(this.MESS_DEPTH);

    }

    spawnCustomer(x, y) {
        let spawnX = x -((this.platWidth/2)-20)
        let customer = new Customer (this, spawnX, y, "sprites", "customerIdle").setOrigin(0.5,1);
        this.physics.add.existing(customer); //flag
        this.customers.add(customer);
        //let customer = this.customers.create(x, y, "sprites", "customerIdle");

        customer.setScale(1);
        customer.body.allowGravity = false;
        customer.body.immovable = true;
        customer.body.velocity.y = this.platMod*this.scroll;
        customer.body.velocity.x = 0; //check
        customer.setDepth(this.CUSTOMER_DEPTH);

    }

    spawnAngryCustomer(x,y) {
   
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
        agCustomer.setDepth(this.CUSTOMER_DEPTH);
   
    }

    makeBlackboard(inX,inY,length, height, xO,yO){
        if (yO ==null) yO=xO;
        let x = inX-(xO*length);
        let y = inY-(yO*height);

        this.add.sprite(x,y,'chalkboard','boardCC')
        .setOrigin(0,0)
        .setScale(length/70,height/70);

    if(height>=140&&length>=140){
        this.add.sprite(x,y,'chalkboard','boardTL')
        .setOrigin(0);
        this.add.sprite(x+length,y,'chalkboard','boardTR')
        .setOrigin(1,0);
        this.add.sprite(x,y+height,'chalkboard','boardBL')
        .setOrigin(0,1);
        this.add.sprite(x+length,y+height,'chalkboard','boardBR')
        .setOrigin(1);
    }else if(height>=140){
        this.add.sprite(x,y,'chalkboard','boardTL')
        .setOrigin(0)
        .setScale(length/140,1);
        this.add.sprite(x+length,y,'chalkboard','boardTR')
        .setOrigin(1,0)
        .setScale(length/140,1);
        this.add.sprite(x,y+height,'chalkboard','boardBL')
        .setOrigin(0,1)
        .setScale(length/140,1);
        this.add.sprite(x+length,y+height,'chalkboard','boardBR')
        .setOrigin(1)
        .setScale(length/140,1);
    }else if(length>=140){
        this.add.sprite(x,y,'chalkboard','boardTL')
        .setOrigin(0)
        .setScale(1,height/140);
        this.add.sprite(x+length,y,'chalkboard','boardTR')
        .setOrigin(1,0)
        .setScale(1,height/140);
        this.add.sprite(x,y+height,'chalkboard','boardBL')
        .setOrigin(0,1)
        .setScale(1,height/140);
        this.add.sprite(x+length,y+height,'chalkboard','boardBR')
        .setOrigin(1)
        .setScale(1,height/140);
    } else{
        this.add.sprite(x,y,'chalkboard','boardTL')
        .setOrigin(0)
        .setScale(length/140,height/140);
        this.add.sprite(x+length,y,'chalkboard','boardTR')
        .setOrigin(1,0)
        .setScale(length/140,height/140);
        this.add.sprite(x,y+height,'chalkboard','boardBL')
        .setOrigin(0,1)
        .setScale(length/140,height/140);
        this.add.sprite(x+length,y+height,'chalkboard','boardBR')
        .setOrigin(1)
        .setScale(length/140,height/140);
    }

    if(height>140){
        if(length<140){
            this.add.sprite(x,y+70,'chalkboard','boardCL')
            .setOrigin(0)
            .setScale(length/140,(height-140)/70);
            this.add.sprite(x+length,y+70,'chalkboard','boardCR')
            .setOrigin(1,0)
            .setScale(length/140,(height-140)/70);
        }else{
            this.add.sprite(x,y+70,'chalkboard','boardCL')
            .setOrigin(0)
            .setScale(1,(height-140)/70);
            this.add.sprite(x+length,y+70,'chalkboard','boardCR')
            .setOrigin(1,0)
            .setScale(1,(height-140)/70);
        }
    }
    if(length>140){
        if(height<140){
            this.add.sprite(x+70,y,'chalkboard','boardTC')
            .setOrigin(0)
            .setScale((length-140)/70,height/140);
            this.add.sprite(x+70,y+height,'chalkboard','boardBC')
            .setOrigin(0,1)
            .setScale((length-140)/70,height/140);
        }else{
            this.add.sprite(x+70,y,'chalkboard','boardTC')
            .setOrigin(0)
            .setScale((length-140)/70,1);
            this.add.sprite(x+70,y+height,'chalkboard','boardBC')
            .setOrigin(0,1)
            .setScale((length-140)/70,1);
        }
    }
    }
}