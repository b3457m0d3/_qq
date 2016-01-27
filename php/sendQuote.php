<?php
require_once('./phpmailer/class.phpmailer.php');
require_once("./underscore.php");
class SSPMailer extends PHPMailer {
    // Set default variables for all new objects
    var $Host       = "smtp.gmail.com";
    var $Mailer     = "smtp";
	var $SMTPAuth   = true;
	var $SMTPSecure = "ssl";
	var $Port       = 465;
	var $Username   = "npotenza@syrscreenprinting.com";
	var $Password   = "CocoButter5";
	var $Subject    = 'A Quote has been requested';
	var $AltBody    = 'To view the message, please use an HTML compatible email viewer!';
}
__::templateSettings(array('evaluate'=>'/\{\{(.+?)\}\}/','interpolate'=>'/\{\{=(.+?)\}\}/','escape'=>'/\{\{-(.+?)\}\}/'));
$template = file_get_contents('./emailTemplate.php');
$compiled = __::template($template);
$confirmation = file_get_contents("./confirmTemplate.php");
$compiledConfirmation = __::template($confirmation);
if(isset($_POST)){
	$mail = new SSPMailer(true); // the true param means it will throw exceptions on errors, which we need to catch
	try {
		  $mail->AddAddress("perchance2dream86@gmail.com");
	    $mail->AddAddress("info@ssp315.com");
	    $mail->AddReplyTo($_POST['email'], $_POST['fName'].' '.$_POST['lName']);
	    $mail->SetFrom($_POST['email'], $_POST['fName'].' '.$_POST['lName']);
	    $mail->MsgHTML($compiled($_POST));
	    foreach($_POST['items'] as $item){
			if(strpos($item['art'],'.zip') !== false) $mail->AddAttachment($item['art']);
	    }
	    $mail->Send();
	    echo "<h1 class='lobster ssp_blue'>Thank You</h1><hr><p class='lead'>You will receive confirmation via the email address you provided</p>";
        $confirm = new SSPMailer(true);
		try {
			$confirm->Subject = "Quote Confirmation - Syracuse Screen Printing Co.";
			$confirm->AddAddress($_POST['email']);
			//$mail->AddAddress("npotenza@syrscreenprinting.com");
			$confirm->SetFrom("orders+noreply@syrscreenprinting.com", "No-Reply @ Syracuse Screen Printing Co.");
			$confirm->MsgHTML($compiledConfirmation($_POST));
			$confirm->Send();
			foreach($_POST['items'] as $item){
				if(strpos($item['art'],'.zip') !== false) unlink($item['art']);
			}
		} catch (phpmailerException $e) {
			echo $e->errorMessage(); //Pretty error messages from PHPMailer
		} catch (Exception $e) {
			echo $e->getMessage(); //Boring error messages from anything else!
		}
	} catch (phpmailerException $e) {
	    echo $e->errorMessage(); //Pretty error messages from PHPMailer
	} catch (Exception $e) {
	    echo $e->getMessage(); //Boring error messages from anything else!
	}
}
