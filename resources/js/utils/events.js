/**
 * Const for events (pub/sub)
 *
 * @author: Sebastian Fitzner
 */

/**
 * Events Global
 */

const EVENTS = {
	blur: 'blur',
	change: 'change',
	click: 'click',
	dblclick: 'dblclick',
	DOMchanged: 'DOMchanged',
	DOMredirect: 'dom:redirect',
	input: 'input',
	keydown: 'keydown',
	keypress: 'keypress',
	keyup: 'keyup',
	mediachange: 'mediachange',
	moduleRegistered: 'moduleRegistered',
	mousedown: 'mousedown',
	mouseenter: 'mouseenter',
	mouseleave: 'mouseleave',
	mouseout: 'mouseout',
	mouseover: 'mouseover',
	mouseup: 'mouseup',
	reset: 'reset',
	resize: 'resize',
	scroll: 'scroll',
	submit: 'submit',
	swipe: 'swipe'
};


/**
 * Events Overlay
 */
EVENTS.overlay = {
	open: 'overlay:open'
};


/**
 * Events Accordion
 */
EVENTS.accordion = {
	openAll: 'accordion:openAll',
	closeAll: 'accordion:closeAll'
};


/**
 * Events EqualRows
 */
EVENTS.equalRows = {
	render: 'equalRows:render'
};

// @INSERTPOINT :: @ref: js-events

export default EVENTS;
