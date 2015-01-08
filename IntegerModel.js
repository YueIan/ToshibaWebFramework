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
*	@class App.model.IntegerModel
*/
Ext.define('App.model.IntegerModel', {
    extend: 'App.model.Model',
    alias: 'widget.appintegermodel',
    value: 0,
    setValue: function(model){
        if (typeof model === typeof 0 && this.value !== model) {
            this.value = parseInt(model);
            this.notify();
        }
    },
    getValue: function(){
        return this.value;
    },
    constructor: function (config) {
        this.callParent(arguments);
    }
});

/**
*   @class App.model.FloatModel
*/
Ext.define('App.model.FloatModel', {
    extend: 'App.model.IntegerModel',
    alias: 'widget.appintegermodel',
    value: 0,
    setValue: function(model){
        if (typeof model === typeof 1.0 && this.value !== model) {
            this.value = parseFloat(model);
            this.notify();
        }
    }
});