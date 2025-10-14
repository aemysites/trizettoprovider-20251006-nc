/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name
  const headerRow = ['Hero (heroInline)'];

  // 2. Background image row: none in this case
  const bgImageRow = [''];

  // 3. Content row: extract the main text (as heading)
  // Defensive: find the quote description text
  let content = '';
  const quoteDesc = element.querySelector('.mpc-quote__description');
  if (quoteDesc) {
    // Use the text content as the heading
    const h1 = document.createElement('h1');
    h1.textContent = quoteDesc.textContent.trim();
    content = h1;
  } else {
    // fallback: use all text content
    const h1 = document.createElement('h1');
    h1.textContent = element.textContent.trim();
    content = h1;
  }

  const contentRow = [content];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImageRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
