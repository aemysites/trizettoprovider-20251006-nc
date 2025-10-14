/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (CTA) block: 1 column, 3 rows
  // Row 1: Header
  // Row 2: Background image (optional)
  // Row 3: Headline, subheading, CTA (optional)

  // Always use block name for header row
  const headerRow = ['Hero (CTA)'];

  // No image present in the provided HTML, so row 2 is empty
  const imageRow = [''];

  // Row 3: Try to find CTA link
  let ctaCell = '';
  // Defensive: Find first anchor inside the element
  const ctaLink = element.querySelector('a');
  if (ctaLink) {
    // Use the actual anchor element
    ctaCell = ctaLink;
  }

  // Compose table rows
  const rows = [
    headerRow,
    imageRow,
    [ctaCell]
  ];

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(table);
}
