/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content
  function extractCard(cardEl) {
    // Image: look for the first image inside the card
    const imgZone = cardEl.querySelector('.vc_gitem-zone-a');
    let img = null;
    if (imgZone) {
      // Prefer the .vc_gitem-zone-img if present, else any img
      img = imgZone.querySelector('.vc_gitem-zone-img') || imgZone.querySelector('img');
    }
    // Text content zone
    const textZone = cardEl.querySelector('.vc_gitem-zone-c');
    let textContent = document.createElement('div');
    if (textZone) {
      // Resource type
      const resourceType = textZone.querySelector('.vc_gitem-post-meta-field-resource_type');
      if (resourceType) {
        const typeDiv = document.createElement('div');
        typeDiv.appendChild(resourceType.cloneNode(true));
        textContent.appendChild(typeDiv);
      }
      // Title (as heading)
      const titleHeading = textZone.querySelector('.featured-grid-post-title');
      if (titleHeading) {
        // The anchor inside is the actual title link
        const link = titleHeading.querySelector('a');
        if (link) {
          const h3 = document.createElement('h3');
          h3.appendChild(link.cloneNode(true));
          textContent.appendChild(h3);
        }
      }
      // Description
      const desc = textZone.querySelector('.featured-grid-post-excerpt');
      if (desc) {
        // Usually a <div> containing a <p>
        const descDiv = desc.querySelector('div');
        if (descDiv) {
          textContent.appendChild(descDiv.cloneNode(true));
        }
      }
      // CTA button
      const ctaContainer = textZone.querySelector('.vc_btn3-container');
      if (ctaContainer) {
        // Only include the anchor (button)
        const cta = ctaContainer.querySelector('a');
        if (cta) {
          const ctaDiv = document.createElement('div');
          ctaDiv.appendChild(cta.cloneNode(true));
          textContent.appendChild(ctaDiv);
        }
      }
    }
    // Defensive: if no image, use null
    return [img || '', textContent];
  }

  // Find all card elements
  const cardEls = element.querySelectorAll('.vc_grid-item');

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards33)']);
  // Card rows
  cardEls.forEach(cardEl => {
    rows.push(extractCard(cardEl));
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace element with block
  element.replaceWith(block);
}
