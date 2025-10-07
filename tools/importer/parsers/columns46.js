/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get direct child columns of the inner row
  const innerRow = element.querySelector('.vc_inner.vc_row-fluid');
  if (!innerRow) return;
  const columns = Array.from(innerRow.querySelectorAll(':scope > .wpb_column'));
  if (columns.length < 2) return;

  // Left column: text content
  const leftCol = columns[0];
  // Find the main text block (wpb_text_column)
  const textBlock = leftCol.querySelector('.wpb_text_column');
  let leftContent = null;
  if (textBlock) {
    // Use the wrapper div directly for resilience
    const wrapper = textBlock.querySelector('.wpb_wrapper');
    leftContent = wrapper ? wrapper : textBlock;
  } else {
    leftContent = leftCol;
  }

  // Right column: image content
  const rightCol = columns[1];
  // Find the image block
  const imgBlock = rightCol.querySelector('.wpb_single_image');
  let rightContent = null;
  if (imgBlock) {
    // Use the figure or the image wrapper directly
    const figure = imgBlock.querySelector('figure');
    rightContent = figure ? figure : imgBlock;
  } else {
    rightContent = rightCol;
  }

  // Table rows
  const headerRow = ['Columns block (columns46)'];
  const contentRow = [leftContent, rightContent];

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);
  element.replaceWith(table);
}
