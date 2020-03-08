import {Sprite} from "../base/Sprite.js";//一定要加上js后缀

export class Background extends Sprite {
    constructor() {
        //下面两种写法效果相同，因为是继承关系
        // const image = Background.getImage('background');
        const image = Sprite.getImage('background');
        super( image,
            0, 0,
            image.width, image.height,
            0, 0,
            window.innerWidth, window.innerHeight);//调用父类的构造方法
    }
}