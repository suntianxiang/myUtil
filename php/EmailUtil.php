<?php 
	/**
	 * 发送邮件工具类（基于SMTP协议）
	 *
	 * usage:	$emailUtil = new EmailUtil(['host' => 'your host','port' => 'your por','user' => 'username','pass' => 'password']);
	 * 			$result = $emailUtil->send_mail('form email','to email', 'subject', 'body');
	 *			if($result) echo 'success';
	 *			else echo $this->error;
	 * @package util
	 * @author suntianxiang<suntianxiang@sina.cn>
	 */
	class EmailUtil
	{
		/**
		 * @access private
		 * @var $host smtp 域名或ip
		 */
		private $host;
		/**
		 * @access private
		 * @var $port smtp 端口
		 */
		private $port;
		/**
		 * @access private
		 * @var $user smtp 用户
		 */
		private $user;
		/**
		 * @access private
		 * @var $pass smtp 密码
		 */
		private $pass;
		/**
		 * @access private
		 * @var $debug 是否开启调试信息
		 */
		private $debug = FALSE;
		/**
		 * @access private
		 * @var $sock 连接句柄
		 */
		private $sock;
		/**
		 * @access private
		 * @var $sock 邮件格式
		 */
		private $mail_format = 'html';
		/**
		 * @access public
		 * @var $errno 错误编号
		 */
		public $errno;
		/**
		 * @access public
		 * @var $error 错误信息
		 */
		public $error;
		/**
		 * 构造函数
		 *
		 * @param array $config 配置
		 */
		public function __construct($config)
		{
			foreach ($config as $key => $value) {
				$this->{$key} = $value;
			}
		}
		/**
		 * 发送邮件
		 *
		 * @param string $from 来源账号
		 * @param string $to 要发送的账号
		 * @param string $subject 主题
		 * @param string $body 内容
		 * @return boolean if send success
		 */
		public function send_mail($from , $to , $subject , $body){
			$this->sock = fsockopen($this->host , $this->port , $this->errno , $this->error , 10);
			if(!$this->sock){
				// throw new Exception("connect fail!Error number:{$this->errno},Error message: {$this->error}\n", 1);
				return FALSE;
			}
			if(!$this->is_email($from) || !$this->is_email($to)){
				$this->show_debug("invalid email address");
				$this->errno = 4001;
				$this->error = 'invalid email address';
				return FALSE;
			}
			$response=fgets($this->sock);
			if(strstr($response , "220") === FALSE){
				// throw new Exception("server error:{response}\n", 1);
				$this->errno = 5001;
				$this->error = 'server error';
				return FALSE;
			}
			$detail = "From: ".$from."\r\n";
			$detail .= "To: ".$to."\r\n";
			$detail .= "Subject: ".$subject."\r\n";
			if($this->mail_format == 'html'){
				$detail .= "Content-Type: text/html;\r\n";
			} else {
				$detail .= "Content-Type: text/html;\r\n";
			}
			$detail .="charset=utf8\r\n\r\n";
			$detail .="{$body}";
			/* STMP 命令发送列表 [[command, rightCode]]*/
			$commands = array(
				array("HELO {$this->host}\r\n" , 250),
				array("AUTH LOGIN\r\n" , 334),
				array(base64_encode($this->user)."\r\n" , 334),
				array(base64_encode($this->pass)."\r\n" , 235),
				array('MAIL FROM:<'.$from.'>'."\r\n" , 250),
				array("RCPT TO: <{$to}>\r\n" , 250),
				array("DATA\r\n" , 354),
				array($detail."\r\n.\r\n" , 250),
				array("QUIT\r\n" , 221),
			);
			foreach ($commands as $k => $v) {
				$res = $this->do_command($v[0], $v[1]);
				if(!$res)
					return FALSE;
			}
			return TRUE;
		}

		private function show_debug($message){
			if($this->debug){
				echo "<p>Debug:{$message}</p>";
				ob_flush();  
    			flush();  
			}
		}

		private function do_command($cmd , $return_code){
			fwrite($this->sock , $cmd);
			$response = fgets($this->sock);
			if(strstr($response, "{$return_code}") === FALSE){
				$this->show_debug($response);
				$this->errno = 5002;
				$this->error = $response;
				return FALSE;
			} else {
				$this->show_debug($response);
				return TRUE;
			}
		}

		private function is_email($str){
			$pattren ="/^[^_][\w]*@[\w.]+[\w]*[^_]$/";
			if(preg_match($pattren, $str)){
				return TRUE;
			} else {
				return FALSE; 
			}
		}
	}
?>