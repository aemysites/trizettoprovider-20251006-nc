/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block table
  const headerRow = ['Columns (columns43)'];

  // Defensive: Get all immediate child columns (should be two for this block)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, find the first <ul> descendant and use it as the cell content
  const cells = columns.map(col => {
    // Find the first <ul> within this column
    const ul = col.querySelector('ul');
    // If found, use the <ul> element, else fallback to the column itself
    return ul || col;
  });

  // Build the table rows
  const tableRows = [
    headerRow,
    cells
  ];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}
