/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards54) block: 2 columns, each row is a card with image and text
  const headerRow = ['Cards (cards54)'];

  // Find all card columns (skip empty columns)
  const columns = Array.from(element.querySelectorAll('.wpb_column.vc_column_container'));
  // Only keep columns that contain card content (image and text)
  const cardColumns = columns.filter(col => col.querySelector('.wpb_single_image'));

  const rows = cardColumns.map(col => {
    // Image: find the image inside the card
    const img = col.querySelector('.wpb_single_image .vc_single_image-wrapper img');
    let imageEl = img ? img : null;

    // Text: extract name (bold) and description (titles) as plain text
    const textColumns = col.querySelectorAll('.wpb_text_column');
    let name = '';
    let titles = [];
    if (textColumns.length > 0) {
      // Name
      const strongEl = textColumns[0].querySelector('strong');
      if (strongEl) {
        name = strongEl.textContent.trim();
      } else {
        // fallback: get text from first text column
        name = textColumns[0].textContent.trim();
      }
    }
    if (textColumns.length > 1) {
      // Titles (could be separated by <br> or in <a> tags)
      const descP = textColumns[1].querySelector('p');
      if (descP) {
        // Get all text nodes and <a> text, split by <br>
        descP.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            const parts = node.textContent.split(/\n|<br\s*\/?>(?![^<]*<)/gi);
            parts.forEach(part => {
              if (part.trim()) titles.push(part.trim());
            });
          } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
            if (node.textContent.trim()) titles.push(node.textContent.trim());
          } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
            // skip
          }
        });
      } else {
        // fallback: get text from second text column
        if (textColumns[1].textContent.trim()) {
          titles.push(textColumns[1].textContent.trim());
        }
      }
    }
    // Defensive: If no name and no titles, fallback to all text columns
    if (!name && titles.length === 0 && textColumns.length > 0) {
      name = textColumns[0].textContent.trim();
      if (textColumns.length > 1) {
        titles.push(textColumns[1].textContent.trim());
      }
    }

    // Compose the text cell as a div: name as heading, titles as paragraphs
    const textCell = document.createElement('div');
    if (name) {
      const heading = document.createElement('strong');
      heading.textContent = name;
      textCell.appendChild(heading);
    }
    titles.forEach(title => {
      const p = document.createElement('p');
      p.textContent = title;
      textCell.appendChild(p);
    });

    return [imageEl, textCell];
  });

  // Compose table
  const cells = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
