#!/usr/bin/env node

'use strict';

const fs = require('fs');

const listSelectors = require('list-selectors');

/**
 * Return a list of all CSS classes referenced in selectors
 * in `files`
 */
function definedClasses(files) {
  const selectors = new Promise(resolve => {
    listSelectors(files, {include: ['classes']}, resolve);
  });
  return selectors.then(info => {
    const classNames = info.classes
      // Remove '.' prefix from class selectors
      .map(cls => cls.replace(/^\./, ''))
      // Ignore classes with a 'js-' prefix which are assumed
      // not to be referenced in CSS files
      .filter(cls => !cls.match(/^js-/));

    return new Set(classNames);
  });
}

if (process.argv.length < 4) {
  console.error(
`Usage: find-unused-css-classes <Used CSS class file> <CSS file patterns...>

Takes a new-line separated list of used CSS classes and a set of CSS
file paths and prints the list of CSS class names which are referenced
in selectors in <CSS file patterns> but do not appear in <Used CSS class file>.

<Used CSS class file> - A new-line separated list of CSS classes which are
                        known to be used.

<CSS file patterns>   - A file path or glob for a CSS file.
`);
  process.exit(1);
)

const [usedClassFile, ...cssFilePatterns] = process.argv.slice(2);

const usedClassList = fs.readFileSync(usedClassFile).toString().split('\n');
const usedClassSet = new Set(usedClassList);
const selectors = cssFilePatterns.map(definedClasses);

Promise.all(selectors).then(classSets => {
  const classes = new Set();
  classSets.forEach(xs => xs.forEach(cls => classes.add(cls)));

  const unusedClasses = new Set(classes);
  usedClassList.forEach(cls => unusedClasses.delete(cls));

  unusedClasses.forEach(cls => console.log(cls));
}).catch(err => {
  console.error(err);
});
