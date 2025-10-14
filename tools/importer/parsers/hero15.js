/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the main image (background)
  function getHeroImage(el) {
    // Look for the first <img> in the block
    const img = el.querySelector('img');
    return img || '';
  }

  // Helper to extract the main text content (title, subheading, citation, CTA)
  function getHeroTextContent(el) {
    // Find the main column (usually the largest one)
    // Try to find the column with most content
    const columns = Array.from(el.querySelectorAll(':scope > div > div > div > div > div'));
    let mainCol = null;
    let maxLength = 0;
    columns.forEach(col => {
      // Count number of text children
      const count = col.querySelectorAll('.wpb_text_column').length;
      if (count > maxLength) {
        maxLength = count;
        mainCol = col;
      }
    });
    // Defensive: fallback to first column if not found
    if (!mainCol) {
      mainCol = columns[0] || el;
    }

    // Collect text blocks
    const textBlocks = Array.from(mainCol.querySelectorAll('.wpb_text_column'));
    const content = [];
    textBlocks.forEach(tb => {
      // Use the wrapper div if present, else the block itself
      const wrapper = tb.querySelector('.wpb_wrapper') || tb;
      // For each wrapper, extract its children
      Array.from(wrapper.children).forEach(child => {
        // Only add non-empty elements
        if (child.textContent && child.textContent.trim()) {
          content.push(child);
        }
      });
    });
    return content;
  }

  // Compose table rows
  const headerRow = ['Hero (heroOverlay)'];

  // Row 2: background image (optional)
  const img = getHeroImage(element);
  const imageRow = [img ? img : ''];

  // Row 3: text content (title, subheading, citation, CTA)
  const textContent = getHeroTextContent(element);
  const textRow = [textContent.length ? textContent : ''];

  // Build the table
  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
