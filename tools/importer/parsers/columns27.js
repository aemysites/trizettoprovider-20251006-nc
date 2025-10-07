/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children columns of the inner row
  function getColumns(rowEl) {
    return Array.from(rowEl.querySelectorAll(':scope > .wpb_column'));
  }

  // Find the inner row with columns
  const innerRow = element.querySelector('.vc_row.vc_inner');
  if (!innerRow) return;
  const columns = getColumns(innerRow);
  if (columns.length < 2) return;

  // --- LEFT COLUMN ---
  const leftCol = columns[0];
  let leftContent = [];
  const leftWrapper = leftCol.querySelector('.wpb_wrapper');
  if (leftWrapper) {
    // Logo image
    const logoImg = leftWrapper.querySelector('.wpb_single_image img');
    if (logoImg) leftContent.push(logoImg.cloneNode(true));
    // Intro text (first text column)
    const introTextCol = leftWrapper.querySelector('.wpb_text_column');
    if (introTextCol) {
      const pEls = introTextCol.querySelectorAll('p');
      pEls.forEach(p => {
        if (p.textContent.trim()) leftContent.push(p.cloneNode(true));
      });
    }
    // Subheading (next text column with 'With RevSpring Inc., you can:')
    const subheadingCol = Array.from(leftWrapper.querySelectorAll('.wpb_text_column')).find(col => col.textContent.trim().startsWith('With RevSpring Inc.'));
    if (subheadingCol && subheadingCol !== introTextCol) {
      const pEls = subheadingCol.querySelectorAll('p');
      pEls.forEach(p => {
        if (p.textContent.trim()) leftContent.push(p.cloneNode(true));
      });
    }
    // Bulleted list (icon list)
    const iconList = leftWrapper.querySelector('.mpc-icon-list');
    if (iconList) {
      const ul = document.createElement('ul');
      Array.from(iconList.querySelectorAll('.mpc-list__item')).forEach(li => {
        const txt = li.querySelector('.mpc-list__title');
        if (txt) {
          const liEl = document.createElement('li');
          liEl.textContent = txt.textContent.trim();
          ul.appendChild(liEl);
        }
      });
      if (ul.childNodes.length) leftContent.push(ul);
    }
  }

  // --- RIGHT COLUMN ---
  const rightCol = columns[1];
  let rightContent = [];
  const rightWrapper = rightCol.querySelector('.wpb_wrapper');
  if (rightWrapper) {
    // Form heading (text column with heading text)
    const formHeadingCol = Array.from(rightWrapper.querySelectorAll('.wpb_text_column')).find(col => col.textContent.trim().startsWith('Get connected to learn more'));
    if (formHeadingCol) {
      const pEls = formHeadingCol.querySelectorAll('p');
      pEls.forEach(p => {
        if (p.textContent.trim()) rightContent.push(p.cloneNode(true));
      });
    }
    // Form fields and button (from screenshot analysis)
    const formLabels = [
      'Name', 'Company', 'Email', 'Phone', 'Current EHR', 'Additional Information', "Let's Get Started"
    ];
    formLabels.forEach(label => {
      const p = document.createElement('p');
      p.textContent = label;
      rightContent.push(p);
    });
    // Form (iframe as link)
    const formIframe = rightWrapper.querySelector('iframe');
    if (formIframe && formIframe.src) {
      const a = document.createElement('a');
      a.href = formIframe.src;
      a.textContent = 'Open form';
      rightContent.push(a);
    }
    // Legal/disclaimer text (text outside text columns)
    Array.from(rightWrapper.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        rightContent.push(p);
      }
    });
    // Also check for additional text columns (sometimes disclaimer is in a text column)
    const disclaimerCol = Array.from(rightWrapper.querySelectorAll('.wpb_text_column')).find(col => col.textContent.trim().toLowerCase().includes('consent'));
    if (disclaimerCol && disclaimerCol !== formHeadingCol) {
      const pEls = disclaimerCol.querySelectorAll('p');
      pEls.forEach(p => {
        if (p.textContent.trim()) rightContent.push(p.cloneNode(true));
      });
    }
  }

  // --- TABLE STRUCTURE ---
  const headerRow = ['Columns block (columns27)'];
  const contentRow = [leftContent, rightContent];
  const cells = [headerRow, contentRow];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
