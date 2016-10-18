# Slide Fox

This blueprint is based on the blueprint of Veams-Components.

## Requirements 
- `Veams-JS`

## Usage

### Include: Page

``` hbs
{{! @INSERT :: START @id: slide-fox, @tag: component-partial }}
<h2>We need some demo text to see the slide fox in action!</h2>
{{#times 20}}
	<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum explicabo facilis, ipsum itaque necessitatibus nisi nulla ut veniam veritatis voluptate. Blanditiis consectetur, error excepturi exercitationem facilis ipsum labore nobis odit.</p>
{{/times}}

{{#with slide-fox-bp}}
	{{#wrapWith "c-slide-fox"}}
		<a href="#">Link to another page.</a>
	{{/wrapWith}}
{{/with}}
{{! @INSERT :: END }}
```

### Include: SCSS

``` scss
// @INSERT :: START @tag: scss-import 
@import "components/_c-slide-fox";
// @INSERT :: END
```

### Include: JavaScript

#### Import
``` js
// @INSERT :: START @tag: js-import 
import SlideFox from './modules/slide-fox/slide-fox';
// @INSERT :: END
```

#### Initializing in Veams V2
``` js
// @INSERT :: START @tag: js-init-v2 
/**
 * Init Form
 */
Helpers.loadModule({
	el: '[data-js-module="slide-fox"]',
	module: SlideFox,
	context: context
});
// @INSERT :: END
```

#### Initializing in Veams V3
``` js
// @INSERT :: START @tag: js-init-v3  
/**
 * Init Form
 */
Helpers.loadModule({
	domName: 'slide-fox',
	module: SlideFox,
	context: context
});
// @INSERT :: END
```
