/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner row containing the columns
  const innerRow = element.querySelector('.vc_inner.vc_row-fluid');
  if (!innerRow) return;
  // Get all columns (should be two)
  const columns = Array.from(innerRow.querySelectorAll('.vc_column_container'));
  if (columns.length < 2) return;

  // For each column, extract heading and paragraph, preserving semantic tags
  const columnCells = columns.map(col => {
    const wrapper = col.querySelector('.wpb_wrapper');
    if (!wrapper) return document.createElement('div');
    // Find the heading (h6 > strong or h6)
    let heading = wrapper.querySelector('h6 strong') || wrapper.querySelector('h6');
    // Find the first paragraph
    let para = wrapper.querySelector('p');
    // Compose a fragment for the cell
    const frag = document.createDocumentFragment();
    if (heading) frag.appendChild(heading.closest('h6').cloneNode(true));
    if (para) frag.appendChild(para.cloneNode(true));
    return frag;
  });

  // Build table rows
  const headerRow = ['Columns (columns6)'];
  const contentRow = columnCells;
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
