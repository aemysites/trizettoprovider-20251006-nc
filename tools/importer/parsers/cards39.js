/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards39) block parser
  // Find the parent container holding all card items
  const gridContainer = element.querySelector('.vc_grid-container');
  if (!gridContainer) return;

  // Find all card items within the grid
  const cardItems = gridContainer.querySelectorAll('.vc_grid-item');
  if (!cardItems.length) return;

  // Prepare the table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards39)']);

  // For each card, extract image and text content
  cardItems.forEach((card) => {
    // Image cell
    let imageEl = null;
    const img = card.querySelector('img');
    if (img) {
      imageEl = img;
    }

    // Text cell
    const textContent = [];
    // Resource type label
    const resourceType = card.querySelector('.vc_gitem-post-meta-field-resource_type');
    if (resourceType) {
      // Use a span for resource type
      const typeSpan = document.createElement('span');
      typeSpan.textContent = resourceType.textContent.trim();
      typeSpan.style.display = 'block';
      typeSpan.style.color = resourceType.style.color || '';
      typeSpan.style.fontWeight = 'bold';
      typeSpan.style.textTransform = 'uppercase';
      typeSpan.style.marginBottom = '6px';
      textContent.push(typeSpan);
    }
    // Title (heading, with link)
    const titleDiv = card.querySelector('.grid-post-title');
    if (titleDiv) {
      const link = titleDiv.querySelector('a');
      if (link) {
        // Use the link as the heading
        const heading = document.createElement('strong');
        const linkEl = document.createElement('a');
        linkEl.href = link.href;
        linkEl.textContent = link.textContent.trim();
        linkEl.title = link.title || '';
        linkEl.style.textDecoration = 'none';
        heading.appendChild(linkEl);
        heading.style.display = 'block';
        heading.style.marginBottom = '6px';
        textContent.push(heading);
      }
    }
    // Description
    const descDiv = card.querySelector('.grid-post-excerpt');
    if (descDiv) {
      // Find the paragraph inside
      const p = descDiv.querySelector('p');
      if (p) {
        textContent.push(p);
      }
    }
    // Add the row for this card
    rows.push([
      imageEl,
      textContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
