<!--搜索后的展示列表-->
<template>
  <scroll ref="suggest"
          class="suggest"
          :data="result"
          :pullup="pullup"
          :pulldown="pulldown"
          :probeType=probeType
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
          @pulldownEnd = "searchMore"
  >
    <ul class="suggest-list">
      <loading v-show="loading" title="正在加载下一页"></loading>
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <!--<loading v-show="hasMore" title=""></loading>-->
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import NoResult from 'base/no-result/no-result'
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import {mapMutations, mapActions} from 'vuex'
  import Singer from 'common/js/singer'
  import {getVkey} from 'api/vkey'

  const TYPE_SINGER = 'singer'
  const perpage = 20

  export default {
    props: {
      showSinger: {
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        page: 1,
        pullup: false, // 关闭上拉加载更多
        pulldown: true,
        probeType: 2,
        loading: false,
        beforeScroll: true,
        hasMore: true,
        result: []
      }
    },
    methods: {
      refresh() {
        this.$refs.suggest.refresh()
      },
      search() {
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0, 0)
        // 调用接口
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            this._checkMore(res.data)
          }
        })
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        this.loading = true
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          // var arr = []
          if (res.code === ERR_OK) {
            console.log('覆盖前', this.result)
            // this.result = this.result.concat(this._genResult(res.data)) // 原来的做法在getvkey后不能实现
            this.result = this._genResult(res.data)
            console.log('覆盖后', this.result)
            this._checkMore(res.data)
            this.loading = false
          }
          // arr.push(res)
          // console.log(arr)
        })
      },
      // 收起输入法:让input失去焦点
      listScroll() {
        this.$emit('listScroll')
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        this.$emit('select', item)
      },
      // 数据字段不一样，增加此处理
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      _genResult(data) {
        let ret = []
        // if (data.zhida && data.zhida.singerid) {
        //   ret.push({...data.zhida, ...{type: TYPE_SINGER}}) // type是为了样式
        // }
        if (data.song) {
          // console.log(this._normalizeSongs(data.song.list))
          // ret = ret.concat(this._normalizeSongs(data.song.list))
          ret = this._normalizeSongs(data.song.list)
        }
        // console.log(ret[0])
        return ret
      },
      // todo then函数里面执行arr.push后arr不是正常的arr,arr[0]拿不到数据* :[Song, __ob__: Observer]和[Song]的区别
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData, index) => {
          // console.log('11111', ret)

          // if (musicData.songid && musicData.albummid) {
          //   ret.push(createSong(musicData))
          //   // console.log(musicData.songmid)
          // }
          let vkey
          getVkey(musicData.songmid).then((res) => {
            // console.log('这首歌的vkey获取到了')
            vkey = res.data.items[0].vkey
            if (musicData.songid && musicData.albummid) {
              // console.log(createSong(musicData, vkey))
              ret.push(createSong(musicData, vkey))
              // console.log(ret)
              // this.$set(ret, index, createSong(musicData, vkey))
            }
          })
        })
        // console.log(ret)
        // console.log(typeof ret)
        // console.log(ret[0])
        return ret
      },
      // 根据QQ返回的数据计算是否还有更多搜索项目
      _checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.hasMore = false
        }
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query(newQuery) {
        this.search(newQuery)
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
