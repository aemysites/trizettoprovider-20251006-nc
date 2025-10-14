/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as specified
  const headerRow = ['Hero (CTA) (heroCTACaseStudy)'];

  // --- Row 2: Background Image ---
  // Find the first <img> inside the block, which is the decorative background
  const bgImg = element.querySelector('img');
  const row2 = [bgImg ? bgImg : ''];

  // --- Row 3: Content (subheading, headline, paragraphs, CTA) ---
  // Find all .wpb_wrapper blocks in order
  const wrappers = element.querySelectorAll('.wpb_wrapper');
  const contentCell = [];

  // Subheading (CASE STUDY, h6)
  if (wrappers[0]) {
    const subheading = wrappers[0].querySelector('h6');
    if (subheading) contentCell.push(subheading);
  }

  // Headline (h5)
  if (wrappers[1]) {
    const headline = wrappers[1].querySelector('h5');
    if (headline) contentCell.push(headline);
  }

  // Paragraphs (all <p> in third wrapper)
  if (wrappers[2]) {
    const paragraphs = wrappers[2].querySelectorAll('p');
    paragraphs.forEach(p => contentCell.push(p));
  }

  // Defensive: If paragraphs are missing from third wrapper, check all wrappers for <p>
  if (contentCell.filter(e => e.tagName === 'P').length === 0) {
    wrappers.forEach(w => {
      w.querySelectorAll('p').forEach(p => {
        if (!contentCell.includes(p)) contentCell.push(p);
      });
    });
  }

  // CTA button (the anchor with .mpc-button)
  const cta = element.querySelector('a.mpc-button');
  if (cta) contentCell.push(cta);

  const row3 = [contentCell.length ? contentCell : ''];

  // Build the table
  const cells = [headerRow, row2, row3];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
