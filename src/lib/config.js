// define constant for static value
// prefix C_
export const C_MAIN_SCREEN = {
    width: 640,
    height: 360
}

export const C_GRAVITY = 300;

export const C_PLAYER_ATTRIBUTES =  {
    Gravity: 500,
    BounceY: 0.2,
    BounceX: 0.0,
    SpeedX: 65,
    SpeedY: 290,
    Health: 5,
    Magic: 30
}

export const C_ENEMY_ATTRIBUTES = {
    Gravity: 1000,
    BounceX: 0.0,
    BounceY: 0.2,
    SpeedX: 35,
    SpeedY: 150
}

export const C_FIREBALL = {
    Damage: 8,
    Speed: 140
}

export const C_ENEMY_FIREBALL = {
    Damage: 1
}

export const C_AXIOS_CONFIG = { 
    baseURL : 'http://localhost:3000/api/withdrawal',
    headers : {
        'Content-type' : 'application/json'
    }
}

export const MERCHANT_ADDRESS = '0xe964e3faeeC50a95c48672Be37432555974c371D';

