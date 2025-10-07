/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards45) block: 2 columns, multiple rows, header row is block name
  // More flexible: parse all columns with card content

  // Helper: Extract card columns (ignore empty columns)
  const columns = Array.from(element.children)
    .filter(col => col.classList.contains('wpb_column'));

  // Prepare rows
  const headerRow = ['Cards (cards45)'];
  const cardRows = [];

  columns.forEach(col => {
    // Find wrappers inside column
    const wrappers = Array.from(col.querySelectorAll('.wpb_wrapper > *'));
    if (!wrappers.length) return; // skip empty columns

    // Extract image
    let imageEl = null;
    const imageDiv = wrappers.find(w => w.classList.contains('wpb_single_image'));
    if (imageDiv) {
      imageEl = imageDiv.querySelector('img');
    }

    // Extract text content (all textblocks)
    const textBlocks = wrappers.filter(w => w.classList.contains('mpc-textblock'));
    if (!imageEl && textBlocks.length === 0) return; // skip columns with no card content

    // Compose text cell: include all textblocks and description
    const textCell = document.createElement('div');
    textBlocks.forEach(tb => {
      // Clone all textblock content into the cell
      Array.from(tb.childNodes).forEach(node => {
        textCell.appendChild(node.cloneNode(true));
      });
    });

    // Add image and text cell to row
    cardRows.push([imageEl, textCell]);
  });

  if (cardRows.length === 0) return;

  const cells = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
