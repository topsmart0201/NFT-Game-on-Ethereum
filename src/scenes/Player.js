var web3, account, contract, balance;
import Web3 from 'web3';
import ABI from '../contract/dogeABI.json';
import { dogeContract } from '../contract/contractAddress';
import { C_AXIOS_CONFIG } from '../lib/config';
import axios from 'axios';


const http = axios.create( C_AXIOS_CONFIG );

export default class Player {

    getWalletInfo(titleScreen) {
        $.blockUI({
          message : `<h5>
            <img src = "/src/assets/environment/loading.gif"/>
          </h5>`
        });
        (async () => {
            if (window.ethereum) {
              try {
                await window.ethereum.send('eth_requestAccounts');
                await window.ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: '0x38' }]
                });

                 web3 = await new Web3(window.ethereum);
                 account = await web3.eth.getAccounts();
                 contract = await new web3.eth.Contract(ABI, dogeContract);
                 let numOfddoge = await contract.methods.balanceOf(account[0]).call({from : account[0]});
                 balance = numOfddoge / (10**18);
                 saveBalanceToLocalStorage(balance);
                 this.checkExistence(account[0], titleScreen);
                

              } catch (error) {
                if (error.code === 4902) {
                  try {
                    await window.ethereum.request({
                      method: 'wallet_addEthereumChain',
                      params: [{
                        chainId: '0x38',
                        chainName: 'Binance Smart Chain',
                        nativeCurrency: {
                          name: 'BNB',
                          symbol: 'BNB',
                          decimals: 18
                        },
                        rpcUrls: ['https://bsc-dataseed.binance.org/'],
                        blockExplorerUrls: ['https://bscscan.com/'],
                      }]
                    });
                    window.location.href = '/';
                  } catch (err) {
                    console.log(err);
                    alert('Please install metamask');
                    window.location.href = '/';
                  }
                }
              }
            }
          })();
    }

    createNewPlayer(_address, _balance) {
        let playerData = {
            address : _address,
            roiPercent : 0,
            feePercent : 0.5,
            totalDate : 0,
            chaNum : 1,
            status : 'pending',
            tokens : 0,
            balance : _balance
        }
        saveToLocalStorage(playerData);
        return true;
    }

    checkExistence(_address, titleScreen) {
        
        http.get(`/check/${_address}/`)
            .then((res) => {
                if(res.data.msg == 'no exist') {
                    console.log('Create Player!');
                    let isCreated = this.createNewPlayer(_address, balance);
                    if(isCreated) {
                        titleScreen.scene.start('ChooseCharacter');
                    }
                } else {
                    console.log('Player exists');
                    saveToLocalStorage(res.data.data[0]);
                    titleScreen.scene.start('Menu');
                }
                $.unblockUI();
            })
            .catch((err) => {
                console.log(err);
                alert('Network Error!')
                $.unblockUI();
            });
    }

}
function saveToLocalStorage(data) {
    let stringData = JSON.stringify(data);
    localStorage.setItem('player', stringData);
}

function saveBalanceToLocalStorage(data) {
  localStorage.setItem('balance', data);
}