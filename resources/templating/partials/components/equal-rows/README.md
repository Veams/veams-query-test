# EqualRows

This blueprint is based on the blueprint of Veams-Components.

## Usage

### Include: Page

``` hbs
{{! @INSERT :: START @id: equalizer, @tag: component-partial }}
<div class="wrapper" data-js-module="equal-rows" data-js-options='{"lastRowClass": "is-last-row"}'>
	<div class="teaser is-grid-33" data-js-atom="equal-child">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci alias animi consectetur cum cumque dolore eum facilis hic ipsam iure nisi nostrum obcaecati, officia omnis porro quas quo quos recusandae.</div>
	<div class="teaser is-grid-33" data-js-atom="equal-child">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis ex excepturi nobis numquam rem, repellendus sequi voluptatem? Asperiores consequatur, dicta fugiat, iure nihil optio qui quo rerum sint tenetur veritatis? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores expedita illo incidunt, itaque placeat quas. Amet beatae cupiditate dignissimos, doloribus ipsa magni, odio omnis quisquam quod sapiente, ullam ut voluptatum.</div>
	<div class="teaser is-grid-33" data-js-atom="equal-child">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias atque cumque dolorem ducimus ea earum, ex ipsam iusto labore laborum nam, necessitatibus neque nesciunt officia quo similique suscipit ut velit.</div>
	<div class="teaser is-grid-33" data-js-atom="equal-child">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
	<div class="teaser is-grid-33" data-js-atom="equal-child">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis ex excepturi nobis numquam rem, repellendus sequi voluptatem? Asperiores consequatur, dicta fugiat, iure nihil optio qui quo rerum sint tenetur veritatis? Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
	<div class="teaser is-grid-33" data-js-atom="equal-child">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
</div>
{{! @INSERT :: END }}
```

### Include: JavaScript

#### Import
``` js
// @INSERT :: START @tag: js-import 
import EqualRows from './modules/equal-rows/equal-rows';
// @INSERT :: END
```

#### Initializing in Veams V2
``` js
// @INSERT :: START @tag: js-init-v2 
/**
 * Init EqualRows
 */
Helpers.loadModule({
	el: '[data-js-module="equal-rows"]',
	module: EqualRows,
	render: false,
	cb: function (module, options) {
        if (options && options.delayInit) {
            $(window).load(function () {
                module._reinit(module);
            });
        }
    },
	context: context
});
// @INSERT :: END
```

#### Initializing in Veams V3
``` js
// @INSERT :: START @tag: js-init-v3  
/**
 * Init EqualRows
 */
Helpers.loadModule({
	domName: 'equal-rows',
	module: EqualRows,
	render: false,
	cb: function (module, options) {
        if (options && options.delayInit) {
            $(window).load(function () {
                module._reinit(module);
            });
        }
    },
	context: context
});
// @INSERT :: END
```

#### Custom Events
``` js
// @INSERT :: START @tag: js-events //
/**
 * Events EqualRows
 */
EVENTS.equalRows = {
	render: 'equalRows:render'
};
// @INSERT :: END
```