/**************************************************************************************************

Copyright (C) 2014 Toshiba Medical Systems Corporation. All rights reserved.

Module: VES MR

**************************************************************************************************/
/**
*/

Ext.define('App.controller.private.portal.LayoutEventController', {
    alias: 'widget.layouteventcontroller',
    extend: 'Ext.app.Controller',
    get: function(){
        return new LayoutEventController();
    }
});

function LayoutEventController(){
    var instance;
	var oP = Object.prototype,
        toString = oP.toString;

    LayoutEventController = function(){
        return instance;
    };

    LayoutEventController.prototype = this;

    instance = new LayoutEventController();
    instance.contructor = LayoutEventController;

    instance.fireEvents = function(layout){
        var events = instance.getAllEvents(layout),
            sendCommand = App.util.GlowstoneAdaptor.sendCommand;
        if (toString.call(events) === '[object Array]') {
            for (var i = 0; i < events.length; i++) {
                sendCommand(events[i].cmd, JSON.stringify(events[i].param));
                //console.log(events[i]);
            }
        }
    };

    instance.fireEventsOnlyValues = function(layout){
        var events = instance.getAllEvents(layout),
            sendCommand = App.util.GlowstoneAdaptor.sendCommand;
        if (toString.call(events) === '[object Array]') {
            for (var i = 0; i < events.length; i++) {
                var values = [];
                for (var j = 0; j < events[i].param.length; j++) {values.push(events[i].param[j].value);}
                sendCommand(events[i].cmd, JSON.stringify(values));
                //console.log(values);
            }
        }
    };

    instance.getAllEvents = function(layout){
        return App.data.Data.LayoutEvents[layout];
    };

    instance.getEvent = function(layout, cmd){
        var events = instance.getAllEvents(layout);
        if (toString.call(events) === '[object Array]') {
            for (var i = 0; i < events.length; i++) {
                if (events[i].cmd === cmd) {
                    return events[i];
                }
            }            
        }
        return;
    };

    function ValidateInput(e){
        if (!e.hasOwnProperty(cmd) || !e.hasOwnProperty(param)) {return false;}
        if (toString.call(e.cmd) === '[object String]' || toString.call(e.param) === '[object Array]') {return false;}
        return true;
    }

    instance.addEvent = function(layout, e){
        var events = App.data.Data.LayoutEvents;
        if (!ValidateInput(e)) {return;}
        if (!events.hasOwnProperty(layout)){
            events[layout] = [];
        }
        events[layout].push(e);
    };

    instance.addEventElem = function(layout, cmd, elem){
        var events = App.data.Data.LayoutEvents;
        if (!ValidateInput(e)) {return;}
        if (!events.hasOwnProperty(layout)){
            events[layout] = [];
            events[layout].push({cmd: cmd, param:[]});
            events[layout][0].param.push(elem);
        } else {
            for (var i = 0; i < events[layout].length; i++) {
                if (events[layout][i].cmd === cmd) {
                    events[layout][i].param.push(elem);
                    return;
                }
            }
        }
    };

    instance.changeEvent = function(layout, cmd, key, value){
        var events = App.data.Data.LayoutEvents[layout];
        if (toString.call(events) !== '[object Array]') {return;}
        for (var i = 0; i < events.length; i++) {
            if (events[i].cmd === cmd) {
                for (var j = 0; j < events[i].param.length; j++) {
                    if (events[i].param[j].key === key) {
                        events[i].param[j].value = value;
                        return;
                    }
                }
            }
        }            
    };


    return instance;
}