# find-unused-css-classes

Tool for finding CSS classes which are referenced by selectors in a set of CSS
files but not used.

## Usage

```
npm install -g find-unused-css-classes
find-unused-css-classes used-class-list.txt app.css
```

Where `used-class-list.txt` is a new-line separated list of classes that are
known to be used in your site or application. This tool does not help you
generate that. If you have a set of HTML files or templates you can use [used-css-classes](https://github.com/robertknight/used-css-classes).
