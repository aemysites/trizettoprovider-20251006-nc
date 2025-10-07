/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row for Hero block
  const headerRow = ['Hero (hero47)'];

  // Find the main inner row (should contain two columns: text and image)
  const innerRow = element.querySelector('.vc_inner.vc_row-fluid');
  let imageCell = null;
  let contentCell = null;

  if (innerRow) {
    // Find columns
    const columns = innerRow.querySelectorAll(':scope > .wpb_column');
    // Text column: usually the wider one (sm-9)
    const textCol = Array.from(columns).find(col => col.classList.contains('vc_col-sm-9'));
    // Image column: usually the smaller one (sm-3)
    const imageCol = Array.from(columns).find(col => col.classList.contains('vc_col-sm-3'));

    // --- Image Cell (row 2) ---
    if (imageCol) {
      // Look for image element
      const img = imageCol.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // --- Content Cell (row 3) ---
    if (textCol) {
      // Gather all text blocks in textCol
      const wrappers = textCol.querySelectorAll('.wpb_text_column .wpb_wrapper');
      let paragraphs = [];
      wrappers.forEach(wrap => {
        Array.from(wrap.children).forEach(child => {
          if (child.tagName === 'P') {
            paragraphs.push(child);
          }
        });
      });
      // For Hero block: promote first paragraph to heading if it is short, otherwise keep as paragraph
      let cellContent = [];
      if (paragraphs.length > 0) {
        const firstText = paragraphs[0].textContent.trim();
        // If the first paragraph is short (<=100 chars, likely a headline), promote to heading
        if (firstText.length <= 100) {
          const heading = document.createElement('h2');
          heading.textContent = firstText;
          cellContent.push(heading);
        } else {
          cellContent.push(paragraphs[0]);
        }
        // Add remaining paragraphs (if any)
        for (let i = 1; i < paragraphs.length; i++) {
          cellContent.push(paragraphs[i]);
        }
      } else {
        // Fallback: use all wrappers' text
        wrappers.forEach(wrap => {
          cellContent.push(wrap);
        });
      }
      contentCell = cellContent;
    }
  }

  // Build table rows
  const rows = [
    headerRow,
    [imageCell || ''],
    [contentCell || ''],
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
