//变量缓存器，方便我们在不同的类中访问和修改变量
export class DataStore {

    //全局只有一个，所以也要创建单例
    static getInstance() {
        if (!DataStore.instance) {
            DataStore.instance = new DataStore();
        }
        return DataStore.instance;
    }

    constructor() {
        this.map = new Map();
    }

    put(key, value) {
        if (typeof value === 'function'){
            value = new value();
        }

        this.map.set(key, value);
        return this;//在操作时候不必每次set，这样就能做到链式操作。
    }

    get(key) {
        return this.map.get(key);
    }

    destroy() {
        for (let value of this.map.values()) {
            value = null;
        }
    }

}