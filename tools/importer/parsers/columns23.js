/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner row that contains the columns
  const innerRow = element.querySelector('.vc_inner.vc_row-fluid');
  if (!innerRow) return;
  const columns = Array.from(innerRow.children).filter(col => col.classList.contains('vc_column_container'));
  if (columns.length < 2) return;

  // --- Column 1: Text content ---
  const col1 = columns[0];
  const col1Content = [];
  if (col1) {
    // Get all text wrappers in order
    const wrappers = col1.querySelectorAll('.wpb_text_column .wpb_wrapper');
    wrappers.forEach(wrap => {
      // Only add if not empty
      if (wrap.textContent.trim()) {
        col1Content.push(wrap);
      }
    });
  }

  // --- Column 2: Metric/statistic and icon ---
  const col2 = columns[1];
  const col2Content = [];
  if (col2) {
    // Get all text wrappers in order
    const wrappers = col2.querySelectorAll('.wpb_text_column .wpb_wrapper');
    wrappers.forEach(wrap => {
      if (wrap.textContent.trim()) {
        col2Content.push(wrap);
      }
    });
    // Find the image (icon) and add it after the text
    const img = col2.querySelector('img');
    if (img) {
      col2Content.push(img);
    }
  }

  // Table header row must match the block name exactly
  const headerRow = ['Columns block (columns23)'];
  // Table content row: each cell is an array of referenced elements
  const contentRow = [col1Content, col2Content];

  // Create the table using referenced elements only
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
