'use strict';

var $CleanContextMenuView = require('./clean-context-menu-view.js');
var $Debug = require('./debug.js');
var $debug = new $Debug($Debug.LOG);
var $atom = require('atom');

function removeCommands() {
    var commands,
        menus,
        menu,
        i,
        item,
        items;
    // remove menus from the menu bar
    commands = {
        'tabs:split-up': true,
        'tabs:split-down': true,
        'tabs:split-right': true,
        'tabs:split-left': true,
        'pane:split-up': true,
        'pane:split-down': true,
        'pane:split-right': true,
        'pane:split-left': true,
        'pane:close': true,
        'core:undo': true,
        'core:redo': true,
        // 'core:cut': true,
        // 'core:copy': true,
        // 'core:paste': true,
        'core:delete': true,
        'core:select-all': true,
        'encoding-selector:show': true,
        'grammar-selector': true,
        'spell-check:correct-misspelling': true,
        'symbols-view:go-to-declaration': true,
        'minimap:toggle': true,
        'tree-view:duplicate': true,
        'tree-view:open-selected-entry-up': true,
        'tree-view:open-selected-entry-down': true,
        'tree-view:open-selected-entry-left': true,
        'tree-view:open-selected-entry-right': true,
        'tree-view:copy-full-path': true,
        'tree-view:copy-project-path': true,
        'tree-view:open-in-new-window': true,
        'tree-view:cut': true,
        'tree-view:copy': true,
        'tree-view:paste': true,
        'tabs:close-all-tabs': true,
        'tabs:close-saved-tabs': true,
        'tabs:close-tabs-to-right': true,
        'tabs:close-other-tabs': true
    };
    $debug.log('removeCommands');
    menus = atom.contextMenu.itemSets;
    for (menu in menus) {
        items = menus[menu].items;
        $debug.detail(menus[menu].selector);
        for (i = items.length; i--;) {
            item = items[i];
            if (!item) {
                continue;
            }
            if (item.command in commands) {
                $debug.detail('  x', item.command);
                // items.splice(i, 1);
            } else {
                $debug.detail('   ', item.command);
            }
        }
    }
}

var CleanContextMenu = {
    activate: function (state) {
        this.view = new $CleanContextMenuView(state.referenceViewState);
        this.panel = atom.workspace.addRightPanel({
            item: this.view.getElement(),
            visible: false
        });
        setTimeout(removeCommands, 500);

        this.subscriptions = new $atom.CompositeDisposable();
        this.subscriptions.add(
            atom.commands.add(
                'atom-workspace',
                {
                    'clean-context-menu:toggle': () => {
                        this.toggle();
                    }
                }
            )
        );
    },
    deactivate: function () {
        this.panel.destroy();
        this.view.destroy();
    },
    toggle: function () {
        if (this.panel.isVisible()) {
            this.panel.hide();
        } else {
            this.panel.show();
        }
    }
};
module.exports = CleanContextMenu;
