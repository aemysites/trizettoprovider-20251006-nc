/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero row: first .vc_row with an <img> inside
  let heroRow = null;
  const rows = element.querySelectorAll('.vc_row');
  for (const row of rows) {
    if (row.querySelector('img')) {
      heroRow = row;
      break;
    }
  }
  if (!heroRow) return;

  // --- IMAGE EXTRACTION ---
  const heroImg = heroRow.querySelector('img');
  const imageCell = [heroImg ? heroImg : ''];

  // --- TEXTUAL CONTENT EXTRACTION ---
  // Find the text block (usually .wpb_text_column .wpb_wrapper inside heroRow)
  let heroTextBlock = null;
  const textCol = heroRow.querySelector('.wpb_text_column .wpb_wrapper');
  if (textCol) {
    const frag = document.createDocumentFragment();
    // Date (optional)
    const date = textCol.querySelector('.tps-post-date');
    if (date) frag.appendChild(date.cloneNode(true));
    // Horizontal rule (optional)
    const hr = textCol.querySelector('hr');
    if (hr) frag.appendChild(hr.cloneNode(true));
    // Main heading (h1 > .tps-post-title)
    const h1 = textCol.querySelector('h1 .tps-post-title');
    if (h1) {
      const h1el = document.createElement('h1');
      h1el.innerHTML = h1.innerHTML;
      frag.appendChild(h1el);
    }
    // Subheading (author)
    const author = textCol.querySelector('.tps-post-author');
    if (author) {
      const subheading = document.createElement('div');
      subheading.style.fontStyle = 'italic';
      subheading.appendChild(author.cloneNode(true));
      frag.appendChild(subheading);
    }
    // Excerpt/description
    const excerpt = textCol.querySelector('.tps-post-excerpt');
    if (excerpt) {
      const excerptDiv = document.createElement('div');
      excerptDiv.appendChild(excerpt.cloneNode(true));
      frag.appendChild(excerptDiv);
    }
    heroTextBlock = frag;
  }

  // Compose the table rows: only hero block content, single column per row
  const headerRow = ['Hero (hero30)'];
  const cells = [headerRow, imageCell, [heroTextBlock ? heroTextBlock : '']];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
