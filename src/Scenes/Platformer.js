class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 150;
        this.DRAG = 1200;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
    }
    preload(){
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles')
        document.getElementById('description').innerHTML = '<h2>Carrot Hunt : Collect 42 Carrots to Win | Left and Right Keys : Move Player | Up Key : Jump | R : Restart Game</h2>'
    }   
    create() {
        this.myScore = 0; 

        this.step = this.sound.add('step').setRate(3).setVolume(0.25);

        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 150 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 150, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");
        this.add.image(1350,225, "bg");
        
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);

        this.animatedTiles.init(this.map);

        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.carrot = this.map.createFromObjects("Objects", {
            name: "carrot",
            key: "tilemap_sheet",
        });

        this.anims.play('grow',this.carrot);

        this.physics.world.setBounds(0, -100, 2700, 625);

        this.physics.world.enable(this.carrot, Phaser.Physics.Arcade.STATIC_BODY);
        this.carrotGroup = this.add.group(this.carrot);

        my.sprite.player = this.physics.add.sprite(45, 395, "bunny", "bunny2_stand.png").setScale(0.175);
        my.sprite.player.setCollideWorldBounds(true);

        this.physics.add.collider(my.sprite.player, this.groundLayer);


        this.physics.add.overlap(my.sprite.player, this.carrotGroup, (obj1, obj2) => {
            this.myScore+=1;
            obj2.destroy(); // remove carrot on overlap
        });

        cursors = this.input.keyboard.createCursorKeys();

        this.physics.world.debugGraphic.clear()

        this.rKey = this.input.keyboard.addKey('R');

        this.physics.world.drawDebug = false;

        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['twirl_02.png', 'twirl_03.png'],
            scale: {start: 0.03, end: 0.1},
            random: true,
            lifespan: 350,
            maxAliveParticles: 8,
            alpha: {start: 1, end: 0.1}, 
            gravityY: -400,
        });

        my.vfx.jumping = this.add.particles(0, 0, "kenny-particles", {
            frame: ['muzzle_04.png', 'muzzle_05.png'],
            scale: {start: 0.03, end: 0.1},
            lifespan: 350,
            maxAliveParticles: 4,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();
        my.vfx.jumping.stop();

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);
    }

    update() {
        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            if (!this.step.isPlaying)
            {
                this.step.play();
            }
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.walking.setParticleScale(0.5, 0.5);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            if (!this.step.isPlaying)
            {
                this.step.play();
            }
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.walking.setParticleScale(0.25, 0.25);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }
        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
            my.vfx.jumping.stop();
        }
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }

        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            my.vfx.jumping.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.jumping.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.jumping.start();
        }
        if(this.myScore == 42){
            my.sprite.player.x = 45;
            my.sprite.player.y = 395;
            this.gameover = this.add.image(350,225, "win");
            this.gameover.scaleX = 0.6;
            this.gameover.scaleY = 0.6;
        }
    }
}
