/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (heroAlignCenter)'];

  // 2. Background image row (none in this case)
  const backgroundImageRow = [''];

  // 3. Content row: collect all relevant text content
  // Find the main heading (h3)
  const heading = element.querySelector('h3');

  // Find the large number/statistic (100%) and its suffix
  let statistic = null;
  let suffix = null;
  const counter = element.querySelector('.mpc-counter__counter');
  if (counter) {
    const target = counter.querySelector('.mpc-counter--target');
    if (target) {
      statistic = document.createElement('span');
      statistic.textContent = target.textContent;
      statistic.style.fontSize = '2em';
      // Find suffix
      suffix = element.querySelector('.mpc-counter__suffix');
      if (suffix) {
        statistic.textContent += suffix.textContent;
      }
    }
  }

  // Find the subheading (h3 with class mpc-counter__heading)
  const subheading = element.querySelector('h3.mpc-counter__heading');

  // Compose content cell
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (statistic) contentCell.push(statistic);
  if (subheading) contentCell.push(subheading);

  const contentRow = [contentCell];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    backgroundImageRow,
    contentRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
