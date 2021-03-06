import {playMode} from 'common/js/config'
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [], // 播放列表
  sequenceList: [], // 右下角列表
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  searchHistory: loadSearch(), // 搜索历史
  playHistory: loadPlay(),
  favoriteList: loadFavorite()
}

export default state
