var express = require('express')
var config = require('./config/index')
var axios = require('axios')

var port = process.env.PORT || config.build.port

var app = express()

var apiRoutes = express.Router()

// 后端代理浏览器显示向本地发送请求，实际转发到了第三方
apiRoutes.get('/getDiscList', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  // axios库在客户端发送ajax请求，服务端发送http(可传入header参数)请求
  axios.get(url, {
    headers: {
      // 发送http请求在header加入参数躲避QQ音乐referer,host校验
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})
// 推荐页歌单
apiRoutes.get('/getSongList', function (req, res) {
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  // axios库在客户端发送ajax请求，服务端发送http(可传入header参数)请求
  axios.get(url, {
    headers: {
      // 发送http请求在header加入参数躲避QQ音乐referer,host校验
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

// 搜索页数据
apiRoutes.get('/search', function (req, res) {
  var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  // axios库在客户端发送ajax请求，服务端发送http(可传入header参数)请求
  axios.get(url, {
    headers: {
      // 发送http请求在header加入参数躲避QQ音乐referer,host校验
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/lyric', function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    // 如果返回jsonp回调字符串
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/ // 匹配 {不包含()的内容} 的字符串 中间的^()表示不能是括号
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret) //后端代理服务器处理jsonp后返回json给前端
  }).catch((e) => {
    console.log(e)
  })
})

app.use('/api', apiRoutes)

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
