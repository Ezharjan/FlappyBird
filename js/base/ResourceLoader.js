//资源文件加载器，确保在图片资源加载完成后才去渲染
import {Resources} from "./Resources.js";

export class ResourceLoader {

    map = null;//浏览器会报错——不兼容这样的声明

    constructor() {
        //将所有的资源塞入Map集合中
        this.map = new Map(Resources);
        // console.log(this.map);
        for (let [key, value] of this.map) {
            // console.log(key);
            // console.log(value);
            const image = new Image();
            image.src = value;
            //获取路径下的图片实际数据并重新赋值给map
            this.map.set(key, image);
        }
    }

    //全部加载完毕时调用
    onLoaded(callback) {
        let loadedCount = 0;

        //直接获取到所有的values值
        for (let value of this.map.values()) {
            //使用ES6的箭头函数直接获取外部的this
            value.onload = () => {
                //这里的this永远指向外部的this
                loadedCount++;
                if (loadedCount >= this.map.size) {
                    callback(this.map);
                }
            }

            //以前的获取this的方式：
            //直接获取到所有的values值
            // let self = this;
            // for (let value of this.map.values()) {
            //     value.onload = function () {
            //         self.
            //     ...
            //     }
        }
    }

    //简单工厂的模式，创造静态工厂
    static create() {
        return new ResourceLoader();
    }

}