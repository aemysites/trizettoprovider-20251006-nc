/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards25) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Select all card columns (each card is in a .wpb_column)
  const cardColumns = element.querySelectorAll('.wpb_column');

  cardColumns.forEach((col) => {
    // Find image (first .wpb_single_image img)
    const img = col.querySelector('.wpb_single_image img');

    // Find title (h6 inside .wpb_text_column)
    const titleWrapper = col.querySelector('.wpb_text_column h6');
    let titleEl = null;
    if (titleWrapper) {
      // Use the heading element directly (may contain a link)
      titleEl = titleWrapper;
    }

    // Find description (first .grid-post-excerpt p)
    const descWrapper = col.querySelector('.grid-post-excerpt p');
    let descEl = null;
    if (descWrapper) {
      descEl = descWrapper;
    }

    // Find CTA button (mpc-button)
    const cta = col.querySelector('.mpc-button');
    let ctaEl = null;
    if (cta) {
      // Use the anchor element directly
      ctaEl = cta;
    }

    // Compose text cell: title, description, CTA (in order)
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    if (descEl) textCellContent.push(descEl);
    if (ctaEl) textCellContent.push(ctaEl);

    // Add row: [image, text content]
    rows.push([
      img,
      textCellContent
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
