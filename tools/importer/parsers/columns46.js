/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns46)'];

  // Defensive: Get the inner row (the actual columns)
  // The structure is: top-level .vc_row > .wpb_column (full width) > .vc_column-inner > .wpb_wrapper > .vc_row (inner) > .wpb_column (column1), .wpb_column (column2)
  const innerRow = element.querySelector('.vc_inner.vc_row-fluid');
  if (!innerRow) return;

  // Get immediate columns inside the inner row
  const columns = Array.from(innerRow.querySelectorAll(':scope > .wpb_column'));
  if (columns.length < 2) return; // Expecting at least two columns

  // Column 1: Text content
  let col1Content = [];
  {
    const col1 = columns[0];
    const wrapper = col1.querySelector('.wpb_wrapper');
    if (wrapper) {
      // Collect all text elements (paragraphs, lists, etc.)
      Array.from(wrapper.children).forEach((child) => {
        // Only include paragraphs and lists (ignore empty space divs)
        if (
          child.matches('div.wpb_text_column, div.wpb_content_element') ||
          child.matches('p, ul, ol')
        ) {
          // If it's a text column wrapper, get its children
          const inner = child.querySelector('.wpb_wrapper');
          if (inner) {
            Array.from(inner.children).forEach((el) => {
              if (el.textContent.trim() !== '' || el.tagName === 'UL' || el.tagName === 'OL') {
                col1Content.push(el);
              }
            });
          } else {
            if (child.textContent.trim() !== '' || child.tagName === 'UL' || child.tagName === 'OL') {
              col1Content.push(child);
            }
          }
        }
      });
      // Defensive: if nothing found, fallback to all children
      if (!col1Content.length) {
        col1Content = Array.from(wrapper.children);
      }
    } else {
      col1Content = [col1];
    }
  }

  // Column 2: Image content
  let col2Content = [];
  {
    const col2 = columns[1];
    const wrapper = col2.querySelector('.wpb_wrapper');
    if (wrapper) {
      // Find the image element
      const img = wrapper.querySelector('img');
      if (img) {
        col2Content = [img];
      } else {
        // Fallback: use all children
        col2Content = Array.from(wrapper.children);
      }
    } else {
      col2Content = [col2];
    }
  }

  // Build the table rows
  const rows = [
    headerRow,
    [col1Content, col2Content]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
