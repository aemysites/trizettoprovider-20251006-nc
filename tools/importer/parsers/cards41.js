/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as header
  const headerRow = ['Cards (cards41)'];

  // Helper to extract card content from a card column
  function extractCard(cardCol) {
    // Find heading
    const heading = cardCol.querySelector('.wpb_text_column h3');
    // Find image (reference the actual element)
    const imgWrapper = cardCol.querySelector('.wpb_single_image .vc_single_image-wrapper img');
    // Find description (the centered paragraph)
    const desc = cardCol.querySelector('.font-midnight-blue p');
    // Find CTA link (the main button)
    const cta = cardCol.querySelector('a.mpc-button');

    // Compose text cell
    const textCell = document.createElement('div');
    if (heading) textCell.appendChild(heading);
    if (desc) textCell.appendChild(desc);
    if (cta) textCell.appendChild(cta);

    // If no content at all, use an empty cell
    if (!heading && !desc && !cta) {
      textCell.textContent = '';
    }

    // Always reference the image element, never clone or use src directly
    return [imgWrapper, textCell];
  }

  // Select all card columns (ignore hidden spacer columns)
  const cardCols = Array.from(element.querySelectorAll('.vc_col-sm-3'));
  const rows = cardCols.map(extractCard);

  // Compose final table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
