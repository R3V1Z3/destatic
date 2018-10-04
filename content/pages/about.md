## How do I use it?
Dead simple, just fork [the repo](https://github.com/Ugotsta/destatic) and edit this Markdown file and any others you wish to change.

## How do I add pages?
Create new Markdown files and access them using the 'content=_yourfile_' url parameter.

You can also put Markdown files in the /pages/ folder and then access them through bare url slugs like so: _ugotsta.github.io/destatic/character_.

## Templates
Links to Markdown files in the /templates/ folder are parsed as includes with an ID based on the name so they can easily be targeted with CSS.

Further, inline JavaScript is evaluated. For example:

```js
var weird = 'weird.';
return 'This is ' + weird;
```