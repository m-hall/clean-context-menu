'use strict';

// var $CleanContextMenuView = require('./clean-context-menu-view.js');
var $Debug = require('./debug.js');
var $debug = new $Debug($Debug.DETAIL);
var $atom = require('atom');
var $Group = require('./group.js');
var groups;
var sets = {
    'editorSplitPanes': {
        label: 'Split Panes',
        items: [
            'pane:split-up',
            'pane:split-down',
            'pane:split-right',
            'pane:split-left'
        ]
    },
    'tabsSplitPanes': {
        label: 'Split Panes',
        items: [
            'tabs:split-up',
            'tabs:split-down',
            'tabs:split-right',
            'tabs:split-left'
        ]
    }
};

var CleanContextMenu = {
    config: {
        editorSplitPanes: {
            title: 'Editor: Split Panes',
            description: 'How the split pane actions show up on tabs',
            type: 'string',
            default: 'hidden',
            enum: [
                'hidden',
                'normal',
                'submenu'
            ]
        },
        tabsSplitPanes: {
            title: 'Tabs: Split Panes',
            description: 'How the split pane actions show up in the editor area',
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
        this.initialActivations = atom.packages.onDidActivateInitialPackages(()=>this.start());
    },
    deactivate: function () {
        for (let i in groups) {
            groups[i].reset();
        }
        groups = [];
    },
    start: function () {
        this.initialActivations.dispose();
        this.initialActivations = null;
        groups = [];
        for (let i in sets) {
            let set = sets[i];
            let group = new $Group(set.label, set.items);
            groups.push(group);
            group.update(atom.config.get('clean-context-menu.' + i, CleanContextMenu.config[i].default));
        }
    }
};
module.exports = CleanContextMenu;
