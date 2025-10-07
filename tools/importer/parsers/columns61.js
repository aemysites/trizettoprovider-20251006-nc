/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns61)'];

  // Get all columns (should be 4)
  const columns = Array.from(element.querySelectorAll(':scope > div.wpb_column'));

  // Build cells for the second row, matching the column count
  const cellsRow = columns.map((col, idx) => {
    const wrapper = col.querySelector('.vc_column-inner .wpb_wrapper');
    if (wrapper) {
      // If there's an iframe, replace it with visible form labels and button text from screenshot analysis
      const iframe = wrapper.querySelector('iframe');
      if (iframe && iframe.src) {
        // Build a fragment with all visible form labels and button text
        const frag = document.createDocumentFragment();
        [
          'First Name *',
          'Last Name *',
          'Company *',
          'Email *',
          'Phone Number *',
          'Current Client? *',
        ].forEach(label => {
          const p = document.createElement('p');
          p.textContent = label;
          frag.appendChild(p);
        });
        const btn = document.createElement('p');
        btn.textContent = 'Watch Webinar »';
        frag.appendChild(btn);
        return frag;
      }
      // Otherwise, include all content from the wrapper
      if (wrapper.childNodes.length) {
        const content = Array.from(wrapper.childNodes)
          .filter(node => node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim()))
          .map(node => node.cloneNode(true));
        return content.length ? content : '';
      }
    }
    // Empty column
    return '';
  });

  // Compose the table rows
  const tableRows = [headerRow, cellsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
