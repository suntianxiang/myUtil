<?php

/**
 * 分页类
 *
 * 用例:
 * $config = array('_totalRow' => 50 , 'page_size' => 10);
 * $paginate = new Paginate($config);
 * echo $paginate->createHtml();
 *
 * @author suntianxiang<suntianxiang@sina.cn>
 * @package paginate
 */
class Paginate 
{
	/* @var integer $_now 当前页 */
	private $_now;
	/* @var integer $_totalRow 总行数 */
	private $_totalRow;
	/* @var integer $_totalPage 总页数 */
	private $_totalPage;
	/* @var integer $limit 每页显示量 */
	private $limit = 0;
	/* @var integer $offset 偏移量 */
	private $offset = 0;
	/* @var string $url 分页基本url连接 */
	private $url = '';
	/* @var string $numTemplate 数字页模板*/
	public $numTemplate = '<li style="float:left;">{number}</li>';
	/* @var string $prevTemplate 上一页模板*/
	public $prevTemplate = '<li style="float:left;"><a href="{link}">上一页</a></li>';
	/* @var string $nextTemplate 下一页模板*/
	public $nextTemplate = '<li style="float:left;"><a href="{link}">下一页</a></li>';
	/* @var string|bool|array 分页跟随参数 */
	public $follows = FALSE;
	/**
	 * 构造函数
	 * @return Paginate 分页类
	 */
	public function __construct($args){
		if(!isset($args['_totalRow']) OR !isset($args['page_size'])){
			throw new Exception("Need _totalRow or page_size", 1);
		}
		$this->_totalRow = $args['_totalRow'];
		$this->limit = $args['page_size'];

		$this->_now = isset($_GET['page']) ? intval($_GET['page']) : 1;
		$this->offset = ($this->_now-1)*$this->limit;
		foreach ($args as $k => $v){
			if(isset($this->$k)){
				$this->$k = $v;
			}
		}
		if(!$this->url){
			$this->_setUrl();
		}
		$this->_totalPage = ceil($this->_totalRow/$this->limit);
		return $this;
	}
	/**
	 * 创建分页连接
	 */
	public function createHtml(){
		return $this->prevHtml().preg_replace('/\{number\}/', $this->_now, $this->numTemplate).$this->nextHtml();
	}
	/**
	 * 获取偏移
	 */
	public function getOffset(){
		return $this->offset;
	}
	/**
	 * 获取每页数量
	 */
	public function getLimit(){
		return $this->limit;
	}
	/**
	 * 创建当前页之前的HTML
	 * @return string
	 */
	private function prevHtml(){
		$str = '<ul style="list-style:none;">';
		if($this->_now-5 > 0 AND $this->_totalPage > 10){
			$p = $this->_now-1;
			$prev = preg_replace('/\{link\}/', $this->url."&page={$p}&page_size={$this->limit}", $this->prevTemplate);
			$str .= $prev;
		}

		$begin = $this->_now-5 > 1 ? $this->_now-5 : 1;
		$begin = $this->_totalPage > 10 ? $begin : 1;
		for ($i=$begin; $i < $this->_now; $i++) { 
			if($i < 1){
				break;
			}
			$str .= preg_replace('/\{number\}/', "<a href=\"".$this->url."&page={$i}&page_size={$this->limit}\">{$i}</a>", $this->numTemplate);
		}
		return $str;
	}
	/**
	 * 创建当前页之后的HTML
	 * @return string
	 */
	private function nextHtml(){
		$str = '';
		$end = $this->_totalPage > 10 ? $this->_now+5 : 11;
		for($i=$this->_now+1; $i < $end; $i++){
			if($i > $this->_totalRow / $this->limit){
				break;
			}
			$str .= preg_replace('/\{number\}/', "<a href=\"".$this->url."&page={$i}&page_size={$this->limit}\">{$i}</a>", $this->numTemplate);
		}
		if($this->_now+5 <= $this->_totalRow / $this->limit AND $this->_totalPage > 10){
			$p = $this->_now+1;
			$next = preg_replace('/\{link\}/', $this->url."&page={$p}&page_size={$this->limit}", $this->nextTemplate);
			$str .= $next;
		}
		$str .= '</ul>';
		return $str;
	}
	/**
	 * 设置
	 */
	private function _setUrl(){
		$url = (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == '443') ? 'https://' : 'http://';
		$url .= $_SERVER['HTTP_HOST'];
		$url .= str_replace('?'.$_SERVER['QUERY_STRING'], '', $_SERVER['REQUEST_URI']);
		if(!$this->follows){
			return $url;
		}
		$query_string = '?';
		if(is_array($this->follows)){
			foreach ($this->follows as $k => $v) {
				if($v == 'page_size' OR $v == 'page'){
					continue;
				}
				$query_string .= $v.'='.(isset($_GET[$v]) ? $_GET[$v] : '').'&';
			}
			$query_string = substr($query_string, 0 , -1);
		}
		$this->url = $url.$query_string;
	}
	/**
	 * 获取属性拦截
	 *
	 * 如果非公有属性存在get{Name}方法，则调用该方法
	 * @param string $name 需要查找的属性
	 */
	public function __get($name){
		$func = 'get'.ucfirst($name);
		if(is_callable($this->$func)){
			return $this->$func();
		} else {
			throw new Exception("Read undefined variable $name", 1);
		}
	}
}