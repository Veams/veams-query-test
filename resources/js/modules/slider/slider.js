/**
 * Represents a responsive slider which can be used as ribbon.
 *
 * @module Slider
 * @version v1.3.2
 *
 * @author Sebastian Fitzner
 * @author Andy Gutsche
 */

import App from '../../app';
import Helpers from '../../utils/helpers';
import AppModule from '../_global/module';

const $ = App.$;

class Slider extends AppModule {
	/**
	 * Constructor for our class
	 *
	 * @see module.js
	 *
	 * @param {Object} obj - Object which is passed to our class
	 * @param {Object} obj.el - element which will be saved in this.el
	 * @param {Object} obj.options - options which will be passed in as JSON object
	 */
	constructor(obj) {
		let options = {
			unresolvedClass: 'is-unresolved',
			activeClass: 'is-active',
			hiddenClass: 'is-hidden',
			cloneClass: 'is-cloned',
			actions: '[data-js-atom="slider-actions"]', // Previous Button
			prev: '[data-js-atom="slider-prev"]', // Previous Button
			next: '[data-js-atom="slider-next"]', // Next Button
			items: '[data-js-atom="slider-item"]', // Slide Items
			pagination: '[data-js-atom="slider-pagination"]', // Pagination
			paginationList: '[data-js-atom="slider-pagination-list"]', // Pagination List
			paginationItemJsAtom: 'slider-pagination-item', // data-js-atom for pagination list item
			paginationItemClass: 'slider__pagination-list-item', // Define your class which we use in our mini tmpl
			ribbon: '[data-js-atom="slider-ribbon"]',
			wrapper: '[data-js-atom="slider-wrapper"]',
			autoPlay: false,
			autoPlayInterval: 3000,
			disablePagination: false,
			enableTouchSwipe: true,
			infinite: true,
			pauseOnHover: true,
			startAtIndex: 0,
			visibleItems: {
				'desktop': 1,
				'tablet-large': 1,
				'tablet-small': 1,
				'mobile-large': 1,
				'mobile-medium': 1,
				'mobile-small': 1
			}
		};

		super(obj, options);
		App.registerModule && App.registerModule(Slider.info, this.el);
	}

	/**
	 * Custom getters and setter
	 */

	/**
	 * Get module information
	 */
	static get info() {
		return {
			name: 'Slider',
			version: '1.3.2',
			vc: true,
			mod: false
		};
	}

	/**
	 * Get and set visible items.
	 *
	 * @param {number} visible - Number of visible items
	 */
	get visibles() {
		return this._numVisible;
	}

	set visibles(visible) {
		this._numVisible = visible;
	}

	/**
	 * Get and set items length for slider.
	 *
	 * @param {number} len - Number of item length
	 */
	get itemsLength() {
		return this._itemLength;
	}

	set itemsLength(len) {
		this._itemLength = len;
	}

	/**
	 * Get and set the index of slider.
	 *
	 * @param {number} idx - index number of slide
	 */
	get index() {
		return this._index;
	}

	set index(idx) {
		this._index = idx;
	}

	/**
	 * Get paused property.
	 *
	 * @param {Boolean} bool - pause state
	 */
	get paused() {
		return this._paused;
	}

	set paused(bool) {
		this._paused = bool;
	}

	/**
	 * Get autoPlay property.
	 *
	 * @param {Boolean} bool - autoplay state
	 */
	get autoPlay() {
		return this._autoPlay;
	}

	set autoPlay(bool) {
		this._autoPlay = bool;
	}

	/**
	 * Get controls height.
	 */
	get controlHeight() {
		return Helpers.getOuterHeight(this.$prev);
	}

