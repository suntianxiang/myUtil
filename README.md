# myUtil
----
pass


php docker 记录
-------
1. gd 支持jpeg
docker-php-ext-configure gd --with-jpeg-dir=/usr/include

2. gd 支持字体
apt-get install libfreetype6-dev
docker-php-ext-configure gd --with-freetype-dir=/usr/include


#### linux

1. 查看cpu占用最多的进程
 ps aux|head -1;ps aux | grep -v PID | sort -rn -k +3 | head -1

#### nginx
1. 切割日志 mv /www/wwwlogs/18.231.158.226.log /www/wwwlogs/backup/18.231.158.226_20220811.log && kill -USR1 1447 （1447：nginx主线程）
