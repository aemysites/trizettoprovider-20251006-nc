/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Only process if there are at least 2 columns (left, center, right)
  if (columns.length < 2) return;

  // --- LEFT COLUMN ---
  // Find the image in the left column (first column)
  let leftContent = null;
  const leftWrapper = columns[0].querySelector('.wpb_wrapper');
  if (leftWrapper) {
    // Look for image inside figure > a > img
    const img = leftWrapper.querySelector('img');
    if (img) leftContent = img;
  }

  // --- CENTER COLUMN ---
  // Center column contains heading, paragraph, and button
  let centerContent = [];
  const centerWrapper = columns[1].querySelector('.wpb_wrapper');
  if (centerWrapper) {
    // Heading
    const heading = centerWrapper.querySelector('h4');
    if (heading) centerContent.push(heading);
    // Subheading/paragraph
    const paragraph = centerWrapper.querySelector('p');
    if (paragraph) centerContent.push(paragraph);
    // Button (anchor)
    const button = centerWrapper.querySelector('a');
    if (button) centerContent.push(button);
  }

  // --- RIGHT COLUMN ---
  // The right column is mostly empty or decorative, but let's check for any image
  let rightContent = '';
  const rightWrapper = columns[2]?.querySelector('.wpb_wrapper');
  if (rightWrapper) {
    const img = rightWrapper.querySelector('img');
    if (img) rightContent = img;
  }
  // If no image, leave cell empty (empty string)

  // Build the table rows
  const headerRow = ['Columns block (columns43)'];
  const contentRow = [leftContent, centerContent, rightContent];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace original element with the new block table
  element.replaceWith(table);
}
