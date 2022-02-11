import Phaser from "phaser";

export default class Heart extends Phaser.GameObjects.Sprite {

    constructor(config) {
        super(config.scene, config.x, config.y,'atlas', 'heart');
    
        config.scene.physics.world.enable(this);
    
        this.scene = config.scene;        

        this.number = config.number;
        
        this.scene.add.existing(this);
    }

    pickup () {
        //this.sound.play();

        //find out how much health the player currently has
        let healthCurrent = this.scene.registry.get('health_current'); 
        
        //find out how much health the player currently has
        let healthMax = this.scene.registry.get('health_max'); 
        
        //update the player's current health
        this.scene.registry.set('health_current', healthCurrent + 1);  
        
        //update the player's max health
        this.scene.registry.set('health_max', healthMax + 1);  
        
        //find out how much health the player currently has
        healthCurrent = this.scene.registry.get('health_current');

        //find out how much health the player currently has
        healthMax = this.scene.registry.get('health_max'); 

        //make sure current health has not exceeded max health
        if (healthCurrent > healthMax) { 
            this.scene.registry.set('health_current', healthMax);  
        }

        //register this object as collected with game so it is not added to future intances of this level
        this.scene.registry.set(`${this.scene.registry.get('load')}_Heart_${this.number}`, 'picked'); 
        
        //tell the scene the health has changed so the HUD is updated
        this.scene.events.emit('healthChange'); 
        
        this.destroy();
    }
}