/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: must match block name exactly
  const headerRow = ['Hero (hero15)'];

  // 2. Background image: reference actual <img> element, not URL or alt
  const img = element.querySelector('img');
  const imageRow = [img ? img : ''];

  // 3. Text content extraction (preserve semantic structure)
  // Find the deepest .wpb_text_column .wpb_wrapper inside the first inner column
  let textColumn = null;
  const innerRows = element.querySelectorAll('.vc_inner');
  for (const innerRow of innerRows) {
    const innerCol = innerRow.querySelector('.vc_column-inner .wpb_wrapper .wpb_text_column .wpb_wrapper');
    if (innerCol) {
      textColumn = innerCol;
      break;
    }
  }
  // Fallback: direct search if not found
  if (!textColumn) {
    textColumn = element.querySelector('.wpb_text_column .wpb_wrapper');
  }

  // Defensive: if textColumn is missing, use empty string
  const textRow = [textColumn ? textColumn : ''];

  // 4. Compose table rows in correct order
  const rows = [
    headerRow,
    imageRow,
    textRow
  ];

  // 5. Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the original element with the table
  element.replaceWith(table);
}
