
<p align="center">
<img src="https://res.cloudinary.com/mayashavin/image/upload/w_600/Screen_Shot_2019-05-27_at_11.58.32.png" />
</p>
  </p>
<h1 align="center"> Cloudinary plugin for Sketch</h1>
This Sketch plugin allows designers to fetch images from Cloudinary DAM. It also allows Uploading Artboards (or layers) *directly* to Cloudinary using an Upload preset.

The plugin was developed as part of the Cloudinary Hackathon (May 2019).

> This project is in an early stage and lacks documentation. If you're interested in contributing or using it at your company, feel free to open GitHub issues.

Roadmap
------

### 🐛Bugs (reminder - need to open as issues)
- [ ] more than 5 downloads fail
- [ ] need to present a message for  “no results” from search/public-id (404)

### *To-do’s*
- [ ] add an option to config Upload-preset for upload
- [ ] add .sketch-plugin file in "latest release" path of this document.
- [ ] add keyboard-shortcut for uploading artboard
- [ ] disable “upload” option or display an error message if nothing is selected…
- [ ] adv.options add option to choose lossy/low-res downloads (faster)
- [ ] properly write a description, and .MD file for GitHub
- [ ] add screenshots and gifs and “How-to”s 
- [ ] change “cloduinary plugin” in data to “Cloudinary” or DAM 

### 🙏 *wishlist*
* support SVG upload and download (as layers).
* support inserting video’s as images in sketch
* also use image metadata as part of "DATA" importing ()
------ 


## Installation

- [Download](../../releases/latest/download/cloudinary-plugin.sketchplugin.zip) the latest release of the plugin
- Un-zip
- Double-click on cloudinary-plugin.sketchplugin

## Development Guide

_This plugin was created using `skpm`. For a detailed explanation on how things work, checkout the [skpm Readme](https://github.com/skpm/skpm/blob/master/README.md)._

### Usage

Install the dependencies

```bash
npm install
```

Once the installation is done, you can run some commands inside the project folder:

```bash
npm run build
```

To watch for changes:

```bash
npm run watch
```

Additionally, if you wish to run the plugin every time it is built:

```bash
npm run start
```

### Custom Configuration

#### Babel

To customize Babel, you have two options:

- You may create a [`.babelrc`](https://babeljs.io/docs/usage/babelrc) file in your project's root directory. Any settings you define here will overwrite matching config-keys within skpm preset. For example, if you pass a "presets" object, it will replace & reset all Babel presets that skpm defaults to.

- If you'd like to modify or add to the existing Babel config, you must use a `webpack.skpm.config.js` file. Visit the [Webpack](#webpack) section for more info.

#### Webpack

To customize webpack create `webpack.skpm.config.js` file which exports function that will change webpack's config.

```js
/**
 * Function that mutates original webpack config.
 * Supports asynchronous changes when promise is returned.
 *
 * @param {object} config - original webpack config.
 * @param {boolean} isPluginCommand - whether the config is for a plugin command or a resource
 **/
module.exports = function(config, isPluginCommand) {
  /** you can change config here **/
}
```

### Debugging

To view the output of your `console.log`, you have a few different options:

- Use the [`sketch-dev-tools`](https://github.com/skpm/sketch-dev-tools)
- Run `skpm log` in your Terminal, with the optional `-f` argument (`skpm log -f`) which causes `skpm log` to not stop when the end of logs is reached, but rather to wait for additional data to be appended to the input

### Publishing your plugin

```bash
skpm publish <bump>
```

(where `bump` can be `patch`, `minor` or `major`)

`skpm publish` will create a new release on your GitHub repository and create an appcast file in order for Sketch users to be notified of the update.

You will need to specify a `repository` in the `package.json`:

```diff
...
+ "repository" : {
+   "type": "git",
+   "url": "git+https://github.com/ORG/NAME.git"
+  }
...
```
------

### Contributors

- Design & development [@mayashavin](https://github.com/mayashavin)
- development [@taragano](https://github.com/taragano)
- PD [@aniboaz](https://github.com/aniboaz)
