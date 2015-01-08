/**************************************************************************************************

Copyright (C) 2012 Toshiba Medical Systems Corporation. All rights reserved.

Module: 

**************************************************************************************************/
/**   
*@fileOverview  
*<H3> Summary: </H3>
* This is class is the Observer.

*<H3> Relevance: </H3>
* Relevant to client side developers.

*<H3> Purpose: </H3>
* This is class is the Observer of the client.

*<H3> Usage: </H3>
* 

*<H3> Contract: </H3>
* 

*<H3> Design: </H3>
* <p></p>
*/

/**
*	@class App.model.ModelProxy
*   Model Proxy(short for Proxy) is not the Proxy Pattern, it is a model and an observer. But it only can observer the model
*   which it surrogate. Proxy can share and stop share the model. Proxy is also a model, that is, it can be observed
*   by other observer.
*/

Ext.define('App.model.ModelProxy', {
    extend: 'App.model.Model',
    notice: Ext.emptyFn,
    model: undefined,
    /*surrogate: Ext.emptyFn,
    getModel: Ext.emptyFn,
    startSharing: Ext.emptyFn,
    stopSharing: Ext.emptyFn,*/
    constructor: function (config) {
        var me = this;
        me.callParent(arguments);

        //me.name = config.name;

        me.ob = Ext.create('App.model.Observer', { name: 'ModelProxy_' + me.name });

        me.ob.notice = function(model){
            //me.model
            me.notify();
        };

        me.surrogate = function (model, noticeImmediately) {
            if (me.model === model) {return me;}
            me.model = model;
            me.ob.startObserver(model, noticeImmediately);
            return me;
        };

        me.getModel = function () {
            return me.model;
        };

        me.startSharing = function(proxy, noticeImmediately){
            //me.model = proxy.getModel();
            me.surrogate(proxy.getModel(), noticeImmediately);
        };

        me.stopSharing = function(){
            if (me.model) {
                me.ob.stopObserver(me.model);
            }
            me.model = undefined;
        };

        me.setValue = function(v){
            if (me.model && me.model.setValue) {
                me.model.setValue(v);
            }
        };

        me.getValue = function(v){
            if (me.model && me.model.getValue) {
                return me.model.getValue();
            }
            return;
        };

    }
});