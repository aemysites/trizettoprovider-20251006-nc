/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion items list
  const ul = element.querySelector('.mpc-accordion__content');
  if (!ul) return;

  // Get all accordion items
  const items = Array.from(ul.querySelectorAll('.mpc-accordion__item'));

  // Table header: single cell row
  const headerRow = ['Accordion (accordion44)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Title cell: find the heading (h3)
    const headingDiv = item.querySelector('.mpc-accordion-item__heading');
    let title = headingDiv && headingDiv.querySelector('h3');
    if (!title) {
      title = document.createElement('div');
      title.textContent = headingDiv ? headingDiv.textContent.trim() : '';
    }

    // Content cell: find the content wrapper
    const contentDiv = item.querySelector('.mpc-accordion-item__content');
    let contentCell = document.createElement('div');
    if (contentDiv) {
      const wrapper = contentDiv.querySelector('.mpc-accordion-item__wrapper');
      if (wrapper) {
        // Move all children of wrapper into contentCell
        Array.from(wrapper.childNodes).forEach((node) => contentCell.appendChild(node.cloneNode(true)));
      } else {
        Array.from(contentDiv.childNodes).forEach((node) => contentCell.appendChild(node.cloneNode(true)));
      }
    }
    rows.push([title, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
