/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: always block name
  const headerRow = ['Hero (CTA) (alignCenter)'];

  // 2. Background image row (none in this case, so empty)
  const backgroundRow = [''];

  // 3. Content row: headline, subheading, CTA
  // Instead of relying on specific classes, grab all text columns and CTA
  const contentCell = [];

  // Find all text columns and add their content
  const textColumns = element.querySelectorAll('.wpb_text_column');
  textColumns.forEach(col => {
    // Add all children (e.g., h5, p) from the wrapper
    const wrapper = col.querySelector('.wpb_wrapper');
    if (wrapper) {
      Array.from(wrapper.children).forEach(child => {
        contentCell.push(child);
      });
    }
  });

  // Find CTA button (anchor)
  const cta = element.querySelector('a.mpc-button');
  if (cta) contentCell.push(cta);

  // Table cells
  const cells = [
    headerRow,
    backgroundRow,
    [contentCell]
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
