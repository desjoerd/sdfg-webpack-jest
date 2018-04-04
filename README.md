# SDFG JS Renaissance


## Part 1: Webpack

### 1. Initial app
We start with the following files:

* `src`
    * `app.css` the awesome css for the calculator
    * `app.js` the ES2017 version of the calculator
* `.gitignore` gitignore for the workshop
* `favicon.ico` because what's life without a favicon?
* `index.html` the awesome html for the calculator
* `README.md` the file you're reading now ;)

### 2. Basic server
Let's open the files in the browser. For this we need a simple server to host our files.

Let's install `lite-server` globally which is a simple webserver with automatic reloading.

Run in the commandline
```bash
npm install --global lite-server

# or the shorthand
npm i -g lite-server
```

Now run `lite-server` in the root of the repository.
```bash
lite-server
```
It will automaticly open the browser and look for changes. The amazing calculator should work in Chrome, but if you open it in Internet explorer 11 it will break, because IE11 doesn't know shit about ES2015.

### 3. Convert back to ES5
The `csproj` of a javascript application is the `package.json`.
Let's create one:

Run in the commandline in the root of the repository to create a `package.json`.
```bash
npm init
```
Just continously press enter ;). Now you've got a basic `package.json`.

To transpile ES2018 to ES5 we will use `babel`.

We can use `babel` through the commandline interface `babel-cli` and for the configuration we can simply use a preset `babel-preset-env`.

Let's add `babel` to our project:

Run in the commandline in the root of the repository
```bash
npm install --save-dev babel-cli babel-preset-env

# or the shorthand
npm i -D babel-cli babel-preset-env
```

It will add the `babel-cli` and `babel-preset-env` dependencies to the `package.json`.

Now we need to add a script to our project file the `package.json`. Open the `package.json` and add the following to the `"scripts"`:

```json
    "scripts": {
        "build": "babel src -d lib"
    }
```

Now run this script with:
```bash
npm run build
```

`babel` will scan the `src` folder and will produce the output in the `lib` folder. But if you take a look at `lib/app.js` you will see, nothing has changed because we didn't configure babel.

Let's create a babel configuration file `.babelrc` with the following contents:
```json
{
    "presets": [
        "env"
    ]
}
```

`babel` will look for the `babel-preset-<name>` package and use that preset. Now run `npm run build` again to see the transpiled output.

Now change the `<script>` tag in the html to the transpiled output:

```html
<script src="/lib/app.js"></script>
```

### 4. Modular javascript
We can use the latest version of ECMAScript now but we also would like to have a modular application. In ECMAScript 2015 there is a new module format added to the specification, `ES modules`. 

Let's modify our app.js to use ESModules.

1. Remove the IIFE (The function which wraps the whole file)
2. Create a new file `src/operators.js`. with the following contents:
```js
// src/operators.js

// export this as add
export const add = (a, b) => a + b;

// export this as subtract
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => a / b;
```
3. remove the operators from `app.js`
4. to import the operators in `app.js` add the following to the top of the file:
```js
// src/app.js

import { add, subtract, multiply, divide } from './operators.js';

// the rest of app.js
```

#### 4.Optional
The latest browsers can use ESModules if we change the `<script>` tag type in `index.html` to `module`:
```html
<script type="module" src="/src/app.js"></script>
```

### 5. Webpack
IE11 is broken now, now we need to add `webpack` to bundle our application.
`webpack` understands ESModules and follows all the imports and exports to create one bundle. It also understands other module formats like `commonjs`.

Let's install `webpack`:
```bash
npm install --save-dev webpack webpack-cli
```

We need to update the `package.json` to call webpack during build:
```json
    "scripts": {
        "build:dev": "webpack --mode=development"
    }
```

`webpack` searches by default to the `src/index.js` file to bundle our application. So let's rename our `src/app.js` to `src/index.js`.

Now run
```bash
npm run build:dev
```

The webpack build creates a bundle called `dist/main.js`. 
Modify the `index.html` to point to the bundled javascript:
```html
<script type="text/javascript" src="/dist/main.js"></script>
```

Check the whether the app still works with `lite-server`.

Let's also add a production build, modify the `package.json`:
```json
    "scripts": {
        "build:dev": "webpack --mode=development",
        "build": "webpack --mode=production"
    }
```

Now run `build` for the production build
```bash
npm run build
```

