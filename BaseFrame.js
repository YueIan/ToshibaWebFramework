/*
* @class App.view.private.component.LayoutFrame
* @extends Ext.panel.Panel
*/
Ext.define('App.component.BaseFrame', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.baseframe',
    /*requires: [
        'App.model.Model',
        'App.model.Observer',
        'App.model.ModelProxy',
        'App.model.BooleanModel',
        'App.model.IntegerModel',
        'App.model.StringModel',
        'App.model.ArrayModel',
        'App.model.ArrayTemplateModel'
    ],*/
    initComponent: function () {
        var me = this;
        me.callParent(arguments);

        me.modelMap = new Ext.util.HashMap();
        me.proxyMap = new Ext.util.HashMap();
    },
    registerModelProxy: function(name, model){
        var me = this;
        if (!name || !model) {return me;}
        if (!(model instanceof App.model.Model)) {return me;}
        me.modelMap.add(name, model);
        var proxy = Ext.create('App.model.ModelProxy', {name: name + me.id});
        proxy.surrogate(model);
        me.proxyMap.add(name, proxy);
        return me;
    },
    queryModelProxy: function(name){
        var me = this;
        return me.proxyMap.get(name);
    }
});