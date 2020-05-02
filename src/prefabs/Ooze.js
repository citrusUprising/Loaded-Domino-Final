class Ooze extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
    }

    update() {
        this.y += game.settings.oozeSpeed;
        this.anims.play("voider", true);
    }
}