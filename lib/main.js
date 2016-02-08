'use strict';

var $Debug = require('./debug.js');
var $debug = new $Debug($Debug.NONE);
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
    'treeSplitPanes': {
        label: 'Split Panes',
        items: [
            'tree-view:open-selected-entry-up',
            'tree-view:open-selected-entry-down',
            'tree-view:open-selected-entry-left',
            'tree-view:open-selected-entry-right'
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
    },
    'tabsCloseThings': {
        label: 'Close...',
        items: [
            'tabs:close-all-tabs',
            'tabs:close-saved-tabs',
            'tabs:close-tabs-to-right',
            'tabs:close-other-tabs'
        ]
    }
};

var CleanContextMenu = {
    config: {
        editorSplitPanes: {
            title: 'Editor: Split Panes',
            description: 'How the split pane actions show up in the editor area',
            type: 'string',
            default: 'hidden',
            enum: [
                'hidden',
                'normal',
                'submenu'
            ]
        },
        treeSplitPanes: {
            title: 'Tree: Split Panes',
            description: 'How the split pane actions show up in the tree',
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
            description: 'How the split pane actions show up on tabs',
            type: 'string',
            default: 'submenu',
            enum: [
                'hidden',
                'normal',
                'submenu'
            ]
        },
        tabsCloseThings: {
            title: 'Tabs: Close...',
            description: 'The "Close..." commands on tabs (not including "Close Tab")',
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
            let key = 'clean-context-menu.' + i;
            groups.push(group);
            group.update(atom.config.get(key));
            atom.config.observe(
                key,
                (value) => {
                    group.update(value);
                }
            );
        }
    }
};
module.exports = CleanContextMenu;
