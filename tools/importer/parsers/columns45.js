/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns block (columns45)'];

  // Find the inner row that contains the actual columns
  const innerRow = element.querySelector('.vc_inner.vc_row-fluid');
  if (!innerRow) return;
  const innerColumns = Array.from(innerRow.querySelectorAll(':scope > div.wpb_column'));

  // Expect two columns: left (text), right (image)
  const contentRow = innerColumns.map((col) => {
    // For left column: gather all text content
    if (col.classList.contains('vc_col-sm-9')) {
      // Get all .wpb_text_column elements
      const textBlocks = Array.from(col.querySelectorAll('.wpb_text_column'));
      // Collect their children (usually <p> or <em>)
      const content = [];
      textBlocks.forEach(tb => {
        const wrapper = tb.querySelector('.wpb_wrapper') || tb;
        Array.from(wrapper.childNodes).forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
            content.push(node.cloneNode(true));
          }
        });
      });
      return content;
    }
    // For right column: get the image
    if (col.classList.contains('vc_col-sm-3')) {
      const img = col.querySelector('img');
      return img ? img.cloneNode(true) : '';
    }
    return '';
  });

  // Build the table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
