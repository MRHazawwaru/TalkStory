export default function waitForElement(selector, timeout = 3000) {
  return new Promise((resolve, reject) => {
    const intervalTime = 50;
    let elapsedTime = 0;

    const interval = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        resolve(el);
      }
      elapsedTime += intervalTime;
      if (elapsedTime >= timeout) {
        clearInterval(interval);
        reject(new Error(`Element ${selector} not found after ${timeout}ms`));
      }
    }, intervalTime);
  });
}
