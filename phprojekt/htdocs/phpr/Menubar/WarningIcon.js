define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/topic',
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/dom-geometry',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dijit/_Widget',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_CssStateMixin',
    'dijit/MenuItem',
    'dojo/text!phpr/template/menubar/warningIcon.html',
    'dijit/DropDownMenu'
], function(declare, lang, on, topic, clazz, style, geometry, domConstruct, domClass, widget, template,
            widgetsInTemplate, cssState, MenuItem, templateString) {

    window.onerror = function(err) {
        debugger;
        topic.publish('notification', {message: 'foo'});
    };

    return declare([widget, template, widgetsInTemplate,  cssState], {
        baseClass: 'warningIconButton',
        templateString: templateString,
        state: 'closed',
        itemCount: 0,

        constructor: function() {
            topic.subscribe('notification', dojo.hitch(this, this._addNotification));
        },

        postCreate: function() {
            this.inherited(arguments);
            this.own(on(this.domNode, 'click', lang.hitch(this, 'onClick')));
        },

        onClick: function() {
            this.toggleState();
        },

        toggleState: function() {
            if (this.isOpen()) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        },

        openMenu: function() {
            var pos = geometry.position(this.domNode);
            style.set(this.menu.domNode, {
                left: (pos.x - 196) + 'px',
                top: (pos.h) + 'px'
            });
            clazz.add(this.domNode, 'open');
            this.state = 'open';
        },

        closeMenu: function() {
            clazz.remove(this.domNode, 'open');
            this.state = 'open';
        },

        isOpen: function() {
            return this.state === 'open';
        },

        _addNotification: function(notification) {
            this._markNotEmpty();

            var item = new MenuItem({iconClass: "warningIcon", label: notification.message});
            item.own(item.on('click', dojo.hitch(this, function() {
                this.menu.removeChild(item);
                this.itemCount -= 1;
                if (this.itemCount === 0) {
                    this._markEmpty();
                    this.closeMenu();
                }
            })));
            this.menu.addChild(item, 0);
            this.itemCount += 1;

            if (this.itemCount > 0) {
                this.openMenu();
            }
        },

        dummyItem: new MenuItem(),

        _markEmpty: function() {
            this.menu.addChild(this.dummyItem);
            domClass.add(this.domNode, 'empty');
        },

        _markNotEmpty: function() {
            this.menu.removeChild(this.dummyItem);
            domClass.remove(this.domNode, 'empty');
        }
    });
});
