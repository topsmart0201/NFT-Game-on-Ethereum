import Phaser from 'phaser';
import GameStates from './GameStates';
import { C_PLAYER_ATTRIBUTES } from '../lib/config';
	

export default class Preloader extends Phaser.Scene {

    /** @type {Phaser.GameObjects.Image} */
	loading;

    constructor() {
		super("Preloader");
    }

    /** @returns {void} */
	editorPreload() {
        this.load.path = "../../src/";
        this.load.pack("asset-pack", "assets/asset-pack.json");
	}

	/** @returns {void} */
	editorCreate() {

		// loading
		const loading = this.add.image(320, 150, "loading");
		this.loading = loading;
		this.events.emit("scene-awake");

	}

	
	/* START-USER-CODE */

	preload() {		

		this.editorCreate();

		this.loading.scaleX = 0;

		this.load.on(Phaser.Loader.Events.PROGRESS, p => {

			this.loading.scaleX = p;
		});		

		this.editorPreload();
	}

	create() {

		Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'minecraft', 'atlas', 'minecraft', 'minecraftXML');
		
		//initialize the starting registry values.
		this.initRegistry(); 
		this.scene.launch("GameStates"); //launch HUD
        this.scene.start("TitleScreen");

	}

	initRegistry() {
		this.registry.set('newGame', true);
		this.registry.set('health_max', C_PLAYER_ATTRIBUTES.Health);
		this.registry.set('health_current', C_PLAYER_ATTRIBUTES.Health);
		this.registry.set('magic_max', C_PLAYER_ATTRIBUTES.Magic);
		this.registry.set('magic_current', C_PLAYER_ATTRIBUTES.Magic);
		this.registry.set('coins_max', 50);
		this.registry.set('coins_current', 0);
		this.registry.set('load', 'Level1');
		this.registry.set('spawn', 'spawnStart');
		this.registry.set('enemyCount', 0);
		this.registry.set('characterNo', 0);
		this.registry.set('buttonNo', 0);
	}
}