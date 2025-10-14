/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (resourceCards) block header
  const headerRow = ['Cards (resourceCards)'];
  const rows = [headerRow];

  // Find all card columns (ignore empty columns)
  const columns = Array.from(element.querySelectorAll('.wpb_column'));
  columns.forEach((col) => {
    // Only process columns with actual card content
    const wrapper = col.querySelector('.wpb_wrapper');
    if (!wrapper) return;
    // Look for a textblock with a link (title), image, and description
    const textblocks = Array.from(wrapper.querySelectorAll('.mpc-textblock'));
    const imageBlock = wrapper.querySelector('.wpb_single_image');
    // Defensive: Only process if both image and at least one textblock
    if (!imageBlock || textblocks.length < 2) return;

    // 1st textblock: Title (with link)
    const titleBlock = textblocks[0];
    // 2nd textblock: Description
    const descBlock = textblocks[1];

    // Image: Use the <img> inside the imageBlock
    let imgEl = imageBlock.querySelector('img');
    // Defensive: If image is wrapped in a link, keep the link
    let imgCell;
    const imgLink = imageBlock.querySelector('a');
    if (imgLink && imgEl) {
      imgCell = imgLink;
    } else if (imgEl) {
      imgCell = imgEl;
    } else {
      // fallback: skip this card
      return;
    }

    // Text cell: Combine title and description
    // Defensive: Use the entire titleBlock and descBlock elements
    const textCell = [titleBlock, descBlock];

    rows.push([imgCell, textCell]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
