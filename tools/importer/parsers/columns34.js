/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row must match target block name exactly
  const headerRow = ['Columns (columns34)'];

  // Find all top-level columns (each stat)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Only keep columns with expected counter/stat content
  const cells = columns.map((col) => {
    // Find the counter value and suffix
    const value = col.querySelector('.mpc-counter--target');
    const suffix = col.querySelector('.mpc-counter__suffix');
    // Find the heading/label
    const label = col.querySelector('.mpc-counter__heading');

    // Compose the cell content
    const cellContent = document.createElement('div');
    cellContent.style.textAlign = 'center';

    // Number (with suffix if present)
    if (value) {
      const numberSpan = document.createElement('span');
      numberSpan.style.fontWeight = 'bold';
      numberSpan.style.fontSize = '2em';
      numberSpan.style.display = 'block';
      numberSpan.style.color = '#85a0f9'; // screenshot color
      numberSpan.append(value.cloneNode(true));
      if (suffix) {
        numberSpan.append(suffix.cloneNode(true));
      }
      cellContent.appendChild(numberSpan);
    }
    // Label (may be multiline)
    if (label) {
      const labelDiv = document.createElement('div');
      labelDiv.style.marginTop = '0.5em';
      labelDiv.append(label.cloneNode(true));
      cellContent.appendChild(labelDiv);
    }
    return cellContent;
  });

  // Table: header row, then one row with all columns
  const tableArray = [headerRow, cells];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableArray, document);

  // Replace original element
  element.replaceWith(blockTable);
}
