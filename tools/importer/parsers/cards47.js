/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards47) block: extract each card's image, title, description, and CTA
  const headerRow = ['Cards (cards47)'];
  const rows = [headerRow];

  // Find all card columns (each card is a .wpb_column)
  const cardColumns = element.querySelectorAll('.wpb_column');

  cardColumns.forEach((col) => {
    // Image: find the first img inside the card
    const img = col.querySelector('img');

    // Title: find the h6 (or heading) inside the card
    const titleWrapper = col.querySelector('h6');
    let titleElem = null;
    if (titleWrapper) {
      // Use the heading element directly, including its link if present
      titleElem = titleWrapper;
    }

    // Description: find the first paragraph inside the card
    const descWrapper = col.querySelector('.grid-post-excerpt p');
    let descElem = null;
    if (descWrapper) {
      descElem = descWrapper;
    }

    // CTA button: find the .mpc-button anchor
    const cta = col.querySelector('.mpc-button');
    let ctaElem = null;
    if (cta) {
      ctaElem = cta;
    }

    // Compose the text cell: title, description, CTA (in order)
    const textCellContent = [];
    if (titleElem) textCellContent.push(titleElem);
    if (descElem) textCellContent.push(descElem);
    if (ctaElem) textCellContent.push(ctaElem);

    // Add the row: [image, text content]
    rows.push([
      img,
      textCellContent
    ]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
