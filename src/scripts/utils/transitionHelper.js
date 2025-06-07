const renderWithTransition = (targetElement, newContentHTML) => {
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      targetElement.innerHTML = newContentHTML;
    });
  } else {
    targetElement.innerHTML = newContentHTML;
  }
};

export default renderWithTransition;
