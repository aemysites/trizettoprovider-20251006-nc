/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards58) block: 2 columns, multiple rows (image/icon | text/title/cta)
  // 1. Find all card columns (skip empty columns)
  const cardColumns = Array.from(element.querySelectorAll('.vc_column_container')).filter(col => {
    // Only keep columns with content (not empty spacers)
    return col.querySelector('.wpb_single_image') && col.querySelector('h6');
  });

  // 2. Build header row
  const headerRow = ['Cards (cards58)'];
  const rows = [headerRow];

  // 3. For each card column, extract image and text/cta
  cardColumns.forEach(col => {
    // Image/Icon (first cell)
    const imgWrapper = col.querySelector('.wpb_single_image');
    let img = null;
    if (imgWrapper) {
      img = imgWrapper.querySelector('img');
    }

    // Text content (second cell)
    const textCell = document.createElement('div');
    // Title (h6)
    const h6 = col.querySelector('h6');
    if (h6) {
      textCell.appendChild(h6.cloneNode(true));
    }
    // Description: none in this example
    // CTA button (link)
    const cta = col.querySelector('a.mpc-button');
    if (cta) {
      textCell.appendChild(cta.cloneNode(true));
    }

    // Add row: [image, textCell]
    rows.push([
      img || '',
      textCell
    ]);
  });

  // 4. Create block table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
