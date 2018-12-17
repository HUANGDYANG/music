#vue全家桶音乐播放器说明

##src下的目录结构（部分）
api:发送ajax请求或node代理转发请求的代码
base：自己封装的基础组件
common:公用方法，类，图片等

##无法播放歌曲解决方案
参考链接:https://segmentfault.com/q/1010000012698827/a-1020000012700711

##playlist(songs)数据组件间的流动
singer-detail=>music-list(点击歌曲触发事件,发送被点击歌曲的index和songs)=>vuex中的playlist
songs是json数组，每组里面有歌曲名，歌曲连接，图片等

##需要获取vkey的几个组件
top-list singer-detail disc suggest(有问题)
