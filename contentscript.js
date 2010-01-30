var fastkeys = new Array();
var control = false;
var highlighted = false;

if (window == top) {
    document.addEventListener('keydown', function(e) {
        control = (e.keyCode == 17);
    }, false);
    document.addEventListener('keyup', function(e) {
        if (control && e.keyCode == 17) {
            toggle();
        } else if (highlighted && !e.shiftKey && !e.ctrlKey && !e.altKey
                   && !e.metaKey && fastkeys[String.fromCharCode(e.keyCode)]) {
            activate(fastkeys[String.fromCharCode(e.keyCode)]);
        }
    }, false);
}

var style = addGlobalStyle('.sample-outside{position:relative}'
    + '.sample-inside{position:absolute;left:50%;top:100%;font:10pt sans-serif;'
    + 'background-color:#ffffdc;border:solid 2px black;padding:3px;display:none}');

var elems = document.evaluate('//a[@href]|//input|//textarea', document, null,
                          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                          // Should use ORDERED_NODE_ITERATOR_TYPE?

for (var i = 0; i < elems.snapshotLength; i++) {
    var elem = elems.snapshotItem(i);
    var key = String.fromCharCode(i + 'A'.charCodeAt(0));
    prepareNode(elem, key);
    fastkeys[key] = elem;
    if (key == 'Z') {
        break;
    }
}

function addGlobalStyle(css) {
    // From http://diveintogreasemonkey.org/patterns/add-css.html
    var head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
    return style;
}

function prepareNode(elem, key) {
    var children = elem.childNodes;
    var spanin = document.createElement('span');
    spanin.setAttribute('class', 'sample-inside');
    spanin.appendChild(document.createTextNode(key));
    var spanout = document.createElement('span');
    spanout.setAttribute('class', 'sample-outside');
    spanout.appendChild(spanin);
    while (children.length > 0) {
        // A node can only have one parent, so appending it to the span
        // also removes it from its previous parent element.
        spanout.appendChild(children[0]);
    }
    elem.appendChild(spanout);
}

function toggle() {
    if (highlighted) {
        style.sheet.cssRules[1].style.display = 'none';
    } else {
        style.sheet.cssRules[1].style.display = '';
    }
    highlighted = !highlighted;
}

function activate(elem) {
    switch(elem.tagName) {
    case 'A':
        var click = document.createEvent('MouseEvents');
        click.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        elem.dispatchEvent(click);
        break;
    default:
        elem.focus();
    }
}
