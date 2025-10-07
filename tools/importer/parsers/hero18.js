/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero18) block: 1 column, 3 rows
  // Row 1: block name
  // Row 2: background image (optional)
  // Row 3: headline, subheading, CTA (optional)

  // Header row
  const headerRow = ['Hero (hero18)'];

  // --- Row 2: Background image ---
  // Find the first <img> inside the block (background image)
  let bgImg = element.querySelector('img');
  // Defensive: If not found, leave cell empty
  const bgImgRow = [bgImg ? bgImg : ''];

  // --- Row 3: Text content ---
  // Find the main content column (usually the largest column)
  // In this HTML, it's the .vc_col-sm-10 column
  let mainCol = Array.from(element.querySelectorAll(':scope > div > div > div > div > div'))
    .find(col => col.classList.contains('vc_col-sm-10'));

  let contentCell = [];
  if (mainCol) {
    // Get all direct children of mainCol's wrapper
    const wrapper = mainCol.querySelector('.wpb_wrapper');
    if (wrapper) {
      // Collect text columns (testimonial + attribution)
      const textColumns = wrapper.querySelectorAll('.wpb_text_column');
      textColumns.forEach(tc => {
        // Each .wpb_text_column contains a .wpb_wrapper with a <p>
        const inner = tc.querySelector('.wpb_wrapper');
        if (inner) {
          // Defensive: Only add non-empty paragraphs
          const p = inner.querySelector('p');
          if (p && p.textContent.trim()) {
            contentCell.push(p);
          }
        }
      });
    }
  }
  // Defensive: If nothing found, leave cell empty
  if (contentCell.length === 0) contentCell = [''];

  // Build table
  const cells = [
    headerRow,
    bgImgRow,
    [contentCell],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
