/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns block (columns20)'];

  // Defensive: Get all immediate child columns (two columns expected)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // If no columns found, do nothing
  if (columns.length < 2) return;

  // For each column, find the first <ul> (the list)
  const cells = columns.map(col => {
    // Find the first <ul> inside this column
    const ul = col.querySelector('ul');
    // If found, use it; else, fallback to the column itself
    return ul || col;
  });

  // Build rows: header, then one row with two columns (each column's list)
  const rows = [headerRow, cells];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
