/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards8) block: 2 columns, multiple rows
  // Each card: first cell = image, second cell = text content (title, description, CTA)

  // Helper to extract card content from a card column
  function extractCard(column) {
    // Find image (inside .wpb_single_image)
    const imageWrapper = column.querySelector('.wpb_single_image');
    let imgEl = null;
    if (imageWrapper) {
      imgEl = imageWrapper.querySelector('img');
    }

    // Find heading/title (usually the first .mpc-textblock)
    const textblocks = column.querySelectorAll('.mpc-textblock');
    let headingBlock = null;
    let descriptionBlock = null;
    if (textblocks.length > 0) {
      headingBlock = textblocks[0];
      // Find the description block (usually the second .mpc-textblock)
      if (textblocks.length > 1) {
        descriptionBlock = textblocks[1];
      }
    }

    // Compose text cell: heading, then description
    const textCellContent = [];
    if (headingBlock) {
      textCellContent.push(headingBlock);
    }
    if (descriptionBlock) {
      textCellContent.push(descriptionBlock);
    }

    // Defensive: fallback to paragraph if no .mpc-textblock
    if (textCellContent.length === 0) {
      const fallback = column.querySelector('p');
      if (fallback) textCellContent.push(fallback);
    }

    return [imgEl, textCellContent];
  }

  // Get all columns that are actual cards (ignore empty columns)
  const cardColumns = Array.from(element.querySelectorAll('.wpb_column'))
    .filter(col => {
      // Only columns with image and/or textblock
      return col.querySelector('.wpb_single_image') && col.querySelector('.mpc-textblock');
    });

  // Build rows: header, then one row per card
  const rows = [];
  rows.push(['Cards (cards8)']); // Header row

  cardColumns.forEach(col => {
    const [img, textContent] = extractCard(col);
    rows.push([img, textContent]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
