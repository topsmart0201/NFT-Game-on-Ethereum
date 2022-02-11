import Phaser from "phaser";
import {C_PLAYER_ATTRIBUTES} from '../lib/config';

export default class Player extends Phaser.GameObjects.Sprite {

    constructor(config) {
        super(config.scene, config.x, config.y, 'player', 'sprites/player-right-1');
        
        console.log("Y position = " + config.y);
        
        config.scene.physics.world.enable(this);

        this.scene = config.scene;
        this.scene.physics.add.existing(this);

        this.body.setBounceY(C_PLAYER_ATTRIBUTES.BounceY);
        this.body.setGravityY(C_PLAYER_ATTRIBUTES.Gravity);
        this.body.setCollideWorldBounds(true);

        this.alive = true;
        this.damaged = false;
        this.fireKeyPressed = false;
        this.fireForward = true;
        
        this.input = this.scene.input.keyboard.createCursorKeys();

        //property controls whether the level can restart so that it can only be called once        
        this.canLoad = true;  

        this.scene.add.existing(this);

        this.shootSound = this.scene.sound.add('shoot');
    }

    update(time, delta) {
        if (this.alive) {
            let healthCurrent = this.scene.registry.get('health_current');
            if (healthCurrent <= 0) {
                this.alive = false;
                this.setTint(0x2a0503);
                this.scene.time.addEvent({ delay: 1000, callback: this.gameOver, callbackScope: this });
            }

            //call pickup method when player overlaps pickup objects
            this.scene.physics.overlap(this, this.scene.pickups, this.pickup); 

            //movement
            /*
            if (!this.damaged) {
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
            }
            */

            if (this.input.left.isDown) {
                this.body.velocity.x = -C_PLAYER_ATTRIBUTES.SpeedX;
                this.play("sprites/player-run", true);
                this.flipX = true;
                this.fireForward = false;
            }
            else if (this.input.right.isDown) {
                this.body.velocity.x = C_PLAYER_ATTRIBUTES.SpeedX;
                this.play("sprites/player-run", true);
                this.flipX = false;
                this.fireForward = true;
            }
            else {
                //console.log("Flipx = " + this.flipX ? "true" : "false");
                this.play("sprites/player-right-1", true);
                
                this.body.velocity.x = 0;
            }

            if (this.input.up.isDown && this.body.onFloor()) {
                this.body.velocity.y = -C_PLAYER_ATTRIBUTES.SpeedY;
            }
                        
            if (this.fireKeyPressed && this.input.space.isUp) {
                let magic = this.scene.registry.get('magic_current');
                if (magic > 0) {
                    let fireball = this.scene.playerAttack.get();
                    let fireballOffset = this.fireForward ? 5 : -5
                    if (fireball) {
                        fireball.fire(this.x + fireballOffset, this.y, this.fireForward);
                        this.shootSound.play();
                    }
                    this.scene.registry.set('magic_current', magic - 1);
                    this.scene.events.emit('magicChange'); //tell the scene the magic has changed so the HUD is updated
                } 
                else {
                    //this.noMagicSound.play();
                }
                this.fireKeyPressed = false;
            }

            if (this.input.space.isDown)
                this.fireKeyPressed = true;

            //check if outside bounds, if out of bounds set load and spawn registry to appropriate value from map then tell the Level to reload
            if (this.canLoad) {
                if (this.x >= this.scene.physics.world.bounds.width - 16) {
                    //if (this.scene.registry.get("enemyCount") <= 0) {
                        let level = this.scene.registry.get('load');
                        if (level === "Level1" || level == "Level2") {
                            this.canLoad = false;
                            this.scene.registry.set('load', "Level2");
                            this.scene.end('restart');
                        }
                    //}
                }
            }
        }
    }

    pickup(player, object) {
        //call the pickup objects method
        object.pickup();
    }

    damage(ammount) {
        if (!this.damaged && this.alive) {
            this.scene.cameras.main.shake(32);
            this.damaged = true;

            //find out the player's current health
            let health = this.scene.registry.get('health_current'); 
            //update the player's current health
            this.scene.registry.set('health_current', health - ammount);  

            //tell the scene the health has changed so the HUD is updated
            this.scene.events.emit('healthChange'); 
            this.setTint(0x8e2f15);

            this.scene.time.addEvent({ delay: 1000, callback: this.normalize, callbackScope: this });
        }
    }

    gameOver() {
        this.scene.end('gameOver');
    }

    normalize() {
        if (this.alive) {
            this.damaged = false;
            this.setTint(0xffffff);
        }
    }
}