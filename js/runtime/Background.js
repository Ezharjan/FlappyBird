import {Sprite} from "../base/Sprite.js";//一定要加上js后缀
import {DataStore} from "../base/DataStore.js";

export class Background extends Sprite {

    constructor() {
        const image = Sprite.getImage('background');
        super(image,
            0, 0,
            image.width, image.height,
            0, 0,
            DataStore.getInstance().canvas.width, DataStore.getInstance().canvas.height);//调用父类的构造方法
    }
}