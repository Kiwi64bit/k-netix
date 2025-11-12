/**
 * True modulo operation that always returns a positive number.
 * @param {number} n The dividend.
 * @param {number} m The divisor.
 * @returns {number} The modulo result.
 */
const mod = (n, m) => ((n % m) + m) % m;

/**
 * Class representing a 3D slider with keyboard, click, and touch/swipe support.
 */
class Slider3D {
    /**
     * Create a Slider3D instance.
     * @param {string | HTMLElement} root - Selector or HTMLElement for the slider root.
     * @throws Will throw an error if no element found for selector or invalid argument.
     */
    constructor(root) {
        if (typeof root === "string") {
            const el = document.querySelector(root);
            if (!el) throw new Error(`No element matches selector: "${root}"`);
            this.root = el;
        } else if (root instanceof HTMLElement) {
            this.root = root;
        } else {
            throw new Error("Slider3D requires a selector string or an HTMLElement");
        }

        /** @type {HTMLElement[]} */
        this.items = Array.from(this.root.querySelectorAll(".item"));

        /** @type {HTMLElement[]} */
        this.indicators = Array.from(this.root.querySelectorAll(".slider-indicators [data-slide-to]"));

        /** @type {HTMLElement | null} */
        this.nextBtn = this.root.querySelector(".slider-control-next");

        /** @type {HTMLElement | null} */
        this.prevBtn = this.root.querySelector(".slider-control-prev");

        /** @type {number} */
        this.index = 0;

        /** @type {Set<string>} */
        this.pressedKeys = new Set();

        // Touch/swipe tracking variables
        /** @private @type {number|null} */
        this._touchStartX = null;

        /** @private @type {number} */
        this._touchCurrentX = 0;

        /** Swipe threshold in pixels to trigger slide change */
        this._swipeThreshold = 30;

        this._bindEvents();
        this.update();
    }

    /**
     * Bind all event listeners: buttons, indicators, keyboard, and touch.
     * @private
     */
    _bindEvents() {
        this.nextBtn?.addEventListener("click", () => this.next());
        this.prevBtn?.addEventListener("click", () => this.prev());

        this.indicators.forEach((indicator, i) => {
            indicator.addEventListener("click", () => this.goTo(i));
        });

        document.addEventListener("keydown", this._handleKeyDown);
        document.addEventListener("keyup", this._handleKeyUp);

        // Touch event listeners for swipe support
        this.root.addEventListener("touchstart", this._handleTouchStart, { passive: true });
        this.root.addEventListener("touchmove", this._handleTouchMove, { passive: true });
        this.root.addEventListener("touchend", this._handleTouchEnd);
        this.root.addEventListener("touchcancel", this._handleTouchCancel);
    }

    /**
     * Keyboard keydown event handler.
     * @param {KeyboardEvent} event
     * @private
     */
    _handleKeyDown = event => {
        if (this.pressedKeys.has(event.key)) return;
        this.pressedKeys.add(event.key);

        if (event.key === "ArrowLeft") this.prev();
        else if (event.key === "ArrowRight") this.next();
    };

    /**
     * Keyboard keyup event handler.
     * @param {KeyboardEvent} event
     * @private
     */
    _handleKeyUp = event => {
        this.pressedKeys.delete(event.key);
    };

    /**
     * Touch start event handler. Records initial touch X position.
     * @param {TouchEvent} event
     * @private
     */
    _handleTouchStart = event => {
        if (event.touches.length === 1) {
            this._touchStartX = event.touches[0].clientX;
            this._touchCurrentX = this._touchStartX;
        }
    };

    /**
     * Touch move event handler. Updates current touch X position.
     * @param {TouchEvent} event
     * @private
     */
    _handleTouchMove = event => {
        if (this._touchStartX !== null && event.touches.length === 1) {
            this._touchCurrentX = event.touches[0].clientX;
        }
    };

    /**
     * Touch end event handler. Determines swipe direction and triggers slide change.
     * @param {TouchEvent} event
     * @private
     */
    _handleTouchEnd = event => {
        if (this._touchStartX === null) return;

        const deltaX = this._touchCurrentX - this._touchStartX;

        if (Math.abs(deltaX) > this._swipeThreshold) {
            if (deltaX > 0) {
                this.prev();
            } else {
                this.next();
            }
        }

        this._touchStartX = null;
        this._touchCurrentX = 0;
    };

    /**
     * Touch cancel event handler. Resets touch tracking variables.
     * @param {TouchEvent} event
     * @private
     */
    _handleTouchCancel = event => {
        this._touchStartX = null;
        this._touchCurrentX = 0;
    };

    /**
     * normalize number to the range [-items / 2, items / 2].
     * @param {number} number
     * @returns {number}
     */
    _normalize(number) {
        const totalItems = this.items.length;
        const halfItems = totalItems / 2;
        let normalized = mod(number + halfItems, totalItems) - halfItems;
        return normalized;
    }

    /**
     * Advance to the next slide.
     */
    next() {
        this.goTo(this.index + 1);
    }

    /**
     * Go back to the previous slide.
     */
    prev() {
        this.goTo(this.index - 1);
    }

    /**
     * Move to a specific slide index.
     * @param {number} index - The target slide index.
     */
    goTo(index) {
        let distance = index - this.index;
        distance = this._normalize(distance);
        this.index += distance;
        this.update();
    }

    /**
     * Update slider UI based on current index.
     */
    update() {
        const total = this.items.length;
        const current = mod(this.index, total);
        const next = mod(this.index + 1, total);
        const previous = mod(this.index - 1, total);
        // wrap index if it is outside [-100, 100]
        // this will cause the carousel to rotate to its original position (angel = 0)
        // (unpleasant side effect in exchange for performance)
        this.index = Math.abs(this.index) > total * Math.ceil(100 / total) ? current : this.index;

        this.root.style.setProperty("--view-index", this.index.toString());

        this.items.forEach(item => item.classList.remove("in-view", "next-item", "previous-item"));
        this.items[current]?.classList.add("in-view");
        this.items[next]?.classList.add("next-item");
        this.items[previous]?.classList.add("previous-item");

        this.indicators.forEach(ind => ind.classList.remove("active"));
        this.indicators[current]?.classList.add("active");
    }
}

/**
 * Automatically initialize all sliders with the ".slider-3d" class on DOM ready.
 */
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".slider-3d").forEach(el => new Slider3D(el));
});