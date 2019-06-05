const HtmlWebpackPlugin = require('html-webpack-plugin');
require('babel-polyfill')
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path')
const WebpackAssetsManifest = require('webpack-assets-manifest');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const webpack = require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const publicPath = '/'
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = publicPath.slice(0, -1);
const cssFilename = 'static/css/[name].[contenthash:8].css';

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
//const publicUrl = publicPath.slice(0, -1);

const shouldUseRelativeAssetPaths = publicPath === './';
const extractTextPluginOptions = Object.assign(
  // Making sure that the publicPath goes back to to build folder.
  shouldUseRelativeAssetPaths ?
      { publicPath: Array(cssFilename.split('/').length).join('../') } :
      {},
  {
    fallback: {
      loader: require.resolve('style-loader'),
      options: {
        hmr: false,
      },
    },
    use: [
      {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: 1,
          minimize: true,
          sourceMap: shouldUseSourceMap,
        },
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          // Necessary for external CSS imports to work
          // https://github.com/facebookincubator/create-react-app/issues/2677
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            autoprefixer({
              browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
              ],
              flexbox: 'no-2009',
            }),
          ],
        },
      },
    ],
  }
);

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'all.js',
    publicPath: "https://cafe-society.news/"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  plugins: [
  // Makes some environment variables available in index.html.
  // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
  // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
  // In production, it will be an empty string unless you specify "homepage"
  // in `package.json`, in which case it will be the pathname of that URL.
  // new InterpolateHtmlPlugin(HtmlWebpackPlugin),
  // Generates an `index.html` file with the <script> injected.
  new HtmlWebpackPlugin({
    inject: true,
    template: 'src/index.html',
  }),
  // Makes some environment variables available to the JS code, for example:
  // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
  // It is absolutely essential that NODE_ENV was set to production here.
  // Otherwise React will be compiled in the very slow development mode.
  new webpack.DefinePlugin("production"),
  // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
  new MiniCssExtractPlugin({
    filename: cssFilename
  }),
  // Generate a manifest file which contains a mapping of all asset filenames
  // to their corresponding output file so that tools can pick it up without
  // having to parse `index.html`.
  new ManifestPlugin({
    fileName: 'asset-manifest.json',
  }),
  // Generate a service worker script that will precache, and keep up to date,
  // the HTML & assets that are part of the Webpack build.
  new SWPrecacheWebpackPlugin({
    // By default, a cache-busting query parameter is appended to requests
    // used to populate the caches, to ensure the responses are fresh.
    // If a URL is already hashed by Webpack, then there is no concern
    // about it being stale, and the cache-busting can be skipped.
    dontCacheBustUrlsMatching: /\.\w{8}\./,
    filename: 'service-worker.js',
    logger(message) {
      if (message.indexOf('Total precache size is') === 0) {
        // This message occurs for every build and is a bit too noisy.
        return;
      }
      if (message.indexOf('Skipping static resource') === 0) {
        // This message obscures real errors so we ignore it.
        // https://github.com/facebookincubator/create-react-app/issues/2612
        return;
      }
      console.log(message);
    },
    minify: false,
    // For unknown URLs, fallback to the index page
    navigateFallback: publicUrl + '/index.html',
    // Ignores URLs starting from /__ (useful for Firebase):
    // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
    navigateFallbackWhitelist: [/^(?!\/__).*/],
    // Don't precache sourcemaps (they're large) and build asset manifest:
    staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
  }),
  // Moment.js is an extremely popular library that bundles large locale files
  // by default due to how Webpack interprets its code. This is a practical
  // solution that requires the user to opt into importing specific locales.
  // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
  // You can remove this if you don't use Moment.js:
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
],

      // {
      //   // "oneOf" will traverse all following loaders until one will
      //   // match the requirements. When no loader matches it will fall
      //   // back to the "file" loader at the end of the loader list.
      //   oneOf: [
      //     // "url" loader works just like "file" loader but it also embeds
      //     // assets smaller than specified size as data URLs to avoid requests.
      //     {
      //       test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      //       loader: require.resolve('url-loader'),
      //       options: {
      //         limit: 10000,
      //         name: 'static/media/[name].[hash:8].[ext]',
      //       },
      //     },
      //     // Process JS with Babel.
      //     {
      //       test: /\.(js|jsx|mjs)$/,
      //       include:  [
      //         'src',
      //         ...[
      //           'bitcoinjs-lib',
      //           'tiny-secp256k1',
      //           'base64url/dist/base64url',
      //           'base64url/dist/pad-string',
      //           'bip32',
      //           'typeforce',
      //           'base-x'
      //         ].map(moduleName => `node_modules/${ moduleName }`)
      //       ],
      //       loader: require.resolve('babel-loader'),
      //       options: {
      //
      //         compact: true,
      //       },
      //     },
      //     // The notation here is somewhat confusing.
      //     // "postcss" loader applies autoprefixer to our CSS.
      //     // "css" loader resolves paths in CSS and adds assets as dependencies.
      //     // "style" loader normally turns CSS into JS modules injecting <style>,
      //     // but unlike in development configuration, we do something different.
      //     // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
      //     // (second argument), then grabs the result CSS and puts it into a
      //     // separate file in our build process. This way we actually ship
      //     // a single CSS file in production instead of JS code injecting <style>
      //     // tags. If you use code splitting, however, any async bundles will still
      //     // use the "style" loader inside the async code so CSS from them won't be
      //     // in the main CSS file.
      //     {
      //       test: /\.css$/,
      //       use: [
      //         {
      //           loader: MiniCssExtractPlugin.loader,
      //           options: extractTextPluginOptions
      //         },
      //         'css-loader'
      //       ],
      //       // Note: this won't work without `new MiniCssExtractPlugin()` in `plugins`.
      //     },
      //     // "file" loader makes sure assets end up in the `build` folder.
      //     // When you `import` an asset, you get its filename.
      //     // This loader doesn't use a "test" so it will catch all modules
      //     // that fall through the other loaders.
      //     {
      //       loader: require.resolve('file-loader'),
      //       // Exclude `js` files to keep "css" loader working as it injects
      //       // it's runtime that would otherwise processed through "file" loader.
      //       // Also exclude `html` and `json` extensions so they get processed
      //       // by webpacks internal loaders.
      //       exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
      //       options: {
      //         name: 'static/media/[name].[hash:8].[ext]',
      //       },
      //     },
      //     // ** STOP ** Are you adding a new loader?
      //     // Make sure to add the new loader(s) before the "file" loader.
      //   ],
      // },
    //],
}
