import Phaser from "phaser";

export default class Coins extends Phaser.GameObjects.Sprite {

    constructor(config) {
        super(config.scene, config.x, config.y, 'atlas', 'coins');
    
        config.scene.physics.world.enable(this);
    
        this.scene = config.scene;    
        
        this.number = config.number;
    
        this.scene.add.existing(this);
    }

    pickup () {
        //find out how many coins the player currently has
        let coins = this.scene.registry.get('coins_current'); 

        //update the player's coin total
        this.scene.registry.set('coins_current', coins + 1);  

        //register this object as collected with game so it is not added to future intances of this level
        this.scene.registry.set(`${this.scene.registry.get('load')}_Coins_${this.number}`, 'picked');

        //tell the scene the coint count has changed so the HUD is updated
        this.scene.events.emit('coinChange'); 

        this.destroy();
    }
}