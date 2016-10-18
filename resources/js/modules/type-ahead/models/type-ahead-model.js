/**
 * Represents a model.
 * @class TypeAheadModel
 *
 * Use the get keyword to make our methods serve as getters for a property.
 * This means they will be accessible as properties, but defined as methods,
 * retaining compatibility with any existing references if you're converting existing code.
 *
 * @author Andy Gutsche
 */

import App from '../../../app';

// Creates a new model class object
class TypeAheadModel extends App.ComponentModel {
	// Default values for all of the model attributes
	get defaults() {
		return [
			{
				keyword: ''
			}
		]
	}

	initialize() {
	}

	// Gets called automatically when the set and/or save methods are called (add your own logic)
	validate(attrs) {
	}
}

// Returns the model class
export default TypeAheadModel;