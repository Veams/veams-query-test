# Storage

This component is based on the blueprint of Veams-Components.
It offers a simple API for storing Javascript objects in HTML5 web storage

## Usage

Just initialize on demand.

### Storage(opts: StorageOptions)
	/**
	 * Constructor
	 *
	 * @param {object} opts - options which will be passed as object
	 * @param {string} opts.type - storage type ('permanent' || 'session')
	 * @param {string} opts.name - namespace in which items will be saved
	 */

### Methods

#### setItem(name:string, obj:object)
	/**
	 * Set item
	 *
	 * @param {string} name - item name
	 * @param {object} obj - object to save
	 */

#### getItem (name:string)
	/**
	 * Get item by name
	 *
	 * @param {string} name - item name
	 * @return {object} - object retrieved by item name
	 */
	 
#### removeItem (name:string)
	/**
	 * Remove item by name
	 *
	 * @param {string} name - item name
	 */

#### clear ()
	/**
	 * Clear all items
	 */


### Include: JavaScript

#### Import
``` js
import Storage from './modules/storage/storage';
```

#### Initializing
``` js
/**
* Init storage
*/
let myStorage = new Storage({
	type: 'permanent' // or 'session',
	name: 'someName' // custom namespace (e.g. from module)
});
```
