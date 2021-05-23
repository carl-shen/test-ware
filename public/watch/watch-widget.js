// var nav = // the content - example of bootstrap's nav
// '<nav class="navbar navbar-expand-sm navbar-dark bg-dark py-1">'+
// '  <div class="collapse navbar-collapse" id="navbarNavAltMarkup">'+
// '    <div class="navbar-nav">'+
// '      <a class="nav-item nav-link py-0" href="./btc.html">BTC</a>' +
// '      <a class="nav-item nav-link py-0" href="./eth.html">ETH</a>' +
// '      <a class="nav-item nav-link py-0" href="./xrp.html">XRP</a>' +
// '      <a class="nav-item nav-link py-0" href="./hum.html">HUM</a>' +
// '    </div>' +
// '  </div>' +
// '</nav>';

const url_splits = window.location.href.split("/");
const page_name = url_splits[url_splits.length-1];
let chart_style_str = page_name.substring(0,2);  // either lc or ta

if(chart_style_str === 'qu'){  //when going from quotes page, default go to ta
    chart_style_str = 'ta';
}

let alt_style_page_name = '';
if(chart_style_str === 'lc'){
    alt_style_page_name = page_name.replace('lc', 'ta');
}else if(chart_style_str === 'ta'){
    alt_style_page_name = page_name.replace('ta', 'lc');
}

var nav = // non bootstrap navbar
'<nav class="navbar">'+
'    <a class="nav-item" href="./' + chart_style_str + 'btc.html">BTC</a>' +
'    <a class="nav-item" href="./' + chart_style_str + 'eth.html">ETH</a>' +
'    <a class="nav-item" href="./' + chart_style_str + 'xrp.html">XRP</a>' +
'    <a class="nav-item" href="./' + chart_style_str + 'hum.html">HUM</a>' +
'    <a class="nav-item" href="./squotes.html">-SQuote-</a>' +
'    <a class="nav-item" href="./' + alt_style_page_name + '">-Alt-</a>' +
'    <a class="nav-item" href="./sha.html">-SHA-</a>' +
'</nav>';


var demo = document.getElementById('navbar-container'); // target element.
demo.insertAdjacentHTML('beforeend', nav); // add content.