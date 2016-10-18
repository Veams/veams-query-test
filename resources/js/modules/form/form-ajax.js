/**
 * Represents a ajax form class.
 *
 * @module FormAjax
 * @version v2.0.0
 *
 * @author Sebastian Fitzner
 */

import Helpers from '../../utils/helpers';
import App from '../../app';
import AppModule from '../_global/module';

const $ = App.$;

class FormAjax extends AppModule {
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
			submitOnLoad: false,
			submitOnChange: true,
			loadingClass: null,
			eventName: App.EVENTS.form.complete
		};

		super(obj, options);
		App.registerModule && App.registerModule(FormAjax.info, this.el);
	}

	/**
	 * Get module information
	 */
	static get info() {
		return {
			name: 'FormAjax',
			version: '2.0.0',
			vc: true,
			mod: false // set to true if source was modified in project
		};
	}

	initialize() {
		// save some references
		this.fields = $('input', this.$el);
		this.selects = $('select', this.$el);

		// Fetch data if option is true
		if (this.options.submitOnLoad) {
			this.fetchData(this.$el);
		}

		// call super
		super.initialize();
	}

	/**
	 * Bind all evente
	 */
	bindEvents() {
		let fnFetchData = this.fetchData.bind(this);
		let fnReset = this.resetFilters.bind(this);
		/**
		 * On submit event fetch data
		 */
		this.$el.on(App.EVENTS.submit + ' ' + App.EVENTS.reset, fnFetchData);

		/**
		 * Reset filters on reset event
		 */
		App.Vent.on(App.EVENTS.form.reset, fnReset);

		/**
		 * If submitOnChange is true
		 *
		 * fetch data
		 * show reset button
		 *
		 */
		if (this.options.submitOnChange) {
			this.$el.on(App.EVENTS.blur + ' ' + App.EVENTS.change, this.fields, fnFetchData);
		}
	}


	/**
	 * Ajax call to get data object with results or error message.
	 *
	 * @param {Object} e - object or event.
	 * @param {object} currentTarget - Target to which listener was attached.
	 */
	fetchData(e, currentTarget) {
		let el;

		if (e && typeof e.preventDefault === 'function') {
			e.preventDefault();
			el = currentTarget || e.currentTarget ;
		} else {
			el = e;
		}

		if (this.options.loadingClass) {
			this.$el.addClass(this.options.loadingClass);
		}

		let action = this.$el.attr('action');
		let method = this.$el.attr('method');
		let serialize = this.$el.serialize();
		let url = action + '?' + serialize;

		$.ajax({
			url: url,
			dataType: 'json',
			success: (data) => {
				this.onSuccess(data, el);
			},
			error: (status, statusText) => {
				this.onError(status, statusText)
			}
		});

	}

	onSuccess(data, el) {
		this.fields = $('input', this.$el);
		this.selects = $('select', this.$el);

		App.Vent.trigger(this.options.eventName, {
			data: data,
			el: el
		});

		if (this.options.loadingClass) {
			this.$el.removeClass(this.options.loadingClass);
		}

		this.$el.addClass('is-success');
	}

	onError(status, statusText) {

		if (this.options.loadingClass) {
			this.$el.removeClass(this.options.loadingClass);
		}

		this.$el.addClass('is-error');

		console.warn('FormAjax:', statusText, '(' + status + ')');
	}

	/**
	 * Reset filters, currently supported
	 *
	 * checkboxes
	 * selects
	 */
	resetFilters() {
		this.resetChecks();
		this.resetSelects();
	}

	/**
	 * Reset checkboxes
	 */
	resetChecks() {
		this.fields.each(function () {
			$(this).removeAttr('checked');
		});
	}

	/**
	 * Resest selects
	 */
	resetSelects() {
		this.selects.each(function () {
			$(this).removeAttr('selected').find('option').eq(0).attr('selected', 'selected');
		});
	}
}

// Returns constructor
export default FormAjax;