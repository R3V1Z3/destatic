/**
 * Destatic Markdown driven dynamic content
 * @param {string} el HTML element
 * @param {object} options options object
 * @returns {object} a new GitDown object
 */
class Destatic {
    
    constructor( el, options ) {
        const destatic = this;
        this.options = options;
        this.wrapper = el;
        this.theme = options['theme'];
        if ( this.theme === null ) this.theme = 'destatic';
        if ( this.theme === '' ) this.theme = 'destatic';
        this.css = 'themes/' + this.theme + `/css/style.css`;
        this.md = 'themes/' + this.theme + `/index.md`;
        this.callback = options['callback'];
        this.entry();
    }

    site_name() {
        return this.options['title'];
    }

    entry() {
        // check if user provided a content url parameter
        let params = (new URL(location)).searchParams;
        // TODO: need error handler here to handle user providing content param that doesn't exist
        // load theme styling
        // get content through promise
        this.get(this.css)
            .then(data => this.append_style('style', 'theme', data))
            .catch(reason => console.log(reason.message));
        // get content through promise
        this.get(this.md)
            .then(data => this.initial_content(data))
            .catch(reason => console.log(reason.message));
    }

    async get (file) {
        // await response of fetch call
        let response = await fetch(file);
        // only proceed once promise is resolved
        return await response.text();
    }

    /**
     * Add style to head either inline or external stylesheet
     * @param {string} type link or style
     * @param {string} id so we can alter href later
     * @param {string} content either href or actual style content
     */
    append_style( type, id, content ){
        if ( type === 'link' ){
            let s  = document.createElement(type);
            s.type = 'text/css';
            if ( id !== null ) s.id = id;
            s.rel  = 'stylesheet';
            s.href = content;
            document.head.appendChild(s);
        } else if ( type === 'style' ) {
            const div = document.createElement("div");
            div.innerHTML = `<style id="${id}">${content}</style>`;
            document.head.appendChild(div);
        }
    }

    initial_content(data) {
        // render the markdown
        this.render( data, this.wrapper );

        let urls = [];
        // now we'll get all links to /themes/ folder with .md extension
        let links = document.querySelectorAll('a');
        links.forEach( el=> {
            let url = el.href;
            let id = el.textContent;
            if ( !url.includes('/themes/') ) return;
            if ( !url.endsWith('.md') ) return;
            let tag = 'div';
            if ( id === 'header' || id === 'footer' ) tag = id;
            // replace parent with div containing id
            el.parentNode.outerHTML = `<${tag} id="${id}" />`;
            urls.push([id, url]);
        });

        urls.forEach( (item, i) => {
            // get url through promise
            let flag = ( i === urls.length - 1);
            let id = item[0], url = item[1];
            this.get(url)
                .then(data => this.process_template_parts(id, data, flag) )
                .catch(reason => console.log(reason.message));
        })
    }

    process_template_parts(id, data, flag) {
        this.render( data, '#' + id );
        if (flag) this.after_template_parts();
    }

    after_template_parts() {
        // eval code blocks
        this.do_eval(this.wrapper);
        // finally call user provided callback
        if ( typeof this.callback === 'function' ) {
            this.callback.call();
        }
    }

    do_eval(el) {
        const container = document.querySelector(el);
        if ( container === null ) return false;
        const codes = container.querySelectorAll('code');
        codes.forEach(i => {
            this.write_results(i);
        });
    }

    write_results(el) {
        let parent = el.parentNode;
        if ( parent === null ) return;
        if ( parent.tagName === 'PRE' ) {
            // ensure parent has .hljs and .js classes
            if ( !parent.classList.contains('hljs') ) return;
            if ( !parent.classList.contains('js') ) return;
            // render tags in new P tag
            let fn = `(function() {${el.textContent}\n}())`;
            let result = `${eval(fn)}`;
            if ( result === 'undefined' ) result = '';
            parent.outerHTML = result;
        } else {
            // only act if inline code block begins with 'js '
            let code = el.textContent;
            if ( code.startsWith('js ') ) code = code.split('js ')[1];
            if ( !code.startsWith('return ') ) code = 'return ' + code;
            // render inline
            el.classList.add('result');
            // create new function for code block
            let fn = `(function() {${code}\n}())`;
            let result = `${eval(fn)}`;
            if ( result === 'undefined' ) result = '';
            el.outerHTML = result;
        }
        return;
    }

    render( content, container ) {
        // markdownit options
        var md = window.markdownit({
            html: false, // Enable HTML - Keep as false for security
            xhtmlOut: true, // Use '/' to close single tags (<br />).
            breaks: true, // Convert '\n' in paragraphs into <br>
            langPrefix: 'language-', // CSS language prefix for fenced blocks.
            linkify: true,
            typographer: true,
            quotes: '“”‘’',
            highlight: function(str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return '<pre class="hljs ' + lang + '"><code>' +
                            hljs.highlight(lang, str, true).value +
                            '</code></pre>';
                    }
                    catch (__) {}
                }
                return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
            }
        });
        
        var c = document.querySelector(container);
        if ( c !== null ) c.innerHTML = md.render(content);
    }

}