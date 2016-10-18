# Overlay

This blueprint is based on the blueprint of Veams-Components.

It represents an overlay module. This module is responsible to create an overlay without predefining any inner overlay template.

It should be used by other modules to display their content in an overlay.

## Requirements

### JavaScript
- `Veams-JS >= v3.4.0`

## Usage

### Include: SCSS

``` scss
// @INSERT :: START @tag: scss-import 
@import "blocks/_b-overlay";
// @INSERT :: END
```

### Include: JavaScript

#### Import
``` js
// @INSERT :: START @tag: js-import 
import Overlay from './modules/overlay/overlay';
// @INSERT :: END
```

#### Initializing in Veams V2
``` js
// @INSERT :: START @tag: js-init-once-v2 
/**
* Init Overlay
*/
new Overlay();
// @INSERT :: END
```

#### Initializing in Veams V3
``` js
// @INSERT :: START @tag: js-init-once-v3 
/**
* Init Overlay
*/
new Overlay();
// @INSERT :: END
```
#### Custom Events
``` js
// @INSERT :: START @tag: js-events //
/**
 * Events Overlay
 */
EVENTS.overlay = {
	open: 'overlay:open'
};
// @INSERT :: END
```