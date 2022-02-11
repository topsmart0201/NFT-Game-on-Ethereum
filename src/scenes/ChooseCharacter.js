import Phaser from 'phaser';
import Level from './Level';
import axios from 'axios';
import { busdContract } from '../contract/contractAddress';
import ABI from '../contract/busdABI.json';
import Web3 from 'web3';

import { C_AXIOS_CONFIG, MERCHANT_ADDRESS } from '../lib/config';
const http = axios.create( C_AXIOS_CONFIG );
var chaNum, roiPercent, fee, web3, contract;
export default class ChooseCharacter extends Phaser.Scene {

    constructor() {
		super("ChooseCharacter");
	}

    
    create() {
        this.cameras.main.setBackgroundColor(0x2a0503);
        //this.cameras.main.setBackgroundColor(0x000000);

        this.titleText = this.add.bitmapText(210, 80, 'minecraft', 'Choose a player you like.').setScrollFactor(0);

        this.doges = [];
        this.doges[0] = this.add.image(150, 140, "doge1").setOrigin(0.5, 0).setScale(0.2);
        this.doges[1] = this.add.image(243, 140, "doge2").setOrigin(0.5, 0).setScale(0.2);
        this.doges[2] = this.add.image(336, 140, "doge3").setOrigin(0.5, 0).setScale(0.2);
        this.doges[3] = this.add.image(429, 140, "doge4").setOrigin(0.5, 0).setScale(0.2);

        this.characterNo = this.registry.get('characterNo');
        this.doges[this.characterNo].setScale(0.3).setPosition(150 + 93 * this.characterNo, 130);
        
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
        this.registry.set('characterNo', this.characterNo);
        chaNum = this.characterNo;
        setRoiPercent(chaNum);
        this.time.removeAllEvents();
        this.isDogeChanging = true;
        this.blinkDoge();
        this.sendBNB(MERCHANT_ADDRESS, fee, this, 'create');
    }

    leftPressed() {
        if (this.isDogeChanging)
            return;

        if (this.characterNo > 0)
            this.characterNo --;
        
        for (let i = 0; i < 4; i ++) {
            if (this.characterNo == i)
                this.zoomDoge(this.doges[i]);
            else
                this.doges[i].setScale(0.2).setPosition(this.doges[i].x, 140);
        }
    }

    rightPressed() {
        if (this.isDogeChanging)
            return;

        if (this.characterNo < 3)
            this.characterNo ++;
        
        for (let i = 0; i < 4; i ++) {
            if (this.characterNo == i)
                this.zoomDoge(this.doges[i]);
            else
                this.doges[i].setScale(0.2).setPosition(this.doges[i].x, 140);
        }
    }


    blinkDoge() {
        if (this.isDogeChanging) {
            for (let i = 0; i < 4; i ++)
                this.doges[i].visible = true;

            return;
        }

        for (let i = 0; i < 4; i ++) {
            if (this.characterNo == i)
                this.doges[i].visible = !this.doges[i].visible;
            else
                this.doges[i].visible = true;
        }
        
    }

    zoomDoge(doge) {
        let text = this.titleText;
        let alpha = 0.2;
        let posX = 140;
        
        this.tweens.addCounter({
            from: 0,
            to: 10,
            duration: 150,
            onUpdate: () => {
                this.isDogeChanging = true;

                alpha += .01;
                posX -= 1;
                doge.setScale(alpha).setPosition(doge.x, posX);
            },
            onComplete: () => {
                this.isDogeChanging = false;        
            }
        });
    }

    sendBNB(_to, _amount, obj, str) {
        /**
         * Send BNB process
         */
        //  $.blockUI({
        //     message : `<h5>
        //       <img src = "/src/assets/environment/loading.gif"/>
        //     </h5>`
        //   });
        var tempData = getFromLocalStorage();
         saveToDB(tempData);
         obj.time.addEvent({ delay: 3500, callback: () => {obj.scene.start('Level');}, callbackScope: obj });
        // (async () => {
        //     web3 = await new Web3(window.ethereum);
        //     contract = await new web3.eth.Contract(ABI, busdContract);
        //     let strFee = (_amount * ( 10 ** 18 )).toString();
        //     contract.methods.transfer(_to, strFee).send({
        //         from : tempData.address,
        //         gas : 100000,
        //     }).then((res) => {
        //         saveToDB(tempData);
        //         obj.time.addEvent({ delay: 3500, callback: () => {obj.scene.start('Level');}, callbackScope: obj });
        //$.unblockUI();
        //     }).catch((err) => {
        // console.log(err);
        //$.unblockUI();
   // });
                //
        // })();

        //Go to Level!
    }
}

function getFromLocalStorage() {
    let strData = localStorage.getItem('player');
    let jsonData = JSON.parse(strData);
    return jsonData;
}

function setRoiPercent(_chaNum) {
    switch(_chaNum) {
        case 0 : 
            roiPercent = 0.002;
            fee = 100;
            break;
        case 1 : 
            roiPercent = 0.004;
            fee = 200;
            break;
        case 2 :
             roiPercent = 0.008;
             fee = 400;
             break;
        case 3 :
             roiPercent = 0.02;
             fee = 800;
             break;
    }


}

function saveToDB(_tempData) {
    //Save data to DataBase
    let balance = getBalanceFromLocalStorage();
    let tokens = balance * roiPercent * _tempData.feePercent;
    let dataToDB = {
        address : _tempData.address,
        roiPercent : roiPercent,
        feePercent : _tempData.feePercent,
        totalDate : _tempData.totalDate,
        chaNum : chaNum,
        status : _tempData.status,
        tokens : tokens
    }

    if(_tempData._id == undefined) {
        http.post('/', dataToDB )
        .then((res) => {    
            console.log('create', res.data);
            saveToLocalStorage(res.data);
        })  
        .catch((err) => {
            console.log(err);
        });
    } else {
        http.put(`/${_tempData._id}/`, dataToDB )
        .then((res) => {    
            console.log('update', res.data);
            saveToLocalStorage(res.data);
        })  
        .catch((err) => {
            console.log(err);
        });
    }
   
}

function saveToLocalStorage(data) {
    let stringData = JSON.stringify(data);
    localStorage.setItem('player', stringData);
}

function getBalanceFromLocalStorage() {
    let strData = localStorage.getItem('balance');
    return Number(strData);
}


