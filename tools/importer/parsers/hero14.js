/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: Exactly 'Hero (heroAlignLeft)' as required.
  const headerRow = ['Hero (heroAlignLeft)'];

  // Find background image (none in this case)
  const imageRow = [''];

  // Extract all text content from the element (including paragraphs, headings, etc.)
  // We'll grab all direct and nested text elements, but group them as a single cell.
  const contentElements = [];
  // Find all paragraphs, headings, and links inside element
  const selectors = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'];
  selectors.forEach(sel => {
    element.querySelectorAll(sel).forEach(el => {
      contentElements.push(el);
    });
  });
  // If no content found, fall back to all text content
  let contentRow;
  if (contentElements.length) {
    contentRow = [contentElements];
  } else {
    // fallback: wrap all text in a paragraph
    const p = document.createElement('p');
    p.textContent = element.textContent.trim();
    contentRow = [p];
  }

  // Build the block table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
