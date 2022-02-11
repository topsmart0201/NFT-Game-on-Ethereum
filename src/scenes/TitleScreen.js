import Phaser from 'phaser';
import Level from './Level';
import PlayerInfo from './Player';
export default class TitleScreen extends Phaser.Scene {

    /** @type {Phaser.GameObjects.TileSprite} */
	background;
	/** @type {Phaser.GameObjects.TileSprite} */
	middle;
	/** @type {Phaser.GameObjects.Image} */
	title_screen;
	/** @type {Phaser.GameObjects.Image} */
	press_enter_text;
	/** @type {Phaser.GameObjects.Image} */
	instructions;


	constructor() {
		super("TitleScreen");
	}

	/** @returns {void} */
	editorCreate() {

		// background
		const background = this.add.tileSprite(0, 0, 640, 360, "back");
		background.setOrigin(0, 0);

		// middle
		const middle = this.add.tileSprite(0, 80, 640, 368, "middle");
		middle.setOrigin(0, 0);

		// title_screen
		const title_screen = this.add.image(200, 10, "title-screen").setScale(0.7, 0.7);
        title_screen.setOrigin(0, 0);

		// credits_text
		this.add.image(225, 304, "credits-text").setOrigin(0, 0);

		// press_enter_text
		const press_enter_text = this.add.image(284, 255, "press-enter-text");
        press_enter_text.setOrigin(0, 0);

		// instructions
		const instructions = this.add.image(260, 70, "instructions").setScale(0.1);
		instructions.setOrigin(0, 0);
		instructions.visible = false;

		this.background = background;
		this.middle = middle;
		this.title_screen = title_screen;
		this.press_enter_text = press_enter_text;
		this.instructions = instructions;

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	create() {

        this.editorCreate();

		this.input.keyboard.on("keydown-ENTER", this.enterPressed, this);
		this.input.on("pointerdown", this.enterPressed, this);

		this.blinkText();
	}

	enterPressed() {

		if (this.title_screen.visible) {

			this.title_screen.visible = false;
			this.instructions.visible = true;

		} else {
			
			let objPlayer = new PlayerInfo();
			objPlayer.getWalletInfo(this);
			
			
		}
	}

	blinkText() {

		this.time.addEvent({
			repeat: -1,
			delay: 1000,
			callback: () => {
				this.press_enter_text.visible = !this.press_enter_text.visible;
			}
		});
	}

	update() {

		this.background.tilePositionX += 0.3;
		this.middle.tilePositionX += 0.6;
	}

	/* END-USER-CODE */
}