/* global WebImporter */
export default function parse(element, { document }) {
  // --- Hero (hero52) block parsing ---
  // 1 column, 3 rows: [Block name], [Background image], [Text content]

  // Header row
  const headerRow = ['Hero (hero52)'];

  // --- Row 2: Background image ---
  // Find the first <img> in the block (background image)
  const img = element.querySelector('img');
  const imageRow = [img ? img : ''];

  // --- Row 3: Text content ---
  // Find main text and attribution
  // The main text is the first .wpb_text_column with bold/white styling
  // The attribution is the next .wpb_text_column with light/white styling
  const textColumns = Array.from(element.querySelectorAll('.wpb_text_column'));
  let textContent = [];
  textColumns.forEach(tc => {
    // Find the direct .wpb_wrapper child (contains the <p>)
    const wrapper = tc.querySelector('.wpb_wrapper');
    if (wrapper) {
      textContent.push(wrapper);
    }
  });
  // Defensive: If nothing found, fallback to all <p> inside element
  if (textContent.length === 0) {
    textContent = Array.from(element.querySelectorAll('p'));
  }
  const textRow = [textContent];

  // --- Create table and replace ---
  const cells = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
