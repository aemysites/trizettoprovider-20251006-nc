/* global WebImporter */
export default function parse(element, { document }) {
  // --- HERO (hero5) BLOCK PARSER ---
  // 1. Header row (must match block name exactly)
  const headerRow = ['Hero (hero5)'];

  // 2. Background image row
  // Find the first <img> inside the block (background image)
  const img = element.querySelector('img');
  const imageRow = [img ? img : '']; // Reference the actual image element

  // 3. Content row
  // Find the main heading (h2/h1/h3), and CTA (a)
  let heading = null;
  let cta = null;

  // The main content is inside a column with h2 (or h1/h3)
  let textColumn = null;
  for (const div of element.querySelectorAll('.vc_col-sm-12, .vc_col-sm-9')) {
    if (div.querySelector('h1, h2, h3')) {
      textColumn = div;
      break;
    }
  }
  if (!textColumn) {
    // fallback: use first child div
    textColumn = element.querySelector('div');
  }

  if (textColumn) {
    heading = textColumn.querySelector('h2, h1, h3');
    // CTA: look for anchor with button classes
    cta = textColumn.querySelector('a.mpc-button, a[href]');
  }

  // Compose content cell, preserving order and semantics
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (cta) contentCell.push(cta);

  // Defensive: If no heading or CTA found, fallback to all text content
  if (contentCell.length === 0 && textColumn) {
    const possible = [];
    for (const el of textColumn.querySelectorAll('h1, h2, h3, p, a')) {
      possible.push(el);
    }
    if (possible.length) contentCell.push(...possible);
  }

  // Build table cells
  const cells = [
    headerRow,
    imageRow,
    [contentCell.length ? contentCell : '']
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
