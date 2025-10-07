/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero26)'];

  // 2. Background image row (none in this case)
  const backgroundRow = ['']; // No image found in source HTML or screenshot

  // 3. Content row: extract main text content
  // Defensive: Look for the main quote/description text
  let contentEl = null;
  const quoteDesc = element.querySelector('.mpc-quote__description');
  if (quoteDesc) {
    // Use the <p> element inside description if present
    const p = quoteDesc.querySelector('p');
    if (p) {
      contentEl = p;
    } else {
      contentEl = quoteDesc;
    }
  }
  // Fallback: use the whole element if nothing found
  if (!contentEl) {
    contentEl = element;
  }

  const contentRow = [contentEl];

  // Build table
  const cells = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
