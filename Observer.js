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
*	@class App.model.Observer
*   Observer's name should be unique. 
*   If two of them is same, model would not regard them as one, and override the previous one with the last one.
*/

Ext.define('App.model.Observer', {
    alias: 'widget.appobserver',
    name: null,
    startObserver: Ext.emptyFn,
    stopObserver: Ext.emptyFn,
    notice: Ext.emptyFn,
    constructor: function (config) {
        var me = this;

        me.name = config.name;

        me.observedModel = undefined;

        me.startObserver = function (model, noticeImmediately) {

            if (!model) {return;}

            //Observer only can ob one model, if has obed, stop ob firstly.
            if (me.observedModel) {
                me.stopObserver(me.observedModel);
            }
            me.observedModel = model;

            model.attach(me.name, me);
            if (noticeImmediately && me.notice) {
                me.notice(model);
            }

        };

        me.stopObserver = function () {
            if (me.observedModel) {
                me.observedModel.detach(me.name);
            }
        };
    }
});

/**
*   @class App.model.MutilObserver
*   MutilObserver is same as Observer except that it can ob mutilple models.
*/
Ext.define('App.model.MutilObserver', {
    alias: 'widget.appmutilobserver',
    name: null,
    startObserver: Ext.emptyFn,
    stopObserver: Ext.emptyFn,
    notice: Ext.emptyFn,
    constructor: function (config) {
        var me = this;

        me.name = config.name;

        me.startObserver = function (model, noticeImmediately) {
            model.attach(me.name, me);
            if (noticeImmediately && me.notice) {
                me.notice(model);
            }
        };

        me.stopObserver = function (model) {
            model.detach(me.name);
        };

    }
});