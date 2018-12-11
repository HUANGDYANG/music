<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {getSongList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {mapGetters} from 'vuex'
  import {createSong} from 'common/js/song'
  import {getVkey} from 'api/vkey'

  export default {
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList() {
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        getSongList(this.disc.dissid).then((res) => {
          // console.log(res.cdlist[0].songlist)
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist)
            // console.log(this.songs)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        let arr = []
        // console.log(list)
        list.forEach((item) => {
          // let {musicData} = item
          // console.log(musicData)
          arr.push(item)
          getVkey(item.songmid).then((res) => {
            // console.log('这首歌的vkey获取到了')
            const vkey = res.data.items[0].vkey
            if (item.songid && item.albummid) {
              // console.log(item)
              if (vkey) {
                ret.push(createSong(item, vkey))
                // console.log(ret)
                // console.log(vkey)
              }
            }
          })
          // if (musicData.songid && musicData.albummid) {
          //   ret.push(createSong(musicData))
          // }
        })
        console.log('未解决的坑:', ret)
        console.log('同样是数组，但不同', arr)
        // console.log(typeof ret)
        // console.log(ret[0])
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
