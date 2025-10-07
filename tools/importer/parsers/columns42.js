/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block (columns42)
  const headerRow = ['Columns block (columns42)'];

  // Only include the navigation buttons as columns (ignore separators)
  const buttons = Array.from(element.querySelectorAll('a'));
  const columns = buttons.map((btn) => {
    const labelSpan = btn.querySelector('.mpc-button__title');
    const label = labelSpan ? labelSpan.textContent.trim() : btn.textContent.trim();
    const link = document.createElement('a');
    link.href = btn.getAttribute('href') || '#';
    link.textContent = label;
    if (btn.hasAttribute('title')) {
      link.setAttribute('title', btn.getAttribute('title'));
    }
    return link;
  });

  // Table rows: header, then one row with all columns (no separators)
  const rows = [
    headerRow,
    columns
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
