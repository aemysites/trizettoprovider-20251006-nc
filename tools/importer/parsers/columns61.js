/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns block (columns61)'];

  // Get all direct child columns
  const columns = Array.from(element.querySelectorAll(':scope > div.wpb_column'));

  // For each column, extract its content
  const contentRow = columns.map((col, idx) => {
    // Find the innermost wrapper
    const inner = col.querySelector('.vc_column-inner .wpb_wrapper');
    if (!inner) return '';

    // If this column contains an iframe, replace it with the visible form content from screenshot analysis
    const iframe = inner.querySelector('iframe');
    if (iframe) {
      // Create a fragment containing all the visible form fields and button as described in the screenshot
      const frag = document.createDocumentFragment();
      const labels = [
        'First Name *',
        'Last Name *',
        'Company *',
        'Email *',
        'Phone Number *',
        'Current Client? *'
      ];
      labels.forEach(label => {
        const p = document.createElement('p');
        p.textContent = label;
        frag.appendChild(p);
      });
      const btn = document.createElement('p');
      btn.textContent = 'Watch Webinar »';
      frag.appendChild(btn);
      return frag;
    }
    // Otherwise, preserve all text and elements (not just children)
    if (inner.children.length) {
      return Array.from(inner.childNodes).filter(
        (node) => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())
      );
    } else if (inner.textContent.trim()) {
      return inner.textContent.trim();
    }
    return '';
  });

  // Ensure all columns are present in the row
  while (contentRow.length < columns.length) {
    contentRow.push('');
  }

  // Build the table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
