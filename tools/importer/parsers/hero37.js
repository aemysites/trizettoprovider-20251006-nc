/* global WebImporter */
export default function parse(element, { document }) {
  // Block name header row
  const headerRow = ['Blockquote (bgBlue)'];

  // --- Row 2: Background image ---
  // Find the first <img> inside the block (background image)
  const img = element.querySelector('img');
  let imageRow;
  if (img) {
    imageRow = [img]; // Reference existing image element
  } else {
    imageRow = ['']; // Empty cell if no image
  }

  // --- Row 3: Quote and attribution ---
  // Find the main quote and attribution text
  // Defensive: Find the largest column (should be col-sm-10)
  const mainCol = element.querySelector('.vc_col-sm-10');
  let quoteContent = [];
  if (mainCol) {
    // Find all text columns inside mainCol
    const textColumns = mainCol.querySelectorAll('.wpb_text_column');
    textColumns.forEach((col) => {
      // Each .wpb_text_column contains a .wpb_wrapper with a <p>
      const wrapper = col.querySelector('.wpb_wrapper');
      if (wrapper) {
        // Grab all children of the wrapper (usually <p> or spans)
        Array.from(wrapper.childNodes).forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            // If it's just whitespace, skip
            if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
            quoteContent.push(node);
          }
        });
      }
    });
  }
  // Defensive: If nothing found, fallback to all <p> in element
  if (quoteContent.length === 0) {
    const ps = element.querySelectorAll('p');
    quoteContent = Array.from(ps);
  }
  // If still nothing, fallback to empty string
  const quoteRow = [quoteContent.length ? quoteContent : ['']];

  // Compose table rows
  const rows = [headerRow, imageRow, quoteRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with the block table
  element.replaceWith(table);
}
