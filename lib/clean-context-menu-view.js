'use strict';
'use babel';

class CleanContextMenuView {
    constructor(serializedState) {
        this.element = document.createElement('div');
        this.element.innerHTML = `<h3>Context Menu Items</h3>`;
    }
    serialize() {

    }
    getElement() {
        return this.element;
    }
    destroy() {
        this.element.remove();
    }
}

module.exports = CleanContextMenuView;
