/**
 * Delegated click handler for all `.concept-card` elements.
 * Uses event delegation on `.concept-card-container` so dynamic cards are supported.
 */
$(".concept-card-container").on("click", ".concept-card", function (event) {
    /**
     * The jQuery-wrapped card element that was clicked.
     * @type {JQuery<HTMLElement>}
     */
    const $card = $(this);

    /**
     * The `.variables` container inside the clicked card.
     * @type {JQuery<HTMLElement>}
     */
    const $variablesContainer = $card.find(".variables");

    // Only proceed if the click truly belongs to this card.
    if (shouldHandleClick(event, $card)) {
        toggleCard($card, $variablesContainer);
    }
});

/* ------------------------------------------------------------------ */
/* --------------------------- FUNCTIONS ----------------------------- */
/* ------------------------------------------------------------------ */

/**
 * Determines whether the clicked target is inside the card
 * such that this specific card should handle the event.
 *
 * @param {MouseEvent} event - The original click event.
 * @param {JQuery<HTMLElement>} $card - The card being evaluated.
 * @returns {boolean} True if the event should trigger card expansion/collapse.
 */
function shouldHandleClick(event, $card) {
    /**
     * @type {HTMLElement}
     */
    const clickedElement = event.target;

    // Ensure the click happened inside *this* card, not another one
    return $(clickedElement).closest(".concept-card")[0] === $card[0];
}

/**
 * Toggles the card's expanded/collapsed state.
 *
 * @param {JQuery<HTMLElement>} $card - The card to toggle.
 * @param {JQuery<HTMLElement>} $variablesContainer - The inner content container.
 */
function toggleCard($card, $variablesContainer) {
    if ($card.hasClass("expanded")) {
        collapseCard($card, $variablesContainer);
    } else {
        expandCard($card, $variablesContainer);
    }
}

/**
 * Expands a concept card and sets its max-height to allow CSS transitions.
 *
 * @param {JQuery<HTMLElement>} $card - The card being expanded.
 * @param {JQuery<HTMLElement>} $variablesContainer - The container being shown.
 */
function expandCard($card, $variablesContainer) {
    $card.addClass("expanded");

    /**
     * The actual full height of the content for animation.
     * @type {number}
     */
    const contentHeight = $variablesContainer.prop("scrollHeight");

    $variablesContainer.css("max-height", contentHeight + "px");
}

/**
 * Collapses a concept card and resets its max-height.
 *
 * @param {JQuery<HTMLElement>} $card - The card being collapsed.
 * @param {JQuery<HTMLElement>} $variablesContainer - The container being hidden.
 */
function collapseCard($card, $variablesContainer) {
    $card.removeClass("expanded");
    $variablesContainer.css("max-height", "0px");
}
