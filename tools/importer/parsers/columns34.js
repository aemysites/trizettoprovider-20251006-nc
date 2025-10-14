/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns block (columns34)'];

  // Get all immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Only process if we have columns
  if (columns.length === 0) return;

  // For each column, extract all text content as a single cell
  const cells = columns.map((col) => {
    // Find the main counter value (number)
    let value = '';
    const valueEl = col.querySelector('.mpc-counter--target');
    if (valueEl) value = valueEl.textContent.trim();

    // Find suffix if present
    let suffix = '';
    const suffixEl = col.querySelector('.mpc-counter__suffix');
    if (suffixEl) suffix = suffixEl.textContent.trim();
    else {
      // Some counters use 'B' for billions, which is not in a span
      // Check if value ends with a letter
      const match = value.match(/^(\d+)([A-Za-z+]+)$/);
      if (match) {
        value = match[1];
        suffix = match[2];
      }
    }

    // Find the label (heading)
    let heading = '';
    const headingEl = col.querySelector('.mpc-counter__heading');
    if (headingEl) heading = headingEl.textContent.trim();

    // Compose the cell: number + suffix (big), label (small, preserve line breaks)
    const cell = document.createElement('div');
    const numberEl = document.createElement('strong');
    numberEl.textContent = value + suffix;
    cell.appendChild(numberEl);

    if (heading) {
      cell.appendChild(document.createElement('br'));
      // Split heading on line breaks if present
      heading.split(/\r?\n/).forEach((line, idx, arr) => {
        const span = document.createElement('span');
        span.textContent = line.trim();
        cell.appendChild(span);
        if (idx < arr.length - 1) cell.appendChild(document.createElement('br'));
      });
    }

    return cell;
  });

  // Build the table rows
  const tableRows = [headerRow, cells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
