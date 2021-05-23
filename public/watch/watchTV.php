<?php


// $targetPage = 'https://www.test-ware.com/watch/quotes.html';
// $targetPage = 'https://s.tradingview.com/embed-widget/tickers/?locale=en#%7B%22symbols%22%3A%5B%7B%22title%22%3A%22BTC%22%2C%22proName%22%3A%22BINANCE%3ABTCBUSD%22%7D%5D%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Afalse%2C%22showSymbolLogo%22%3Atrue%2C%22largeChartUrl%22%3A%22https%3A%2F%2Fwww.test-ware.com%2Fwatch%2Flcbtc.html%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A72%2C%22utm_source%22%3A%22www.test-ware.com%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22tickers%22%7D';

// $dom = new DOMDocument();
 
// // @ here is to make the example shorter, only in demo purposes
// @$dom->loadHTMLFile($targetPage);
// // $productsInfo = [];

// $domElement = $dom->getElementById('tv-container');

// echo $dom->saveHTML();


// write timestamp of the when the request is made
$FILE = fopen("watchtv/request.time","w");
$timestamp = time();
fputs($FILE, $timestamp);
fclose ($FILE);

die();

?>