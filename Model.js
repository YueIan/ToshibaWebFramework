/**************************************************************************************************

Copyright (C) 2012 Toshiba Medical Systems Corporation. All rights reserved.

Module: 

**************************************************************************************************/
/**   
*@fileOverview  
*<H3> Summary: </H3>
* This is class is the Model.

*<H3> Relevance: </H3>
* Relevant to client side developers.

*<H3> Purpose: </H3>
* This is class is the Subject of the client.

*<H3> Usage: </H3>
* 

*<H3> Contract: </H3>
* 

*<H3> Design: </H3>
* <p></p>
*/

/**
*	@class App.model.Subject
*/

Ext.define('App.model.Model', {
    alias: 'widget.appmodel',
    name: null,
    observers: null,
    isBusy: false,
    attach: Ext.emptyFn,
    detach: Ext.emptyFn,
    notify: Ext.emptyFn,
    notified: Ext.emptyFn,
    constructor: function (config) {
        var me = this;
        if (!config || !config.name) {
            me.name = 'model_' + Math.random() * 100;
        } else {
            me.name = config.name;
        }
        
        me.observers = new Ext.util.HashMap();

        me.attach = function (name, observer) {
            me.observers.add(name, observer);
        };

        me.detach = function (name) {
            me.observers.removeAtKey(name);
        };

        me.notify = function () {
            if (me.isBusy === true) {
                return;
            }
            me.isBusy = true;
            me.observers.each(function (key, observer, length) {
                try{
                    observer.notice(me);
                }
                catch (e) {
                    console.log(observer.name + '\'s notice failed!');
                    //continue to next observer
                }
                
            }, me);
            me.isBusy = false;
        };

        me.notified = function (model) {
            var same = false;
            if (me === model) {
                same = true;
            }
            return same;
        };

        //end of constructor
    }
});