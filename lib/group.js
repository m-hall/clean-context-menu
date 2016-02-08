'use strict';
var $Debug = require('./debug.js');
var $debug = new $Debug($Debug.DETAIL);

function findAll(commands) {
    var found = [],
        menus,
        menu,
        i,
        item,
        items;
    // remove menus from the menu bar
    $debug.log('findAll');
    menus = atom.contextMenu.itemSets;
    for (menu in menus) {
        items = menus[menu].items;
        for (i = items.length; i--;) {
            item = items[i];
            if (!item) {
                continue;
            }
            if (commands.indexOf(item.command) >= 0) {
                item.originMenu = menus[menu];
                item.currentParent = menus[menu];
                found.push(item);
                $debug.detail(item.command + ' (' + menus[menu].selector + ')');
                $debug.detail(item);
            }
        }
    }
    if (found.length < 1) {
        $debug.warn('Could not find any items to remove');
    }
    return found;
}

class CommandGroups {
    constructor(name, commands) {
        this.name = name;
        this.commands = commands;
        this.items = findAll(this.commands);
        this.menuItems;
        $debug.log(name, this.items.length);
    }
    destructor() {
        this.reset();
        for (let i = items.length; i--;) {
            let item = items[i];
            delete item.originMenu;
            delete item.currentParent;
        }
        delete this.items;
        delete this.name;
        delete this.commands;
    }
    hide() {
        $debug.log(this.name, 'hide');
        this.reset();
        for (let i = this.items.length; i--;) {
            let item = this.items[i];
            let origin = item.originMenu;
            $debug.detail(this.name, 'hide', 'remove', item.command);
            origin.items.splice(origin.items.indexOf(item), 1);
            item.currentParent = null;
        }
    }
    submenu() {
        var menuItems = {};
        $debug.log(this.name, 'submenu');
        this.reset();
        for (let i = this.items.length; i--;) {
            let item = this.items[i];
            let origin = item.originMenu;
            let menu = menuItems[origin.selector];

            if (!menu) {
                menu = {
                    label: this.name,
                    submenu: []
                };
                menuItems[origin.selector] = menu;
                origin.items.push(menu);
            }
            $debug.detail(this.name, 'submenu', 'move', item.command);
            menu.submenu.push(item);
            item.currentParent = menu;
            origin.items.splice(origin.items.indexOf(item), 1);
        }

    }
    show() {
        $debug.log(this.name, 'show');
        this.reset();
    }
    reset() {
        $debug.log(this.name, 'reset');
        for (let i = this.items.length; i--;) {
            let item = this.items[i];
            if (!item) {
                $debug.error(this.name, 'reset', 'Could not find item at position: ' + i);
                this.items.splice(i, 1);
                continue;
            }
            let parent = item.currentParent;
            let origin = item.originMenu;
            if (parent === origin) {
                $debug.detail(this.name, 'reset', 'no change', item.command);
                continue;
            } else if (parent) {
                $debug.detail(this.name, 'reset', 'unsubmenu', item.command);
                parent.submenu.splice(parent.submenu.indexOf(item), 1);
                if (parent.submenu.length < 1) {
                    $debug.detail(this.name, 'reset', 'delete submenu');
                    origin.splice(origin.indexOf(parent), 1);
                }
            }
            $debug.detail(this.name, 'reset', 'restore', item.command);
            item.currentParent = origin;
            origin.items.push(item);
        }
    }
    update(value) {
        $debug.log(this.name, 'update', value);
        switch(value) {
            case 'hidden':
                this.hide();
                break;
            case 'submenu':
                this.submenu();
                break;
            case 'normal':
            default:
                this.show();
        }
    }
}
module.exports = CommandGroups;
