/**
 * Represents a button with custom click handlers.
 *
 * @module CTA
 * @version v1.1.5
 *
 * @author Sebastian Fitzner
 * @author Andy Gutsche
 */

import Helpers from '../../utils/helpers';
import App from '../../app';
import AppModule from '../_global/module';
const $ = App.$;

class CTA extends AppModule {
	/**
	 * Constructor for our class
	 *
	 * @see module.js
	 *
	 * @param {obj} obj - Object which is passed to our class
	 * @param {obj.el} obj - element which will be saved in this.el
	 * @param {obj.options} obj - options which will be passed in as JSON object
	 */
	constructor(obj) {
		let options = {
			activeClass: 'is-active',
			closeLabel: false,
			ctaContent: '[data-js-atom="cta-content"]',
			globalEvent: 'cta:click',
			openLabel: false
		};

		super(obj, options);
		App.registerModule && App.registerModule(CTA.info, this.el);
	}

	/**
	 * Get module information
	 */
	static get info() {
		return {
			name: 'CTA',
			version: '1.1.5',
			vc: true,
			mod: false // set to true if source was modified in project
		};
	}

	/**
	 * Get and set the active state.
	 *
	 * @param {boolean} state - active state
	 */
	get active() {
		return this._active;
	}

	set active(state) {
		this._active = state;
	}

	/**
	 * Initialize the view and merge options
	 *
	 */
	initialize() {
		this.$ctaContent = $(this.options.ctaContent, this.$el);

		if (this.$el.is('.' + this.options.activeClass)) {
			this.active = true;
		}

		super.initialize();
	}

	/**
	 * Bind events
	 *
	 * Listen to open and close events
	 */
	bindEvents() {
		let onClick = this.onClick.bind(this);

		// Local events
		this.$el.on(App.clickHandler, onClick);
	}

	/**
	 * Close method
	 *
	 * Remove the active class, set label and trigger global event
	 *
	 * @public
	 */
	close() {
		if (this.options.closeLabel) {
			this.$ctaContent.text(this.options.closeLabel);
		}

		this.$el.removeClass(this.options.activeClass);
		this.active = false;
	}

	/**
	 * Open method
	 *
	 * Add the active class, set label and trigger global event
	 *
	 * @public
	 */
	open() {

		if (this.options.openLabel) {
			this.$ctaContent.text(this.options.openLabel);
		}

		this.$el.addClass(this.options.activeClass);
		this.active = true;
	}

	/**
	 * Click event method
	 *
	 * This method should be overriden when you want to use the button view
	 * @see button-init.js
	 *
	 * @param {event} e - event object
	 */
	onClick(e) {
		e.preventDefault();

		if (typeof this.clickHandler === 'function') {
			if (this.active) {
				this.close();
			}
			else {
				this.open();
			}

			this.clickHandler.apply(this, arguments);
		} else {
			console.log('You need to inherit from ' + this + ' and override the onClick method or pass a function to ' + this + '.clickHandler !');
		}
	}

	/**
	 * Click handler
	 *
	 * This method is public and can be overridden by
	 * other instances to support a generic button module
	 */
	clickHandler() {
		App.Vent.trigger(this.options.globalEvent, {
			el: this.el,
			isActive: this.active,
			options: this.options
		});
	}
}

export default CTA;