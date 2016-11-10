/**
 * Represents a simple accordion with transitions and max-height.
 *
 * @module Accordion
 * @version v2.0.0
 *
 * @author Sebastian Fitzner
 * @author Andy Gutsche
 */

/**
 * Requirements
 */
import Helpers from '../../utils/helpers';
import App from '../../app';
import AppModule from '../_global/module';

var $ = App.$;

/**
 * Class Accordion
 */
class Accordion extends AppModule {
	constructor(obj) {
		let options = {
			openIndex: null,
			openOnViewports: [
				'desktop',
				'tablet-large',
				'tablet-small'
			], // array: viewport names - eg.: ['mobile', 'tablet', 'desktop-small', 'desktop']
			singleOpen: false,
			activeClass: 'is-active',
			openClass: 'is-open',
			closeClass: 'is-closed',
			calculatingClass: 'is-calculating',
			unresolvedClass: 'is-unresolved',
			removeStyles: false, // TODO
			dataMaxAttr: 'data-js-height',
			accordionBtn: '[data-js-atom="accordion-btn"]',
			accordionContent: '[data-js-atom="accordion-content"]',
			tabMode: false,
			openByHash: false
		};

		super(obj, options);
		App.registerModule && App.registerModule(Accordion.info, this.el);
	}

	/**
	 * GETTER AND SETTER
	 */

	/**
	 * Get module information
	 */
	static get info() {
		return {
			name: 'Accordion',
			version: '2.0.0',
			vc: true,
			mod: false // set to true if source was modified in project
		};
	}

	set $accordionContents(items) {
		this._$accordionContents = items;
	}

	get $accordionContents() {
		return this._$accordionContents;
	}

	set $accordionBtns(items) {
		this._$accordionBtns = items;
	}

	get $accordionBtns() {
		return this._$accordionBtns;
	}

	set $target(item) {
		this._$target = item;
	}

	get $target() {
		return this._$target;
	}

	set $btn(item) {
		this._$btn = item;
	}

	get $btn() {
		return this._$btn;
	}

	initialize() {
		this.$accordionContents = $(this.options.accordionContent, this.$el);
		this.$accordionBtns = $(this.options.accordionBtn, this.$el);
		this.$target = null;
		this.$btn = null;

		if (this.options.openByHash) {
			let idx = this.getIndexByHash();

			this.openIndex = typeof idx === 'number' ? idx : this.options.openIndex;
		}
		else if (this.options.tabMode && !this.options.openIndex) {
			this.openIndex = 0;
		}
		else {
			this.openIndex = this.options.openIndex;
		}

		// call super
		super.initialize();
	}

	/**
	 * Bind all events
	 */
	bindEvents() {
		let fnRender = this.render.bind(this);
		let fnHandleClick = this.handleClick.bind(this);
		let fnCloseAll = this.closeAll.bind(this);
		let fnOpenAll = this.openAll.bind(this);
		let fnOnHashChange = this.onHashChange.bind(this);

		// Local events
		this.$el.on(Helpers.clickHandler(), this.options.accordionBtn, fnHandleClick);

		if (this.options.openByHash) {
			$(window).on(App.EVENTS.hashchange, fnOnHashChange);
		}

		// Global events
		App.Vent.on(App.EVENTS.resize, fnRender);
		App.Vent.on(App.EVENTS.accordion.closeAll, fnCloseAll);
		App.Vent.on(App.EVENTS.accordion.openAll, fnOpenAll);
	}

	render() {
		if (!App.currentMedia) {
			console.warn('Accordion: App.currentMedia is necessary to support the slider module!');
			return;
		}

		this.removeStyles();
		this.saveHeights(this.$accordionContents);
		this.closeAll();

		// Open on index if set in options
		if (typeof this.openIndex === 'number') {

			if (this.options.tabMode || this.options.openOnViewports.indexOf(App.currentMedia) !== -1) {
				this.activateBtn(this.$accordionBtns.eq(this.openIndex));
				this.slideDown(this.$accordionContents.eq(this.openIndex));
			}
		}

		if (this.$el.hasClass(this.options.unresolvedClass)) {
			this.$el.removeClass(this.options.unresolvedClass);
		}
	}

	/**
	 * Get index of accordion content referenced by hash
	 *
	 * @return {number|boolean} - index of element or false if no match
	 */
	getIndexByHash() {
		let hash = document.location.hash.split('#');
		let retVal = false;
		let i = 0;

		if (hash < 2) {
			return false;
		}

		for (i; i < this.$accordionContents.length; i++) {
			if (this.$accordionContents[i].id === hash[1]) {
				retVal = i;
				break;
			}
		}

		return retVal;
	}

