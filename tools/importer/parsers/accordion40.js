/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion40)'];
  const rows = [headerRow];

  // Get all direct children
  const children = Array.from(element.children);

  // Find the main purpose/title (first .purpose)
  let purposeTitle = '';
  const purposeDiv = children.find((div) => div.classList.contains('purpose'));
  if (purposeDiv) {
    const h4 = purposeDiv.querySelector('h4');
    purposeTitle = h4 ? h4.textContent.trim() : purposeDiv.textContent.trim();
  }

  // Flexible: Collect all .name-header/.name/.retention-header/.retention/.function-header/.function blocks
  // But also collect any other visible text blocks in the element
  // We'll group by .name-header/.name pattern, but if not present, fallback to any div with text
  let i = 0;
  while (i < children.length) {
    // If this is a name-header, start a cookie block
    if (children[i].classList.contains('name-header')) {
      // Title: next sibling .name
      const nameDiv = children[i + 1] && children[i + 1].classList.contains('name') ? children[i + 1] : null;
      let titleCell = nameDiv ? nameDiv.textContent.trim() : '';
      // Content cell: purpose, expiration, function
      const contentParts = [];
      if (purposeTitle) {
        const p = document.createElement('p');
        p.textContent = purposeTitle;
        contentParts.push(p);
      }
      // Expiration
      const retentionHeaderIdx = i + 2;
      const retentionDiv = children[retentionHeaderIdx + 1] && children[retentionHeaderIdx + 1].classList.contains('retention') ? children[retentionHeaderIdx + 1] : null;
      if (retentionDiv) {
        const exp = document.createElement('p');
        exp.textContent = retentionDiv.textContent.trim() ? `Expiration: ${retentionDiv.textContent.trim()}` : 'Expiration:';
        contentParts.push(exp);
      }
      // Function
      const functionHeaderIdx = i + 4;
      const functionDiv = children[functionHeaderIdx + 1] && children[functionHeaderIdx + 1].classList.contains('function') ? children[functionHeaderIdx + 1] : null;
      if (functionDiv) {
        const func = document.createElement('p');
        func.textContent = functionDiv.textContent.trim() ? `Function: ${functionDiv.textContent.trim()}` : 'Function:';
        contentParts.push(func);
      }
      rows.push([titleCell, contentParts]);
      i = functionHeaderIdx + 2;
    } else if (children[i].classList.contains('purpose')) {
      // If it's a purpose block, skip (already handled)
      i++;
    } else {
      // For any other div with visible text, treat as a flexible accordion row
      const text = children[i].textContent.trim();
      if (text) {
        // Use heading if present, else text
        let titleCell = '';
        let contentCell = '';
        // If there's a heading inside, use it as title
        const heading = children[i].querySelector('h4, h5, h3, h2, h1');
        if (heading) {
          titleCell = heading.textContent.trim();
          // Remove heading from content
          const clone = children[i].cloneNode(true);
          const headingClone = clone.querySelector('h4, h5, h3, h2, h1');
          if (headingClone) headingClone.remove();
          contentCell = clone.textContent.trim();
        } else {
          // Otherwise, use all text as content
          contentCell = text;
        }
        // Only add if there's meaningful content
        if (titleCell || contentCell) {
          rows.push([titleCell || contentCell, contentCell ? [document.createTextNode(contentCell)] : []]);
        }
      }
      i++;
    }
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
