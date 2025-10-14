/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Accordion (optOutPreferences)
  const headerRow = ['Accordion (optOutPreferences)'];
  const rows = [headerRow];

  // Get all direct children
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Find the purpose title
  let purposeTitle = '';
  for (const child of children) {
    if (child.classList.contains('purpose')) {
      const h4 = child.querySelector('h4');
      if (h4) purposeTitle = h4.textContent.trim();
      break;
    }
  }

  // Parse each cookie block
  let i = 0;
  while (i < children.length) {
    if (children[i].classList.contains('name-header')) {
      const nameDiv = children[i + 1];
      let titleCell;
      if (nameDiv && nameDiv.classList.contains('name')) {
        // Title cell: use the name value as text
        titleCell = document.createElement('div');
        titleCell.textContent = nameDiv.textContent.trim();
      } else {
        titleCell = document.createElement('div');
        titleCell.textContent = '';
      }

      // Content cell: include all labels and values, but only for this cookie
      const contentBlock = document.createElement('div');

      // Purpose (always include)
      if (purposeTitle) {
        const purposeEl = document.createElement('div');
        purposeEl.textContent = purposeTitle;
        contentBlock.appendChild(purposeEl);
      }

      // Expiration header and value
      const retentionHeader = children[i + 2];
      const retentionDiv = children[i + 3];
      if (retentionHeader && retentionHeader.classList.contains('retention-header')) {
        const label = retentionHeader.querySelector('h5');
        if (label) {
          const labelDiv = document.createElement('div');
          labelDiv.textContent = label.textContent;
          contentBlock.appendChild(labelDiv);
        }
      }
      if (retentionDiv && retentionDiv.classList.contains('retention')) {
        const valueDiv = document.createElement('div');
        valueDiv.textContent = retentionDiv.textContent.trim(); // may be empty
        contentBlock.appendChild(valueDiv);
      }

      // Function header and value
      const functionHeader = children[i + 4];
      const functionDiv = children[i + 5];
      if (functionHeader && functionHeader.classList.contains('function-header')) {
        const label = functionHeader.querySelector('h5');
        if (label) {
          const labelDiv = document.createElement('div');
          labelDiv.textContent = label.textContent;
          contentBlock.appendChild(labelDiv);
        }
      }
      if (functionDiv && functionDiv.classList.contains('function')) {
        const valueDiv = document.createElement('div');
        valueDiv.textContent = functionDiv.textContent.trim(); // may be empty
        contentBlock.appendChild(valueDiv);
      }

      // Do NOT add all text content from the source html block to every content cell
      // Only include content relevant to the current cookie row

      rows.push([titleCell, contentBlock]);
      i += 6;
    } else {
      i++;
    }
  }

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
