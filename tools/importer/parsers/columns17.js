/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Columns block (columns17)'];

  // Get all immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Group columns into pairs: [icon, content], [icon, content]
  const pairs = [];
  for (let i = 0; i < columns.length; i += 2) {
    if (columns[i] && columns[i + 1]) {
      pairs.push([columns[i], columns[i + 1]]);
    }
  }

  // Each cell: icon + heading link + description (no wrappers or empty space)
  const contentRow = pairs.map(([iconCol, contentCol]) => {
    // Extract icon
    const icon = iconCol.querySelector('.mpc-icon');
    // Extract heading link (first .mpc-textblock a)
    const headingBlock = contentCol.querySelector('.mpc-textblock a');
    // Extract description (second .mpc-textblock p, possibly with <strong>)
    const descBlock = contentCol.querySelectorAll('.mpc-textblock');
    let description = null;
    if (descBlock.length > 1) {
      description = descBlock[1].querySelector('p');
    }
    // Compose cell: only icon, heading link, description
    const cellContent = [];
    if (icon) cellContent.push(icon);
    if (headingBlock) cellContent.push(headingBlock);
    if (description) cellContent.push(description);
    return cellContent;
  });

  const rows = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
