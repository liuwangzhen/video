var http = require('http');
var querystring = require('querystring');

http.createServer(function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    // 解析参数
    body = querystring.parse(body);
    // 设置响应头部信息及编码
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });

    if (body.name && body.url) { // 输出提交的数据
      res.write("网站名字：" + body.name);
      res.write("<br>");
      res.write("网站 URL：" + body.url);
    } else {  // 输出表单
      res.write(postHTML);
    }
    res.end();
  });
}).listen(3000);