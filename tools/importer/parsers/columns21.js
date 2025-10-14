/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row for Columns block
  const headerRow = ['Columns (columns21)'];

  // 2. Get immediate child columns (should be two)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Only process columns if present
  const contentRow = columns.map((col) => {
    // Each column has a .vc_column-inner > .wpb_wrapper
    const wrapper = col.querySelector('.vc_column-inner > .wpb_wrapper');
    // If wrapper not found, fallback to column itself
    const contentContainer = wrapper || col;
    // Collect all direct children (should be two text blocks)
    const blocks = Array.from(contentContainer.children).filter(child => child.nodeType === 1);
    // Compose a fragment to hold both blocks
    const frag = document.createDocumentFragment();
    blocks.forEach(block => frag.appendChild(block));
    return frag;
  });

  // 3. Build table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 4. Replace original element
  element.replaceWith(table);
}
