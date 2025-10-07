/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards3) block: 2 columns, each row is a card with image and text
  // Model fields: image, title, description, cta
  // <!-- image -->
  // <!-- title -->
  // <!-- description -->
  // <!-- cta -->
  const headerRow = ['Cards (cards3)'];
  const rows = [headerRow];

  // Find all columns inside the main row
  const columns = element.querySelectorAll(':scope > div');

  // Defensive: Only proceed if we have at least 2 columns (image + text)
  if (columns.length < 2) return;

  // --- IMAGE COLUMN ---
  // The first column contains the image (inside a figure > a > img)
  let imageEl = null;
  const imgCol = columns[0];
  const imgWrapper = imgCol.querySelector('.wpb_single_image');
  if (imgWrapper) {
    const img = imgWrapper.querySelector('img');
    if (img) imageEl = img;
  }

  // --- TEXT COLUMN ---
  // The second column contains heading link and description
  const textCol = columns[1];
  let cardTextEls = [];

  // Find heading (h6 with link)
  const headingWrapper = textCol.querySelector('.wpb_text_column .wpb_wrapper h6');
  if (headingWrapper) {
    cardTextEls.push(headingWrapper);
  }

  // Find description (paragraph)
  const descWrapper = textCol.querySelector('.grid-post-excerpt .wpb_wrapper p');
  if (descWrapper) {
    cardTextEls.push(descWrapper);
  }

  // Compose the card row: [image, text]
  // Add HTML comments for model fields
  const textCell = document.createElement('div');
  textCell.appendChild(document.createComment('title'));
  if (headingWrapper) textCell.appendChild(headingWrapper.cloneNode(true));
  textCell.appendChild(document.createComment('description'));
  if (descWrapper) textCell.appendChild(descWrapper.cloneNode(true));

  rows.push([
    imageEl ? imageEl : '',
    textCell
  ]);

  // Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
