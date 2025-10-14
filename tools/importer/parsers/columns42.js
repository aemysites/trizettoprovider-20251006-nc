/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Columns (linksList)'];

  // Find the button set container
  const buttonSet = element.querySelector('.mpc-button-set');
  if (!buttonSet) return;

  // Select all anchor tags inside the button set
  const links = Array.from(buttonSet.querySelectorAll('a'));

  // Each link becomes a column in the second row, including its full content
  const columnsRow = links.map(link => link.cloneNode(true));

  // Build the table
  const cells = [
    headerRow,
    columnsRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
