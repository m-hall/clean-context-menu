'use strict';

var $CleanContextMenuView = require('./clean-context-menu-view.js');
var $Debug = require('./debug.js');
var $debug = new $Debug($Debug.DETAIL);
var $atom = require('atom');

function removeItems(commands) {
    var removed = [],
        menus,
        menu,
        i,
        item,
        items;
    // remove menus from the menu bar
    $debug.log('removeItems');
    menus = atom.contextMenu.itemSets;
    for (menu in menus) {
        items = menus[menu].items;
        $debug.detail(menus[menu].selector);
        for (i = items.length; i--;) {
            item = items[i];
            if (!item) {
                continue;
            }
            if (commands.indexOf(item.command) >= 0) {
                item.originMenu = menus[menu];
                removed.push(items.splice(i, 1)[0]);
                $debug.detail('  x', item.command);
            } else {
                $debug.detail('   ', item.command);
            }
        }
    }
    if (removed.length < 1) {
        $debug.warn('Could not find any items to remove');
    }
    return removed;
}

function moveToSubMenu(name, commands) {
    var items,
        groups = {};

    $debug.log('moveToSubMenu', commands);
    items = removeItems(commands);
    $debug.detail('items collected', items);
    for (let i = 0, l = items.length; i < l; i++) {
        let selector = items[i].originMenu.selector;
        if (!groups[selector]) {
            groups[selector] = [
                {
                    label: name,
                    submenu: []
                }
            ];
        }
        groups[selector][0].submenu.push(items[i]);
    }
    atom.contextMenu.add(groups);
}
function removeCommands() {
    $debug.log('removeCommands');
    moveToSubMenu(
        'Split Panes',
        [
            'tabs:split-up',
            'tabs:split-down',
            'tabs:split-right',
            'tabs:split-left',
            'pane:split-up',
            'pane:split-down',
            'pane:split-right',
            'pane:split-left'
        ]
    );
}

var CleanContextMenu = {
    config: {
        splitPanes: {
            title: 'Split Panes',
            description: 'How the split pane actions show up',
            type: 'string',
            default: 'submenu',
            enum: [
                'hidden',
                'normal',
                'submenu'
            ]
        }
    },
    activate: function (state) {
        this.view = new $CleanContextMenuView(state.referenceViewState);
        this.panel = atom.workspace.addRightPanel({
            item: this.view.getElement(),
            visible: false
        });
        setTimeout(removeCommands, 500);

        // this.subscriptions = new $atom.CompositeDisposable();
        // this.subscriptions.add(
        //     atom.commands.add(
        //         'atom-workspace',
        //         {
        //             'clean-context-menu:toggle': () => {
        //                 this.toggle();
        //             }
        //         }
        //     )
        // );
    },
    deactivate: function () {
        this.panel.destroy();
        this.view.destroy();
    },
    toggle: function () {
        // if (this.panel.isVisible()) {
        //     this.panel.hide();
        // } else {
        //     this.panel.show();
        // }

    }
};
module.exports = CleanContextMenu;
