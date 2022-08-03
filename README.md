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
 ps aux|head-1;ps aux | grep -v PID | sort -rn -k +3 | head -1
