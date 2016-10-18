/**
 * Represents a TypeAheadItemView.
 * @class TypeAheadItemView
 *
 * Use the get keyword to make our methods serve as getters for a property.
 * This means they will be accessible as properties, but defined as methods,
 * retaining compatibility with any existing references if you're converting existing code.
 *
 * @author Andy Gutsche
 */

import App from '../../../app';
import Helpers from '../../../utils/helpers';
import Tpl from '../../../templates/templates';

let Handlebars = require('handlebars/runtime')['default'];
let $ = App.$;
let Template = Tpl(Handlebars);

// Creates a new view class object
class TypeAheadItemView extends App.ComponentView {

	/**
	 * Get template
	 *
	 */
	get template() {
		return this._template;
	}

	/**
	 * Set template
	 *
	 */
	set template(tpl) {
		this._template = tpl;
	}

	/**
	 * Get options
	 *
	 */
	get _options() {
		return {
			template: Template['TYPEAHEAD__ITEM'],
			itemLink: '[data-js-atom="item-link"]'
		}
	}

	/**
	 * Set options
	 *
	 */
	set _options(opts) {
		this.options = opts;
	}

	/**
	 * Initialize the view and merge options
	 *
	 * @param {Object} obj - options obj
	 * @public
	 */
	initialize(obj) {
		this._options = Helpers.defaults(obj.options || {}, this._options);
		this.template = this.options.template;
		this.bindEvents();
	}

	/**
	 * Bind all events
	 *
	 * @public
	 */
	bindEvents() {
		let fnTriggerSearch = this.triggerSearch.bind(this);

		// global events

		// local events
		this.$el.on(App.EVENTS.click, this.options.itemLink, fnTriggerSearch);
	}

	/**
	 * Trigger search
	 *
	 * @param {Object} e - event object
	 * @private
	 */
	triggerSearch(e) {
		e.preventDefault();

		App.Vent.trigger(App.EVENTS.typeAhead.search, {
			el: this.$el,
			keyword: $(e.currentTarget).text()
		});
	}

	/**
	 * Render view
	 *
	 * @public
	 */
	render() {
		this.$el.html(this.template(this.model.toJSON()));

		// Maintains chainability
		return this;
	}

}

// Returns the view class
export default TypeAheadItemView;