import Phaser from "phaser";
import Player from "../sprites/Player";
import Enemy from "../sprites/Enemy";
import Coins from "../sprites/Coins";
import Demon from "../sprites/Demon";
import Heart from "../sprites/Heart";
import Jug from "../sprites/Jug";
import Meat from "../sprites/Meat";
import Potion from "../sprites/Potion";
import Slime from "../sprites/Slime";
import DarkFireball from "../sprites/DarkFireball";
import Fireball from "../sprites/Fireball";


export default class Level extends Phaser.Scene {

    /** @type {string} */
    gameLevel;

    /** @type {number} */
    initPlayerX;

    /** @type {number} */
    initPlayerY;


    constructor() {
        super("Level");

        if(localStorage.getItem('startTime') == null) {
            let startTime = new Date().getTime();
            localStorage.setItem('startTime', startTime);
        }
        
        
    }

    create() {

        this.gameLevel = this.registry.get("load");

        this.registry.set("enemyCount", 0);

        //load map based on registry value, set physics bounds, and create layer
        this.map = this.make.tilemap({ key: `${this.gameLevel}Map` });

        //this.physics.world.bounds.width = this.map.widthInPixels;
        //this.physics.world.bounds.height = this.map.heightInPixels;

        //get tileset from tiled map 
        this.tileset = this.map.addTilesetImage('tiles');

        //create and make the layer collidable by the property set on the tileset in Tiled
        this.layer = this.map.createLayer("tileLayer", this.tileset, 0, 0);
        this.layer.setCollisionByProperty({ collide: true }); 

        this.physics.world.setBounds(0, 0, this.layer.width, this.layer.height);

        //Game Objects
        //Enemies
        this.enemies = this.add.group({
            runChildUpdate: true
        });
        
        this.enemyAttack = this.add.group({
           classType: DarkFireball,
           maxSize: 50,
           runChildUpdate: true 
        });

        //PickUps
        this.pickups = this.add.group();

        //Assign game dynamic objects from map json
        this.assignObjectsFromMap();

        //Player
        this.player = new Player({
            scene: this,
            x: this.initPlayerX,
            y: this.initPlayerY - 100
        }).setScale(0.6, 0.5);

        this.playerAttack = this.add.group({
            classType: Fireball,
            maxSize: 100,
            runChildUpdate: true 
        });

        this.playerNo = this.registry.get("characterNo") + 1;
        this.playerFace = this.add.image(580, 70, "doge" + this.playerNo).setOrigin(0.5, 0.5).setScale(0.23).setScrollFactor(0);
        
        //Initialize camera attributes
        this.initCamera();

        //Set the Collision Event
        this.initCollider();

        this.backSound = this.sound.add('back');
        this.backSound.setLoop(true);
        this.backSound.play();

        if (this.registry.get('newGame') === true) {
            this.newGame();
            this.centerText = true;
            this.textCall = 1;
        } 
        else {
            this.centerText = false;
        }
    }

    update (time, delta) {
        this.player.update(time, delta);

        if (this.player.alive) {

        }
    }

    initCamera() {

		const cam = this.cameras.main;
		cam.setBounds(0, 0, this.layer.width, this.layer.height);
		cam.setRoundPixels(true);
        cam.startFollow(this.player);
	}
    
    initCollider() {
        this.physics.add.collider(this.player, this.layer);

        this.physics.add.collider(this.player, this.enemies, this.playerEnemy);

        this.physics.add.collider(this.enemies, this.layer);

        this.physics.add.collider(this.enemies, this.enemies);

        //collide callback for fireball hitting wall
        this.physics.add.collider(this.playerAttack, this.layer, this.fireballWall);  

        //collide callback for fireball hitting wall
        this.physics.add.collider(this.enemyAttack, this.layer, this.fireballWall);  

        //collide callback for fireball hitting enemy
        this.physics.add.collider(this.playerAttack, this.enemies, this.fireballEnemy); 

        //collide callback for fireball hitting darkFireball
        this.physics.add.collider(this.playerAttack, this.enemyAttack, this.fireballFireball); 

        //collide callback for fireball hitting player
        this.physics.add.collider(this.player, this.enemyAttack, this.fireballPlayer); 
    }

