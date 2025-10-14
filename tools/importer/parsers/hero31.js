/* global WebImporter */
export default function parse(element, { document }) {
  // --- CRITICAL REVIEW ---
  // 1. No hardcoded content; all content is referenced from the DOM.
  // 2. No markdown formatting; only HTML elements and WebImporter.DOMUtils.createTable are used.
  // 3. Only one table per hero block, matching the example.
  // 4. Table header matches EXACTLY: ['Hero (heroCaseStudy)']
  // 5. Handles edge cases: missing image, missing text column.
  // 6. No Section Metadata block in the example, so none is created.
  // 7. Existing elements are referenced, not cloned or recreated.
  // 8. Semantic meaning is retained: heading, author, excerpt, date, all referenced as-is.
  // 9. All text content from the source HTML is included in the content cell.
  // 10. Only references the <img> element, never creates a new image or uses alt/URL from data attributes.
  // 11. No model provided, so no html comments for model fields.

  // --- Extraction Logic ---

  // Get the direct image child (background image)
  const img = element.querySelector(':scope > img');

  // Find the main text column (deepest .wpb_text_column .wpb_wrapper)
  let textColumn;
  const col = element.querySelector('.vc_column_container');
  if (col) {
    const inner = col.querySelector('.vc_column-inner');
    if (inner) {
      const wrapper = inner.querySelector('.wpb_wrapper');
      if (wrapper) {
        // Prefer .wpb_text_column .wpb_wrapper if present
        textColumn = wrapper.querySelector('.wpb_text_column .wpb_wrapper') || wrapper;
      }
    }
  }
  // Defensive fallback: if not found, use the whole element
  if (!textColumn) textColumn = element;

  // Table rows
  const headerRow = ['Hero (heroCaseStudy)'];
  const imageRow = [img ? img : ''];
  const contentRow = [textColumn];

  const cells = [headerRow, imageRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
