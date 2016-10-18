module.exports = function(Handlebars) {

window["App"] = window["App"] || {};
window["App"]["Templates"] = window["App"]["Templates"] || {};

window["App"]["Templates"]["OVERLAY"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"b-overlay\" data-css=\"b-overlay\" data-js-atom=\"overlay\">\r\n	<div class=\"overlay__wrapper\">\r\n		<button class=\"overlay__close\" data-js-atom=\"overlay-close\"></button>\r\n		<div class=\"overlay__content\">\r\n			<div class=\"overlay__inner\" data-js-atom=\"overlay-content\">\r\n\r\n			</div>\r\n		</div>\r\n	</div>\r\n	<div class=\"overlay__mask\" data-js-atom=\"overlay-mask\"></div>\r\n</div>";
},"useData":true});

window["App"]["Templates"]["TYPEAHEAD__ITEM"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<a href=\"#"
    + alias4(((helper = (helper = helpers.keyword || (depth0 != null ? depth0.keyword : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"keyword","hash":{},"data":data}) : helper)))
    + "\" class=\"type-ahead__item-link\" data-js-atom=\"item-link\">"
    + alias4(((helper = (helper = helpers.keyword || (depth0 != null ? depth0.keyword : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"keyword","hash":{},"data":data}) : helper)))
    + "</a>";
},"useData":true});

window["App"]["Templates"]["TYPEAHEAD"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.typeAheadContextClass || (depth0 != null ? depth0.typeAheadContextClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"typeAheadContextClass","hash":{},"data":data}) : helper)));
},"3":function(container,depth0,helpers,partials,data) {
    return "default";
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return " "
    + container.escapeExpression(((helper = (helper = helpers.typeAheadClass || (depth0 != null ? depth0.typeAheadClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"typeAheadClass","hash":{},"data":data}) : helper)));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<div class=\"c-type-ahead--"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.typeAheadContextClass : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.typeAheadClass : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" data-css=\"c-type-ahead\">\r\n	<ul class=\"type-ahead__list\" data-js-atom=\"type-ahead-list\"></ul>\r\n</div>";
},"useData":true});

return window["App"]["Templates"];

};