import Phaser from "phaser";
import Enemy from "./Enemy";
import Meat from "./Meat";
import Potion from "./Potion";

export default class Slime extends Enemy {

    constructor(config) {
		super(config);
		this.setFrame('slime');
		this.number
		this.health = 2;
		this.detectionDistance = 48;
    	this.walk = 8;
    	this.run = 16;
	}

	deathRegister() {
    	this.scene.registry.set(`${this.scene.registry.get('load')}_Slime_${this.number}`, 'dead');
        this.scene.events.emit('updateEnemyChange', 'dead');
  	}

  	dropLoot() {
	    let decision = Phaser.Math.RND.integerInRange(1, 20);
	    if (decision <= 2) {
            let potion = new Potion({
                scene: this.scene,
                x: this.x, 
                y: this.y,
                number: 0
            });
            this.scene.pickups.add(potion);
            //this.dropSound.play();
	    } 
        else if (decision > 2 && decision <= 4) {
            let meat = new Meat({
                scene: this.scene,
                x: this.x, 
                y: this.y,
                number: 0
            });
            this.scene.pickups.add(meat);
            //this.dropSound.play();
	    }
	}
}