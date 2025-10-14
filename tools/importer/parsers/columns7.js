/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner row containing the columns
  const innerRow = element.querySelector('.vc_inner.vc_row');
  if (!innerRow) return;
  // Get all direct column containers
  const columns = Array.from(innerRow.children).filter(col => col.classList.contains('vc_column_container'));

  // For each column, extract only the heading and paragraph (exclude spacers and wrappers)
  const columnCells = columns.map(col => {
    const wrapper = col.querySelector('.vc_column-inner > .wpb_wrapper');
    if (!wrapper) return '';
    // Find the heading and paragraph inside this wrapper
    const heading = wrapper.querySelector('h6, h5, h4, h3, h2, h1');
    const paragraph = wrapper.querySelector('p');
    // Create a fragment to hold only the heading and paragraph
    const frag = document.createDocumentFragment();
    if (heading) frag.appendChild(heading.cloneNode(true));
    if (paragraph) frag.appendChild(paragraph.cloneNode(true));
    return frag;
  });

  const headerRow = ['Columns (columns7)'];
  const contentRow = columnCells;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
