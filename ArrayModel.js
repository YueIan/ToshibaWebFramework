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
*	@class App.model.ArrayModel
*/
Ext.define('App.model.ArrayModel', {
    extend: 'App.model.Model',
    alias: 'widget.arraymodel',
    value: [],
    setValue: function(model){
        if (toString.call(model) === '[object Array]' && this.value.toString() !== model.toString()) {
            this.value = model;
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