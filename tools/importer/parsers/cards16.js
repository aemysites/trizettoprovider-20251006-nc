/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards16) block: 2 columns, multiple rows, each row is a card (image + text)
  const headerRow = ['Cards (cards16)']; // single cell header row per guidelines
  const rows = [headerRow];

  // Find all card items within the parent container
  // Each card is a .vc_grid-item (not .vc_grid-item-mini)
  const cardItems = element.querySelectorAll('.vc_grid-item');

  cardItems.forEach((cardItem) => {
    // Image cell: find the first image within the card
    let imgCell = '';
    const imgCol = cardItem.querySelector('.vc_col-sm-4');
    if (imgCol) {
      const img = imgCol.querySelector('img');
      if (img) {
        imgCell = img;
      }
    }
    // If no image, leave cell empty (do not use anchor or placeholder text)

    // Text cell: title, description, and optional CTA
    const textCol = cardItem.querySelector('.vc_col-sm-8');
    const textCellContent = [];

    // Title (bold/heading)
    const titleDiv = textCol && textCol.querySelector('.grid-post-title');
    if (titleDiv) {
      // The title is usually inside an <a> within a <div>
      const titleAnchor = titleDiv.querySelector('a');
      if (titleAnchor) {
        // Make the title bold (strong)
        const strong = document.createElement('strong');
        strong.appendChild(document.createTextNode(titleAnchor.textContent.trim()));
        textCellContent.push(strong);
      }
    }

    // Description
    const descDiv = textCol && textCol.querySelector('.grid-post-excerpt');
    if (descDiv) {
      // Usually a <p> inside a <div>
      const p = descDiv.querySelector('p');
      if (p) {
        textCellContent.push(p);
      }
    }

    rows.push([imgCell, textCellContent]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
