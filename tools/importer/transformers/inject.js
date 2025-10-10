(() => {
  const wrapperParent = document.querySelector('.wpb-wrapper');
if (wrapperParent) {
  const cardRows = wrapperParent.querySelectorAll(':scope > div:not(:first-child):not(.vc_empty_space)');
  if (cardRows.length) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('blu-det-container');
    wrapperParent.insertBefore(wrapper, cardRows[0]);
    cardRows.forEach(div => wrapper.appendChild(div));
  }
}
})();
