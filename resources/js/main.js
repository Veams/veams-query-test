// Main Requirements
import App from './app';
import Helpers from './utils/helpers';

// ES6 Modules
// import Storage from './modules/storage/storage';

import Slider from './modules/slider/slider';
import CTA from './modules/cta/cta';
import Overlay from './modules/overlay/overlay';
import SlideFox from './modules/slide-fox/slide-fox';

// @INSERTPOINT :: @ref: js-import

// Vars
const $ = App.$;

'use strict';

// Main Functionality
class Core {
	constructor() {
		this.initialize();
	}

	/**
	 * Initialize our core functionality
	 * This function will only be executed once.
	 */
	initialize() {
		console.log('App initialized with version: ', App.version);

		/**
		 * Detect Touch
		 */
		if (!App.support.touch) {
			$('html').addClass('no-touch');
		} else {
			$('html').addClass('touch');
		}

		// Redirect
		App.Vent.on(App.EVENTS.DOMredirect, (obj) => {
			if (!obj && !obj.url) {
				throw new Error('Object is not defined. Please provide an url in your object!');
			}

			// Redirect to page
			window.location.href = String(obj.url);
		});


		/**
		 * Init Overlay
		 */
		new Overlay();

		// @INSERTPOINT :: @ref: js-init-once-v3

	}

	preRender() {
		Helpers.saveDOM();
	}

	render(context) {

		/**
		 * Init Call-To-Action
		 */
		Helpers.loadModule({
			domName: 'cta',
			module: CTA,
			context: context
		});


		/**
		 * Init Form
		 */
		Helpers.loadModule({
			domName: 'slide-fox',
			module: SlideFox,
			context: context
		});


		// @INSERTPOINT :: @ref: js-init-v3

		Helpers.loadModule({
			domName: 'slider',
			module: Slider,
			context: context
		});

		// App.$.ajax({
		// 	url: 'ajax/test.json',
		// 	dataType: 'json',
		// 	success: function(resp) {
		// 		console.log('response: ', resp);
		// 	},
		// 	error: function(status, statusText) {
		// 		console.log('status: ', status);
		// 		console.log('statusText: ', statusText);
		// 	}
		// });

		// let fnHandler = function myHandler(e, data) {
		// 	console.log('e: ', e);
		// 	console.log('data: ', e.detail);
		// };

		// let $h3 = $('h3');
		// $h3.on(App.EVENTS.click, fnHandler);
		// $h3.trigger(App.EVENTS.click);

		// App.Vent.on('blakeks', fnHandler);
		// App.Vent.trigger('blakeks', {hurz: 'suelz'});

		// window.myStorage = new Storage({
		// 	type: 'permanent', // or 'session',
		// 	name: 'someName' // custom namespace (e.g. from module)
		// });

	}
}

document.addEventListener("DOMContentLoaded", function () {
	let core = new Core();

	/**
	 * Render modules
	 */
	core.preRender();
	core.render(document);

	/**
	 * Initialize modules which are loaded after initial load
	 * via custom event 'DOMchanged'
	 */
	App.Vent.on(App.EVENTS.DOMchanged, (context) => {
		console.log('Dom has changed. Initialising new modules in: ', context);
		core.preRender();
		core.render(context);
	});
});