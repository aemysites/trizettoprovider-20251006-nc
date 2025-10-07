/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero21) block: 1 column, 3 rows
  // 1st row: block name
  // 2nd row: background image (optional)
  // 3rd row: heading, subheading, CTA (optional)

  // Header row
  const headerRow = ['Hero (hero21)'];

  // For this HTML, there is no <img> or inline background-image style, so leave row 2 empty
  const backgroundRow = [''];

  // Extract text content for hero
  // Find the text column wrapper
  let heroContent = '';
  const textColumn = element.querySelector('.mpc-cubebox-side__content');
  if (textColumn) {
    const innerWrapper = textColumn.querySelector('.wpb_wrapper');
    if (innerWrapper) {
      // Get all child nodes (could be paragraphs, headings, etc.)
      const contentNodes = Array.from(innerWrapper.childNodes).filter(node => {
        return (node.nodeType === 1 && node.textContent.trim()) || (node.nodeType === 3 && node.textContent.trim());
      });
      // If only one paragraph, preserve its tag (do NOT convert to h1)
      if (contentNodes.length === 1 && contentNodes[0].nodeType === 1 && contentNodes[0].tagName === 'P') {
        heroContent = contentNodes[0].cloneNode(true);
      } else {
        // Otherwise, wrap all in a div
        const div = document.createElement('div');
        contentNodes.forEach(node => div.appendChild(node.cloneNode(true)));
        heroContent = div;
      }
    }
  }
  const contentRow = [heroContent || ''];

  // Compose table
  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(block);
}
