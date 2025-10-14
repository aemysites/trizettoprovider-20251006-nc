/* global WebImporter */
export default function parse(element, { document }) {
  // HERO (heroAlignLeft) block parsing
  // Table: 1 col, 3 rows: [Block name], [Background Image], [Text content]

  // 1. Header row
  const headerRow = ['Hero (heroAlignLeft)'];

  // 2. Background image row (none present)
  const imageRow = [''];

  // 3. Text content row
  // Collect all text content (headings and paragraphs) in order
  const textContent = [];
  // Select all heading and paragraph elements in source order
  element.querySelectorAll('.wpb_text_column .wpb_wrapper > h1, .wpb_text_column .wpb_wrapper > h2, .wpb_text_column .wpb_wrapper > h3, .wpb_text_column .wpb_wrapper > h4, .wpb_text_column .wpb_wrapper > h5, .wpb_text_column .wpb_wrapper > h6, .wpb_text_column .wpb_wrapper > p').forEach((el) => {
    textContent.push(el.cloneNode(true));
  });
  const textRow = [textContent.length ? textContent : ''];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];

  // Create block table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
