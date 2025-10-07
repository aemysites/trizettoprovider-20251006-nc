/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Hero (hero56)'];

  // Defensive selectors for image and text
  let heroImg = null;
  let heroText = null;

  // Find the main image (background or foreground)
  // Look for the first <img> inside the block
  heroImg = element.querySelector('img');

  // Find the headline text
  // Look for a text column with a heading or paragraph
  // The text is inside a .wpb_text_column or similar
  const textCol = element.querySelector(
    '.wpb_text_column, .tps-resource-title, .vc_custom_1722366586109'
  );
  if (textCol) {
    // The actual text is inside a <p> tag
    const p = textCol.querySelector('p');
    if (p) {
      // Wrap the text in a heading for semantic clarity
      const h1 = document.createElement('h1');
      h1.textContent = p.textContent.trim();
      heroText = h1;
    }
  }

  // Build table rows
  // Row 2: image (if present)
  const imageRow = [heroImg ? heroImg : ''];
  // Row 3: headline (if present)
  const textRow = [heroText ? heroText : ''];

  // Compose table
  const cells = [headerRow, imageRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
