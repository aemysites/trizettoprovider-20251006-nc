/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (solutionsCards)'];

  // Get all direct child columns
  const columns = Array.from(element.querySelectorAll(':scope > .wpb_column'));
  if (!columns.length) return;

  // Each row should have as many columns as there are cards (every 2 columns = 1 row)
  const cellsPerRow = 2;
  const rows = [];
  for (let i = 0; i < columns.length; i += cellsPerRow) {
    const rowColumns = columns.slice(i, i + cellsPerRow);
    const cellEls = rowColumns.map((col) => {
      // Find the wrapper for the content
      const wrapper = col.querySelector('.wpb_wrapper');
      if (!wrapper) return col;
      // Remove empty space divs
      Array.from(wrapper.querySelectorAll('.vc_empty_space')).forEach((el) => el.remove());
      // Group icon and all text together in one cell
      const frag = document.createElement('div');
      // Icon
      const icon = wrapper.querySelector('.mpc-icon');
      if (icon) frag.appendChild(icon.cloneNode(true));
      // All textblocks (heading + description)
      Array.from(wrapper.querySelectorAll('.mpc-textblock')).forEach((tb) => {
        frag.appendChild(tb.cloneNode(true));
      });
      return frag;
    });
    // Only push row if it contains the correct number of columns
    if (cellEls.length === cellsPerRow) {
      rows.push(cellEls);
    }
  }

  // The block expects a single row of columns after the header
  if (rows.length) {
    const tableRows = [headerRow, ...rows];
    const table = WebImporter.DOMUtils.createTable(tableRows, document);
    element.replaceWith(table);
  }
}
