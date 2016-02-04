CleanContextMenuView = require './clean-context-menu-view'
{CompositeDisposable} = require 'atom'

module.exports = CleanContextMenu =
  cleanContextMenuView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    @cleanContextMenuView = new CleanContextMenuView(state.cleanContextMenuViewState)
    @modalPanel = atom.workspace.addModalPanel(item: @cleanContextMenuView.getElement(), visible: false)

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'clean-context-menu:toggle': => @toggle()

  deactivate: ->
    @modalPanel.destroy()
    @subscriptions.dispose()
    @cleanContextMenuView.destroy()

  serialize: ->
    cleanContextMenuViewState: @cleanContextMenuView.serialize()

  toggle: ->
    console.log 'CleanContextMenu was toggled!'

    if @modalPanel.isVisible()
      @modalPanel.hide()
    else
      @modalPanel.show()
