export const lazyLoad = (componentPath) => {
  return React.lazy(() => 
    import(componentPath).catch(error => {
      console.error('Component loading failed:', error);
      return { default: () => <div>Failed to load component</div> };
    })
  );
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function(...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

// Image optimization utility
export const optimizeImage = (url, width = 800, quality = 80) => {
  if (!url) return '';
  // Use ImageKit or Cloudinary for optimization
  return `${url}?tr=w-${width},q-${quality},f-webp`;
};