	/**
	 * Initialize the view
	 */
	initialize() {
		this.index = 0;
		this.$prev = this.$el.find(this.options.prev);
		this.$next = this.$el.find(this.options.next);
		this.$items = this.$el.find(this.options.items);
		this.$initialItems = this.$items;
		this.$wrapper = this.$el.find(this.options.wrapper);
		this.$ribbon = this.$el.find(this.options.ribbon);
		this.startAtIndex = ~~this.options.startAtIndex;
		this.$lastItem = this.$items.eq(this.$items.length - 1);
		this.$firstItem = this.$items.eq(0);
		this.transition = this.$ribbon.css('transition');
		this.paginationDisabled = this.options.disablePagination || this.$items.length < 2;
		this.infinite = this.options.infinite && this.$items.length > 1;
		this.touchSwipeEnabled = false;
		this.clickHandler = true;
		this.autoPlay = this.options.autoPlay && this.infinite;

		if (!this.paginationDisabled) {
			this.$paginationList = this.$el.find(this.options.paginationList);
		}

		if (this.options.autoPlay && !this.infinite) {
			console.warn('Slider: Sorry - option "autoPlay" has no effect while option "infinite" is set to false!');
		}

		if (this.infinite) {

			for (let item in this.options.visibleItems) {
				if (this.options.visibleItems.hasOwnProperty(item)) {
					if (this.options.visibleItems[item] > 1) {
						console.warn('Slider: Sorry - option "visibleItems" has no effect while option "infinite" is set to true!');
						break;
					}
				}
			}
		}

		super.initialize();
	}

	/**
	 * Bind all events
	 */
	bindEvents() {
		let render = this.render.bind(this);
		let showPrev = this.showPrevElement.bind(this);
		let showNext = this.showNextElement.bind(this);
		let goTo = this.navigateToElement.bind(this);
		let play = this.play.bind(this);
		let pause = this.pause.bind(this);

		// Local Events
		this.$el.on(App.clickHandler, this.options.prev, showPrev);
		this.$el.on(App.clickHandler, this.options.next, showNext);
		this.$el.on(App.clickHandler, '[data-js-atom="' + this.options.paginationItemJsAtom + '"]', goTo);

		// Global Events
		if (!App.EVENTS && !App.EVENTS.resize) {
			console.warn('Slider: App.EVENTS.resize is missing!');
			return;
		}

		App.Vent.on(App.EVENTS.resize, render);

		if (this.autoPlay && this.options.pauseOnHover) {

			if (App.EVENTS.mouseenter && App.EVENTS.mouseleave) {
				this.$el.on(App.EVENTS.mouseenter, pause);
				this.$el.on(App.EVENTS.mouseleave, play);
			} else {
				console.warn('Slider: App.EVENTS.mouseEnter and/or App.EVENTS.mouseLeave missing - option "pauseOnHover" will be ignored!');
			}
		}
	}

	/**
	 * Unbind all events
	 */
	unbindEvents() {
		// Global Events
		App.Vent.off(App.EVENTS.resize);

		// Local Events
		this.$el.off(App.clickHandler);
	}

	/**
	 * Bind transition events
	 *
	 */
	bindTransitions() {
		let onRibbonTransitionEnd = this.onRibbonTransitionEnd.bind(this);
		let onItemsTransitionEnd = this.onItemsTransitionEnd.bind(this);

		this.$ribbon.on(Helpers.transitionEndEvent(), onRibbonTransitionEnd);
		this.$items.on(Helpers.transitionEndEvent(), onItemsTransitionEnd);
	}

	/**
	 * React to transitionend on ribbon
	 *
	 * @param {Object} e - Event object.
	 */
	onRibbonTransitionEnd(e) {
		e.stopPropagation();

		if (this.autoPlay && this.paused) {

			if (this.options.pauseOnHover) {

				if (!this.$el.is(':hover')) {
					this.play();
				}
			}
			else {
				this.play();
			}
		}


		if (this.$clonedFirst && this.$clonedFirst.hasClass(this.options.activeClass)) {
			this.$clonedFirst.removeClass(this.options.activeClass);
			this.index = 1;

			this.animateSlide({
				idx: this.index,
				animate: false
			});
		}

		if (this.$clonedLast && this.$clonedLast.hasClass(this.options.activeClass)) {
			this.$clonedLast.removeClass(this.options.activeClass);
			this.index = this.$items.length - this.visibles - 1;

			this.animateSlide({
				idx: this.index,
				animate: false
			});
		}

		this.clickHandler = true;
	}


	/**
	 * React to transitionend on items
	 *
	 * @param {Object} e - Event object.
	 */
	onItemsTransitionEnd(e) {
		e.stopPropagation();
	}


