# Type Ahead

This component is based on the blueprint of Veams-Components.

## Usage

### Include: JavaScript

#### Import
``` js
// @INSERT :: START @tag: js-import 
import TypeAhead from './modules/type-ahead/type-ahead-view';
// @INSERT :: END
```

#### Initializing in Veams V2
``` js
// @INSERT :: START @tag: js-init-v2 
/**
 * Init TypeAhead
 */
Helpers.loadModule({
	el: '[data-js-module="type-ahead"]',
	module: TypeAhead,
	context: context,
	render: false
});
// @INSERT :: END
```

#### Initializing in Veams V3
``` js
// @INSERT :: START @tag: js-init-v3  
/**
 * Init TypeAhead
 */
Helpers.loadModule({
	domName: 'type-ahead',
	module: TypeAhead,
	context: context,
	render: false
});
// @INSERT :: END
```

#### Custom Events
``` js
// @INSERT :: START @tag: js-events //
/**
 * Events TypeAhead
 */
EVENTS.typeAhead = {
	search: 'typeAhead:search'
};
// @INSERT :: END
```
