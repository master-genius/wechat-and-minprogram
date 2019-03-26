### weixin_api_lib/:

> menu.js 是封装的自定菜单接口

> access_token.js 是获取access_token的接口文件，请求localhost:5555获取。

### tokenServ.js

运行access_token服务，默认在localhost:5555，通过设置定时器自动更新access_token。

请求http://localhost:5555/access_token可以获取access_token。


### wxapi_lib_test.js

测试获取菜单操作的代码文件，注释部分是删除菜单，使用时请注意保存之前的菜单数据。