	/**
	 * Renders the view's template to the UI
	 */
	render() {
		if (!App.currentMedia) {
			console.warn('Slider: App.currentMedia is necessary to support the slider module!');
			return;
		}

		if (this.$clonedLast && this.$clonedFirst) {
			this.$clonedLast.remove();
			this.$clonedFirst.remove();
			this.$items = this.$initialItems;
		}

		this.visibles = this.infinite ? 1 : this.options.visibleItems[App.currentMedia];
		this.itemsLength = this.$items.length;

		this.handleVisibility();

		if (!this.paginationDisabled) {
			this.removePagination();
			this.addPagination();
		}

		if (this.infinite) {
			this.infiniteLoop();
		}

		this.bindTransitions();
		this.getAndSetDimensions();

		if (App.support.touch && this.options.enableTouchSwipe && !this.touchSwipeEnabled) {
			this.bindSwipes();
		}

		if (this.infinite) {
			this.goToItem(this.startAtIndex + this.visibles);
		}
		else {
			this.goToItem(this.startAtIndex);
		}

		if (this.autoPlay && this.paused) {
			this.play();
		}
	}

	/**
	 * Clone first and last element
	 *
	 */
	infiniteLoop() {
		this.$clonedFirst = this.$firstItem.clone(true).addClass(this.options.cloneClass);
		this.$clonedLast = this.$lastItem.clone(true).addClass(this.options.cloneClass);

		this.$firstItem.before(this.$clonedLast);
		this.$lastItem.after(this.$clonedFirst);

		this.$items = $(this.options.items, this.$el);
	}

	/**
	 * Animate slide
	 *
	 * @param {Object} obj - animation property object.
	 */
	animateSlide(obj) {
		if (!obj.animate) {
			this.$ribbon.css('transition', 'none');
		} else {
			this.$ribbon.css('transition', this.transition);
		}

		this.$ribbon.css('left', -obj.idx * (this.thumbWidth) + 'px');
	}

	/**
	 * Check first/last slide classes
	 *
	 */
	checkSlides() {

		if (this.$clonedFirst.hasClass(this.options.activeClass)) {
			this.$firstItem.addClass(this.options.activeClass);
		}
		if (this.$clonedLast.hasClass(this.options.activeClass)) {
			this.$lastItem.addClass(this.options.activeClass);
		}
	}

	/**
	 * When items length is 0 we hide this view.
	 */
	handleVisibility() {
		if (this.itemsLength === 0) {
			this.$el.addClass(this.options.hiddenClass);
			console.warn('Slider: There is no item we can use in our slider :(');
		}

		this.$el.css('max-width', 'none');
	}

	/**
	 * Empty pagination.
	 */
	removePagination() {
		this.$paginationList.empty();
	}

	/**
	 * Add pagination elements with a simple string template and
	 * save a pagination item reference.
	 */
	addPagination() {
		let tmpl = '';
		let i = 0;

		for (i; i < this.$items.length; i++) {
			tmpl += '<li class="' + this.options.paginationItemClass + '" data-js-atom="' + this.options.paginationItemJsAtom + '"><strong>' + (i + 1) + '</strong></li>';
		}

		this.$paginationList.append(tmpl);
		this.$paginationItems = $('[data-js-atom="' + this.options.paginationItemJsAtom + '"]', this.$el);
	}

	/**
	 * Navigate to a specific slide.
	 *
	 * @param {object} e - Event object.
	 * @param {object} currentTarget - Target to which listener was attached.
	 */
	navigateToElement(e, currentTarget) {
		let $currentTarget = currentTarget ? $(currentTarget) : $(e.currentTarget);

		if ($currentTarget.hasClass(this.options.activeClass)) return;

		this.index = $currentTarget.index();

		if (this.infinite) {
			this.index++;
		}

		this.goToItem(this.index);
	}

	/**
	 * Go to the next slide.
	 *
	 * @param {object} e - Event object.
	 */
	showNextElement(e) {
		e.preventDefault();

		if (this.clickHandler) {
			this.goToItem(this.index + this.visibles);
		}

		this.clickHandler = false;
	}

	/**
	 * Go to the previous slide.
	 *
	 * @param {object} e - Event object.
	 */
	showPrevElement(e) {
		e.preventDefault();

		if (this.clickHandler) {
			this.goToItem(this.index - this.visibles);
		}

		this.clickHandler = false;
	}

	/**
	 * Return the direction `next` or `prev`.
	 *
	 * @param {number} index - Index of the pagination element.
	 */
	getDirection(index) {
		return index > this.index ? "next" : "prev";
	}

