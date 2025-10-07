/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards51) block: 2 columns, each card is a row
  const headerRow = ['Cards (cards51)'];
  const cardColumns = element.querySelectorAll('.wpb_column');
  const rows = [];

  cardColumns.forEach((col) => {
    // Image extraction
    const img = col.querySelector('img');
    // Text extraction
    let textBlock = col.querySelector('.mpc-textblock');
    if (!textBlock) textBlock = col.querySelector('p');

    let cellContent = [];
    if (textBlock) {
      // Find all links
      const links = textBlock.querySelectorAll('a');
      if (links.length === 2) {
        // First link: company name (may contain <strong> and <span>), ignore if just company
        // Second link: resource title (the actual card title and link)
        const companySpan = textBlock.querySelector('.marketplace-highlighted-resource-type');
        let company = companySpan ? companySpan.textContent.trim() : '';
        // Compose heading: bold company name + resource title link
        const heading = document.createElement('div');
        if (company) {
          const strong = document.createElement('strong');
          strong.textContent = company + ' ';
          heading.appendChild(strong);
        }
        heading.appendChild(links[1].cloneNode(true));
        cellContent = [heading];
      } else if (links.length === 1) {
        // Only one link: use it as heading (contains company and title)
        cellContent = [links[0].cloneNode(true)];
      } else {
        // fallback: just use textBlock text
        cellContent = [document.createTextNode(textBlock.textContent.trim())];
      }
    } else {
      cellContent = [''];
    }
    rows.push([img, cellContent]);
  });

  const tableData = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(blockTable);
}
