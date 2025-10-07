/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns container
  const columnsWrapper = element.querySelector('.footer-widgets-wrapper');
  if (!columnsWrapper) return;

  // Get all column elements (should be 3)
  const columns = columnsWrapper.querySelectorAll(':scope > .footer-widgets');
  if (columns.length < 3) return;

  // Prepare the header row
  const headerRow = ['Columns block (columns48)'];
  const cells = [headerRow];

  // Helper to extract all content from a column, avoiding duplicate social links and icons
  function extractColumnContent(col) {
    const frag = document.createDocumentFragment();
    const seenSocialLinks = new Set();
    Array.from(col.children).forEach(widget => {
      // Headings and lists
      widget.querySelectorAll('h2, h6, p, ul').forEach(el => {
        frag.appendChild(el.cloneNode(true));
      });
      // Links directly under widget-content or custom-html-widget
      widget.querySelectorAll('.widget-content > a, .custom-html-widget > a').forEach(a => {
        frag.appendChild(a.cloneNode(true));
      });
      // Links inside login-dropdown-content
      widget.querySelectorAll('.login-dropdown-content a').forEach(a => {
        frag.appendChild(a.cloneNode(true));
      });
      // Login button if present
      const loginBtn = widget.querySelector('.login-droptext');
      if (loginBtn) frag.appendChild(loginBtn.cloneNode(true));
      // Social icons (images inside links) - avoid duplicates
      widget.querySelectorAll('a > img').forEach(img => {
        const parentA = img.closest('a');
        if (parentA) {
          const href = parentA.getAttribute('href');
          // Only add if not already seen and only in column-three
          if (col.classList.contains('column-three') && !seenSocialLinks.has(href)) {
            frag.appendChild(parentA.cloneNode(true));
            seenSocialLinks.add(href);
          }
        }
      });
    });
    return frag;
  }

  // Build the content row for the columns
  const contentRow = Array.from(columns).map(extractColumnContent);
  cells.push(contentRow);

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
