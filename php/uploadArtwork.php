<? //if(isset($_FILES["Fileinput"]) && $_FILES["Fileinput"]["error"]== UPLOAD_ERR_OK){
  if($_SERVER['REQUEST_METHOD'] == 'POST') {
    extract($_POST);
    ############ Edit settings ##############
    $files = getcwd().'files/'; //specify upload directory ends with / (slash)
    $tmp = $files.'tmp/';
    $archive = $files.'archive/';
    ##########################################

    if (!isset($_SERVER['HTTP_X_REQUESTED_WITH'])) die();
    $zipPath = date("Y-m-d-g-i-s").'.zip';
    $c = count($_FILES["Fileinput"]['name']);
    $ok = 0;
    $error_names = array();
    foreach($_FILES["Fileinput"]['name'] as $id => $name){
      if ($_FILES["Fileinput"]["size"][$id] > 5242880) die("File size is too big!");
      switch(strtolower($_FILES['Fileinput']['type'][$id])){
          case'image/svg+xml':case'image/png':case'image/gif':case'image/jpeg':case'image/pjpeg':case'application/pdf':
          case 'application/x-zip-compressed':  break;
          default: die('Unsupported File!'); //output error
      }
      $File_Name          = $name;
      $File_Ext           = substr($File_Name, strrpos($File_Name, '.')); //get file extention
      $Random_Number      = rand(0, 9999999999); //Random number to be added to name.
      $NewFileName        = $Random_Number.$File_Ext; //new file name
      if(move_uploaded_file($_FILES['Fileinput']['tmp_name'][$id], $tmp.$NewFileName )) $ok++; else $error_names[] = array($id,$name);
    }
    if($ok == $c){
      include_once('pclzip.lib.php');
      $z = new PclZip($zipPath);
      $v_ = $z->create($tmp, PCLZIP_OPT_REMOVE_ALL_PATH);
      if($v_==0){die("Error : ".$z->errorInfo(true));}else{ $s = ($c>1)?'s':''; echo 'Success! '.$c.' File'.$s.' Uploaded and Compressed.<span class="zip" class="hide">'.$zipPath.'</span>'; }
    } else { echo 'error uploading File!'."<ul class='list-unstyled'>"; foreach($error_names as $key=>$val){ echo "<li><i class='fa fa-warning'></i> ".$val[1]." was not uploaded</li>"; } echo "</ul>"; }
} else die('Something wrong with upload! Is "upload_max_filesize" set correctly?');
