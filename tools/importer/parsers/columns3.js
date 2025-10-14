/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct column containers
  const columns = Array.from(element.querySelectorAll(':scope > div.center.wpb_column'));

  // Defensive fallback: if no columns found, use all direct children
  const colElems = columns.length ? columns : Array.from(element.children);

  // Compose each column's content
  const row = colElems.map((col) => {
    // Find the wrapper inside the column
    const wrapper = col.querySelector('.wpb_wrapper');
    if (!wrapper) return col; // fallback: use column as-is

    // Find the heading (mpc-textblock)
    const headingBlock = wrapper.querySelector('.mpc-textblock');
    let heading = null;
    if (headingBlock) {
      heading = headingBlock;
    }

    // Find image (wpb_single_image)
    const imageBlock = wrapper.querySelector('.wpb_single_image');
    let image = null;
    if (imageBlock) {
      // Use the image element directly
      const img = imageBlock.querySelector('img');
      // If image is wrapped in a link, use the link
      const imageLink = imageBlock.querySelector('a');
      if (img && imageLink) {
        image = imageLink;
      } else if (img) {
        image = img;
      }
    }

    // Find video (iframe) and convert to link
    const videoBlock = wrapper.querySelector('.wpb_video_widget');
    let videoLink = null;
    if (videoBlock) {
      const iframe = videoBlock.querySelector('iframe');
      if (iframe && iframe.src) {
        const link = document.createElement('a');
        link.href = iframe.src;
        link.textContent = 'Watch Video';
        videoLink = link;
      }
    }

    // Compose cell content: heading + image OR heading + video link
    const cellContent = [];
    if (heading) cellContent.push(heading);
    if (image) cellContent.push(image);
    if (videoLink) cellContent.push(videoLink);

    // Defensive: If nothing found, use column as-is
    return cellContent.length ? cellContent : [col];
  });

  // Table header row
  const headerRow = ['Columns (columns3)'];
  const cells = [headerRow, row];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
