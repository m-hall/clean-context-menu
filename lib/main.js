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
    'editorEditHistory': {
        label: 'Edit',
        items: [
            'core:undo',
            'core:redo'
        ]
    },
    'editorEdit': {
        label: 'Edit',
        items: [
            'core:cut',
            'core:copy',
            'core:paste',
            'core:delete',
            'core:select-all'
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
    'treeEdit': {
        label: 'Edit',
        items: [
            'tree-view:move',
            'tree-view:duplicate',
            'tree-view:remove'
        ]
    },
    'treeEdit2': {
        label: 'Edit',
        items: [
            'tree-view:cut',
            'tree-view:copy',
            'tree-view:paste'
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
    },
    'closePane': {
        label: 'Close Pane',
        items: [
            'pane:close'
        ]
    }
};

var CleanContextMenu = {
    config: {
        editorSplitPanes: {
            title: 'Editor: Split Panes',
            description: 'How the split pane actions show up in the editor area.',
            type: 'string',
            default: 'hidden',
            enum: [
                'hidden',
                'normal',
                'submenu'
            ]
        },
        editorEdit: {
            title: 'Editor: Edit Actions',
            description: 'Cut/Copy/Paste/Delete/Select All/Undo/Redo.',
            type: 'string',
            default: 'normal',
            enum: [
                'hidden',
                'normal',
                'submenu'
            ]
        },
        editorEditHistory: {
            title: 'Editor: Edit Actions - History',
            description: 'Undo/Redo. These will join with the regular edit actions.',
            type: 'string',
            default: 'normal',
            enum: [
                'hidden',
                'normal',
                'submenu'
            ]
        },
        treeSplitPanes: {
            title: 'Tree: Split Panes',
            description: 'How the split pane actions show up in the tree.',
            type: 'string',
            default: 'hidden',
            enum: [
                'hidden',
                'normal',
                'submenu'
            ]
        },
        treeEdit: {
            title: 'Tree: Edit (File commands)',
            description: 'Rename/Duplicate/Edit.',
            type: 'string',
            default: 'normal',
            enum: [
                'hidden',
                'normal',
                'submenu'
            ]
        },
        treeEdit2: {
            title: 'Tree: Edit',
            description: 'Cut/Copy/Paste.',
            type: 'string',
            default: 'normal',
            enum: [
                'hidden',
                'normal',
                'submenu'
            ]
        },
        tabsSplitPanes: {
            title: 'Tabs: Split Panes',
            description: 'How the split pane actions show up on tabs.',
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
            description: 'The "Close..." commands on tabs (not including "Close Tab").',
            type: 'string',
            default: 'submenu',
            enum: [
                'hidden',
                'normal',
                'submenu'
            ]
        },
        closePane: {
            title: 'Close Pane',
            description: 'Just the "Close Pane" command. If checked, will be visible.',
            type: 'boolean',
            default: true
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
