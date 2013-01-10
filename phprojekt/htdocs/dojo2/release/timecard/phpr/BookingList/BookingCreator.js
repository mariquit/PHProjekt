//>>built
require({cache:{"url:phpr/template/bookingList/bookingCreator.html":'<div class="bookingCreator">\n    <div data-dojo-attach-point="form" data-dojo-type="dijit/form/Form">\n        <div class="first">\n            <select data-dojo-attach-point="project"\n                    class="project"\n                    name="project"\n                    data-dojo-type="dijit/form/FilteringSelect"\n                    data-dojo-props="autoComplete: false, labelType: \'html\', searchAttr: \'name\', labelAttr: \'label\',\n                                     queryExpr: \'*$\\{0\\}*\'">\n                <option value="1"><span class="projectId">1</span> Unassigned</option>\n            </select>\n            <input type="text"\n                   name="start"\n                   required="true"\n                   data-dojo-type="dijit/form/ValidationTextBox"\n                   data-dojo-attach-point="start"\n                   data-dojo-props="pattern: this._getStartRegexp, invalidMessage: \'Invalid time format\'"\n                   class="time"/>\n            -\n            <input type="text"\n                   name="end"\n                   data-dojo-type="dijit/form/ValidationTextBox"\n                   data-dojo-attach-point="end"\n                   data-dojo-props="pattern: this._getEndRegexp, invalidMessage: \'Invalid time format\'"\n                   class="time"/>\n            <input type="text"\n                   name="date"\n                   data-dojo-type="phpr/DateTextBox"\n                   value="today"\n                   data-dojo-attach-point="date"\n                   class="date"/>\n            <a href="javascript: void(0)" class="notesIcon" data-dojo-attach-point="notesIcon"><div><b></b></div></a>\n            <button data-dojo-type="dijit/form/Button"\n                    type="submit"\n                    data-dojo-attach-point="submitButton"\n                    data-dojo-props="showLabel: false, iconClass: \'submitIcon\', baseClass: \'submitButton\'"\n                    class="submitButton">Submit</button>\n        </div>\n        <div data-dojo-attach-point="notesContainer" class="second">\n            <input type="text"\n                   name="notes"\n                   class="notes"\n                   data-dojo-type="dijit/form/TextBox"\n                   data-dojo-attach-point="notes"/>\n        </div>\n    </div>\n</div>\n'}});
define("phpr/BookingList/BookingCreator","dojo/_base/declare,dojo/_base/lang,dojo/_base/array,dojo/on,dojo/number,dojo/dom-class,dojo/promise/all,dojo/topic,dojo/json,dojo/store/JsonRest,dojo/store/Memory,dijit/Tooltip,phpr/BookingList/BookingBlock,phpr/Api,phpr/Timehelper,phpr/models/Project,dojo/text!phpr/template/bookingList/bookingCreator.html".split(","),function(j,e,k,l,g,h,m,n,o,p,q,r,s,t,f,i,u){return j([s],{templateString:u,store:null,projectDeferred:null,buildRendering:function(){this.inherited(arguments);
this.date.set("value",new Date);this.own(this.form.on("submit",e.hitch(this,this._submit)));this.projectDeferred=m({recent:i.getRecentProjects(),projects:i.getProjects()});this.projectDeferred=this.projectDeferred.then(e.hitch(this,function(a){var b=[],c=function(a){b.push({id:""+a.id,name:""+a.id+" "+a.title,label:'<span class="projectId">'+a.id+"</span> "+a.title})};k.forEach(a.recent,c);0<a.recent.length&&b.push({label:"<hr />"});b.push({id:"1",name:"1 Unassigned",label:'<span class="projectId">1</span> Unassigned'});
for(var d in a.projects)c(a.projects[d]);this.project.set("store",new q({data:b}))}))},_setBookingAttr:function(a){var b=function(a){return g.format(a.getHours(),{pattern:"00"})+":"+g.format(a.getMinutes(),{pattern:"00"})};this.projectDeferred.then(e.hitch(this,function(){this.project.set("value",""+a.projectId)}));var c=f.datetimeToJsDate(a.startDatetime);this.start.set("value",b(c));this.date.set("value",c);a.endTime&&(c=f.timeToJsDate(a.endTime),this.end.set("value",b(c)));a.notes&&this.notes.set("value",
a.notes);this.booking=a},postCreate:function(){if(!this.store)this.store=new p({target:"index.php/Timecard/Timecard/"});this.own(l(this.notesIcon,"click",e.hitch(this,"toggleNotes")));this.start.set("placeHolder","Start");this.end.set("placeHolder","End");this.notes.set("placeHolder","Notes");this.end.validate=this._endValidateFunction(this.end.validate,this.start)},toggleNotes:function(){var a=!0;h.contains(this.notesContainer,"open")&&(a=!1);h.toggle(this.notesContainer,"open");a?this.notes.focus():
this.end.focus()},_getStartRegexp:function(){return"(([01]?\\d|2[0123])[:\\. ]?([01-5]\\d)|24[:\\. ]?00)"},_getEndRegexp:function(){return"(([01]?\\d|2[0123])[:\\. ]?([01-5]\\d)|24[:\\. ]?00)?"},_showErrorInWarningIcon:t.errorHandlerForTag("bookingCreator"),_submit:function(a){a.stopPropagation();if(this.form.validate()){var a=this.form.get("value"),b=this._prepareDataForSend(a);this.emit("create",a);b&&this.store.put(b).then(function(){n.publish("notification/clear","bookingCreator")},e.hitch(this,
function(a){try{var b=o.parse(a.responseText,!0);b.error&&"overlappingEntry"===b.error?this._markOverlapError():this._showErrorInWarningIcon(a)}catch(e){this._showErrorInWarningIcon(a)}}))}return!1},_markOverlapError:function(){this.start.set("state","Error");this.end.focus();this.end.set("state","Error");this.end.set("message","The entry overlaps with an existing one")},_prepareDataForSend:function(a){var b={},c=this._inputToTime(a.start,this._getStartRegexp()),d=this._inputToTime(a.end,this._getEndRegexp());
if(!c)return!1;if(d)b.endTime=f.jsDateToIsoTime(d)+":00";if(a.id)b.id=a.id;d=new Date(a.date.getTime());d.setHours(c.getHours());d.setMinutes(c.getMinutes());b.startDatetime=f.jsDateToIsoDatetime(d)+":00";b.notes=a.notes||"";b.projectId=a.project||"1";return b},_inputToTime:function(a,b){if(0!==a.length){var c=a.match(b);if(c[2]&&c[3]){var d=new Date;d.setHours(parseInt(c[2],10));d.setMinutes(parseInt(c[3],10));return d}}return null},_setDateAttr:function(a){this.date.set("value",a)},_endValidateFunction:function(a,
b){return function(c){var d=a.apply(this,arguments);if(!d)return d;var e=this.get("value"),f=!1;if(e.match(/^\d{3}$/)){if(c)return d;f=!0}d=parseInt(b.get("value").replace(/D/g,""));e=parseInt(e.replace(/\D/g,""),10);return d>=e?(this._maskValidSubsetError=!1,this.focusNode.setAttribute("aria-invalid","true"),this.set("state","Error"),this.set("message","End time must be after start time"),f&&r.show("End time must be after start time",this.domNode,this.tooltipPosition,!this.isLeftToRight()),!1):!0}}})});