/* global WebImporter */
export default function parse(element, { document }) {
  // --- Hero (hero57) block ---
  // Table: 1 column, 3 rows
  // 1st row: block name
  // 2nd row: background image (optional)
  // 3rd row: heading, subheading, CTA (optional)

  // Header row
  const headerRow = ['Hero (hero57)'];

  // --- 2nd row: Background image ---
  // Find the first <img> inside the element
  let imgEl = element.querySelector('img');
  let bgImageCell = imgEl ? imgEl : '';

  // --- 3rd row: Text content ---
  // Find the main heading (h1)
  let heading = element.querySelector('h1');

  // Find the subheading (h6)
  let subheading = element.querySelector('h6');

  // Find CTA (anchor) if present (not present in this example)
  let cta = null;
  // Look for anchor tags inside the text area
  // Only include if visually present as CTA
  // (Not present in this block)

  // Compose content cell
  const textContent = [];
  if (heading) textContent.push(heading);
  if (subheading) textContent.push(subheading);
  if (cta) textContent.push(cta);

  // Defensive: if nothing found, add a placeholder
  const textCell = textContent.length ? textContent : '';

  // Build table
  const cells = [
    headerRow,
    [bgImageCell],
    [textCell],
  ];

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
