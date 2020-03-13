const compose = (...funcs) => (component) =>
  funcs.reduceRight((wrapped, func) => func(wrapped), component);

export default compose;
