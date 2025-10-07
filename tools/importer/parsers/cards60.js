/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards60) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards60)'];
  const rows = [headerRow];

  // Each card is a .wpb_column.vc_column_container
  const cardColumns = element.querySelectorAll('.wpb_column.vc_column_container');
  cardColumns.forEach((col) => {
    // Card image: find first img inside .wpb_single_image
    let img = col.querySelector('.wpb_single_image img');
    // Card text: find the first mpc-textblock with a link (title), and last mpc-textblock (desc)
    const textBlocks = col.querySelectorAll('.mpc-textblock');
    let titleBlock = null;
    let descBlock = null;
    if (textBlocks.length > 0) {
      // Title block is first mpc-textblock with a link
      titleBlock = Array.from(textBlocks).find(tb => tb.querySelector('a'));
      // Description block is last mpc-textblock
      descBlock = textBlocks[textBlocks.length - 1];
    }

    // Compose text cell: title (as heading), description
    const textCellContent = [];
    if (titleBlock) {
      // Use the link as the title, preserve strong/span styling
      // Wrap in <strong> for heading effect
      const link = titleBlock.querySelector('a');
      if (link) {
        // Clone the link to avoid moving it from DOM
        const linkClone = link.cloneNode(true);
        // Wrap in <strong> for heading effect
        const heading = document.createElement('div');
        heading.appendChild(linkClone);
        textCellContent.push(heading);
      }
    }
    if (descBlock) {
      // Only add description if it's not the same as titleBlock
      if (descBlock !== titleBlock) {
        // Clone to avoid moving
        const descClone = descBlock.cloneNode(true);
        textCellContent.push(descClone);
      }
    }

    // Defensive: if no image, use empty string
    rows.push([
      img || '',
      textCellContent.length ? textCellContent : ''
    ]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}