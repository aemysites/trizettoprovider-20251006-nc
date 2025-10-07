/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cardsNoImages31) block parsing
  // 1 column, multiple rows: header row, then each card in a row

  // Header row as required
  const headerRow = ['Cards (cardsNoImages31)'];

  // Find the card content container
  // The repeating card structure is: .mpc-cubebox__side > .mpc-cubebox-side > .mpc-cubebox-side__content
  // Within .mpc-cubebox-side__content: text (in .wpb_text_column) and CTA (in <a>)
  const content = element.querySelector('.mpc-cubebox-side__content');
  if (!content) {
    // Defensive: If not found, remove element and return
    element.remove();
    return;
  }

  // Extract text content (usually in .wpb_text_column)
  const textColumn = content.querySelector('.wpb_text_column');
  let textContent;
  if (textColumn) {
    // Use the wrapper div inside for actual content
    const wrapper = textColumn.querySelector('.wpb_wrapper');
    textContent = wrapper ? wrapper : textColumn;
  }

  // Extract CTA (button/link)
  const cta = content.querySelector('a');

  // Compose card cell: text + CTA (if present)
  const cardCell = [];
  if (textContent) cardCell.push(textContent);
  if (cta) cardCell.push(cta);

  // Build table rows
  const rows = [headerRow];
  rows.push([cardCell]);

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with block table
  element.replaceWith(block);
}
