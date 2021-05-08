
<?php
  
  $url = "http://hq.sinajs.cn/list=" . $_POST["ticker"];

  $result = file_get_contents($url);

//   $arrResult = array(
//     'result' => $result
//   );

//   print json_encode($arrResult);
  echo iconv('GB2312', 'UTF-8', $result);
  die();
    
    
?>