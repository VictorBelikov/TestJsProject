lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: true, // set loading="lazy" into the <img />
};

// ============================================================================

// if ('loading' in HTMLImageElement.prototype) {
//   const images = document.querySelectorAll('img.lazyload');
//   images.forEach((img) => {
//     img.src = img.dataset.src;
//   });
// } else {
//   // Dynamically import the LazySizes library
//   let script = document.createElement('script');
//   script.async = true;
//   script.src = '../libraries/lazysizes.min.js';
//   document.body.appendChild(script);
// }
