/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  // Find the parent container holding all cards
  const innerRow = element.querySelector('.vc_inner.vc_row');
  if (!innerRow) return;

  // Each card is a .vc_column_container inside the innerRow
  const cardColumns = innerRow.querySelectorAll('.vc_column_container');

  cardColumns.forEach((col) => {
    // Image: direct child img of .vc_column-inner
    const colInner = col.querySelector('.vc_column-inner');
    const img = colInner ? colInner.querySelector('img') : null;

    // Card content wrapper
    const wrapper = colInner ? colInner.querySelector('.wpb_wrapper') : null;
    if (!img || !wrapper) return;

    // Instead of targeting only h4/h5, get all text content from all .wpb_text_column elements
    const textColumns = wrapper.querySelectorAll('.wpb_text_column');
    const textCell = document.createElement('div');
    textCell.style.display = 'flex';
    textCell.style.flexDirection = 'column';
    textCell.style.gap = '10px';

    textColumns.forEach(tc => {
      // Clone the entire text column so all text (including headings and paragraphs) is included
      Array.from(tc.childNodes).forEach(node => {
        textCell.appendChild(node.cloneNode(true));
      });
    });

    // CTA: anchor with class .mpc-button
    const cta = wrapper.querySelector('.mpc-button');
    if (cta) {
      textCell.appendChild(cta.cloneNode(true));
    }

    // Add the card row
    rows.push([
      img,
      textCell
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
