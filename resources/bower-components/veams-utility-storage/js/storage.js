/**
 * Represents a storage class.
 *
 * Offers a simple API for storing Javascript objects in HTML5 web storage
 *
 * @module Storage
 * @version v1.0.4
 *
 * @author Andy Gutsche
 */

import App from '../../app';
import Helpers from '../../utils/helpers';

/**
 * ####################################################
 * PRIVATE PROPERTIES
 * ####################################################
 */

const _storage = new WeakMap();
const _options = new WeakMap();

/**
 * ####################################################
 * PRIVATE METHODS
 * ####################################################
 */

/**
 * Initialize
 *
 * @private
 */
function initialize() {
	App.registerModule && App.registerModule(Storage.info, this.el);

	if (!window.localStorage || !window.sessionStorage) {
		console.warn('Storage: HTML5 web storage not available');
	}
	else {
		if (_options.get(this).type === 'permanent') {

			_storage.set(this, 'localStorage');
		} else if (_options.get(this).type === 'session') {

			_storage.set(this, 'sessionStorage');
		}
		else {
			console.warn('Storage: unknown storage type - use "permanent" or "session"');
		}
	}
}

/**
 * Update wrapper object
 *
 * @private
 *
 * @param {object} wrapperObj - wrapper object
 */
function updateWrapperObj(wrapperObj) {
	window[_storage.get(this)].setItem(_options.get(this).name, JSON.stringify(wrapperObj));
}

/**
 * Get wrapper object
 *
 * @private
 * @return {object} - wrapper object
 */
function getWrapperObj() {
	return JSON.parse(window[_storage.get(this)].getItem(_options.get(this).name)) || {};
}

/**
 * ####################################################
 * CLASS
 * ####################################################
 */


class Storage {
	/**
	 * Constructor for our class
	 *
	 * @param {object} opts - options which will be passed in as JSON object
	 * @param {string} opts.type - storage type ('permanent' || 'session')
	 * @param {string} opts.name - namespace in which items will be saved
	 */
	constructor(opts) {
		let options = {
			type: '',
			name: ''
		};

		_options.set(this, Helpers.defaults(opts || {}, options));
		this::initialize();
	}

	/**
	 * Get module information
	 */
	static get info() {
		return {
			name: 'Storage',
			version: '1.0.4',
			vc: true,
			mod: false
		};
	}

	/**
	 * Set item
	 *
	 * @public
	 *
	 * @param {string} name - item name
	 * @param {object} obj - object to save
	 */
	setItem(name, obj) {
		if (!_storage.get(this)) {
			return;
		}

		let wrapperObj = this::getWrapperObj();

		wrapperObj[name] = obj;
		this::updateWrapperObj(wrapperObj);
	}

	/**
	 * Get item by name
	 *
	 * @public
	 *
	 * @param {string} name - item name
	 * @return {object} - object retrieved by item name
	 */
	getItem(name) {
		if (!_storage.get(this)) {
			return false;
		}

		let wrapperObj = this::getWrapperObj();

		return wrapperObj[name];
	}

	/**
	 * Remove item by name
	 *
	 * @public
	 *
	 * @param {string} name - item name
	 */
	removeItem(name) {
		if (!_storage.get(this)) {
			return;
		}

		let wrapperObj = this::getWrapperObj();

		delete wrapperObj[name];
		this::updateWrapperObj(wrapperObj);
	}

	/**
	 * Clear all items
	 *
	 * @public
	 */
	clear() {
		if (!_storage.get(this)) {
			return;
		}

		window[_storage.get(this)].removeItem(_options.get(this).name);
	}
}

/**
 * ####################################################
 * EXPORT MODULE
 * ####################################################
 */

export default Storage;