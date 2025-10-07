/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards38) block parser
  // Header row
  const headerRow = ['Cards (cards38)'];
  const rows = [headerRow];

  // Find the grid container that holds all cards
  const cardItems = element.querySelectorAll('.vc_grid-item');

  cardItems.forEach(card => {
    // --- IMAGE CELL ---
    let imgEl = null;
    const imgContainer = card.querySelector('.wpb_single_image');
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }

    // --- TEXT CELL ---
    // Title extraction: always use the full company name from the image link's title attribute
    let titleText = '';
    let titleEl = null;
    const imgLink = card.querySelector('.wpb_single_image a');
    if (imgLink) {
      // Prefer the title attribute for full company name
      titleText = imgLink.getAttribute('title') ? imgLink.getAttribute('title').trim() : '';
      if (!titleText) {
        titleText = imgLink.textContent.trim();
      }
      if (titleText) {
        // Use heading for title for fidelity
        titleEl = document.createElement('h3');
        titleEl.textContent = titleText;
      }
    }

    // Description (from excerpt)
    let descEl = null;
    const descContainer = card.querySelector('.marketplace-grid-post-excerpt');
    if (descContainer) {
      const p = descContainer.querySelector('p');
      if (p) {
        descEl = document.createElement('span');
        descEl.textContent = p.textContent;
      } else {
        descEl = document.createElement('span');
        descEl.textContent = descContainer.textContent;
      }
    }

    // CTA link (Explore Solution)
    let ctaEl = null;
    const ctaContainer = card.querySelector('.marketplace-grid-post-button-link a');
    if (ctaContainer) {
      ctaEl = ctaContainer.cloneNode(true);
    }

    // Compose the text cell
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    if (descEl) textCellContent.push(document.createElement('br'), descEl);
    if (ctaEl) textCellContent.push(document.createElement('br'), ctaEl);

    // Add the card row: [image, text]
    rows.push([
      imgEl || '',
      textCellContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
