/* global WebImporter */
export default function parse(element, { document }) {
  // HERO (hero24) block: 1 col x 3 rows
  // Row 1: Block name
  // Row 2: Background image (optional)
  // Row 3: Headline, subheading, CTA (optional)

  // --- Row 1: Header ---
  const headerRow = ['Hero (hero24)'];

  // --- Row 2: Background Image ---
  // Find the first <img> in the block (background image)
  let img = element.querySelector('img');
  let imageRow;
  if (img) {
    imageRow = [img];
  } else {
    imageRow = [''];
  }

  // --- Row 3: Headline, Subheading, CTA ---
  // Find headline (h1, h2, etc.)
  let headline;
  // Search for heading tags inside the block
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    headline = heading;
  }

  // Find subheading (not present in this example, but support for future)
  let subheading;
  // Search for a second heading (different level)
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headings.length > 1) {
    subheading = headings[1];
  }

  // Find CTA (link/button)
  let cta;
  // Look for anchor or button inside the block
  const link = element.querySelector('a');
  if (link) {
    cta = link;
  }
  const button = element.querySelector('button');
  if (!cta && button) {
    cta = button;
  }

  // Compose content for row 3
  const contentRow = [];
  if (headline) contentRow.push(headline);
  if (subheading) contentRow.push(subheading);
  // No paragraph in this example, but could be added for future-proofing
  // If CTA found, add it
  if (cta) contentRow.push(cta);

  // Defensive: If no headline, fallback to text content
  if (contentRow.length === 0) {
    // Try to find any text content
    const textDiv = element.querySelector('.wpb_text_column, .wpb_wrapper');
    if (textDiv) {
      contentRow.push(textDiv);
    } else {
      contentRow.push('');
    }
  }

  // Table rows
  const rows = [
    headerRow,
    imageRow,
    [contentRow]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
