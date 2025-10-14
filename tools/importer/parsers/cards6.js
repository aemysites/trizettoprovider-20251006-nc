/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the block name header row
  const headerRow = ['Cards (cards6)'];
  const rows = [headerRow];

  // Find the parent container holding all cards
  // In this HTML, cards are inside the inner .vc_row with two .vc_column_container children
  const innerRow = element.querySelector('.vc_inner.vc_row');
  if (!innerRow) return;

  // Each card is a .vc_column_container (2 cards)
  const cardColumns = Array.from(innerRow.querySelectorAll('.vc_column_container'));

  cardColumns.forEach((col) => {
    // Image: always present, first img in the column
    const img = col.querySelector('img');

    // Title: h4 inside .wpb_text_column (first one)
    let title = null;
    const titleTextCol = col.querySelector('.wpb_text_column h4');
    if (titleTextCol) {
      title = titleTextCol.closest('.wpb_text_column');
    }

    // Description: h5s inside the second .wpb_text_column
    let desc = null;
    const descTextCol = col.querySelectorAll('.wpb_text_column');
    if (descTextCol.length > 1) {
      desc = descTextCol[1];
    }

    // CTA: anchor with class .mpc-button
    const cta = col.querySelector('a.mpc-button');

    // Compose text cell: title, description, CTA
    const textCellContent = [];
    if (title) textCellContent.push(title);
    if (desc) textCellContent.push(desc);
    if (cta) textCellContent.push(cta);

    // Add the card row: [image, text content]
    rows.push([img, textCellContent]);
  });

  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
