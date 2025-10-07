/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion items
  const ul = element.querySelector('.mpc-accordion__content');
  if (!ul) return;
  const items = ul.querySelectorAll(':scope > .mpc-accordion__item');
  if (!items.length) return;

  // Table header row (must be single column)
  const headerRow = ['Accordion (accordion44)'];
  const rows = [headerRow];

  // For each accordion item, extract title and content
  items.forEach((item) => {
    // Title cell: find h3 inside heading
    const heading = item.querySelector('.mpc-accordion-item__heading');
    let titleEl = heading && heading.querySelector('h3');
    let titleCell = titleEl ? titleEl.textContent.trim() : (heading ? heading.textContent.trim() : '');

    // Content cell: preserve all HTML structure inside the content wrapper
    const content = item.querySelector('.mpc-accordion-item__content');
    let contentCell = '';
    if (content) {
      // Instead of flattening, clone and preserve all children
      const wrapper = document.createElement('div');
      Array.from(content.children).forEach(child => {
        wrapper.appendChild(child.cloneNode(true));
      });
      contentCell = wrapper;
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
