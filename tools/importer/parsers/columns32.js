/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns32)'];

  // Find the button set container
  const buttonSet = element.querySelector('.mpc-button-set');
  if (!buttonSet) {
    element.replaceWith(document.createElement('div'));
    return;
  }

  // Get all direct child anchor elements (the buttons) in order
  const buttons = Array.from(buttonSet.querySelectorAll('a.mpc-button'));

  // For each button, preserve the anchor element (with href and title)
  const secondRow = buttons.map(btn => {
    // Clone the anchor and remove background div
    const anchor = btn.cloneNode(true);
    const bg = anchor.querySelector('.mpc-button__background');
    if (bg) bg.remove();
    return anchor;
  });

  // Create the block table
  const cells = [headerRow, secondRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
