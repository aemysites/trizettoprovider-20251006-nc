/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get immediate child columns of the inner row
  function getColumns(row) {
    return Array.from(row.querySelectorAll(':scope > div.wpb_column'));
  }

  // Find the inner row (the one with columns)
  const innerRow = element.querySelector('.vc_inner.vc_row-fluid');
  if (!innerRow) return;

  const columns = getColumns(innerRow);
  // Defensive: Only use the first two columns (left: text, right: stats)
  const leftCol = columns[0];
  const rightCol = columns[1];
  if (!leftCol || !rightCol) return;

  // --- LEFT COLUMN: Get all content ---
  // Get all direct children of leftCol's .vc_column-inner > .wpb_wrapper
  const leftWrapper = leftCol.querySelector('.vc_column-inner .wpb_wrapper');
  // Defensive: If not found, fallback to leftCol itself
  const leftContent = leftWrapper ? leftWrapper : leftCol;

  // --- RIGHT COLUMN: Get all content ---
  // Get all direct children of rightCol's .vc_column-inner > .wpb_wrapper
  const rightWrapper = rightCol.querySelector('.vc_column-inner .wpb_wrapper');
  const rightContent = rightWrapper ? rightWrapper : rightCol;

  // Build the table rows
  const headerRow = ['Columns (statisticsRight)'];
  const contentRow = [leftContent, rightContent];

  // Create the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
