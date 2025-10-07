/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards13) block: extract video as a card

  const headerRow = ['Cards (cards13)'];

  // Find the iframe (video embed)
  const iframe = element.querySelector('iframe');
  let cardImage = '';
  if (iframe && iframe.src) {
    // Create a link to the video
    const a = document.createElement('a');
    a.href = iframe.src;
    a.textContent = iframe.src;
    cardImage = a;
  }

  // Extract all text content from the element except inside iframes, scripts, or styles
  let cardText = '';
  // Get all text nodes that are not inside iframes, scripts, or styles
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: function(node) {
      let parent = node.parentNode;
      while (parent) {
        if (parent.tagName === 'IFRAME' || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
          return NodeFilter.FILTER_REJECT;
        }
        parent = parent.parentNode;
      }
      if (node.textContent.trim()) return NodeFilter.FILTER_ACCEPT;
      return NodeFilter.FILTER_SKIP;
    }
  });
  const textParts = [];
  let n;
  while ((n = walker.nextNode())) {
    textParts.push(n.textContent.trim());
  }
  cardText = textParts.filter(Boolean).join(' ');

  // Always create a card row, even if cardText is empty
  const cardRow = [cardImage || '', cardText];
  const cells = [headerRow, cardRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
