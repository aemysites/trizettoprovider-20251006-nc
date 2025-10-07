/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards58) block parsing
  // 1. Find all card columns (skip empty columns)
  const cardColumns = Array.from(element.children)
    .filter(col => col.classList.contains('vc_column_container') && col.querySelector('.wpb_single_image'));

  // 2. Prepare header row
  const headerRow = ['Cards (cards58)'];
  const rows = [headerRow];

  // 3. Parse each card column
  cardColumns.forEach(col => {
    // Card content wrapper
    const wrapper = col.querySelector('.wpb_wrapper');
    if (!wrapper) return;

    // Image (mandatory)
    const img = wrapper.querySelector('.wpb_single_image img');

    // Text (title)
    let title = wrapper.querySelector('.wpb_text_column h6');
    // Defensive: fallback to first h6 or h5 if needed
    if (!title) title = wrapper.querySelector('h6,h5');

    // CTA (button/link)
    const cta = wrapper.querySelector('a');

    // Compose text cell: title (heading), then CTA link (if present)
    const textCell = [];
    if (title) {
      textCell.push(title);
    }
    if (cta) {
      textCell.push(cta);
    }

    // Only add row if image and text are present
    if (img && textCell.length) {
      rows.push([img, textCell]);
    }
  });

  // 4. Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
