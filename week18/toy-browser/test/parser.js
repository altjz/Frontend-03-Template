const assert = require('assert');
import { parseHtml } from '../src/parser';

describe("parse html:", () => {
  it('<a>abc</a>', () => {
    const tree = parseHtml('<a>abc</a>');
    assert.strictEqual(tree.children[0].tagName, 'a');
    assert.strictEqual(tree.children[0].children.length, 1);
  });
  it('<a herf="//time.geekbang.org"></a>', () => {
    const tree = parseHtml('<a herf="//time.geekbang.org"></a>');
    assert.strictEqual(tree.children[0].tagName, 'a');
    assert.strictEqual(tree.children[0].children.length, 0);
  });
  it('<a/>', () => {
    const tree = parseHtml('<a/>');
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });
  it('<a></b>', () => {
    assert.throws(() => parseHtml('<a></b>'), Error);
  });
  it('<a id name= "abc" />', () => {
    const tree = parseHtml('<a id name= "abc" />');
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
    assert.strictEqual(tree.children[0].attributes.length, 2);
    assert.strictEqual(tree.children[0].attributes[0].name, 'id');
    assert.strictEqual(tree.children[0].attributes[0].value, '');
    assert.strictEqual(tree.children[0].attributes[1].name, 'name');
    assert.strictEqual(tree.children[0].attributes[1].value, 'abc');
  });
  it('<a id=abc></a>', () => {
    const tree = parseHtml('<a id=abc></a>');
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
    assert.strictEqual(tree.children[0].attributes.length, 1);
    assert.strictEqual(tree.children[0].attributes[0].name, 'id');
    assert.strictEqual(tree.children[0].attributes[0].value, 'abc');
  });
  it('<a id=abc />', () => {
    const tree = parseHtml('<a id=abc />');
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
    assert.strictEqual(tree.children[0].attributes.length, 1);
    assert.strictEqual(tree.children[0].attributes[0].name, 'id');
    assert.strictEqual(tree.children[0].attributes[0].value, 'abc');
  });
  it('<a id=abc/>', () => {
    const tree = parseHtml('<a id=abc/>');
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
    assert.strictEqual(tree.children[0].attributes.length, 1);
    assert.strictEqual(tree.children[0].attributes[0].name, 'id');
    assert.strictEqual(tree.children[0].attributes[0].value, 'abc');
  });
  it("<a id='abc' name='cba' />", () => {
    const tree = parseHtml("<a id='abc' name='cba' />");
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
    assert.strictEqual(tree.children[0].attributes.length, 2);
    assert.strictEqual(tree.children[0].attributes[0].name, 'id');
    assert.strictEqual(tree.children[0].attributes[0].value, 'abc');
    assert.strictEqual(tree.children[0].attributes[1].name, 'name');
    assert.strictEqual(tree.children[0].attributes[1].value, 'cba');
  });
  it('global style', () => {
    const tree = parseHtml(`<style>
  body div{
    font-size:15px;
  }
  body>div{
    line-size:5px;
  }
  div>p{
    color: #FFF;
  }
  div p {
    color: #FFF;
  }
  div+div>a{
    font-size:20px;
  }
  div~div>p{
    font-size:25px;
  }
  div~a{}
  div p.myp{}
  #ppp{}
  body div.abc.cba{}
  div #atest{}
  div #noid {}
  div>p>span {}
  #noid + span {}
  body ul>li.myli+li{}
  body ul>li.llliii+li{}
  body ul>li.llliii~li{}
  body ul>li.llliii>li{}
</style>
<html>
<body>
  <ul><li class="myli"></li></ul>
  <ul><li class="llliii"></li><li>hhhwww</li></ul>
  <div></div>
  <div id="atest">
  <a href="#">A Test</a>
  </div>
  <div class="abc">
    <p id="ppp" class="myp">hello world</p>
  </div>
</body>
</html>
`);
    console.log(tree);
    assert.strictEqual(tree.children[0].tagName, 'style');
    assert.strictEqual(tree.children[0].children.length, 1);
  });
});