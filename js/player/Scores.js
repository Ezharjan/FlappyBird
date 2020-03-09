import {DataStore} from "../base/DataStore.js";

export class Scores {
    constructor() {
        this.ctx = DataStore.getInstance().ctx;
        this.scoreNumber = 0;

        //因为canvas刷新很快，所以需要一个变量控制加分，只加一次
        this.isScorable = true;
    }

    draw() {
        this.ctx.font = '25px Arial';
        this.ctx.fillStyle = '#00ffed';
        this.ctx.fillText(
            this.scoreNumber,
            window.innerWidth / 2,
            window.innerHeight / 18,
            1000);
    }
}