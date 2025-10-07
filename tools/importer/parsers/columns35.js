/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner row containing the columns
  const topRow = element.querySelector('.vc_row.vc_inner');
  if (!topRow) return;

  // Get the two main columns
  const columns = topRow.querySelectorAll(':scope > .wpb_column');
  if (columns.length < 2) return;

  // Left column: main article content
  const leftColWrap = columns[0].querySelector('.wpb_wrapper');
  // Right column: sidebar stats
  const rightColWrap = columns[1].querySelector('.wpb_wrapper');

  // Defensive fallback if wrappers are missing
  const leftContent = leftColWrap || columns[0];
  const rightContent = rightColWrap || columns[1];

  // Columns block header row
  const headerRow = ['Columns (columns35)'];

  // Second row: left and right columns as DOM references
  const contentRow = [leftContent, rightContent];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // Replace the original element with the block
  element.replaceWith(table);
}
