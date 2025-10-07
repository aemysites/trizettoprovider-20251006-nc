/* global WebImporter */

export default function parse(element, { document }) {
  // Find the inner row containing the actual columns
  const innerRow = element.querySelector('.vc_inner.vc_row');
  if (!innerRow) return;

  // Get all direct column containers
  const columns = Array.from(innerRow.querySelectorAll(':scope > div.wpb_column'));

  // Only include columns that have meaningful content in their .wpb_wrapper
  const cells = columns
    .map(col => col.querySelector('.wpb_wrapper'))
    .filter(wrapper => wrapper && (wrapper.textContent.trim() || wrapper.querySelector('img,svg,a')));

  // If no meaningful cells, abort
  if (cells.length === 0) return;

  // Table header must match block name exactly
  const headerRow = ['Columns block (columns12)'];
  const rows = [headerRow, cells];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the element
  element.replaceWith(table);
}
