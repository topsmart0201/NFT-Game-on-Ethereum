import Phaser from "phaser";

export default class Jug extends Phaser.GameObjects.Sprite {

    constructor(config) {
        super(config.scene, config.x, config.y,'atlas', 'jug');
    
        config.scene.physics.world.enable(this);
    
        this.scene = config.scene;

        this.number = config.number;

        this.particles = this.scene.add.particles('atlas', 'whiteParticle');
        this.emitter = this.particles.createEmitter();
        this.emitter.setPosition(this.x, this.y);
        this.emitter.setSpeed(16);
        this.emitter.setBlendMode(Phaser.BlendModes.ADD);

        this.scene.add.existing(this);
    }

    pickup () {
        //this.sound.play();

        this.emitter.explode(64, this.x, this.y);

        //find out how the max magic the player has
        let magicMax = this.scene.registry.get('magic_max'); 

        //find out how the current magic the player has
        let magicCurrent = this.scene.registry.get('magic_current'); 

        //update the player's max magic
        this.scene.registry.set('magic_max', magicMax + 5);  

        //update the player's current magic
        this.scene.registry.set('magic_current', magicCurrent + 5);  

        //find out how the max magic the player has
        magicMax = this.scene.registry.get('magic_max'); 

        //find out how the current magic the player has
        magicCurrent = this.scene.registry.get('magic_current'); 

        //check to see if current magic exceeded max magic
        if (magicCurrent > magicMax) {
            //update the player's current magic
            this.scene.registry.set('magic_current', magicMax);  
        }

        //register this object as collected with game so it is not added to future intances of this level
        this.scene.registry.set(`${this.scene.registry.get('load')}_Jug_${this.number}`, 'picked'); 

        //tell the scene the magic count has changed so the HUD is updated
        this.scene.events.emit('magicChange'); 

        this.destroy();
    }
}