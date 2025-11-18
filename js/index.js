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

    toggleCard($card, $variablesContainer);
});

$(".equation-card-container").on("click", ".equation-card", function (event) {
    /**
     * The jQuery-wrapped card element that was clicked.
     * @type {JQuery<HTMLElement>}
     */
    const $card = $(this);
    $card.toggleClass("flipped")
});

/* ------------------------------------------------------------------ */
/* --------------------------- FUNCTIONS ----------------------------- */
/* ------------------------------------------------------------------ */

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
