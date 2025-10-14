/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find all card columns (skip spacers/empty columns)
  const cardColumns = Array.from(element.querySelectorAll('.vc_column_container'))
    .filter(col => col.querySelector('img'));

  // 2. Prepare rows for the Cards (cards40) table
  const rows = [];
  // Header row: must match block name and variant exactly
  rows.push(['Cards (cards40)']);

  cardColumns.forEach(col => {
    // --- IMAGE ---
    const img = col.querySelector('img'); // Reference existing image element

    // --- TEXT CONTENT ---
    // Heading: first h3 or h2
    const heading = col.querySelector('h3, h2');
    // Description: first <p> (may contain <br> or multiple lines)
    const desc = col.querySelector('p');
    // CTA: first <a> (button)
    const cta = col.querySelector('a');

    // Compose the text cell: preserve order and semantics
    const textCell = [];
    if (heading) textCell.push(heading);
    if (desc) textCell.push(desc);
    if (cta) textCell.push(cta);

    // Ensure all text content is included; no markdown, only HTML elements
    rows.push([
      img,
      textCell
    ]);
  });

  // 3. Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
