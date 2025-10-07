/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero53) block: 1 column, 3 rows
  // 1st row: block name
  // 2nd row: Background Image (optional)
  // 3rd row: Headline, Subheading, CTA (optional)

  // --- Extract background image (none in this example) ---
  let imgEl = null;
  // Try to find any <img> descendant
  imgEl = element.querySelector('img');

  // --- Extract all text content for hero ---
  // Find all text columns (wpb_text_column)
  const textColumns = element.querySelectorAll('.wpb_text_column');
  const contentCell = [];
  textColumns.forEach(tc => {
    // Grab the wrapper div inside
    const wrapper = tc.querySelector('.wpb_wrapper');
    if (wrapper) {
      // Push all children (preserve structure)
      Array.from(wrapper.childNodes).forEach(node => {
        // Only push elements or text nodes with content
        if ((node.nodeType === Node.ELEMENT_NODE && node.textContent.trim()) ||
            (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          contentCell.push(node.cloneNode(true));
        }
      });
    }
  });

  // Build table rows
  const headerRow = ['Hero (hero53)'];
  const imageRow = [imgEl ? imgEl : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const rows = [headerRow, imageRow, contentRow];

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(table);
}
