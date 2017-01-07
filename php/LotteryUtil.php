<?php
/**
 * 抽奖工具类
 */
class LotteryUtil{
	/**
	 * 抽奖函数
	 *
	 * @param array $gifts 奖品列表
	 * @return integer 奖品id
	 */
	public static function lottery(array $gifts){
		if(count($gifts) < 1){
			throw new Exception("Error param 1 length must more than 1", 1);
		}
		foreach ($gifts as $k => $v) {
			if(!isset($v['id']) OR !isset($v['probability'])){
				throw new Exception("Error param 1 options muse like array('id'=>1,'probability' => 90)", 1);
			}
		}
		$sortFuncName = self::class.'::sortByProbability';
		usort($gifts , $sortFuncName);
		$sum = 0;//总区间
		foreach ($gifts as $k => $v) {
			$sum+=$v['probability'];
		}
		//抽奖主流程
		$result = NULL;
		foreach ($gifts as $k => $v) {
			$rand = mt_rand(1,$sum);
			if($rand <= $v['probability']){
				$result = $v['id'];
				break;
			} else {
				$sum -= $v['probability'];
			}
		}
		return $result;
	}
	/**
	 * 排序函数
	 *
	 * @param $a
	 * @param $b
	 * @return boolean
	 */
	public static function sortByProbability($a , $b){
		if($a['probability'] > $b['probability']){
			return -1;
		} else if($a['probability'] == $b['probability']){
			return 0;
		} else {
			return 1;
		}
	}
}