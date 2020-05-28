class Preload extends Phaser.Scene {

    constructor() {
        super("preloadScene");
    }
    
    preload() {

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