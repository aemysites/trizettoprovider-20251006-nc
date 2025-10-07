/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero37) block parsing
  // 1 column, 3 rows: [header], [background image], [headline/subheading/cta]

  // Header row
  const headerRow = ['Hero (hero37)'];

  // Find the background image (img element)
  let bgImg = element.querySelector('img');

  // Defensive: If no image found, check for data-hlx-background-image
  if (!bgImg && element.dataset.hlxBackgroundImage) {
    const imgSrcMatch = element.dataset.hlxBackgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (imgSrcMatch && imgSrcMatch[1]) {
      bgImg = document.createElement('img');
      bgImg.src = imgSrcMatch[1];
    }
  }

  // Second row: background image (optional)
  // Reference the existing image element if possible
  const imageRow = [bgImg ? bgImg : ''];

  // Third row: headline/subheading/cta
  // Find the main headline (h1 or .tps-post-title)
  let headline = '';
  const h1 = element.querySelector('h1');
  if (h1) {
    headline = h1;
  } else {
    // Fallback: look for .tps-post-title
    const postTitle = element.querySelector('.tps-post-title');
    if (postTitle) {
      const h1El = document.createElement('h1');
      h1El.appendChild(postTitle.cloneNode(true));
      headline = h1El;
    }
  }

  // Compose content cell
  const contentRow = [headline ? headline : ''];

  // Build table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
