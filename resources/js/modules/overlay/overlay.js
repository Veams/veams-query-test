/**
 * Represents an overlay module.
 *
 * This module is responsible to create an overlay
 * without predefining any inner overlay template.
 *
 * It should be used by other modules
 * to display their content in an overlay.
 *
 * @module Overlay
 * @version v2.0.0
 *
 * @author Sebastian Fitzner
 */

import Helpers from '../../utils/helpers';
import App from '../../app';
import AppModule from '../_global/module';

const $ = App.$;

let Handlebars = require('handlebars/runtime')['default'];
let Template = require('../../templates/templates')(Handlebars);

class Overlay extends AppModule {
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
			openClass: 'is-open',
			closeBtn: '[data-js-atom="overlay-close"]',
			overlay: '[data-js-atom="overlay"]',
			regionContent: '[data-js-atom="overlay-content"]',
			template: Template['OVERLAY']
		};

		super(obj, options);
		App.registerModule && App.registerModule(Overlay.info, this.el);
	}

	// GETTER AND SETTER

	/**
	 * Get module information
	 */
	static get info() {
		return {
			name: 'Overlay',
			version: '2.0.0',
			vc: true,
			mod: false // set to true if source was modified in project
		};
	}

	// set and get overlay template
	get template() {
		return this._template;
	}

	set template(tpl) {
		this._template = tpl;
	}

	// set and get infos if overlay is created
	get overlayCreated() {
		return this._overlayCreated;
	}

	set overlayCreated(bol) {
		this._overlayCreated = bol;
	}

	// set and get infos if overlay is open
	get isOpen() {
		return this._isOpen;
	}

	set isOpen(bol) {
		this._isOpen = bol;
	}

	// set and get overlay element after creation
	get $overlay() {
		return this._$overlay;
	}

	set $overlay(el) {
		this._$overlay = el;
	}

	// set and get close button after creation
	get $closeBtn() {
		return this._$closeBtn;
	}

	set $closeBtn(el) {
		this._$closeBtn = el;
	}

	// set and get content region
	get $regionContent() {
		return this._$regionContent;
	}

	set $regionContent(el) {
		this._$regionContent = el;
	}

	/**
	 * Initialize the view and merge options
	 *
	 */
	initialize() {
		this.$body = $('body');
		this.template = this.options.template;

		this.bindEvents();
	}

	/**
	 * Bind global events
	 *
	 * Listen to open and close events
	 */
	bindEvents() {
		let fnRender = this.render.bind(this);

		// Global events
		App.Vent.on(App.EVENTS.overlay.open, fnRender);

		// Close overlay with ESC
		$(window).on(App.EVENTS.keyup, (e) => {
			if (e.keyCode == 27 && this.isOpen) {
				this.close();
			}
		});
	}

	/**
	 * Bind local events
	 */
	bindLocalEvents() {
		let fnClose = this.close.bind(this);

		// Local events
		this.$closeBtn.on(App.EVENTS.click, fnClose);
	}

	/**
	 * Pre-Render the overlay and save references
	 */
	preRender() {
		// Append FE template
		this.$body.append(this.template());

		// Set some references
		this.$overlay = $(this.options.overlay);
		this.$closeBtn = $(this.options.closeBtn, this.$overlay);
		this.$regionContent = $(this.options.regionContent, this.$overlay);

		this.overlayCreated = true;
	}

	/**
	 * Render the overlay
	 */
	render(obj) {
		let data = obj.data || (obj.options && obj.options.data);

		// Check if data object is provided
		if (!data) {
			console.warn('Overlay: You have to provide an object with data (obj.data || obj.options.data)!');
			return;
		}

		// Check if overlay is already created
		if (!this.overlayCreated) {
			this.preRender();
			this.bindLocalEvents();
		}

		// Append data to overlay region
		this.$regionContent.html(data);

		// Open overlay
		this.open();
	}

	/**
	 * Open Overlay
	 */
	open() {
		this.$overlay.addClass(this.options.openClass);
		this.isOpen = true;
	}

	/**
	 * Close overlay
	 */
	close() {
		this.$overlay.removeClass(this.options.openClass);
		this.isOpen = false;
	}
}

export default Overlay;