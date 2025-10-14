/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row
  const headerRow = ['Columns block (columns39)'];

  // Find all inner rows (columns blocks)
  const innerRows = element.querySelectorAll('.vc_row.vc_inner');
  let cells = [headerRow];

  if (innerRows.length > 0) {
    // Use the first inner row for columns
    const firstInnerRow = innerRows[0];
    const firstCols = Array.from(firstInnerRow.querySelectorAll(':scope > .wpb_column'));
    const numCols = firstCols.length;
    if (numCols > 0) {
      // Add the first row of columns
      cells.push(firstCols);
      // For each additional inner row, add a row with only non-empty columns
      for (let i = 1; i < innerRows.length; i++) {
        const rowCols = Array.from(innerRows[i].querySelectorAll(':scope > .wpb_column'));
        // Only include non-empty columns
        const filteredCols = rowCols.filter(col => col.textContent.trim() || col.querySelector('img,iframe,a,button'));
        // If no non-empty columns, skip this row
        if (filteredCols.length > 0) {
          // If filteredCols < numCols, fill with '' for missing columns
          const filled = Array(numCols).fill('');
          filteredCols.forEach((col, idx) => {
            filled[idx] = col;
          });
          cells.push(filled);
        }
      }
    } else {
      // Fallback: treat all content as a single column
      cells.push([element]);
    }
  } else {
    // Fallback: treat all content as a single column
    cells.push([element]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
