/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: always the block name
  const headerRow = ['Hero (hero59)'];

  // 2. Second row: Background image (optional)
  // This hero does not have a background image in the HTML or screenshot, so leave cell empty
  const bgImageRow = [''];

  // 3. Third row: Title, subheading, CTA
  // Find the main text (subheading/description)
  let textContent = null;
  const textDiv = element.querySelector('.wpb_text_column .wpb_wrapper');
  if (textDiv) {
    textContent = textDiv;
  }

  // Find the CTA button (anchor)
  let cta = null;
  // The button is inside a .mpc-button anchor
  cta = element.querySelector('a.mpc-button');

  // Compose the content cell for row 3
  // There is no main heading, only a subheading/description and a CTA
  const contentRow = [
    [
      textContent,
      cta
    ].filter(Boolean) // Only include non-null elements
  ];

  // Build the table
  const cells = [
    headerRow,
    bgImageRow,
    contentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
