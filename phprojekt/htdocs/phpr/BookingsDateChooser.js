define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/Evented',
    'dijit/_Widget',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!phpr/template/bookingsDateChooser.html',
    'phpr/DateChooserCalendar'
], function(declare, array, lang, on, Evented, widget, template, widgetsInTemplate, templateString) {
    return declare([widget, template, widgetsInTemplate, Evented], {
        templateString: templateString,

        setDate: function(date) {
            this.calendarNode.set('value', date);
        }
    });
});
