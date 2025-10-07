/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the first <img> in the subtree
  function getHeroImage(el) {
    // Look for any <img> element in the subtree
    return el.querySelector('img');
  }

  // Helper to extract all text content (title, subtitle, etc.)
  function getHeroTextContent(el) {
    // Find all .wpb_text_column .wpb_wrapper elements
    const wrappers = el.querySelectorAll('.wpb_text_column .wpb_wrapper');
    const contentEls = [];
    wrappers.forEach(wrap => {
      // Defensive: Only include wrappers with actual content
      if (wrap.textContent.trim()) {
        // Instead of just the wrapper, include all its children (preserves headings, etc.)
        Array.from(wrap.childNodes).forEach(node => {
          if (
            (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim()) ||
            (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
          ) {
            contentEls.push(node.cloneNode(true));
          }
        });
      }
    });
    return contentEls;
  }

  // Build the table rows
  const headerRow = ['Hero (hero14)'];

  // Row 2: Background image (optional)
  const imageEl = getHeroImage(element);
  const imageRow = [imageEl ? imageEl : ''];

  // Row 3: Text content (title, subtitle, etc.)
  const textContentEls = getHeroTextContent(element);
  const textRow = [textContentEls && textContentEls.length ? textContentEls : ''];

  const cells = [
    headerRow,
    imageRow,
    textRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
