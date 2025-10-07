/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: Always use block name
  const headerRow = ['Hero (hero4)'];

  // --- Row 2: Background image (optional) ---
  // Screenshot shows only a gradient bar, so leave empty
  const backgroundRow = [''];

  // --- Row 3: Title, subheading, CTA (optional) ---
  // Extract all text content from the center column (not just CTA)
  let contentCell = '';
  const centerCol = Array.from(element.querySelectorAll(':scope .vc_col-sm-8'))[0];
  if (centerCol) {
    const wrapper = centerCol.querySelector('.wpb_wrapper');
    if (wrapper) {
      // Collect all text content inside the wrapper
      const text = wrapper.textContent.trim();
      if (text) {
        contentCell = text;
      }
      // If there's a CTA link, append its href and title as HTML
      const cta = wrapper.querySelector('a');
      if (cta) {
        const a = document.createElement('a');
        a.href = cta.getAttribute('href');
        a.textContent = cta.textContent.trim();
        const title = cta.getAttribute('title');
        if (title) a.title = title;
        contentCell = a;
      }
    }
  }
  const contentRow = [contentCell || ''];

  // Compose table
  const cells = [
    headerRow,
    backgroundRow,
    contentRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
