import('../dist/index.js').then(mod => {
  if (typeof module.exports === 'function') {
    module.exports = mod.default;
  }
});
