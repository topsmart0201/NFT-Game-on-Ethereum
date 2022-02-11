import Phaser from "phaser";
import Enemy from "./Enemy";
import Heart from "./Heart";
import Jug from "./Jug";
import Potion from "./Potion";
import Meat from "./Meat";

export default class Demon extends Enemy {

    constructor(config) {
        super(config)
        this.setFrame('demon');
		this.number
		this.health = 6;
		this.detectionDistance = 128;
		this.canFireball = true;
    }

    detectBehavior() {
		if ((this.distanceToPlayerX > 32 || this.distanceToPlayerY > 32) && this.canFireball) {
			this.canFireball = false;
			this.scene.time.addEvent({ delay: 2000, callback: this.enableFireball, callbackScope: this });
	        let fireball = this.scene.enemyAttack.get();
	        if (fireball) {
	        	fireball.fire(this.x, this.y);
	        }
	    } 
        else {
	    	if (this.x > this.scene.player.x) {
	    		this.moveX = 'left';
	    	} 
            else if (this.x < this.scene.player.x) {
	    		this.moveX = 'right';
	    	} else {
	    		this.moveX = 'none';
	    	}
	    }
	}

    enableFireball() {
		this.canFireball = true;
	}

	deathRegister() {
		this.scene.registry.set(`${this.scene.registry.get('load')}_Demon_${this.number}`, 'dead');
		this.scene.events.emit('updateEnemyChange', 'dead');
	}

    dropLoot() {
		let decision = Phaser.Math.RND.integerInRange(1, 20);
		if (decision <= 2) {
			let heart = new Heart({
				scene: this.scene,
				x: this.x, 
				y: this.y,
				number: 0
			});
			this.scene.pickups.add(heart);
			//this.dropSound.play();
		}  
        else if (decision > 2 && decision <= 4) {
			let jug = new Jug({
				scene: this.scene,
				x: this.x, 
				y: this.y,
				number: 0
			});
			this.scene.pickups.add(jug);
			//this.dropSound.play();
		} 
        else if (decision > 4 && decision <= 12) {
			let potion = new Potion({
				scene: this.scene,
				x: this.x, 
				y: this.y,
				number: 0
			});
			this.scene.pickups.add(potion);
			//this.dropSound.play();
		} 
        else if (decision > 12 && decision <= 20) {
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