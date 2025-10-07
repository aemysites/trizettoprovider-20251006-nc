/* global WebImporter */
export default function parse(element, { document }) {
  // Find the background image (first img in the block)
  const bgImg = element.querySelector('img');

  // Find the main content column (first .vc_column_container)
  let contentColumn = element.querySelector('.vc_column_container') || element;

  // Find all text columns inside the content column
  const textBlocks = Array.from(contentColumn.querySelectorAll('.wpb_text_column'));

  // Extract heading, subheading, paragraphs, and CTA
  let heading = null, subheading = null, paragraphs = [], cta = null;

  for (const block of textBlocks) {
    const wrapper = block.querySelector('.wpb_wrapper') || block;
    // Heading (CASE STUDY)
    if (!heading && wrapper.querySelector('h6')) {
      heading = wrapper.querySelector('h6');
    }
    // Subheading (main headline)
    if (!subheading && wrapper.querySelector('h5')) {
      subheading = wrapper.querySelector('h5');
    }
    // Paragraphs
    const ps = wrapper.querySelectorAll('p');
    if (ps.length) {
      paragraphs.push(...ps);
    }
  }

  // Find CTA button (anchor with .mpc-button)
  cta = contentColumn.querySelector('a.mpc-button');

  // Compose content cell
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  if (paragraphs.length) contentCell.push(...paragraphs);
  if (cta) contentCell.push(cta);

  // Table rows
  const headerRow = ['Hero (hero55)'];
  const imageRow = [bgImg ? bgImg : ''];
  const contentRow = [contentCell];

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
