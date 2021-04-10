const { hash } = require('.');

(async () => {
  const t = await hash('./test/files/castle2.png', 8, "hex");
  console.log(t);
})();