	/**
	 * Bind all swipe gestures.
	 */
	bindSwipes() {

		if (this.$items.length > this.visibles) {
			Helpers.detectSwipe(this.el, 75);

			this.$el.on(App.EVENTS.swipe, (e) => {
				let direction = e.detail.direction;

				if (direction === 'left') {
					this.goToItem(this.index + this.visibles);
				}

				if (direction === 'right') {
					this.goToItem(this.index - this.visibles);
				}
			});

			this.touchSwipeEnabled = true;
		}
	}

	/**
	 * Enables button
	 *
	 * @param {Object} $btn - button element.
	 */
	enableBtn($btn) {
		$btn.removeClass(this.options.hiddenClass);
		$btn.removeAttr('disabled');
		$btn.removeAttr('aria-disabled');
	}

	/**
	 * Disables button
	 *
	 * @param {Object} $btn - button element.
	 */
	disableBtn($btn) {
		$btn.addClass(this.options.hiddenClass);
		$btn.attr('disabled', 'disabled');
		$btn.attr('aria-disabled', true);
	}

	/**
	 * Handles the method to go to a specific item.
	 * Further we handle the class
	 *
	 * @param {number} i - Index number.
	 */
	goToItem(i) {
		let maxIndex = this.$items.length - this.visibles;

		if (maxIndex < 0) {
			maxIndex = 0;
		}

		if (!this.paused) {
			this.pause();
		}

		if (this.infinite) {
			if (i < 0) {
				i = maxIndex;
			} else if (i > maxIndex) {
				i = 0;
			}
		}
		else {
			this.enableBtn(this.$prev);
			this.enableBtn(this.$next);

			if (i < 1) {
				this.disableBtn(this.$prev);

				if (i < 0) {
					i = 0;
				}
			}

			if (i > maxIndex - 1) {
				this.disableBtn(this.$next);

				if (i > maxIndex) {
					i = maxIndex;
				}
			}
		}

		this.animateSlide({
			idx: i,
			animate: !this.$el.hasClass(this.options.unresolvedClass)
		});

		if (this.$el.hasClass(this.options.unresolvedClass)) {
			this.$el.removeClass(this.options.unresolvedClass);
		}

		this.index = i;

		this.$items.removeClass(this.options.activeClass);

		if (!this.paginationDisabled && this.$paginationItems && this.$paginationItems.length) {
			this.$paginationItems.removeClass(this.options.activeClass);
		}

		if (!this.infinite) {
			for (let idx = this.index; idx < this.index + this.visibles; idx++) {
				this.$items.eq(idx).addClass(this.options.activeClass);

				if (!this.paginationDisabled) {
					this.$paginationItems.eq(idx).addClass(this.options.activeClass);
				}
			}
		}
		else {
			for (let idx = this.index - 1; idx < this.index - 1 + this.visibles; idx++) {
				let slideIdx = idx;
				this.$items.eq(slideIdx + 1).addClass(this.options.activeClass);

				if (!this.paginationDisabled) {
					if (idx >= this.$paginationItems.length) {
						slideIdx = 0;
					}

					this.$paginationItems.eq(slideIdx).addClass(this.options.activeClass);
				}
			}
		}

		if (this.infinite) {
			this.checkSlides();
		}
	}

	/**
	 * Start autoplay.
	 */
	play() {
		clearInterval(this.autoPlayInterval);

		this.autoPlayInterval = setInterval(() => {
			this.goToItem(this.index + this.visibles);
		}, this.options.autoPlayInterval);

		this.paused = false;
	}

	/**
	 * Pause autoplay.
	 */
	pause() {
		clearInterval(this.autoPlayInterval);
		this.paused = true;
	}

	/**
	 * Get and set dimensions for our project progress.
	 */
	getAndSetDimensions() {
		this.width = this.$el.outerWidth();
		this.thumbWidth = this.width / this.visibles;
		this.$wrapper.css('width', this.width + 'px');
		this.$items.css('width', this.thumbWidth + 'px');

		this.$ribbon.css({
			width: this.getRibbonWidth() + 'px'
		});
	}

	/**
	 * Get ribbon width.
	 */
	getRibbonWidth() {
		let width;

		if (this.$items.length <= this.visibles) {
			width = this.$items.length * (this.thumbWidth);
		} else {
			width = this.$items.length * (this.thumbWidth);
		}

		return width;
	}
}

export default Slider;