/* global WebImporter */
export default function parse(element, { document }) {
  // Blockquote: 1 column, 3 rows (header, image, content)
  const headerRow = ['Blockquote'];

  // --- Row 2: Background Image (optional) ---
  // Find the first <img> direct child (background image)
  let bgImg = null;
  const img = element.querySelector(':scope > img');
  if (img) bgImg = img;

  // --- Row 3: Content (quote + attribution) ---
  // Find the main column wrapper
  const col = element.querySelector('.wpb_column');
  let quote = null;
  let attribution = null;
  if (col) {
    // Find all text columns inside the column
    const wrappers = col.querySelectorAll('.wpb_text_column');
    if (wrappers.length > 0) {
      // The first .wpb_text_column is the quote
      quote = wrappers[0];
      // The second .wpb_text_column is the attribution (if present)
      if (wrappers.length > 1) {
        attribution = wrappers[1];
      }
    }
  }

  // Compose the content cell
  const contentCell = [];
  if (quote) contentCell.push(quote);
  if (attribution) contentCell.push(attribution);

  // Build the table
  const rows = [
    headerRow,
    [bgImg ? bgImg : ''],
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
