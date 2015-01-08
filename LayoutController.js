/**************************************************************************************************

Copyright (C) 2014 Toshiba Medical Systems Corporation. All rights reserved.

Module: VES MR

**************************************************************************************************/
/**
*/

var basePanelClass = 'Ext.panel.Panel';

Ext.define('App.controller.private.portal.LayoutController', {
    alias: 'widget.layoutController',
    extend: 'Ext.app.Controller',
    get: function(){
        return new LayoutController();
    },
    onLaunch: function () {
        function bindCallbackFuncToServer(obj){
            App.util.GlowstoneAdaptor.activeAll();
            console.log('Cardiac Application has launched successfully.');  
        }
        App.util.GlowstoneAdaptor.register(bindCallbackFuncToServer, 'CmrLayoutViewModel', 'LayoutController::bindCallbackFuncToServer');  
    }

});

function LayoutController(){
    var instance;

    LayoutController = function(){
        return instance;
    };

    LayoutController.prototype = this;

    instance = new LayoutController();
    instance.contructor = LayoutController;

    instance.legosMap = new Ext.util.HashMap();
    instance.viewPool = new Ext.util.HashMap();
    instance.currentLegos = '';

    instance.setViewPool = function(name, view){
        this.viewPool.add(name, view);
    };

    instance.set = function(legoName, pc, pCells){
        this.legosMap.add(legoName, {
            panelContainer: pc,
            panelCells: pCells
        });
    };

    instance.get = function(legoName, needRefreshView){
        var me = this;
        if (legoName && (legoName !== me.currentLegos || needRefreshView)) {
            me.removeViews();
            me.addViews(legoName);
            return me.legosMap.get(me.currentLegos).panelContainer;
        }
        return me.legosMap.get(me.currentLegos).panelContainer;
    };

    instance.removeViews = function(paramLego){
        var me = this,
            lego, panels;
        if (paramLego) {lego = this.legosMap.get(paramLego);}
        else {lego = this.legosMap.get(me.currentLegos);}
        if (lego) {
            panels = lego.panelCells;
            for (var i = 0; i < panels.length; i++) {
                var portlet = panels[i].getComponent('portlet');
                if (portlet) {
                    //portlet.hide();
                    panels[i].remove(portlet, false);
                } else {
                    panels[i].removeAll(false);
                }
                //panels[i].hide();
            }
        }
    };

    instance.addViews = function(legoName){
        var me = this,
            lego = me.legosMap.get(legoName),
            panels;
        if (lego) {
            panels = lego.panelCells;
            for (var i = 0; i < panels.length; i++) {
                var portlet = me.getView(panels[i].viewRef);
                panels[i].add(portlet);
                panels[i].show();
                //portlet.show();
            }
        }
        me.currentLegos = legoName;
    };

    instance.getView = function(viewRef){
        if (!viewRef) {return;}
        var me = this,
            panel = me.viewPool.get(viewRef);
        if (!panel) {
            var view = App.util.GlowstoneAdaptor.createGlowstoneView(viewRef);
            panel = Ext.create(basePanelClass, {itemId:'portlet', viewRef: viewRef, layout: 'fit'});
            panel.add(view);
            me.viewPool.add(viewRef, panel);
        }
        return panel;
    };

    instance.getDisplayViews = function(legoName, filter, filter2, condition){
        var me = this,
            lego, panels, views = [], matchingString, matchingString2;
        lego = me.legosMap.get(legoName);
        if (lego) {
            if (!filter || filter === '@') {matchingString = '';}
            else{matchingString = filter.substr(0,filter.search('@'));}

            if (!filter2 || filter2 === '@') {matchingString2 = '';}
            else{matchingString2 = filter2.substr(0,filter2.search('@'));}

            panels = lego.panelCells;
            for (var i = 0; i < panels.length; i++) {
                if (condition === 'or') {
                    if (panels[i].viewRef.search(matchingString) >= 0 || panels[i].viewRef.search(matchingString2) >= 0) {views.push(panels[i].viewRef);}
                } else {
                    if (panels[i].viewRef.search(matchingString) >= 0 && panels[i].viewRef.search(matchingString2) >= 0) {views.push(panels[i].viewRef);}
                }
                
            }
        }
        return views;
    };

    instance.getPanel = function(legoName, panelName){
        var me = this,
            lego, panels;
        lego = me.legosMap.get(legoName);
        if (lego) {
            panels = lego.panelCells;
            for (var i = 0; i < panels.length; i++) {
                if (panels[i].panelName === panelName) {
                    return panels[i];
                }
            }
        }
        return undefined;
    };

    instance.switchView = function(legoName, panelName, viewRef, needRefreshView){
        var me = this,
            view, lego, panels;
        view = me.getView(viewRef);
        if (!view) {return;}
        lego = me.legosMap.get(legoName);

        //if current layout name is not the input param, do not need refresh the view
        if (me.currentLegos !== legoName) {
            needRefreshView = false;
        }

        if (lego) {
            panels = lego.panelCells;
            for (var i = 0; i < panels.length; i++) {
                if (panels[i].panelName === panelName) {

                    if (needRefreshView) {
                        var viewRemove = me.getView(panels[i].viewRef);
                        panels[i].remove(viewRemove, false);
                        panels[i].add(view);
                    }
                    panels[i].viewRef = viewRef;
                    App.data.Data.layoutSwitchView(legoName, panelName, viewRef);
                    break;
                }
            }
        }
    };

    //macros is the array of [layout, panel, view, refresh].
    //and for the code clean, do not validate the input, so please be attention of the input format.
    instance.switchViewMacros = function(macros){
        if (!macros) {return;}
        for (var i = 0; i < macros.length; i++) {
            instance.switchView(macros[i][0], macros[i][1], macros[i][2], macros[i][3]);
        }
    };

    instance.getCurrentLegos = function(){
        return this.currentLegos;
    };

    instance.changeLayout = function(portalPanel, layout, viewRef){
        var me = this;

        portalPanel.removeAll(false);
        if (layout.substr(0,7) === 'enlarge') {
            me.switchView('Layout_Enlarge', 'large', layout.substr(7));
            portalPanel.add(me.get('Layout_Enlarge'));
        } else{
            //removeViews() and addViews() would be done in get function
            portalPanel.add(me.get(layout));            
        }
    };

    instance.recreate = function(layout){
        var me = this,
            legoFactory = App.controller.private.portal.LegoFactory.prototype,
            layoutMap = App.data.Data.LayoutMap;
        //remove all the views from panel to invoke the views' removed' events
        me.removeViews(layout);
        //remove the key from map
        me.legosMap.removeAtKey(layout);
        //re-create the layout by factory
        legoFactory.createLego.call(legoFactory, me, layout, layoutMap.get(layout));     
    };

    instance.refresh = function(layout){
        var portalPanel = Ext.getCmp('cmrportalpanel'), 
        views, i;
        if (portalPanel) {
            //remove the layout
            portalPanel.removeAll(false);
            views = App.data.Data.Views;//instance.getDisplayViews(layout);
            for(i=0;i<views.length;i++){
            	if(instance.getView(views[i]).hideHeader){
            		instance.getView(views[i]).hideHeader();
            	}
            }
            //add layout
            portalPanel.add(instance.get(layout, true));              
        }

    };

    instance.removeAllViews = function(){
        var views = App.data.Data.Views,
            viewPool = instance.viewPool,
            i, j, removedViews;
        instance.legosMap.each(function(key, value, length){
            instance.removeViews(key);
        });
        for (i = 0; i < views.length; i++) {
            if (viewPool.containsKey(views[i])) {
                //1, remove from glowstone
                App.util.GlowstoneAdaptor.removeGlowstoneView(views[i]);
                //2, remove from view pool
                viewPool.removeAtKey(views[i]);
                //3-1, remove all items in view(e.g. image header)
                //3-2, unregister from Ext.ComponentManager
                removedViews = Ext.ComponentQuery.query('portlet[viewRef=' + views[i] + ']');
                for (j = 0; j < removedViews.length; j++) {
                    removedViews[j].imageHeader = null;
                    removedViews[j].removeAll(true);
                    Ext.ComponentManager.unregister(removedViews[j]);
                };
            }
        }
        //clear thumbnails view
        var thumbnailMinView = Ext.ComponentQuery.query('container[cls=thumbnailsView_minPanel]');
           for (var i = 0; i < thumbnailMinView.length; i++) {
               //remove thumbnails container
               Ext.ComponentManager.unregister(thumbnailMinView[i]);
               //remove from glowstone
                App.util.GlowstoneAdaptor.removeGlowstoneView(thumbnailMinView[i].tag);
           }
    };

    return instance;
}