    assignObjectsFromMap() {
        //objects in map are checked by type(assigned in object layer in Tiled) and the appopriate extended sprite is created
        //find the object layer in the tilemap named 'objects'
        const objects = this.map.getObjectLayer('objects'); 
        
        //initialize our coin numbering used to check if the coin has been picked up
        let coinNum = 1;
        
        //initialize our meat numbering used to check if the meat has been picked up
        let meatNum = 1; 
        
        //initialize our potion numbering used to check if the potion has been picked up
        let potNum = 1;
        
        //initialize our jug numbering used to check if the jug has been picked up
        let jugNum = 1;
        
        //initialize our heart numbering used to check if the heart has been picked up
        let heartNum = 1;
        
        //initialize our enemy numbering used to check if the enemy has been killed
        let enemyNum = 1;
        
        //initialize our demon numbering used to check if the demon has been killed
        let demonNum = 1;
        
        //initialize our slime numbering used to check if the slime has been killed
        let slimeNum = 1; 

        let regName

        objects.objects.forEach (
            (object) => {
                //create a series of points in our spawnpoints array
                if (object.name === 'spawn') {
                    this.initPlayerX = object.x;
                    this.initPlayerY = object.y;
                }

                if (object.name === 'coins') {
                    //check the registry to see if the coin has already been picked. If not create the coin in the level and register it with the game
                    regName = `${this.gameLevel}_Coins_${coinNum}`;
                    if (this.registry.get(regName) !== 'picked') {
                        let coins = new Coins({
                            scene: this,
                            x: object.x + 2, 
                            y: object.y - 4,
                            number: coinNum
                        });
                        this.pickups.add(coins);
                        this.registry.set(regName, 'active');
                    }
                    coinNum += 1;
                }

                if (object.name === 'meat') {
                    //check the registry to see if the meat has already been picked. If not create the meat in the level and register it with the game
                    regName = `${this.gameLevel}_Meat_${meatNum}`;
                    if (this.registry.get(regName) !== 'picked') {
                        let meat = new Meat({
                            scene: this,
                            x: object.x + 8, 
                            y: object.y - 8,
                            number: meatNum
                        });
                        this.pickups.add(meat);
                        this.registry.set(regName, 'active');
                    }
                    coinNum += 1;
                }

                if (object.name === 'potion') {
                    //check the registry to see if the potion has already been picked. If not create the potion in the level and register it with the game
                    regName = `${this.gameLevel}_Potion_${potNum}`;
                    if (this.registry.get(regName) !== 'picked') {
                        let potion = new Potion({
                            scene: this,
                            x: object.x + 8, 
                            y: object.y - 8,
                            number: potNum
                        });
                        this.pickups.add(potion);
                        this.registry.set(regName, 'active');
                    }
                    potNum += 1;
                }

                if (object.name === 'jug') {
                    //check the registry to see if the jug has already been picked. If not create the jug in the level and register it with the game
                    regName = `${this.gameLevel}_Jug_${jugNum}`;
                    if (this.registry.get(regName) !== 'picked') {
                        let jug = new Jug({
                            scene: this,
                            x: object.x + 8, 
                            y: object.y - 8,
                            number: jugNum
                        });
                        this.pickups.add(jug);
                        this.registry.set(regName, 'active');
                    }
                    jugNum += 1;
                }

                if (object.name === 'heart') {
                    //check the registry to see if the heart has already been picked. If not create the heart in the level and register it with the game
                    regName = `${this.gameLevel}_Heart_${heartNum}`;
                    if (this.registry.get(regName) !== 'picked') {
                        let heart = new Heart({
                            scene: this,
                            x: object.x + 8, 
                            y: object.y - 8,
                            number: heartNum
                        });
                        this.pickups.add(heart);
                        this.registry.set(regName, 'active');
                    }
                    heartNum += 1;
                }

                if (object.name === "enemy") {
                    //check the registry to see if the enemy has already been killed. If not create the enemy in the level and register it with the game
                    regName = `${this.gameLevel}_Enemies_${enemyNum}`;
                    if (this.registry.get(regName) !== 'dead') {
                        let enemy = new Enemy({
                            scene: this,
                            x: object.x + 8, 
                            y: object.y - 8,
                            number: enemyNum
                        });
                        this.enemies.add(enemy);
                        this.registry.set(regName, 'active');
                        this.events.emit('updateEnemyChange', 'add');
                    }
                    enemyNum += 1;
                }

                if (object.name === "demon") {
                    //check the registry to see if the demon has already been killed. If not create the demon in the level and register it with the game
                    regName = `${this.gameLevel}_Demon_${demonNum}`;
                    if (this.registry.get(regName) !== 'dead') {
                        let demon = new Demon({
                            scene: this,
                            x: object.x + 8, 
                            y: object.y - 8,
                            number: demonNum
                        });
                        this.enemies.add(demon);
                        this.registry.set(regName, 'active');
                        this.events.emit('updateEnemyChange', 'add');
                    }
                    demonNum += 1;
                }

                if (object.name === "slime") {
                    //check the registry to see if the slime has already been killed. If not create the slime in the level and register it with the game
                    regName = `${this.gameLevel}_Slime_${slimeNum}`;
                    if (this.registry.get(regName) !== 'dead') {
                        let slime = new Slime({
                            scene: this,
                            x: object.x + 8, 
                            y: object.y - 8,
                            number: slimeNum
                        });
                        this.enemies.add(slime);
                        this.registry.set(regName, 'active');
                        this.events.emit('updateEnemyChange', 'add');
                    }
                    slimeNum += 1;
                }
            }
        );
        
    }

