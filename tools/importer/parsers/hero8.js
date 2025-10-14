/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (CTA) (CTAOnly) block: 1 column, 3 rows
  // Row 1: block name
  // Row 2: background image (optional, none in this case)
  // Row 3: headline, subheading, CTA (only CTA present here)

  // Header row
  const headerRow = ['Hero (CTA) (CTAOnly)'];

  // Row 2: background image (none in this HTML)
  const bgImageRow = [''];

  // Row 3: content (CTA link)
  // Find the CTA link in the middle column
  let ctaContent = '';
  const columns = element.querySelectorAll(':scope > div');
  if (columns.length >= 3) {
    // Middle column is likely the main content
    const middleCol = columns[1];
    // Look for link inside middle column
    const ctaLink = middleCol.querySelector('a[href]');
    if (ctaLink) {
      ctaContent = ctaLink;
    } else {
      // Fallback: grab text content
      ctaContent = middleCol.textContent.trim();
    }
  } else {
    // Fallback: try to find any link in the block
    const ctaLink = element.querySelector('a[href]');
    if (ctaLink) {
      ctaContent = ctaLink;
    } else {
      ctaContent = element.textContent.trim();
    }
  }

  const tableCells = [
    headerRow,
    bgImageRow,
    [ctaContent]
  ];

  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(blockTable);
}
