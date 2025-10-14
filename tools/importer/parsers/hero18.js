/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Hero (heroSimple)'];

  // Defensive: Find the first image (background image)
  const img = element.querySelector('img');

  // Defensive: Find the headline (h1 or .tps-post-title)
  let heading = null;
  // Try to find h1
  heading = element.querySelector('h1');
  // If not found, try to find .tps-post-title
  if (!heading) {
    heading = element.querySelector('.tps-post-title');
    // If found, wrap in h1 for semantic correctness
    if (heading) {
      const h1 = document.createElement('h1');
      h1.appendChild(heading);
      heading = h1;
    }
  }

  // Row 2: Background image (optional)
  const imageRow = [img ? img : ''];

  // Row 3: Headline (optional)
  const contentRow = [heading ? heading : ''];

  // Compose the table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
