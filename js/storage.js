"use strict";


const taskStorage = {
    storageKey: 'taskStorage',

    add(key, options) {
        let items = this.get();
        items[key] = options;

        this.set(items)
    },

    set(items) {
        localStorage.setItem(this.storageKey, JSON.stringify(items));
    },

    get() {
        return JSON.parse(localStorage.getItem(this.storageKey)) ?? {};
    },

    delete(key) {
        let items = this.get();
        delete items[key];
        this.set(items);
    },

    clear() {
        localStorage.removeItem(this.storageKey);
    },

    syncTask(key, options) {
        this.add(key, options);
    },
}

export {taskStorage};