/* global WebImporter */
export default function parse(element, { document }) {
  // Get immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > div.wpb_column'));

  // Defensive: Expecting at least two columns (image, text)
  if (columns.length < 3) return;

  // --- Extract left column (image + visible text) ---
  const leftCol = columns[1]; // columns[0] is empty per HTML
  let leftColContent = document.createElement('div');

  // Find image inside leftCol
  const img = leftCol.querySelector('img');
  if (img) leftColContent.appendChild(img);

  // Attempt to extract visible text under image (caption/title)
  // Look for any text nodes, figcaption, or branding
  // In this HTML, the image is inside .wpb_single_image, which may have a figure
  const figure = leftCol.querySelector('figure');
  if (figure) {
    // Try to get any text nodes inside figure (not inside divs)
    Array.from(figure.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        leftColContent.appendChild(document.createTextNode(node.textContent.trim()));
      }
    });
    // Also check for figcaption
    const figcaption = figure.querySelector('figcaption');
    if (figcaption) {
      leftColContent.appendChild(figcaption.cloneNode(true));
    }
  }

  // If there is branding/logo, try to find it (e.g., images with alt/logo)
  // In this HTML, there is no explicit logo, but if present, include it
  const logoImg = leftCol.querySelector('img[alt*="logo"], img[title*="logo"]');
  if (logoImg && logoImg !== img) {
    leftColContent.appendChild(logoImg.cloneNode(true));
  }

  // --- Extract right column (text) ---
  let rightColContent = document.createElement('div');
  const rightCol = columns[2];
  // Find text content inside rightCol
  const textWrapper = rightCol.querySelector('.wpb_text_column .wpb_wrapper');
  if (textWrapper) {
    // Use all paragraphs inside
    const paragraphs = Array.from(textWrapper.querySelectorAll('p'));
    if (paragraphs.length) {
      paragraphs.forEach(p => rightColContent.appendChild(p.cloneNode(true)));
    } else {
      rightColContent.appendChild(textWrapper.cloneNode(true));
    }
  }

  // --- Build the table ---
  const headerRow = ['Columns (columns50)'];
  const contentRow = [leftColContent, rightColContent];

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
