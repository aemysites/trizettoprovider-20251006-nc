/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card containers (flipboxes)
  const flipboxes = element.querySelectorAll('.mpc-flipbox');
  const rows = [];

  flipboxes.forEach(flipbox => {
    // Extract heading from the front side
    const headingEl = flipbox.querySelector('.mpc-flipbox__front h6');
    // Extract description from the back side
    const descEl = flipbox.querySelector('.mpc-flipbox__back p');
    const cell = document.createElement('div');
    if (headingEl) {
      cell.appendChild(headingEl.cloneNode(true));
    }
    if (descEl) {
      cell.appendChild(descEl.cloneNode(true));
    }
    rows.push([cell]);
  });

  const headerRow = ['Cards (cardsNoImages36)'];
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
