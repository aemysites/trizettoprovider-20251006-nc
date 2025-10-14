/* global WebImporter */
export default function parse(element, { document }) {
  // HERO block: 1 column, 3 rows
  // Row 1: Block name
  // Row 2: Background image (optional)
  // Row 3: Heading, subheading, CTA (optional)

  // Find image element (background image)
  let imgEl = element.querySelector('img');

  // Find all visible text content from the element and its descendants
  // Only include text nodes that are not inside <script>, <style>, or <img>
  let textContent = [];
  element.querySelectorAll('*:not(script):not(style):not(img)').forEach(el => {
    // Only push text if it's not whitespace
    if (el.childNodes.length) {
      el.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const clean = node.textContent.trim();
          if (clean) textContent.push(clean);
        }
      });
    }
  });

  // Defensive: If no text found, try to get alt text from image
  if (textContent.length === 0 && imgEl && imgEl.alt && imgEl.alt.trim()) {
    textContent.push(imgEl.alt.trim());
  }

  // Compose row 3: all visible text content
  const headerRow = ['Hero'];
  const imageRow = [imgEl ? imgEl : ''];
  const contentRow = [textContent.length ? textContent.join(' ') : ''];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
