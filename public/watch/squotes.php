<?php
    require('makePrivate.php');
?>

<!DOCTYPE html>
<html lang="en">
    <head>
      <meta charset="utf-8">
      <!-- Responsive viewport for mobile -->
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  
      <!-- Bootstrap CSS -->
      <!-- <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"> -->

      <link rel="stylesheet" href="./watch-widget.css">
      <title>TV-List</title>
    </head>
    <body>
      <div class="container" id="navbar-container"></div>

      <script src="./content/js/jquery.min.js"></script>
      <script type="text/javascript" src="./watch-widget.js"></script>

      <script type="text/javascript" src="./watchtv/tickerList.txt"></script>

      <div id="quotes-container">
          <script type="text/javascript">
            update_request_time();  // call request for the first time to activate server side update

            // set up div rows
            var showNTickers = tickerList.length;
            for(let i = 0; i < showNTickers; i++){
                document.write(`
                    <div class="list-row">
                        <span class="ticker" id="ticker${i}">.</span>
                        <span class="price" id="price${i}">.</span>
                        <span class="chg" id="change${i}">.</span>
                    </div>
                `);
            }  


            // var tickerList = [];

            // get the tickerlist from blk file
            // var client = new XMLHttpRequest();
            // client.open('GET', './watchtv/tickerList.txt');
            // client.onreadystatechange = function() {
            //     if (this.readyState === 4 && this.status === 200) {
            //         let tempList = client.responseText.split("\r\n");
            //         tempList.forEach((element, index) => {
            //             if(element.length >2){
            //                 tickerList.push(element);
            //             }
            //         }); 
            //         // console.log(tickerList);
            //         console.log("list is setupl.");

            //         // set up div rows
            //         var showNTickers = tickerList.length;
            //         for(let i = 0; i < showNTickers; i++){
            //             document.write(`
            //                 <div class="list-row">
            //                     <span class="ticker" id="ticker${i}">.</span>
            //                     <span class="price" id="price${i}">.</span>
            //                     <span class="chg" id="change${i}">.</span>
            //                 </div>
            //             `);
            //         }  

            //     }
            // }
            // client.send();

            updatePriceData();  // call once immediately, then set interval for every n seconds
            setInterval(function(){
                updatePriceData();
            }, 3000);

            function updatePriceData() {
                update_request_time()

                tickerList.forEach((ticker, index) => {  // get data for each ticker
                    const client = new XMLHttpRequest();
                    client.open('GET', './watchtv/' + ticker + '.txt');
                    client.onreadystatechange = function() {
                        if (this.readyState === 4) {
                            if (this.status === 200){
                                let result = client.responseText.split(",");
                                // console.log(result);
                                elementsToHTML(index, result);
                            }else{
                                console.log("Error", client.statusText);
                            }
                        }
                    }
                    client.send();
                });
            }
    
            function elementsToHTML(index, elements){
                $('#ticker' + index).text(elements[0].substr(0,3));  // only take first 3 characters

                if (isNaN(elements[1])) {
                    $('#price' + index).text("-");
                }else{
                    $('#price' + index).text(parseFloat(elements[1]));
                }

                let tempChg = 0;
                if (!isNaN(elements[2])) {
                    tempChg = parseFloat(elements[2]);
                }
                $('#change' + index).text((tempChg).toFixed(2) + "%");
                // set the class to show red and green colour
                if(tempChg > 0){
                    $('#change' + index).attr('class', 'chg-positive');
                }else if(tempChg < 0){
                    $('#change' + index).attr('class', 'chg-negative');
                }else{
                    $('#change' + index).attr('class', 'chg');
                }

                let updateTime = 0;
                if (!isNaN(elements[3])) {
                    updateTime = parseInt(elements[3]);
                }
                if(Date.now()/1000 - updateTime > 30){  // if data is more than n seconds old
                    $('#ticker' + index).attr('class', 'ticker-outdated');
                }else{
                    $('#ticker' + index).attr('class', 'ticker');
                }
            }


            function update_request_time(){
                // save current epoch time on server
                $.ajax({
                url: 'watchTV.php',
                type: 'POST',
                data: function(){
                    return "";
                }(),
                success: function(data){
                    console.log("request.time updated successfully.");
                },
                error: function(e){
                    console.log(e);
                },
                complete: function(){
                    // console.log("completee");
                },
                cache: false,
                contentType: false,
                processData: false
            });

            }
        
          </script>        
      </div>




    </body>
</html>