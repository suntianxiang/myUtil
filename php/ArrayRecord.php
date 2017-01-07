<?php
	Class ArrayRecord implements ArrayAccess,Iterator{
		private $_attributes = array();
		/**
		 * 检查一个偏移位置是否存在
		 * @param integer $key 偏移位置
		 * @return bool
		 */
		public function offsetExists($key){
			return isset($_attributes[$key]);
		}
		/**
		 * 获取一个便宜位置
		 * @param integer $key 偏移位置
		 * @return mixed
		 */
		public function offsetGet($key){
			if($this->offsetExists($key)){
				return $this->_attributes[$key];	
			}
		}
		/**
		 * 设置一个偏移位置的值
		 * @param integer $key 偏移位置
		 * @return void
		 */
		public function offsetSet($key , $value){
			 $this->_attributes[$key] = $value;
		}
		/**
		 * 复位一个偏移位置的值
		 * @param integer $key 偏移位置
		 * @return void
		 */
		public function offsetUnset($key){
			if($this->offsetExists($key)){
				unset($this->_attributes[$key]);
			}
		}

		public function current(){
			return current($this->_attributes);
		}

		public function key(){
			return key($this->_attributes);
		}

		public function next(){
			return next($this->_attributes);
		}

		public function rewind(){
			return reset($this->_attributes);
		}

		public function valid(){
			if(!is_null(key($this->_attributes))) {
                return true;
            } else {
                return false ;
            }
		}
	}

	$res = new ArrayRecord();
	$res['name'] = 'renxingzhi';
	$res['email'] = 'rxz@cjkt.com';
	$res['age'] = 23;
	$res['sex'] = 'man';
	foreach ($res as $key => $value) {
		var_dump($key);
		var_dump($value);
		echo '<br>';
	}

?>