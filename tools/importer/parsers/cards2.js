/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards2) block: 2 columns, each row is a card (image | text)
  // Header row
  const headerRow = ['Cards (cards2)'];

  // Defensive: get all columns (cards) in this row
  const columns = element.querySelectorAll(':scope > div.wpb_column');

  // Find image column (usually first)
  let imageCell = null;
  for (const col of columns) {
    // Look for image inside this column
    const img = col.querySelector('img');
    if (img) {
      imageCell = img;
      break;
    }
  }

  // Find text column (usually second)
  let textCell = document.createElement('div');
  for (const col of columns) {
    // Look for heading and paragraph inside this column
    const heading = col.querySelector('h6, h5, h4, h3, h2, h1');
    const desc = col.querySelector('p');
    if (heading || desc) {
      // Compose text cell
      if (heading) textCell.appendChild(heading);
      if (desc) textCell.appendChild(desc);
      break;
    }
  }

  // If no image found, fallback to first column's image
  if (!imageCell && columns[0]) {
    const img = columns[0].querySelector('img');
    if (img) imageCell = img;
  }

  // If no text found, fallback to second column's text
  if (!textCell.hasChildNodes() && columns[1]) {
    const heading = columns[1].querySelector('h6, h5, h4, h3, h2, h1');
    const desc = columns[1].querySelector('p');
    if (heading) textCell.appendChild(heading);
    if (desc) textCell.appendChild(desc);
  }

  // Build table rows
  const rows = [headerRow];
  rows.push([imageCell, textCell]);

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
