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
* This Array model only can be used in a window(iframe). 
* Because the array only can store the same type, which is judged bu 'instanceof'.
* Please do not access the value([]) directly and do use the 'pushBack' or others functions.
* For the performance, the notify should be set by caller in 'set' and 'pushBack' function, or call update.

*<H3> Contract: </H3>
* 

*<H3> Design: </H3>
* <p></p>
*/

/**
*	@class App.model.ArrayModel
*/
Ext.define('App.model.ArrayTemplateModel', {
    extend: 'App.model.Model',
    alias: 'widget.arraytemplatemodel',
    value: [],
    template: null,
    update: function(){
        var me = this;
        me.notify();
    },
    clear: function(needNotify){
        var me = this;
        me.value.length = 0;
        if (needNotify === true) {
            me.notify();
        }
    },
    pushBack: function(value, needNotify){
        var me = this;
        if (me.checkInvalid(value) === false) {return;}
        me.value.push(value);
        if (needNotify === true) {
            me.notify();
        }
    },
    checkEqual: function(v1, v2){
        var i;
        for(i in v1){
            if (!v2.hasOwnProperty(i)) {return false;}
            if (v1[i] !== v2[i]) {return false;}
        }
        return true;
    },
    set: function(index, value, needNotify){
        var me = this;
        //if (!index) {return;}
        if (index < 0 || index >= me.getLength()) {return;}
        if (me.checkInvalid(value) === false) {return;}
        if (me.checkEqual(me.value[index], value) === true) {return;}
        me.value[index] = value;
        if (needNotify === true) {
            me.notify();
        }
    },
    getLength: function(){
        return this.value.length;
    },
    getByIndex: function(index){
        var me = this;
        //if (!index) {return;}
        if (index < 0 || index >= me.getLength()) {return;}
        return me.value[index];
    },

    //Although the undefined and null are primiry value, the array do not store those two kinds of type.
    checkPrimitiveType: function(value){
        var type = typeof value;
        if (type === 'string' || type === 'number' || type === 'boolean' || type === 'undefined') {
            return type;
        } else if(value === undefined || value === null){
            return false;
        }
        return false;
    },
    checkInvalid: function(value){
		var me = this;
        if (!value) {return false;}

        if (me.checkPrimitiveType(value) === me.template) {return true;}

        if (value instanceof this.template) {return true;}

        return false;
    },
    constructor: function (config) {
        this.callParent(arguments);
        if (config.template) {
            this.template = config.template;
        } else{
            console.log(config.name + '\'s template function is null, this array model would not accept any value.');
        }
    }
});