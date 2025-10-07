/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: always use block name
  const headerRow = ['Columns block (columns19)'];

  // Get all immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, extract only the relevant text content (headline and subhead)
  const cells = columns.map(col => {
    // Find the two text blocks in each column
    const wrappers = col.querySelectorAll('.vc_column-inner .wpb_wrapper > .wpb_text_column');
    const cellContent = [];
    wrappers.forEach(wrap => {
      // Get the inner wrapper (should contain h1/h6)
      const inner = wrap.querySelector('.wpb_wrapper');
      if (inner) {
        // Append all children (h1, h6, etc) to cellContent
        Array.from(inner.children).forEach(child => cellContent.push(child.cloneNode(true)));
      }
    });
    return cellContent;
  });

  // Build table rows: header, then one row with all columns as cells
  const rows = [headerRow, cells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
