<?php 
	require "EmailUtil.php";

	$config = array(
		'host' => 'smtp.163.com',
		'port' => 25,
		'user' => 'a334965556@163.com',
		'pass' => '13426620350.',
		'debug' => TRUE,
		'mail_format' => 'html',
	);
	$email = new EmailUtil($config);
	$r = $email->send_mail('a334965556@163.com' , '334965556@qq.com' , '您好，我是孙大象，跟你同名' , '<h1>hello my smtp is worked!</h1>');
	if($r){
		echo 'success';
	} else {
		echo 'err';
	}
 ?>