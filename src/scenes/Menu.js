import Phaser from 'phaser';
import Level from './Level';
import ChooseCharacter from './ChooseCharacter';
import { C_AXIOS_CONFIG } from '../lib/config';
import axios from 'axios';

const http = axios.create( C_AXIOS_CONFIG );

export default class Menu extends Phaser.Scene {

    constructor() {
		super("Menu");
	}

    
    create() {
        this.cameras.main.setBackgroundColor(0x2a0503);
        

        this.titleText = this.add.bitmapText(330, 80, 'minecraft', 'Main Menu.').setScrollFactor(0).setOrigin(0.5, 0);

        this.doges = [];
        this.doges[0] = this.add.image(170, 180, "playgames").setOrigin(0.5, 0.5).setScale(.4);
        this.doges[1] = this.add.image(330, 180, "withdrawal").setOrigin(0.5, 0.5).setScale(.4);
        this.doges[2] = this.add.image(490, 180, "buy").setOrigin(0.5, 0.5).setScale(.4);

        this.buttonNo = this.registry.get('buttonNo');
        this.doges[this.buttonNo].setScale(0.45).setPosition(170 + 93 * this.buttonNo, 180);
        this.keys = this.input.keyboard.createCursorKeys();

        this.input.keyboard.on("keydown-ENTER", this.enterPressed, this);
        this.input.keyboard.on("keydown-LEFT", this.leftPressed, this);
        this.input.keyboard.on("keydown-RIGHT", this.rightPressed, this);

        this.time.addEvent({
            delay: 600,
            callback: () => {
                this.blinkDoge();
            },
            callbackScope: this,
            repeat: -1
        });

        this.isDogeChanging = false;
    }

    update() {
        if (this.keys.left.isDown) {

        }
        else if(this.keys.right.isDown) {

        }
    }

    enterPressed() {
        this.registry.set('buttonNo', this.buttonNo);

        this.time.removeAllEvents();
        this.isDogeChanging = true;
        this.blinkDoge();

        this.time.addEvent({ 
            delay: 1500, 
            callback: () => {
                var player = getFromLocalStorage();
                let chaNum = player.chaNum;
                this.registry.set('characterNo', Number(chaNum));

                if (this.buttonNo == 0) {
                    console.log("go to level");
                    this.scene.start('Level');                    
                } else if (this.buttonNo == 1) {
                    let balance = getBalanceFromLocalStorage();
                    withdrawal(balance, this);
                } else {
                    console.log("go to choose character");
                    this.scene.start('ChooseCharacter');
                }
            }, 
            callbackScope: this 
        });
    }

    leftPressed() {
        if (this.isDogeChanging)
            return;

        if (this.buttonNo > 0)
            this.buttonNo --;
        
        for (let i = 0; i < 3; i ++) {
            if (this.buttonNo == i)
                this.zoomDoge(this.doges[i]);
            else
                this.doges[i].setPosition(this.doges[i].x, 180).setScale(.4);
        }
    }

    rightPressed() {
        if (this.isDogeChanging)
            return;

        if (this.buttonNo < 2)
            this.buttonNo ++;
        
        for (let i = 0; i < 3; i ++) {
            if (this.buttonNo == i)
                this.zoomDoge(this.doges[i]);
            else
                this.doges[i].setPosition(this.doges[i].x, 180).setScale(.4);
        }
    }


    blinkDoge() {
        if (this.isDogeChanging) {
            for (let i = 0; i < 3; i ++)
                this.doges[i].visible = true;
            return;
        }

        for (let i = 0; i < 3; i ++) {
            if (this.buttonNo == i)
                this.doges[i].visible = !this.doges[i].visible;
            else
                this.doges[i].visible = true;
        }
        
    }

    zoomDoge(doge) {
        let text = this.titleText;
        let alpha = .4;
        
        this.tweens.addCounter({
            from: 0,
            to: 10,
            duration: 150,
            onUpdate: () => {
                this.isDogeChanging = true;

                alpha += .01;
                doge.setScale(alpha).setPosition(doge.x, 180);
            },
            onComplete: () => {
                this.isDogeChanging = false;        
            }
        });
    }
}

function withdrawal(_balance, menu) {
  
    let player = getFromLocalStorage();
    let totalDays = player.totalDate;
    let feePercent = player.feePercent;
    let roiPercent = player.roiPercent;
    let tempFeePercent = feePercent = 0.5 - (totalDays-1) * (2.5/100);
    if(tempFeePercent > 0) {
        feePercent = tempFeePercent;
    } else {
        feePercent = 0;
    }

    let tokens = _balance * roiPercent * (1 - feePercent);
    let data = {
        address: player.address,
        tokens: tokens,
        roiPercent: player.roiPercent,
        feePercent: feePercent,
        totalDate: player.totalDate,
        status : "request",
        chaNum : player.chaNum
    }
    http.put(`/${player._id}/`, data)
        .then((res) => {
            console.log('updatedTokens', res.data);
            saveToLocalStorage(res.data);
            alert('Withdrawal is requested. Pls wait for permission');
            menu.scene.start('Level');      
        })
        .catch(err => console.log(err));
}

function getFromLocalStorage() {
    let strData = localStorage.getItem('player');
    let jsonData = JSON.parse(strData);
    return jsonData;
}

function getBalanceFromLocalStorage() {
    let strData = localStorage.getItem('balance');
    return Number(strData);
}

function saveToLocalStorage(data) {
    let stringData = JSON.stringify(data);
    localStorage.setItem('player', stringData);
}