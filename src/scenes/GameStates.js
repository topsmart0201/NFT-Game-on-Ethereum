import Phaser from 'phaser';
import Level from './Level';

export default class GameStates extends Phaser.Scene {

    /** @type {Phaser.GameObjects.bitmapText} */
    health;
    /** @type {Phaser.GameObjects.bitmapText} */
    magic;
    /** @type {Phaser.GameObjects.bitmapText} */
    coins;

    constructor() {
		super("GameStates");
	}

    create() {
        
        //Bitmap Text showing Player Health
        this.health = this.add.bitmapText(1, 1, 'minecraft', `Health: ${this.registry.get('health_current')} / ${this.registry.get('health_max')}`).setScrollFactor(0);

        //Bitmap Text showing Magic current/capacity
        this.magic = this.add.bitmapText(1, 18, 'minecraft', `Magic: ${this.registry.get('magic_current')} / ${this.registry.get('magic_max')}`).setScrollFactor(0);

        //Bitmap Text showing the number of coins
        this.coins = this.add.bitmapText(this.cameras.main.width - 1, 1, 'minecraft', `Coins: ${this.registry.get('coins_current')} / ${this.registry.get('coins_max')}`).setScrollFactor(0).setOrigin(1, 0);

        const level = this.scene.get('Level');

        //watch the level to see if the coin count has changed. Event emitted by coin class.
        level.events.on('coinChange', this.updateCoins, this);  

        //watch the level to see if the coin health has changed. Event emitted by player and meat class.
        level.events.on('healthChange', this.updateHealth, this);  

        //watch the level to see if the coin magic has changed. Event emitted by player and potion class.
        level.events.on('magicChange', this.updateMagic, this);

        //Count the number of enemies by level about "dead" or "added"
        level.events.on('updateEnemyChange', this.updateEnemyChange, this);
        
        //watch for Game Over
        level.events.on('gameOver', this.gameOver, this); 

    }

    updateCoins() {
        this.coins.setText(`Coins: ${this.registry.get('coins_current')} / ${this.registry.get('coins_max')}`);
    }

    updateHealth() {
        this.health.setText(`Health: ${this.registry.get('health_current')} / ${this.registry.get('health_max')}`);
    }

    updateMagic() {
        this.magic.setText(`Magic: ${this.registry.get('magic_current')} / ${this.registry.get('magic_max')}`);
    }

    updateEnemyChange(type) {
        let enemyCount = this.registry.get("enemyCount");

        if (type == 'add') {
            this.registry.set("enemyCount", enemyCount + 1);
        }
        else if (type == 'dead') {
            this.registry.set("enemyCount", enemyCount - 1);
        }
        enemyCount = this.registry.get("enemyCount");
        console.log("Enemy Count = " + enemyCount);
    }

    gameOver() {
        this.health.destroy();
        this.magic.destroy();
        this.coins.destroy();
    }
}