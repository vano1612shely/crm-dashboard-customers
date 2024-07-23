const path = require("path");
const PugPlugin = require("pug-plugin");

// load constants from .env file
require("dotenv").config();

module.exports = (env, argv) => {
  const isDocs = env.docs === "true";
  const isDev = argv.mode === "development";

  const config = {
    mode: isDev ? "development" : "production",
    devtool: isDev ? "inline-source-map" : "source-map",

    output: {
      path: path.join(__dirname, "dist"),
      clean: true,
    },

    resolve: {
      alias: {
        // aliases used in sources
        "@views": path.join(__dirname, "src/views/"),
        "@images": path.join(__dirname, "src/assets/images/"),
        "@fonts": path.join(__dirname, "src/assets/fonts/"),
        "@styles": path.join(__dirname, "src/assets/styles/"),
        "@scripts": path.join(__dirname, "src/assets/scripts/"),
      },
      modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
    },

    plugins: [
      new PugPlugin({
        entry: "src/views/pages/",
        filename: ({ chunk }) => {
          console.log(chunk);
          let [name] = chunk.name.replaceAll("\\", "/").split("/");
          if (name === "home") name = "index";
          return `${name}.html`;
        },

        js: {
          // JS output filename, used if `inline` option is false (defaults)
          filename: "js/[name].[contenthash:8].js",
          //inline: true, // inlines JS into HTML
        },
        css: {
          // CSS output filename, used if `inline` option is false (defaults)
          filename: "css/[name].[contenthash:8].css",
          //inline: true, // inlines CSS into HTML
        },
      }),
    ],

    module: {
      rules: [
        // styles
        {
          test: /\.(css|sass|scss)$/,
          use: ["css-loader", "sass-loader"],
        },

        // images
        {
          test: /\.(png|jpe?g|webp|ico)$/i,
          oneOf: [
            {
              resourceQuery: /inline/,
              type: "asset/inline",
            },
            {
              type: "asset",
              parser: {
                dataUrlCondition: {
                  maxSize: 2048,
                },
              },
              generator: {
                filename: "images/[name].[hash:8][ext]",
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          type: "asset/resource",
          generator: {
            filename: "images/[name].[hash:8][ext]",
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        // fonts
        {
          test: /\.(woff(2)?|ttf|otf|eot|svg)$/,
          type: "asset/resource",
          include: /assets\/fonts|node_modules/, // fonts from `assets/fonts` or `node_modules` directory only
          generator: {
            // generates filename including last directory name to group fonts by name
            filename: (pathData) =>
              `fonts/${path.basename(
                path.dirname(pathData.filename),
              )}/[name][ext][query]`,
          },
        },
      ],
    },

    performance: {
      hints: isDev ? "warning" : "error",
      maxEntrypointSize: (isDev ? 15000 : 5000) * 1024,
      maxAssetSize: (isDev ? 10000 : 5000) * 1024,
    },

    stats: {
      colors: true,
      preset: isDev ? "minimal" : "errors-only",
      loggingDebug: isDev ? ["sass-loader"] : [],
    },
  };

  if (isDev) {
    config.devServer = {
      static: path.join(process.cwd(), "./dist"),
      watchFiles: {
        paths: ["src/**/*.*", "README.md"],
        options: {
          usePolling: true,
        },
      },
      open: true,
      compress: true,
      historyApiFallback: {
        rewrites: [
          { from: /^\/$/, to: "/index.html" },
          { from: /./, to: "/404.html" },
        ],
      },
    };

    config.watchOptions = {
      //aggregateTimeout: 1000,
      ignored: ["**/node_modules"],
    };
  }

  if (isDocs) {
    // generate docs for github.io
    config.output.path = path.join(__dirname, "docs");
  }

  return config;
};