	/**
	 * Open accordion content referenced by hash
	 *
	 * @param {object} e - event object
	 */
	onHashChange(e) {
		let idx = this.getIndexByHash();

		if (typeof idx === 'number') {

			if (this.options.singleOpen) {
				this.closeAll();
			}

			this.activateBtn(this.$accordionBtns.eq(idx));
			this.slideDown(this.$accordionContents.eq(idx));

		}
	}

	/**
	 * Save heights of all accordion contents.
	 *
	 * @param {Array} items - array of items
	 */
	saveHeights(items) {
		Helpers.forEach(items, (idx, item) => {
			this.saveHeight(item);
		});
	}

	/**
	 * Save the height of the node item.
	 *
	 * @param {Object} item - item to calculate the height
	 */
	saveHeight(item) {
		let $el = $(item);

		// the el is hidden so:
		// making the el block so we can measure its height but still be hidden
		$el.addClass(this.options.calculatingClass);

		let wantedHeight = $el.outerHeight();

		// reverting to the original values
		$el.removeClass(this.options.calculatingClass);

		// save height in data attribute
		$el.attr(this.options.dataMaxAttr, wantedHeight);
	}

	/**
	 * Handle the click,
	 * get the id of the clicked button and
	 * execute the toggleContent method.
	 *
	 * @param {Object} e - event object
	 * @param {object} currentTarget - Target to which listener was attached.
	 */
	handleClick(e, currentTarget) {
		this.$btn = currentTarget ? $(currentTarget) : $(e.currentTarget);
		let targetId = this.$btn.attr('href');

		e.preventDefault();

		if (this.options.tabMode && this.$btn.hasClass(this.options.activeClass)) {
			return;
		}

		this.toggleContent(targetId);
	}

	/**
	 * Toggle the accordion content by using the id of the accordion button.
	 *
	 * @param {String} id - id of the target
	 *
	 * @public
	 */
	toggleContent(id) {
		this.$target = this.$el.find(id);

		if (this.$target.hasClass(this.options.openClass)) {
			this.slideUp(this.$target);
			this.deactivateBtn(this.$btn);
		} else {

			if (this.options.singleOpen || this.options.tabMode) {
				this.closeAll();
			}

			this.activateBtn(this.$btn);
			this.slideDown(this.$target);
		}
	}

	/**
	 * Mimics the slideUp functionality of jQuery by using height and transition.
	 *
	 * @param {Object} $item - jQuery object of item
	 */
	slideUp($item) {

		$item
				.css('height', 0)
				.removeAttr('style')
				.attr('aria-expanded', 'false')
				.removeClass(this.options.openClass)
				.addClass(this.options.closeClass);
	}

	/**
	 * Mimics the slideDown functionality of jQuery by using height and transition.
	 *
	 * @param {Object} $item - jQuery object of item
	 */
	slideDown($item) {

		$item
				.css('height', $item.attr('data-js-height'))
				.attr('aria-expanded', 'true')
				.removeClass(this.options.closeClass)
				.addClass(this.options.openClass);
	}

	/**
	 * Adds active class to the clicked button.
	 *
	 * @param {Object} $item - jQuery object of button
	 */
	activateBtn($item) {
		$item.addClass(this.options.activeClass);
	}

	/**
	 * Removes active class from the button.
	 *
	 * @param {Object} $item - jQuery object of button
	 */
	deactivateBtn($item) {
		$item.removeClass(this.options.activeClass);
	}

	/**
	 * Remove all styles of the accordion content elements
	 */
	removeStyles() {
		this.$accordionContents.removeAttr('style');
	}

	/**
	 * Close all accordion contents and active buttons
	 *
	 * @public
	 */
	closeAll() {
		Helpers.forEach(this.$accordionContents, (idx, item) => {
			this.slideUp($(item));
		});
		Helpers.forEach(this.$accordionBtns, (idx, item) => {
			this.deactivateBtn($(item));
		});
	}

	/**
	 * Close all accordion contents and active buttons
	 *
	 * @public
	 */
	openAll() {
		Helpers.forEach(this.$accordionContents, (idx, item) => {
			this.slideDown($(item));
		});
		Helpers.forEach(this.$accordionBtns, (idx, item) => {
			this.activateBtn($(item));
		});
	}
}

// Returns constructor
export default Accordion;