### 6. Webpack & Babel
Webpack bundles our files now, but the app doesn't work anymore in IE11 because the javascript files aren't converted to `ES5`. To do that we need to configure `webpack` to use specific loaders for certain files. Like for ES2018 the `babel-loader`.

Let's install the `babel-loader` to load js files with `babel`.
```bash
npm install --save-dev babel-loader
```

Now we need to configure webpack. Create a `webpack.config.js` file in the root of the repository with the following contents:
```js
// webpack.config.js

// module.exports is needed for modules in Node.js, webpack runs in Node.js.
module.exports = {
  // configure the module and loaders
  module: {
    rules: [
      // for .js -> use babel-loader
      { test: /\.js$/, use: ['babel-loader'] }
    ]
  }
};
```

Now run `npm run build` or `npm run build:dev` to create a bundle which is transpiled with `babel`.
Run `lite-server` to check wheter it works in chrome and internet explorer.

### 7. CSS
We can even bundle CSS with `webpack` to create a real modular application. Let's add an `import` to `index.js` to load the CSS.

Add this import to the top of the file.
```js
// src/index.js

// add a relative path to the css file.
import "./app.css";
```

If you run `webpack` now it will break, because `webpack` doesn't know how to load a css file.

To let `webpack` handle `.css` files you will need the `css-loader` and the `style-loader`. The `css-loader` knows how to load `.css` files. We also need to inject the styles into the `html`, that's what the `style-loader` is for.

Install the `css-loader` and the `style-loader`:
```bash
npm install --save-dev css-loader style-loader
```

Let's modify the `webpack.config.js` to handle `.css` files.
```js
// webpack.config.js
//...
  module: {
    rules: [
      // for .css use first the 'css-loader' to load the file and than the 'style-loader' to inject the styles in the html.
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      
      // other rules
    ]
  }
//...
```

We also need to remove the `<link rel="stylesheet" href="/src/app.css">` from the `index.html`.

### 8. Jest

Time to add some unit tests using Jest.  

First you'll need to install it using:

```bash
npm install --save-dev jest
```
Then replace the test script in your package.json to run `jest`

So replace:

```json
    "scripts": {
      //...
        "test": "echo \"Error: no test specified\" && exit 1",
      //...
    }
```
with:
```json
    "scripts": {
      //...
        "test": "jest",
      //...
    }
```
Now you need to add your first unit test.  To do so, add a file `src/operators.test.js`. with the following contents:
```js
// src/operators.test.js

// import your functions using destructuring
// and CommonJS require
const {
  add,
  subtract,
  divide,
  multiply
} = require('./operators');

// test the add function
test('adds 1 + 2 to equal 3', () => {
  const v = add(1, 2);
  expect(v).toBe(3);
});
```

Now run `test` to run your `jest` test
```bash
npm run test
``` 
Did it pass? :P

### 9. Test Cafe

Lastly we'll do some end-to-end testing with Test Cafe.

Install it globally using
```bash
npm install -g testcafe
```
Add a test file, `src/index.e2e.js` containing the following code:
```js
import {
  Selector
} from 'testcafe'; // first import testcafe selectors

fixture `Test add` // declare the fixture
  .page `http://localhost:8080`; // specify the start page


//then create a test and place your code there
test('My first test', async t => {
  await t
    .typeText('#left', '1')
    .typeText('#right', '2')
    .click('#add')

    // Use the assertion to check if the result is equal to the expected one
    .expect(Selector('#result-value').textContent).eql('3');
});
```


Now, unless it is already running, startup lite-server
```bash
lite-server
```
Then open a new terminal using the keyboard shortcut ctrl+shift+` and run the test by using the following command:
```bash
testcafe chrome ./src/index.e2e.js
```
And you should have a test that passed.

## Extended exercise

### Mathjs

```html
<div id="expression-calculator" class="calculator">
    <div class="inputs">
        <input type="text" name="expression"            placeholder="expression">
    </div>
    <div class="operators">
        <button class="solve">solve</button>
    </div>
    <div class="result">
        <p class="result-value">...</p>
    </div>
</div>
```


## More verbose webpack.config.js

```js
// webpack.config.js

// import the node path package
const path = require('path');

module.exports = {
  // the entry point of the app
  entry: './src/index.js',

  // output config
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  // configure the module and loaders
  module: {
    rules: [
      // for .js -> use babel-loader
      { test: /\.js$/, use: ['babel-loader'] },
      // for .css use first the 'css-loader' to load the file and than the 'style-loader' to inject the styles in the html.
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    ]
  }
};
```
