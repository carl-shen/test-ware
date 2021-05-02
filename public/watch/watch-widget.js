var nav = // the content - example of bootstrap's nav
'<nav class="navbar navbar-expand-sm navbar-dark bg-dark py-1">'+
'  <div class="collapse navbar-collapse" id="navbarNavAltMarkup">'+
'    <div class="navbar-nav">'+
'      <a class="nav-item nav-link py-0" href="./btc.html">BTC</a>' +
'      <a class="nav-item nav-link py-0" href="./eth.html">ETH</a>' +
'      <a class="nav-item nav-link py-0" href="./xrp.html">XRP</a>' +
'      <a class="nav-item nav-link py-0" href="./hum.html">HUM</a>' +
'    </div>' +
'  </div>' +
'</nav>';

var demo = document.getElementById('navbar-container'); // target element.
demo.insertAdjacentHTML('beforeend', nav); // add content.