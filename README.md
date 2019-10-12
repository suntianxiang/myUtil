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
