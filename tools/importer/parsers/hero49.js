/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as required
  const headerRow = ['Hero (hero49)'];

  // Defensive: Get all columns (should be 3: 2 empty, 1 with content)
  const columns = Array.from(element.querySelectorAll(':scope > .wpb_column'));
  // Find the main content column (the one with text)
  let contentColumn = columns.find(col => col.querySelector('.wpb_text_column'));
  if (!contentColumn) contentColumn = element; // fallback if structure changes

  // Extract heading and paragraph
  const wrappers = Array.from(contentColumn.querySelectorAll('.wpb_text_column .wpb_wrapper'));
  let heading = null;
  let subheading = null;
  wrappers.forEach(wrap => {
    if (!heading) heading = wrap.querySelector('h1, h2, h3, h4, h5, h6');
    if (!subheading) subheading = wrap.querySelector('p');
  });

  // Defensive fallback: if not found, try broader search
  if (!heading) heading = contentColumn.querySelector('h1, h2, h3, h4, h5, h6');
  if (!subheading) subheading = contentColumn.querySelector('p');

  // Row 2: Background image (none in this HTML, so leave blank)
  const bgImageRow = [''];

  // Row 3: Content (heading + subheading)
  const contentRow = [
    [
      ...(heading ? [heading] : []),
      ...(subheading ? [subheading] : [])
    ]
  ];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImageRow,
    contentRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
