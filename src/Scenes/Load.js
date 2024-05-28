const BG_KEY = "background";

class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {

        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("bunny", "bunny.png", "bunny.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilemap_packed.png");                         // Packed tilemap
        this.load.image("bg", "bg.png");
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");   // Tilemap in JSON

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.bitmapFont("minecraftia", "Minecraftia_0.png", "Minecraftia.fnt");

        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        this.load.multiatlas("kenny-particles", "kenny-particles.json");

    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('bunny', {
                prefix: "bunny2_walk",
                start: 1,
                end: 2,
                suffix:".png"
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "bunny",
            frames: [
                { frame: "bunny2_stand.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "bunny",
            frames: [
                { frame: "bunny2_jump.png" }
            ],
        });

        this.anims.create({
            key: 'grow',
            frames: this.anims.generateFrameNumbers('tilemap_sheet', { frames: [56, 72]}),
            frameRate: 2,
            repeat: -1
        });

         // ...and pass to the next Scene
         this.scene.start("platformerScene");

    }

    // Never get here since a new scene is started in create()
    update() {
    }
}