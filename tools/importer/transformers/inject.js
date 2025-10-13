(() => {
  const wrapperParents = document.querySelectorAll('.wpb_wrapper:has(.vc_row .wpb_wrapper a[href$=".pdf"])');

  wrapperParents.forEach(wrapperParent => {
    const cardRows = wrapperParent.querySelectorAll(':scope > div:has(a[href$=".pdf"])');
  
    if (cardRows.length) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('blu-det-container');
      wrapperParent.insertBefore(wrapper, cardRows[0]);
      cardRows.forEach(div => wrapper.appendChild(div));
    }
  });

  const cookiesOverviewElement = document.getElementById('cmplz-cookies-overview');
  if (cookiesOverviewElement) {
    cookiesOverviewElement.classList.add('blu-det-container');
  }
})();
