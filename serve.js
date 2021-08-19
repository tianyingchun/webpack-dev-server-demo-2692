const { Compiler, Configuration,  MultiCompiler, webpack } = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { join } =require('path');

  const createWebpack =(entry)=>{
     /**
      * @type Configuration
      */
    const webpackConfig = { 
      mode:'development',
      target: ['web', 'es2015'],
      stats: 'minimal',
      devtool: 'eval-source-map' ,
      // The base directory, an absolute path, for resolving entry points and loaders from configuration.
      // The context is an absolute string to the directory that contains the entry files.
      context: process.cwd(),
      cache: {
        // Use `filesystem` cache to improve performance for `production` build
        // Default cache directory is `node_modules/.cache`
        // type: serveMode ? 'memory' : 'filesystem',
        type: 'memory',
      },
      output: {
        pathinfo: true,
        path: join(process.cwd(), '/public'),
        publicPath: join(process.cwd(), '/public'),
        environment: {},
        publicPath: 'http://localhost:5000/public/',
        filename: '[name]/bundle.js',
        chunkFilename: '[id].[contenthash].js'
      },
      resolve: {
        mainFields: ['browser', 'module', 'main'],
        extensions: ['.ts', '.tsx', '.js', '.json', '.vue'],
      },
      name: Object.keys(entry)[0],
      entry
    };
    return webpackConfig;
  };


  const webpackConfigModule1 = createWebpack({
    ['repo/module1']: ['./src/module1/index.js']
  });

  const webpackConfigModule2 = createWebpack({
    ['repo/module2']: ['./src/module2/index.js']
  });
  
 
const startServe = ()=> {
  /**
   * @type MultiCompiler
   */
  const compilers = webpack([webpackConfigModule1, webpackConfigModule2 ]);
  const devServer = new WebpackDevServer(
    {
      hot: true,
      compress: true,
      open: false,
      port: 5000,
      open: true,
      static: {
        directory: `${join(process.cwd(), '/public')}`,
      },
      // Enable firewall or set hosts that are allowed to access the dev server.
      allowedHosts: 'all',
      client: {
        overlay: {
          errors: true,
          // don't show overlay warning message in dev page, view warning mesage in console.
          warnings: false,
        },
      },
    },
    compilers,
  );

  return new Promise((resolve, reject) => {
    devServer.startCallback((err) => {
      if (err) {
        return reject(err);
      }
      resolve(true);
    });
  });
}

startServe().then(()=> {
  console.log('serve run ok!')
}).catch(err=> {
  console.log('err', err);
})

// webpack([webpackConfigModule1, webpackConfigModule2],(err, stats) => {
//   console.log('111')
// })