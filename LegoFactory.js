/**************************************************************************************************

Copyright (C) 2014 Toshiba Medical Systems Corporation. All rights reserved.

Module: VES MR

**************************************************************************************************/
/**
* The input should be a [].
* the element of the array is [width, height, startX, startY, view, panelName]
* width: the unit of Lego in x-direction 
* height: the unit of Lego in y-direction 
* startX & startY: the start location of the unit 
* view: the view of the panel 
* panelName: the name of the panel 
*/

Ext.define('App.controller.private.portal.LegoFactory', {
    alias: 'widget.Legofactory',
    extend: 'Ext.app.Controller',
    init: function () {
        this.callParent(arguments);
    },
    /**
    * build a larger Lego to contain the two little ones
    */
    spliceLego: function(lb1, lb2){
        var panel, lego, w, h, x, y,
            e1 = lb1, 
            e2 = lb2,
            p;
            
        if (e1.startY === e2.startY) {
            p = Ext.create('Ext.container.Container',{layout: 'hbox'});
            Ext.apply(e1.panel, {
                //width: (e1.width / (e1.width + e2.width) * 100 ).toString() + '%', 
                flex: e1.width,
                height: '100%'
            });
            Ext.apply(e2.panel, {
                //width: (e2.width / (e1.width + e2.width) * 100 ).toString() + '%',
                flex: e2.width, 
                height: '100%'
            });
            e1.startX < e2.startX ? p.add([e1.panel, e2.panel]) : p.add([e2.panel, e1.panel]);
            w = e1.width + e2.width;
            h = e1.height;
            e1.startX < e2.startX ? x = e1.startX : x = e2.startX;
            y = e1.startY;
        } else if (e1.startX === e2.startX) {
            p = Ext.create('Ext.panel.Panel',{layout: 'vbox'});
            Ext.apply(e1.panel, {
                width: '100%', 
                //height: (e1.height / (e1.height + e2.height) * 100 ).toString() + '%'
                flex: e1.height
            });
            Ext.apply(e2.panel, {
                width: '100%', 
                //height: (e2.height / (e1.height + e2.height) * 100 ).toString() + '%'
                flex: e2.height
            });
            e1.startY < e2.startY ? p.add([e1.panel, e2.panel]) : p.add([e2.panel, e1.panel]);
            w = e1.width;
            h = e1.height + e2.height;
            x = e1.startX;
            e1.startY < e2.startY ? y = e1.startY : y = e2.startY;
        }

        lego = Ext.create('App.controller.private.portal.LegoBlock',
            [w, h, x, y, p]
        );
        return lego;
    },
    /**
    * p1 and p2 are instance of [width, height, startX, startY, view]
    */
    assembleLego: function(lb1, lb2){
        var l1 = lb1,
            l2 = lb2,
            panel = undefined;
        if (!l1 || !l2) {
            return panel;
        }
        //rows' index are equal and rows are equal too.
        //else if for column.
        //else, the two panel can not be merged.
        var condition1 = l1.width ===l2.width, condition4 = l1.height === l2.height,// same width or height
        condition2 = l1.startX === l2.startX, condition5 = l1.startY === l2.startY,//same start location
        condition3, condition6; // the two legos are adjacent

        l1.startY < l2.startY ? condition3 = (l1.startY + l1.height) === l2.startY : condition3 = (l2.startY + l2.height) === l1.startY;
        l1.startX < l2.startX ? condition6 = (l1.startX + l1.width) === l2.startX : condition6 = (l2.startX + l2.width) === l1.startX;

        if (condition1 && condition2 && condition3 ||
            condition4 && condition5 && condition6
        ) {
            panel = this.spliceLego(l1, l2);
        } else {
            panel = undefined;
        }
        return panel;
    },
    loopLegoPool: function(legoPool){
        var hasSpliced = false,
            maxLoopCount = legoPool.length * (legoPool.length - 1),
            i, j;
        while(legoPool.length > 1){
            hasSpliced = false;
            for (i = 0; i < legoPool.length - 1; i++) {
                for (j = 1; j < legoPool.length; j++) {
                    if (i === j) {continue;}
                    var lb = this.assembleLego(legoPool[i], legoPool[j]);
                    if (lb) {
                        hasSpliced = true;
                        if (i < j) {
                            legoPool.splice(i,1);
                            legoPool.splice(j-1,1);
                        } else {
                            legoPool.splice(j,1);
                            legoPool.splice(i-1,1);
                        }
                        legoPool.push(lb);
                        break;
                    }

                }
                if (hasSpliced) {break;}
            }
            if (hasSpliced === false) {break;}
        }
    },
    createLego: function(legoController, legoName, legoBlocks){
        var lc = legoController,
            lb = legoBlocks,
            i,
            panels = [],
            legoPool = [];
        for (i = 0; i < legoBlocks.length; i++) {
            panels.push(Ext.create('App.component.BaseFrame', {
                layout: 'fit',
                viewRef: legoBlocks[i][4], 
                panelName: legoBlocks[i][5],
                layoutName: legoName
            }));
        }

        for (i = 0; i < legoBlocks.length; i++) {
            legoPool.push(Ext.create('App.controller.private.portal.LegoBlock', 
                [legoBlocks[i][0], 
                legoBlocks[i][1], 
                legoBlocks[i][2], 
                legoBlocks[i][3], 
                panels[i]]));
        }

        this.loopLegoPool(legoPool);

        lc.set(legoName, legoPool[0].panel, panels);

        return legoPool[0].panel;
    }
});

Ext.define('App.controller.private.portal.LegoBlock', {
    alias: 'widget.Legoblock',
    width: 0,
    height: 0,
    startX: 0,
    startY: 0,
    panel: null,
    constructor: function(){
        this.width = arguments[0][0];
        this.height = arguments[0][1];
        this.startX = arguments[0][2];
        this.startY = arguments[0][3];
        this.panel = arguments[0][4];
    }
});