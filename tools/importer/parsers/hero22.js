/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero22) block: 1 column, 3 rows
  // Row 1: Block name
  // Row 2: Background image (optional)
  // Row 3: Main content (heading, subheading, CTA)

  // Header row
  const headerRow = ['Hero (hero22)'];

  // --- Row 2: Background image ---
  // Try to find a background image from <img> or CSS background-image
  let bgImg = element.querySelector('img');
  let bgCell = '';
  if (bgImg) {
    bgCell = bgImg;
  } else {
    // Try to find background-image from style or data-hlx-background-image
    const bgDiv = element.closest('[data-hlx-background-image]') || element.querySelector('[data-hlx-background-image]');
    if (bgDiv) {
      let url = bgDiv.getAttribute('data-hlx-background-image');
      if (url) {
        // Remove url(...) wrapper and quotes
        url = url.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
        const img = document.createElement('img');
        img.src = url;
        bgCell = img;
      }
    }
  }
  const imageRow = [bgCell];

  // --- Row 3: Main content ---
  // Find the main column wrapper (holds the text)
  let wrapper = element.querySelector('.wpb_wrapper');
  if (!wrapper) wrapper = element;

  // Collect all text columns in order (quote, attribution)
  const textColumns = Array.from(wrapper.querySelectorAll('.wpb_text_column'));
  let quoteEl = null;
  let attributionEl = null;
  if (textColumns.length >= 1) {
    quoteEl = textColumns[0];
    if (textColumns.length > 1) {
      attributionEl = textColumns[1];
    }
  } else {
    const ps = wrapper.querySelectorAll('p');
    if (ps.length) quoteEl = ps[0];
    if (ps.length > 1) attributionEl = ps[1];
  }
  const contentCell = [];
  if (quoteEl) contentCell.push(quoteEl);
  if (attributionEl) contentCell.push(attributionEl);
  if (contentCell.length === 0) {
    contentCell.push(document.createTextNode(element.textContent.trim()));
  }
  const contentRow = [contentCell];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
