/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (reveal) block: 1 column, 3 rows
  // 1st row: block name
  // 2nd row: background image (optional, but not present in source HTML)
  // 3rd row: title, subheading, CTA (optional)

  // Header row
  const headerRow = ['Cards (reveal)'];

  // Row 2: Background image (none in source HTML)
  const backgroundImageCell = '';

  // Row 3: Title, subheading, CTA
  // The source HTML contains a centered paragraph as the headline.
  const contentCell = element.querySelector('p') || '';

  // Compose table rows
  const rows = [
    headerRow,
    [backgroundImageCell],
    [contentCell],
  ];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the element with the block table
  element.replaceWith(blockTable);
}
