/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: must be exactly one cell
  const headerRow = ['Cards (personCard)'];

  // 2. Find the card column with actual content
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  const cardColumns = columns.filter(col => col.querySelector('.wpb_single_image img'));

  // 3. For each card, extract image and text content
  const rows = cardColumns.map(col => {
    // Image
    const img = col.querySelector('.wpb_single_image img');
    // Name/title (bold)
    const nameStrong = col.querySelector('.wpb_text_column .wpb_wrapper p strong');
    let nameText = '';
    if (nameStrong) {
      nameText = nameStrong.textContent.trim();
    }
    // Description (role/title)
    const descP = col.querySelectorAll('.wpb_text_column.font-light .wpb_wrapper p');
    let descText = '';
    if (descP.length) {
      descText = descP[0].textContent.trim();
    }
    // Compose text cell: name (bold), then description (normal)
    const textCell = document.createElement('div');
    if (nameText) {
      const nameEl = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = nameText;
      nameEl.appendChild(strong);
      textCell.appendChild(nameEl);
    }
    if (descText) {
      const descEl = document.createElement('p');
      descEl.textContent = descText;
      textCell.appendChild(descEl);
    }
    // Return row: [image, text]
    return [img, textCell];
  });

  // 4. Compose table cells
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
