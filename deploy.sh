# 首先将指定node版本添加到PATH中，yarn运行时会调用node命令，公用构建机上默认全局安装的node版本很低，会引起报错
export PATH=/home/appops/static/ehr:$PATH
test -e /home/appops/static/ehr/node && mv  /home/appops/static/ehr/node /home/appops/static/ehr/node.bak
ln -s /usr/bin/node14 /home/appops/static/ehr/node
rm -rf node_modules
yarn1
yarn1 build