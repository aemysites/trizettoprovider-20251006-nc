/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row
  const headerRow = ['Columns (columns10)'];

  // Extract columns from the inner modal structure
  // There are three main columns: image, LinkedIn icon, and text info
  const modalContent = element.querySelector('.mpc-modal__content');
  let row;
  if (modalContent) {
    // Find the inner row with three columns
    const innerRow = modalContent.querySelector('.vc_row.vc_inner');
    if (innerRow) {
      const columns = innerRow.querySelectorAll('.wpb_column.vc_column_container');
      if (columns.length >= 3) {
        // Column 1: Image
        let imgCell = '';
        const img = columns[0].querySelector('img');
        if (img) {
          const imgEl = document.createElement('img');
          imgEl.src = img.src;
          imgEl.alt = img.alt || '';
          imgCell = imgEl;
        }

        // Column 2: LinkedIn icon/link
        let linkCell = '';
        const linkedinLink = columns[1].querySelector('a[href*="linkedin.com"]');
        const linkedinIcon = columns[1].querySelector('.vc_icon_element-icon');
        if (linkedinLink && linkedinIcon) {
          // Create a span with the icon and link
          const span = document.createElement('span');
          span.appendChild(linkedinIcon.cloneNode(true));
          const link = document.createElement('a');
          link.href = linkedinLink.href;
          link.target = '_blank';
          link.title = linkedinLink.title || 'LinkedIn';
          link.textContent = 'LinkedIn';
          span.appendChild(link);
          linkCell = span;
        } else if (linkedinLink) {
          const link = document.createElement('a');
          link.href = linkedinLink.href;
          link.target = '_blank';
          link.title = linkedinLink.title || 'LinkedIn';
          link.textContent = 'LinkedIn';
          linkCell = link;
        }

        // Column 3: Text info (name, title, bio)
        let infoCell = '';
        const col3 = columns[2];
        if (col3) {
          // Gather all text content
          const fragments = [];
          // Name
          const name = col3.querySelector('h4');
          if (name) fragments.push(name.cloneNode(true));
          // Title
          const title = col3.querySelector('p');
          if (title) fragments.push(title.cloneNode(true));
          // Bio paragraphs
          const bioCol = element.querySelector('.vc_col-sm-8');
          if (bioCol) {
            const bioParas = bioCol.querySelectorAll('p');
            bioParas.forEach(p => fragments.push(p.cloneNode(true)));
          }
          // Wrap in a div
          if (fragments.length) {
            const div = document.createElement('div');
            fragments.forEach(frag => div.appendChild(frag));
            infoCell = div;
          }
        }
        row = [imgCell, linkCell, infoCell];
      }
    }
  }
  // Fallback: If no content found, create three empty columns
  if (!row) {
    row = ['', '', ''];
  }

  const cells = [headerRow, row];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
