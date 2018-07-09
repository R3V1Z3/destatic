```js
thispage.containerize = function(el) {
    el.innerHTML = '<div class="container">' + el.innerHTML + '</div>';
};
```

[navbar](themes/destatic/navbar.md)

```js
let el = document.querySelector('#navbar');
el.classList.add("navbar", "navbar-inverse", "navbar-fixed-top");
thispage.containerize(el);
```

[header](themes/destatic/header.md)

```js
let el = document.querySelector('#header');
el.classList.add("jumbotron");
thispage.containerize(el);
```

[content](themes/destatic/content.md)

```js
let el = document.querySelector('#content');
thispage.containerize(el);
```

-----

[footer](themes/destatic/footer.md)

```js
let el = document.querySelector('#footer');
thispage.containerize(el);
```