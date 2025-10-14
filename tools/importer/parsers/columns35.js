/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract only meaningful content from a column
  function extractContent(col) {
    const wrapper = col.querySelector('.vc_column-inner > .wpb_wrapper') || col;
    // Only keep paragraphs, headings, lists, links, and counters
    const blocks = Array.from(wrapper.children).filter((el) => {
      // Ignore vertical spacers and empty divs
      if (el.classList.contains('vc_empty_space')) return false;
      // Ignore wrappers that contain no visible content
      if (el.tagName === 'DIV' && el.textContent.trim() === '') return false;
      return true;
    });
    // For each block, flatten unnecessary wrappers
    return blocks.map((el) => {
      // If it's a text column, unwrap to just its content
      if (el.classList.contains('wpb_text_column')) {
        const inner = el.querySelector('.wpb_wrapper');
        if (inner) return Array.from(inner.childNodes);
      }
      // If it's a counter, keep the counter and heading
      if (el.classList.contains('mpc-counter')) {
        const wrap = el.querySelector('.mpc-counter__wrap');
        const heading = el.querySelector('.mpc-counter__heading');
        return [wrap, heading].filter(Boolean);
      }
      // If it's a divider, keep the divider
      if (el.classList.contains('mpc-divider-wrap')) {
        return el;
      }
      // If it's a list, keep the list
      if (el.querySelector('ul')) {
        return el.querySelector('ul');
      }
      // Otherwise, keep as is
      return el;
    }).flat().filter(Boolean);
  }

  // Find the inner .vc_row that contains the actual columns
  const outerColumn = element.querySelector('.vc_column_container');
  if (!outerColumn) return;
  const innerRow = outerColumn.querySelector('.vc_row');
  if (!innerRow) return;

  // Get the two columns (left: main content, right: sidebar)
  const columns = Array.from(innerRow.querySelectorAll(':scope > .wpb_column'));
  if (columns.length < 2) return;
  const leftCol = columns[0];
  const rightCol = columns[1];

  // Extract clean content for each column
  const leftContent = extractContent(leftCol);
  const rightContent = extractContent(rightCol);

  // --- Table Construction ---
  const headerRow = ['Columns (columns35)'];
  const secondRow = [leftContent, rightContent];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    secondRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
