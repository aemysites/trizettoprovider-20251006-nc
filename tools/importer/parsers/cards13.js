/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards13) block: expects 2 columns, each row is a card
  const headerRow = ['Cards (cards13)'];
  const rows = [];

  // Find all buttons and links with visible text
  const btns = element.querySelectorAll('button, a');
  btns.forEach((btn) => {
    const text = btn.textContent.trim();
    if (text) {
      // First column: no image/icon, so use empty string
      // Second column: button/link text
      rows.push(['', text]);
    }
  });

  // Always replace with a table (header only if no cards)
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
