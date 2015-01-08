Ext.define('App.view.Viewport', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.appviewport',
    selectImagePanel: null,
    initComponent: function () {
        var me = this;

        Ext.apply(this, {
            id: 'app-viewport',
            layout: {
                type: 'border'
            },
            items: [{
                xtype: 'selectimagepanel',
                region: 'west',
                itemId: 'carousel',
                padding: 0,
                width: 120,
                height: '100%',
                split: false
            }, {
                id: 'centerRegion',
                region: 'center',
                layout: 'fit'
            }]
        });
        this.callParent(arguments);
    },
    beforeDestroy: function () {
        var me = this;
        me.removeAll();
        me.callParent(arguments);
    }
});