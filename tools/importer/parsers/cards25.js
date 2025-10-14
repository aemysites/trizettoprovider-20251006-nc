/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (resourceList) block - 2 columns: image | text
  // Header row
  const headerRow = ['Cards (resourceList)'];
  const rows = [headerRow];

  // Find the grid container that holds all cards
  const grid = element.querySelector('.vc_grid');
  if (!grid) return;

  // Each card is .vc_grid-item
  const cardItems = grid.querySelectorAll('.vc_grid-item');
  cardItems.forEach((card) => {
    // Image cell
    let imageCell = null;
    const imgCol = card.querySelector('.vc_col-sm-4');
    if (imgCol) {
      const img = imgCol.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // Text cell
    const textCol = card.querySelector('.vc_col-sm-8');
    const textCellContent = [];
    if (textCol) {
      // Resource type
      const resourceType = textCol.querySelector('.vc_gitem-post-meta-field-resource_type');
      if (resourceType) {
        textCellContent.push(resourceType);
      }
      // Title (usually a link inside .grid-post-title)
      const titleDiv = textCol.querySelector('.grid-post-title');
      if (titleDiv) {
        textCellContent.push(titleDiv);
      }
      // Description
      const descDiv = textCol.querySelector('.grid-post-excerpt');
      if (descDiv) {
        textCellContent.push(descDiv);
      }
    }

    // Defensive: If image or text missing, skip this card
    if (imageCell && textCellContent.length) {
      rows.push([imageCell, textCellContent]);
    }
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
