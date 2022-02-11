import Phaser from "phaser";

export default class Potion extends Phaser.GameObjects.Sprite {

    constructor(config) {
        super(config.scene, config.x, config.y,'atlas', 'potion');
    
        config.scene.physics.world.enable(this);
    
        this.scene = config.scene;

        this.number = config.number;

        this.scene.add.existing(this);
    }

    pickup () {
        //this.sound.play();

        //find out how much magic the player currently has
        let magic = this.scene.registry.get('magic_current'); 
        if (magic < this.scene.registry.get('magic_max')) {
            //update the player's current magic
            this.scene.registry.set('magic_current', magic + 5);  
        }

        magic = this.scene.registry.get('magic_current');

        //check to see if current magic exceeded max magic
        if (magic > this.scene.registry.get('magic_max')) {
            this.scene.registry.set('magic_current', this.scene.registry.get('magic_max'));  //update the player's current magic
        }
        
        //register this object as collected with game so it is not added to future intances of this level
        this.scene.registry.set(`${this.scene.registry.get('load')}_Potion_${this.number}`, 'picked'); 
        
        //tell the scene the magic count has changed so the HUD is updated
        this.scene.events.emit('magicChange'); 
        
        this.destroy();
    }
}