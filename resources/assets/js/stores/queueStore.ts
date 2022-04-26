import { difference, shuffle, union } from 'lodash'
import { reactive } from 'vue'
import { arrayify } from '@/utils'

interface QueueStoreState {
  songs: Song[],
  current?: Song
}

export const queueStore = {
  state: reactive<QueueStoreState>({
    songs: [] as Song[]
  }),

  init () {
    // We don't have anything to do here yet.
    // How about another song then?
    //
    // LITTLE WING
    // -- Jimi Hendrix
    //
    // Well she's walking
    // Through the clouds
    // With a circus mind
    // That's running wild
    // Butterflies and zebras and moonbeams and fairy tales
    // That's all she ever thinks about
    // Riding with the wind
    //
    // When I'm sad
    // She comes to me
    // With a thousand smiles
    // She gives to me free
    // It's alright she said
    // It's alright
    // Take anything you want from me
    // Anything...
  },

  get all () {
    return this.state.songs
  },

  set all (songs: Song[]) {
    this.state.songs = songs
  },

  get first () {
    return this.all[0]
  },

  get last () {
    return this.all[this.all.length - 1]
  },

  contains (song: Song) {
    return this.all.includes(song)
  },

  /**
   * Add song(s) to the end of the current queue.
   */
  queue (songs: Song | Song[]) {
    this.unqueue(songs)
    this.all = union(this.all, arrayify(songs))
  },

  queueIfNotQueued (song: Song) {
    if (!this.contains(song)) {
      this.queueAfterCurrent(song)
    }
  },

  queueToTop (songs: Song | Song[]) {
    this.all = union(arrayify(songs), this.all)
  },

  replaceQueueWith (songs: Song | Song[]) {
    this.all = arrayify(songs)
  },

  queueAfterCurrent (songs: Song | Song[]) {
    songs = arrayify(songs)

    if (!this.current || !this.all.length) {
      return this.queue(songs)
    }

    // First we unqueue the songs to make sure there are no duplicates.
    this.unqueue(songs)

    const head = this.all.splice(0, this.indexOf(this.current) + 1)
    this.all = head.concat(songs, this.all)
  },

  unqueue (songs: Song | Song[]) {
    this.all = difference(this.all, arrayify(songs))
  },

  /**
   * Move some songs to after a target.
   */
  move (songs: Song | Song[], target: Song) {
    const targetIndex = this.indexOf(target)
    const movedSongs = arrayify(songs)

    movedSongs.forEach(song => {
      this.all.splice(this.indexOf(song), 1)
      this.all.splice(targetIndex, 0, song)
    })
  },

  clear () {
    this.all = []
  },

  indexOf (song: Song) {
    return this.all.indexOf(song)
  },

  get next () {
    if (!this.current) {
      return this.first
    }

    const index = this.all.map(song => song.id).indexOf(this.current.id) + 1

    return index >= this.all.length ? undefined : this.all[index]
  },

  get previous () {
    if (!this.current) {
      return this.last
    }

    const index = this.all.map(song => song.id).indexOf(this.current.id) - 1

    return index < 0 ? undefined : this.all[index]
  },

  get current () {
    return this.state.current
  },

  set current (song) {
    this.state.current = song
  },

  shuffle () {
    this.all = shuffle(this.all)
  }
}