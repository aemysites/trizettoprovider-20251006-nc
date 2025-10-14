/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (CTA)'];

  // 2. Extract the background image (first <img> in the block)
  const img = element.querySelector('img');
  let imageRow = [''];
  if (img) {
    imageRow = [img]; // Reference the actual image element
  }

  // 3. Extract headline and CTA
  // Headline: Look for <h2> inside the main column
  // CTA: Look for <a> (button) inside the main column
  let headline = null;
  let cta = null;

  // Find the main column (where the text/cta lives)
  const mainColumn = element.querySelector('.vc_col-sm-9');
  if (mainColumn) {
    // Headline
    const h2 = mainColumn.querySelector('h2');
    if (h2) {
      headline = h2; // Reference the actual heading element
    }
    // CTA
    const a = mainColumn.querySelector('a');
    if (a) {
      cta = a; // Reference the actual anchor element
    }
  }

  // Compose the content cell
  const contentCell = [];
  if (headline) contentCell.push(headline);
  if (cta) contentCell.push(cta);

  // Defensive: If nothing found, fallback to text content
  if (contentCell.length === 0) {
    const fallbackText = document.createElement('div');
    fallbackText.textContent = element.textContent.trim();
    contentCell.push(fallbackText);
  }

  // 4. Build the table
  const cells = [
    headerRow,
    imageRow,
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
