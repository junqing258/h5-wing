module.exports = class WingPlugin {
  apply(compiler) {
    compiler.plugin('compilation', (compilation, params) => {
      console.log('[WingPlugin]', params);
    });

    compiler.plugin('compilation', (compilation, data) => {
      data.normalModuleFactory.plugin('parser', (parser, options) => {
        // debugger;
      });
    });
  }
};
