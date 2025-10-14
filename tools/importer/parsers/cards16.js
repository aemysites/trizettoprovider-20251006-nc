/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards16) block: 2 columns, each row is a card
  // Header row must be exactly ['Cards (cards16)']
  const headerRow = ['Cards (cards16)'];

  // Card content container
  const cardContent = element.querySelector('.mpc-cubebox-side__content');

  // --- Image/Icon extraction ---
  // Per block spec, only use actual <img> or <svg> as image/icon. If none, leave cell empty.
  let imageCell = '';
  const img = cardContent && cardContent.querySelector('img');
  if (img) {
    imageCell = img;
  } else {
    const svgIcon = cardContent && cardContent.querySelector('svg');
    if (svgIcon) {
      imageCell = svgIcon;
    }
  }

  // Text content (title/description)
  let textContent = null;
  if (cardContent) {
    const textColumn = cardContent.querySelector('.wpb_text_column .wpb_wrapper');
    if (textColumn) {
      textContent = textColumn;
    }
  }

  // CTA extraction (the button link)
  let cta = null;
  if (cardContent) {
    const ctaLink = cardContent.querySelector('a.mpc-button');
    if (ctaLink) {
      cta = ctaLink;
    }
  }

  // Compose the card's text cell
  const textCell = [];
  if (textContent) textCell.push(textContent);
  if (cta) textCell.push(cta);

  // Two columns: first is image/icon (or empty), second is text content
  const cardRow = [imageCell, textCell];

  // Table cells
  const cells = [headerRow, cardRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
