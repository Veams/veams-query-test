/**
 * A module which takes elements and set the height of the elements equal.
 *
 * @module EqualRows
 * @version v2.0.0
 *
 * @author Sebastian Fitzner
 */

import Helpers from '../../utils/helpers';
import App from '../../app';
import AppModule from '../_global/module';
import ImageLoader from '../../utils/mixins/imageLoader';

const $ = App.$;

class EqualRows extends AppModule {
	/**
	 * Constructor for our class
	 *
	 * @see module.js
	 *
	 * @param {Object} obj - Object which is passed to our class
	 * @param {Object} obj.el - element which will be saved in this.el
	 * @param {Object} obj.options - options which will be passed in as JSON object
	 */
	constructor(obj) {
		let options = {
			childElements: '[data-js-atom="equal-child"]',
			lastRowClass: 'is-last-row',
			addPadding: 0
		};

		super(obj, options);
		App.registerModule && App.registerModule(EqualRows.info, this.el);
	}

	/**
	 * Get module information
	 */
	static get info() {
		return {
			name: 'EqualRows',
			version: '2.0.0',
			vc: true,
			mod: false // set to true if source was modified in project
		};
	}

	initialize() {
		this.$childElements = $(this.options.childElements, this.$el);
		this.$firstChild = this.$childElements.eq(0);

		super.initialize();
	}

	bindEvents() {
		let fnRender = this.render.bind(this);

		App.Vent.on(App.EVENTS.resize, fnRender);
	}

	resetStyles($el) {
		$el.removeAttr('style');
	}

	setLastRowClass(row) {
		Helpers.forEach(row, (i, el) => {
			$(el).addClass(this.options.lastRowClass);
		});
	}

	buildRow() {
		let rows = [];
		let posArray = [];
		let firstElTopPos = this.$firstChild[0].offsetTop;

		Helpers.forEach(this.$childElements, (i, element) => {
			let $el = $(element);

			this.resetStyles($el);

			if ($el[0].offsetTop === firstElTopPos) {
				posArray.push($el);
			} else {
				rows.push(posArray);
				posArray = [];
				posArray.push($el);
				firstElTopPos = $el[0].offsetTop;
			}
		});

		rows.push(posArray);
		this.defineRowHeight(rows);
	}

	defineRowHeight(rows) {
		let i = 0;
		let padding = parseInt(this.options.addPadding, 10);

		for (i; i < rows.length; i++) {
			let height = this.getRowHeight(rows[i]);

			this.setHeight(rows[i], height, padding);

			if (i > 0 && i === rows.length - 1) {
				this.setLastRowClass(rows[i]);
			}
		}
	}

	getRowHeight(elements) {
		let height = 0;

		Helpers.forEach(elements, (i, el) => {
			let $el = $(el);
			let elHeight = $el.outerHeight();

			height = elHeight > height ? elHeight : height;
		});

		return height;
	}

	setHeight(elements, height, padding) {
		let addPadding = padding || 0;

		Helpers.forEach(elements, (i, el) => {
			el[0].style.height = height + addPadding + 'px';
		});
	}

	// Renders the view's template to the UI
	render() {
		this.buildRow();

		setTimeout(() => {
			App.Vent.trigger(App.EVENTS.equalRows.render, {
				el: this.el,
				$childElements: this.$childElements
			});
		}, 0);

		// Maintains chainability
		return this;
	}
}

EqualRows.classMixin(ImageLoader);

// Returns the View class
export default EqualRows;