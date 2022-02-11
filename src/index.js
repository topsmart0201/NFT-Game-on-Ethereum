import Phaser from 'phaser';
import {C_MAIN_SCREEN, C_GRAVITY} from './lib/config'
import Preloader from './scenes/Preloader';
import TitleScreen from './scenes/TitleScreen';
import GameStates from './scenes/GameStates';
import Level from './scenes/Level';
import GameOver from './scenes/GameOver';
import ChooseCharacter from './scenes/ChooseCharacter';
import Menu from '../src/scenes/Menu';
import axios from 'axios';
import { C_AXIOS_CONFIG } from './lib/config';
const http = axios.create(C_AXIOS_CONFIG);


export default class Boot extends Phaser.Scene {


	preload() {
		this.load.path = "../../src/";
		this.load.pack("pack", "assets/preload-pack.json");
	}

	create() {
        this.scene.start("Preloader");
	}

}

const config = {
    type: Phaser.AUTO,
    backgroundColor: "#242424",
    width: C_MAIN_SCREEN.width,
    height: C_MAIN_SCREEN.height,
    scale: {
        //mode: Phaser.Scale.FIT,
        
    },
    physics: {
        default: 'arcade',
        arcade: {
            //gravity: { y: C_GRAVITY },
            debug: false
        }
    },
    input: {
        activePointers: 3
    },
    scene: [Boot, Preloader, GameStates, TitleScreen, Level, GameOver, ChooseCharacter, Menu]
};

const game = new Phaser.Game(config);

window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    let startTime = localStorage.getItem('startTime');
    let playerInfo = localStorage.getItem('player');
    if (playerInfo != null && startTime != null) {
      let endTime = new Date().getTime();
      let period = endTime - startTime;
      let days = makeDateFormat(period / 1000);
      updateTimeTracked(days);
    }
    e.returnValue = '';
});

function makeDateFormat(seconds) {
  
  var day = seconds / (3600 * 3);
  console.log('day', Math.floor(seconds));
  return day;

}

function getFromLocalStorage() {
    let strData = localStorage.getItem('player');
    let jsonData = JSON.parse(strData);
    return jsonData;
}

function updateTimeTracked(days) {

      let player = getFromLocalStorage();
      var totaldays = Number(days) + Number(player.totalDate);
      console.log('totalDate', totaldays);
      let data = {
            address: player.address,
            tokens: player.tokens,
            roiPercent: player.roiPercent,
            feePercent: player.feePercent,
            totalDate: totaldays,
            status : player.status,
            chaNum : player.chaNum
        }
        http.put(`/${player._id}`, data)
            .then((res) => {
                console.log('updatedTime', res.data);
                localStorage.removeItem('player');
                localStorage.removeItem('startTime');
            })
            .catch(err => console.log(err));
}