    newGame() {
        this.registry.set('newGame', false);
        /*
        this.text = this.add.bitmapText(this.player.x, this.player.y - 32, 'minecraft', 'Press arrow key to move.');
        this.text.setOrigin(.5);
        this.time.addEvent({ delay: 6000, 
            callback: () => {
                this.changeText(this.textCall);
                this.textCall += 1;
            },
            callbackScope: this,
            repeat: 5
        });
        */
    }

    changeText(number) {

    }

    playerEnemy(player, enemy){
        if (enemy.alive){
            player.damage(enemy.attack);
        }
    }

    fireballWall(fireball, wall) {
        if (fireball.active) {
            fireball.wallCollide();
        }
    }

    fireballEnemy(fireball, enemy) {
        if (fireball.active) {
            fireball.enemyCollide(enemy);
        }
    }

    fireballPlayer(player, fireball) {
        if (fireball.active) {
            fireball.playerCollide(player);
        }
    }

    fireballFireball(fireball1, fireball2) {
        if (fireball1.active && fireball2.active) {
            fireball1.fireballCollide();
            fireball2.fireballCollide();
        }
    }

    end(type) {
        if (type === 'restart') {
            this.scene.restart();
        } 
        else if (type === 'gameOver') {
            this.cameras.main.fade(1000, 16.5, 2.0, 1.2);
            this.events.emit('gameOver');
            this.time.addEvent({ delay: 1000, callback: () => {this.scene.start('GameOver', 'lose');}, callbackScope: this });
        } 
        else if (type === 'win') {
            this.cameras.main.fade(1000, 16.5, 2.0, 1.2);
            this.events.emit('gameOver');
            this.time.addEvent({ delay: 1000, callback: () => {this.scene.start('GameOver', 'win');}, callbackScope: this });
        }
    }
}