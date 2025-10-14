/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (partnerCards) block
  const headerRow = ['Cards (partnerCards)'];
  const cells = [headerRow];

  // Find all card items
  const cardItems = element.querySelectorAll('.vc_grid-item');

  cardItems.forEach((card) => {
    // --- IMAGE CELL ---
    let imageEl = null;
    const imgContainer = card.querySelector('.wpb_single_image');
    if (imgContainer) {
      imageEl = imgContainer.querySelector('img');
    }
    if (!imageEl) {
      imageEl = card.querySelector('img');
    }

    // --- TEXT CELL ---
    // Find the organization/product name from the visible heading text
    // Try to get from the .marketplace-grid-post-logo-image > a > img alt/title
    // But prefer visible text if present
    let orgName = '';
    // Try to get from the .marketplace-grid-post-logo-image's parent .vc_gitem-zone-a > a[title]
    const zoneA = card.querySelector('.vc_gitem-zone-a a[title]');
    if (zoneA && zoneA.title) {
      orgName = zoneA.title;
    }
    // Defensive: If not found, try to get from the .marketplace-grid-post-logo-image > a[title]
    if (!orgName) {
      const logoLink = card.querySelector('.marketplace-grid-post-logo-image a[title]');
      if (logoLink && logoLink.title) {
        orgName = logoLink.title;
      }
    }
    // Defensive: If not found, try to get from the first <img> alt
    if (!orgName && imageEl && imageEl.alt) {
      orgName = imageEl.alt;
    }
    // Defensive: If not found, try to get from the first <img> title
    if (!orgName && imageEl && imageEl.title) {
      orgName = imageEl.title;
    }
    // Defensive: If not found, try to get from the first <img> filename
    if (!orgName && imageEl && imageEl.src) {
      orgName = imageEl.src.split('/').pop().split('.')[0].replace(/[-_]/g, ' ');
    }

    // Create a heading element for the orgName if present
    let headingEl = null;
    if (orgName) {
      headingEl = document.createElement('strong');
      headingEl.textContent = orgName;
    }

    // Find the description
    let descEl = null;
    const descContainer = card.querySelector('.marketplace-grid-post-excerpt');
    if (descContainer) {
      const p = descContainer.querySelector('p');
      if (p) {
        descEl = p;
      } else {
        descEl = descContainer;
      }
    }

    // Find the CTA link
    let ctaEl = null;
    const ctaContainer = card.querySelector('.marketplace-grid-post-button-link');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) {
        ctaEl = ctaLink;
      }
    }

    // Compose the text cell
    const textCellContent = [];
    if (headingEl) textCellContent.push(headingEl);
    if (descEl) textCellContent.push(descEl);
    if (ctaEl) textCellContent.push(ctaEl);

    cells.push([
      imageEl || '',
      textCellContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
