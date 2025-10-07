/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero29) block: 1 column, 3 rows
  // 1st row: block name
  // 2nd row: background image (optional)
  // 3rd row: headline, subheading, CTA (optional)

  // Header row
  const headerRow = ['Hero (hero29)'];

  // Find the background image
  let img = element.querySelector('img');
  // Defensive: if not found, try to find via data-hlx-background-image
  if (!img) {
    const bgUrl = element.getAttribute('data-hlx-background-image');
    if (bgUrl) {
      img = document.createElement('img');
      // Extract actual URL from css url()
      const match = bgUrl.match(/url\(["']?(.*?)["']?\)/);
      if (match) {
        img.src = match[1];
      } else {
        img.src = bgUrl;
      }
    }
  }

  // Find the headline/subheading/CTA content
  // The headline is inside .wpb_text_column .wpb_wrapper > h2 (or other headings)
  let textContent = null;
  const textColumn = element.querySelector('.wpb_text_column .wpb_wrapper');
  if (textColumn) {
    // Defensive: collect all heading and paragraph elements
    const contentEls = Array.from(textColumn.children).filter(
      el => ['H1','H2','H3','H4','H5','H6','P'].includes(el.tagName)
    );
    // If nothing found, fallback to all children
    textContent = contentEls.length ? contentEls : Array.from(textColumn.childNodes);
  }

  // If no text found, fallback to any heading in the block
  if (!textContent) {
    const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      textContent = [heading];
    }
  }

  // Compose table rows
  const rows = [
    headerRow,
    [img ? img : ''],
    [textContent ? textContent : '']
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
