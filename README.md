# Destatic
The dynamically static web

## How do I use it?
Dead simple, just fork [the repo](https://github.com/Ugotsta/destatic) and edit the Markdown files as you need.

## How to I add pages?
Create new Markdown files and access them using the 'content=_yourfile_' url parameter.

You can also put Markdown files in the /pages/ folder and then access them through bare url slugs like so: _ugotsta.github.io/destatic/character_.

## Templates
Links to Markdown files in the /templates/ folder are parsed as includes with an ID based on the name so they can easily be targeted with CSS.

Further, inline JavaScript is evaluated. For example:

```js
var weird = 'weird.';
return 'This is ' + weird;
```

## Static pages are faster!
Yes, they are. The goal of this project is to provide a dynamic starting point that can be compiled to static pages. In other words, you create a site by just forking this repo and making changes to this README.md file. Once you're happy with the results, you can compile it, if you want.

The build process isn't implemented at this time but that's the goal.
