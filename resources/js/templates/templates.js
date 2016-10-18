module.exports = function(Handlebars) {

window["App"] = window["App"] || {};
window["App"]["Templates"] = window["App"]["Templates"] || {};

window["App"]["Templates"]["OVERLAY"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"b-overlay\" data-css=\"b-overlay\" data-js-atom=\"overlay\">\r\n	<div class=\"overlay__wrapper\">\r\n		<button class=\"overlay__close\" data-js-atom=\"overlay-close\"></button>\r\n		<div class=\"overlay__content\">\r\n			<div class=\"overlay__inner\" data-js-atom=\"overlay-content\">\r\n\r\n			</div>\r\n		</div>\r\n	</div>\r\n	<div class=\"overlay__mask\" data-js-atom=\"overlay-mask\"></div>\r\n</div>";
},"useData":true});

return window["App"]["Templates"];

};