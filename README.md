#vue全家桶音乐播放器说明

##src下的目录结构（部分）
api:发送ajax请求或node代理转发请求的代码
base：自己封装的基础组件
common:公用方法，类，图片等

##无法播放歌曲暂无解决方案
common/js/song.js 中createSong中的url参数需要拼接。
参考链接:https://segmentfault.com/q/1010000012698827/a-1020000012700711
