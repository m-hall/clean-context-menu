'use strict';

// var $CleanContextMenuView = require('./clean-context-menu-view.js');
var $Debug = require('./debug.js');
var $debug = new $Debug($Debug.DETAIL);
var $atom = require('atom');
var $Group = require('./group.js');
var groups;
var sets = {
    'splitPanes': {
        label: 'Split Panes',
        items: [
            'tabs:split-up',
            'tabs:split-down',
            'tabs:split-right',
            'tabs:split-left',
            'pane:split-up',
            'pane:split-down',
            'pane:split-right',
            'pane:split-left'
        ]
    }
};

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
            group.submenu();
        }
    }
};
module.exports = CleanContextMenu;
