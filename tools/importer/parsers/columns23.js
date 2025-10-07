/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child columns of the inner row
  function getColumns(row) {
    return Array.from(row.querySelectorAll(':scope > .wpb_column'));
  }

  // Find the inner row that contains the columns
  const innerRow = element.querySelector('.vc_inner.vc_row-fluid');
  if (!innerRow) return;

  const columns = getColumns(innerRow);

  // Defensive: Only use columns with content
  const meaningfulColumns = columns.filter(col => {
    return col.textContent.trim() || col.querySelector('img');
  });

  // --- FIX: Insert the 'OVER' badge into the right column if present ---
  // The badge is a small vertical label at the top of the right column
  // It is not part of the .wpb_wrapper, so we need to find it and prepend it
  // The right column is the second in meaningfulColumns
  if (meaningfulColumns.length > 1) {
    const rightCol = meaningfulColumns[1];
    // Look for a badge/label element, likely a div or span with text 'OVER'
    // It may be positioned absolutely or have a distinctive class
    // We'll look for any element with text 'OVER' in the right column
    const badge = Array.from(rightCol.querySelectorAll('*')).find(el => el.textContent.trim() === 'OVER');
    if (badge) {
      // Get the wrapper inside the right column
      let wrapper = rightCol.querySelector('.wpb_wrapper');
      if (!wrapper) wrapper = rightCol;
      // Prepend the badge to the wrapper
      wrapper.insertBefore(badge.cloneNode(true), wrapper.firstChild);
    }
  }

  // Build cells for the second row
  const contentCells = meaningfulColumns.map(col => {
    const wrapper = col.querySelector('.wpb_wrapper');
    return wrapper || col;
  });

  // Table structure: header row, then one row with columns
  const headerRow = ['Columns (columns23)'];
  const tableRows = [headerRow, contentCells];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
