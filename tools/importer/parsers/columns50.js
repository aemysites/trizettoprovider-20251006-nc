/* global WebImporter */
export default function parse(element, { document }) {
  // Get immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > div.wpb_column'));

  // Defensive: Only proceed if there are at least two columns
  if (columns.length < 2) return;

  // --- COLUMN 1: Image (left) ---
  let imageCell = '';
  const col1 = columns[1]; // The image is in the second column (index 1)
  const img = col1.querySelector('img');
  if (img) {
    imageCell = img;
  }

  // --- COLUMN 2: Text (right) ---
  let textCell = '';
  const col2 = columns[2]; // The text is in the third column (index 2)
  const textWrapper = col2.querySelector('.wpb_text_column .wpb_wrapper');
  if (textWrapper) {
    // Only include the <p> elements, not the wrapper div
    textCell = Array.from(textWrapper.querySelectorAll('p'));
  }

  // Table header row
  const headerRow = ['Columns block (columns50)'];
  // Content row: [image, text]
  const contentRow = [imageCell, textCell];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
