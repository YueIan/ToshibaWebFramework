/**************************************************************************************************

Copyright (C) 2014 Toshiba Medical Systems Corporation. All rights reserved.

Module: VES MR

**************************************************************************************************/
/**
*	Class GlowstoneAdaptor
*	GlowstoneAdaptor is a adaptor for glowstone, which is mainly encapsulate the glowstone's functions.
*	GlowstoneAdaptor supply a lazy array to cantian callback functions of app temporarily, wihch would not be called.
*	And set the priority(or order) of callback function of app. There are 7 prioritys: S, A, B,..., F, and default is C.
*	If the two callback funciton have same priority, the first added would be call first.
*	However, if the move the functions out of the lazy array, the control of priority would be turn to glowstone.
*/
Ext.namespace('App.util');

function GlowstoneAdaptor(){
	var instance,
		createView = glowstone.views.createGlowstoneView,
        removeView = glowstone.views.removeView,
		register = glowstone.comm.registerHandler,
		unregister = glowstone.comm.unregisterHandler,
        sendCommand = glowstone.comm.sendCommand,
        mock = glowstone.mock;

    GlowstoneAdaptor = function(){
        return instance;
    };

    GlowstoneAdaptor.prototype = this;

    instance = new GlowstoneAdaptor();
    instance.contructor = GlowstoneAdaptor;

    instance.createGlowstoneView = createView;
    instance.removeGlowstoneView = removeView;
    instance.register = register;
    instance.unregister = unregister;
    instance.sendCommand = sendCommand;
    if (mock) {
        instance.mock = mock;
    }
    instance.hasActiveAll = false;
    

    instance.lazyCallbackPool = [[],[],[],[],[],[],[]];
    instance.lazyRegister = function(callbackFunction, type, source, priority, forceLazyRegister){
        if (instance.hasActiveAll && !forceLazyRegister) {
            register(callbackFunction, type, source);
            return instance;
        }
        var s = source,
            t = type,
            c = callbackFunction,
            p = priority,
            pair = App.util.Constants.pairString,
            json = App.util.Constants.json,
            cp = App.util.Constants.callbackPriority,
            keyArray = instance.lazyCallbackPool,
            item;
		item = json(pair(t,s), callbackFunction);
		if (!p) {
			p = 'C';
		}
		keyArray[cp[p]].push(item);
    };

    instance.active = function(source, type){
        var s = source,
            t = type,
            pair = App.util.Constants.pairString,
            keyArray = instance.lazyCallbackPool,
            keyString;
		keyString = pair(s,t);
		var i, j;
		for (i = 0; i < keyArray.length; i++) {
			for (j = 0; j < keyArray[i].length; j++) {
				if (keyArray[i][j].key === keyString) {
					register(keyArray[i][j].value, type, source);
					keyArray[i].splice(j,1);
				}
			}
		}
    };

    instance.activeAll = function(){
		var i, j,
            constant = App.util.Constants,
            keyArray = instance.lazyCallbackPool,
            type, source;
		for (i = 0; i < keyArray.length; i++) {
			for (j = 0; j < keyArray[i].length; j++) {
                type = constant.getPairStringFirst(keyArray[i][j].key);
                source = constant.getPairStringSecond(keyArray[i][j].key);
				register(keyArray[i][j].value, type, source);
			}
            keyArray[i].length = 0;
		}
        instance.hasActiveAll = true;
    };

    return instance;
}
