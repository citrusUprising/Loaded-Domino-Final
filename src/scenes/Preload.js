class Preload extends Phaser.Scene {

    constructor() {
        super("preloadScene");
    }
    
    preload() {
        //loading bar variables
        var width = game.config.width;
        var height = game.config.height;

        //loading box and text
        //code provided by Scott Westover on GameDevAcademy
        //https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0xfacade, 0.8);
        progressBox.fillRect((width/2)-450,(height/2)-25,900,50);

        var loadingText = this.make.text({
            x: width/2,
            y: height/2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#facade'
            }
        });
        loadingText.setOrigin(0.5);

        var percentText = this.make.text({
            x: width/2,
            y: height/2,
            text: '0%',
            style:{
                font: '18px monospace',
                fill: '#222222'
            }
        });
        percentText.setOrigin(0.5);

        var flavorText = this.make.text({
            x: width/2,
            y: height/2 + 50,
            text: 'Now Hiring!',
            style: {
                font: '18px monospace',
                fill: '#facade'
            }
        });
        flavorText.setOrigin(0.5);

        //loading listeners
        //code provided by Scott Westover on GameDevAcademy
        //https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/
        this.load.on('progress', function (value) {
            console.log(value);

            percentText.setText(parseInt(value*100)-1+'%');
            progressBar.clear();
            progressBar.fillStyle(0xfacade, 1);
            progressBar.fillRect((width/2)-440,(height/2)-15,(880*value)-1,30);

            if(value<.25)flavorText.setText('Reading resumes');
            else if(value<.5)flavorText.setText('Conducting interviews');
            else if(value<.75)flavorText.setText('Balancing checkbook');
            else if(value<1)flavorText.setText('Firing employees');
            else flavorText.setText('Finalizing work schedule');//check
        });


        this.load.on('comeplete', function () {
            console.log('comeplete');
            progressBar.destroy();
            progressBox.destroy();
            percentText.destroy();
            flavorText.destroy();
        });

        // load title screen image
        this.load.image('titleInit', 'assets/titleInit.png')
        this.load.spritesheet("title", "assets/titleScroll.png", {
            frameWidth: 1280, frameHeight :720,
            startFrame: 0, endFrame: 2
        });

        // load game backdrop
        this.load.image("backDrop", "assets/ware.png");

        // load sprite atlas
        this.load.atlas("sprites", "assets/spritesheet.png", "assets/sprites.json");

        // load static void image
        this.load.image("voidStatic", "assets/voidStatic.png");

        // load void atlas
        this.load.atlas("void", "assets/voidSheet.png", "assets/voidJson.json");

        // load music
        this.load.audio('menuMusic', 'assets/bgm/OnMyWay.mp3');
        this.load.audio('gameMusic', 'assets/bgm/TheShowMustBeGo.mp3');

        // load sfx
		this.load.audio("sfxJump", ["assets/sfx/jump.mp3", "assets/sfx/jump.ogg"]);
		this.load.audio("sfxFall", ["assets/sfx/fall.mp3", "assets/sfx/fall.ogg"]);
		this.load.audio("sfxConsume", ["assets/sfx/consume.mp3", "assets/sfx/consume.ogg"]);
        this.load.audio("sfxOops", ["assets/sfx/oops.mp3", "assets/sfx/oops.ogg"]);
        this.load.audio("sfxShelf", ["assets/sfx/shelving.mp3", "assets/sfx/shelving.ogg"]);
        this.load.audio("sfxStep", ["assets/sfx/step.mp3", "assets/sfx/step.ogg"]);
        this.load.audio("sfxClean", ["assets/sfx/clean.mp3", "assets/sfx/clean.ogg"]);
        this.load.audio("sfxUIClick", ["assets/sfx/ui-click.mp3", "assets/sfx/ui-click.ogg"]);

    }
    
    create() {

        this.scene.start("menuScene");

    }

}