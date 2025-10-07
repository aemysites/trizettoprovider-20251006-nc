/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: Block name
  const headerRow = ['Hero (hero11)'];

  // 2. Background image row: None in this example
  const bgImageRow = [''];

  // 3. Content row: Extract CTA link (centered banner)
  // Find the main column (centered) - usually col-sm-8
  const columns = element.querySelectorAll(':scope > div');
  let ctaContent = '';
  for (const col of columns) {
    if (col.classList.contains('vc_col-sm-8')) {
      // Look for the CTA link inside this column
      const link = col.querySelector('a');
      if (link) {
        ctaContent = link;
      } else {
        // If no link, use the text content
        const wrapper = col.querySelector('.wpb_wrapper');
        if (wrapper && wrapper.textContent.trim()) {
          ctaContent = document.createTextNode(wrapper.textContent.trim());
        }
      }
      break;
    }
  }
  // Defensive fallback: if nothing found, use empty string
  if (!ctaContent) ctaContent = '';

  const contentRow = [ctaContent];

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImageRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
