/**
 * Represents a TypeAheadView.
 * @class TypeAheadView
 *
 * @module TypeAheadView
 * @version v3.0.0
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
import TypeAheadCollection from '../collections/type-ahead-collection';
import TypeAheadItemView from './type-ahead-item-view';

let Handlebars = require('handlebars/runtime')['default'];
let $ = App.$;
let Template = Tpl(Handlebars);

// Creates a new view class object
class TypeAheadView extends App.ComponentView {

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
			url: false, //ajax url
			inputField: '[data-js-atom="input-field"]', // input
			list: '[data-js-atom="type-ahead-list"]', // item list
			deleteBtn: '[data-js-atom="delete-btn"]',
			item: '[data-js-atom="type-ahead-item"]', // single item
			form: '[data-js-atom="form"]', // form element
			appendTarget: false, // append the type-ahead box to appendTarget
			template: Template['TYPEAHEAD'], // template name
			contextClass: 'search', // modifier class
			modifierClass: false, //state modifier class
			itemClass: 'type-ahead__item',
			threshold: 4 // start type-ahead threshold, default 4 characters
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
	 * Get module information
	 */
	static get info() {
		return {
			name: 'TypeAhead',
			version: '3.0.0',
			vc: true
		};
	}

	/**
	 * Initialize the view and merge options
	 *
	 * @param {Object} obj - options obj
	 * @public
	 */
	initialize(obj) {
		this.$el = $(this.el); //TODO: set via AppComponentView
		this._options = Helpers.defaults(obj.options || {}, this._options);
		this.template = this.options.template;

		App.registerModule && App.registerModule(TypeAheadView.info, this.el);

		this.$inputField = $(this.options.inputField, this.$el);
		this.$form = this.$el.closest(this.options.form);
		this.$appendTarget = this.options.appendTarget ? $(this.options.appendTarget, this.$el) : this.$el;

		this.bindEvents();
	}

	/**
	 * Bind all events
	 *
	 * @public
	 */
	bindEvents() {
		let fnResetInput = this.resetInput.bind(this);
		let fnFetchData = this.fetchData.bind(this);
		let fnRemoveTypeAhead = this.removeTypeAhead.bind(this);
		let fnSearch = this.search.bind(this);
		let fnCalculateWidthAndPos = this.calculateWidthAndPos.bind(this);

		// global events
		App.Vent.on(App.EVENTS.typeAhead.search, fnSearch);
		App.Vent.on(App.EVENTS.resize, fnCalculateWidthAndPos);

		// local events
		this.$el.on(App.EVENTS.click, this.options.deleteBtn, fnResetInput);
		this.$el.on(App.EVENTS.keyup, this.options.inputField, fnFetchData);
		this.$el.on(App.EVENTS.blur, this.options.inputField, fnRemoveTypeAhead);
	}

	/**
	 * Fetch auto suggest data
	 *
	 * @private
	 */
	fetchData() {

		if (this.$inputField.val().length >= this.options.threshold) {
			this.collection = new TypeAheadCollection();

			this.collection.fetch({
				url: this.options.url,
				success: () => {
					this.render();
				}
			});
		} else {
			this.removeTypeAhead(true);
		}
	}

	/**
	 * Reset input
	 *
	 * @private
	 */
	resetInput() {
		this.$inputField.val('');
		this.removeTypeAhead(true);
	}

	/**
	 * Submit form
	 *
	 * @param {Object} e - event object
	 * @private
	 */
	search(e) {
		this.$inputField.val(e.keyword);
		this.$form[0].submit();
	}

	/**
	 * Remove type ahead element
	 *
	 * @param {Object} e - event object
	 * @private
	 */
	removeTypeAhead(e) {
		let timeout = typeof e === 'boolean' && e ? 0 : 200;

		clearTimeout(this.timeout);

		this.timeout = setTimeout(() => {

			if (this.$typeAheadEl && this.$typeAheadEl.length) {
				this.$typeAheadEl.remove();
				this.$typeAheadEl = null;
			}
		}, timeout);
	}

	/**
	 * Calculate width and position of type ahead element
	 *
	 * @param {Object} e - event object
	 * @private
	 */
	calculateWidthAndPos(e) {
		let inputOffset = this.$inputField.offset();

		if (!this.$typeAheadEl || !this.$typeAheadEl.length) {
			return;
		}

		if (e && !App.support.touch) {
			this.removeTypeAhead(true);
		}

		this.$typeAheadEl.css({
			width: this.$inputField.outerWidth(),
			top: inputOffset.top + this.$inputField.outerHeight(),
			left: inputOffset.left
		});
	}

	/**
	 * Render one item
	 *
	 * @param {Object} model - item model
	 * @private
	 */
	renderOne(model) {
		let item = new TypeAheadItemView({
			model: model,
			tagName: 'li',
			className: () => {
				return this.options.itemClass;
			}
		});

		this.$typeAheadEl.find(this.options.list).append(item.render().el);
	}

	/**
	 * Render view
	 *
	 * @public
	 */
	render() {
		let data = {
			contextClass: this.options.contextClass,
			modifierClass: this.options.modifierClass
		};

		if (this.$typeAheadEl && this.$typeAheadEl.length) {
			this.$typeAheadEl.find(this.options.list).empty();
		} else {
			this.$typeAheadEl = $($.parseHTML(this.template(data)));
			this.calculateWidthAndPos();
			this.$appendTarget.append(this.$typeAheadEl);
		}

		this.collection.forEach(this.renderOne, this);

		// Maintains chainability
		return this;
	}
}

// Returns the view class
export default TypeAheadView;