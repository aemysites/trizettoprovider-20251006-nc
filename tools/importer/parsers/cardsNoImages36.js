/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cardsNoImages36) block: 1 column, multiple rows, each row is a card
  // Header row as required
  const headerRow = ['Cards (cardsNoImages36)'];

  // Find all visible card rows: each card is a flipbox with a heading (front) and description (back)
  // Each .mpc-grid__item is a card
  const cardRows = [];
  const cardItems = element.querySelectorAll('.mpc-grid__item');
  cardItems.forEach((item) => {
    // Card front: heading
    let heading = '';
    const headingEl = item.querySelector('.mpc-flipbox__front h6');
    if (headingEl) heading = headingEl.textContent.trim();
    // Card back: description
    let desc = '';
    const descEl = item.querySelector('.mpc-flipbox__back p');
    if (descEl) desc = descEl.textContent.trim();
    // Compose cell content
    const cell = document.createElement('div');
    if (heading) {
      const h = document.createElement('h6');
      h.textContent = heading;
      cell.appendChild(h);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc;
      cell.appendChild(p);
    }
    cardRows.push([cell]);
  });

  // If no cards found, do nothing
  if (cardRows.length === 0) return;

  // Build the table
  const rows = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
