const APP_VERSION = '0.3.7'
// const ENV = 'debug'
const VKABUSER_SERVER = 'https://vkabuser.fletcherist.com'
// const VKABUSER_SERVER = 'http://localhost:5000'
const TELEGRAM_CHANNEL = 'https://t.me/joinchat/AAAAAEN_IDZdpjLdsWIaDg'
// const ENV = 'production'

Vue.component('preloader', {
  template: `
    <div class="vk-like-preloader">
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="75" width="75" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" stroke-width="8"/></svg>
    </div>
  `
})

Vue.component('telegram-logo', {
  template: `
  <svg width="50px" height="50px" class="telegram-logo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 240 240">
    <defs>
    <linearGradient id="b" x1="0.6667" y1="0.1667" x2="0.4167" y2="0.75">
      <stop stop-color="#37aee2" offset="0"/>
      <stop stop-color="#1e96c8" offset="1"/>
    </linearGradient>
    <linearGradient id="w" x1="0.6597" y1="0.4369" x2="0.8512" y2="0.8024">
      <stop stop-color="#eff7fc" offset="0"/>
      <stop stop-color="#fff" offset="1"/>
    </linearGradient>
    </defs>
    <circle cx="120" cy="120" r="120" fill="url(#b)"/>
    <path fill="#c8daea" d="m98 175c-3.8876 0-3.227-1.4679-4.5678-5.1695L82 132.2059 170 80"/>
    <path fill="#a9c9dd" d="m98 175c3 0 4.3255-1.372 6-3l16-15.558-19.958-12.035"/>
    <path fill="url(#w)" d="m100.04 144.41 48.36 35.729c5.5185 3.0449 9.5014 1.4684 10.876-5.1235l19.685-92.763c2.0154-8.0802-3.0801-11.745-8.3594-9.3482l-115.59 44.571c-7.8901 3.1647-7.8441 7.5666-1.4382 9.528l29.663 9.2583 68.673-43.325c3.2419-1.9659 6.2173-0.90899 3.7752 1.2584"/>
  </svg>
  `
})

Vue.component('ok-svg', {
  template: `
    <svg width="45px" height="45px" viewBox="0 0 45 45" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="1492806668_Check_Circle" fill="#7BCD7F">
                <g id="Group">
                    <g id="TabBar-Icons">
                        <g id="Check-Circle">
                            <path d="M22.5,45 C34.9264069,45 45,34.9264069 45,22.5 C45,10.0735931 34.9264069,0 22.5,0 C10.0735931,0 0,10.0735931 0,22.5 C0,34.9264069 10.0735931,45 22.5,45 L22.5,45 L22.5,45 Z M22.5,43.2 C33.9322943,43.2 43.2,33.9322943 43.2,22.5 C43.2,11.0677057 33.9322943,1.8 22.5,1.8 C11.0677057,1.8 1.8,11.0677057 1.8,22.5 C1.8,33.9322943 11.0677057,43.2 22.5,43.2 L22.5,43.2 Z M17.1014155,30.2257922 L9.68162339,22.8060002 L8.40883118,24.0787924 L17.3183766,32.9883377 L18.5911688,31.7155455 L18.3742078,31.4985845 L36.2823376,13.5904546 L35.0095455,12.3176624 L17.1014155,30.2257922 L17.1014155,30.2257922 Z" id="Shape"></path>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
  `
})

Vue.component('not-ok-svg', {
  template: `
    <svg width="45px" height="45px" viewBox="0 0 45 45">
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="1492806668_Check_Circle-Copy">
                <g id="Group">
                    <g id="TabBar-Icons">
                        <g id="Check-Circle" fill="#CBCBCB">
                            <path d="M22.5,45 C34.9264069,45 45,34.9264069 45,22.5 C45,10.0735931 34.9264069,0 22.5,0 C10.0735931,0 0,10.0735931 0,22.5 C0,34.9264069 10.0735931,45 22.5,45 L22.5,45 L22.5,45 Z M22.5,43.2 C33.9322943,43.2 43.2,33.9322943 43.2,22.5 C43.2,11.0677057 33.9322943,1.8 22.5,1.8 C11.0677057,1.8 1.8,11.0677057 1.8,22.5 C1.8,33.9322943 11.0677057,43.2 22.5,43.2 L22.5,43.2 Z" id="Shape"></path>
                        </g>
                        <g id="remove" transform="translate(12.000000, 12.000000)" fill="#C8C8C8">
                            <g id="Capa_1">
                                <polygon id="Shape" points="20.4238571 0 10.802 9.69492857 1.10628571 0.0722857143 0.000785714286 1.188 9.69571429 10.8098571 0.0722857143 20.5055714 1.188 21.6126429 10.8106429 11.9177143 20.5055714 21.5403571 21.6126429 20.4246429 11.9177143 10.8027857 21.5403571 1.10707143"></polygon>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
  `
})

Vue.component('help', {
  template: `
    <div class='help'>
      <div>
        <span class='text-grey'>v${APP_VERSION}</span>
      </div>
    </div>
  `
})

Vue.component('like-exchanger', {
  template: `
    <div class="wrapper like-exchanger">
      <div>Быстрый обмен лайками</div>
      <div class="">Хотите обменяться лайками?</div>
      <div class="like-exchanger__container">
        <div class="like-exchanger__icon"
          @click="selectOK()"
          v-show='isStarted && !isSearching'>
          <ok-svg></ok-svg>
        </div>
        <div class="like-exchanger__search"
          @click='startSearching()'
          v-show='!isSearching'>
          <div class="like-exchanger__search_title">Поиск</div>
        </div>
        <div v-show='isSearching' class="like-exchanger__preloader">
          <preloader></preloader>
        </div>
        <div class="like-exchanger__icon"
          @click="selectNotOK()"
          v-show='isStarted && !isSearching'>
          <not-ok-svg></not-ok-svg>
        </div>
      </div>
    </div>
  `,
  data: function () {
    return {
      isStarted: false,
      isSearching: false
    }
  },
  methods: {
    startSearching: function () {
      this.isStarted = !this.isStarted
      this.isSearching = !this.isSearching

      fetch(`${VKABUSER_SERVER}/exchanger/get_target`)
        .then(r => r.text())
        .then(r => {
          console.log(r)
        })

      setTimeout(() => {
        this.isStarted = true
        this.isSearching = false
      }, 2000)
    },
    selectOK: function () {
      alert('ok selected')
    },
    selectNotOK: function () {
      alert('not ok selected')
    }
  },
  computed: {
    isLoading: function () {
      return this.isStarted && !this.isSearching
    }
  }
})

Vue.component('follow-us', {
  template: `
    <div class="follow-us">
      <div class="follow-us__text">
        Подписывайтесь на наш телеграм канал, чтобы получать последние новости
        об обновлениях и разработке.
      </div>
      <div class="follow-us__channels">
        <a href="${TELEGRAM_CHANNEL}" target="_blank" class="follow-us__channel no-underline">
          <telegram-logo></telegram-logo>
        </a>
      </div>
    </div>
  `
})

Vue.component('login-button', {
  data: function () {
    return {
      server: '5133221' // Default auth server
    }
  },
  init: function () {
    // Getting the most relevant auth server
    fetch(`${VKABUSER_SERVER}/server`)
      .then(r => r.json())
      .then(r => {
        if (r && r.server && r.server.clientId) {
          this.server = r.server.clientId
          fromCache.server.set(this.server)
        }
        console.log(r)
      })
      .catch(e => {
        console.log(e)
      })
  },
  template: `
    <a href='https://oauth.vk.com/authorize?client_id={{{server}}}&scope=wall,friends,offline&redirect_uri=https://oauth.vk.com/blank.html&display=popup&v=5.17&response_type=token'
      class='button' target='_blank'>Войти</a>
  `
})

const BLOG_SERVER_ADDRESS = 'https://blog.vkabuser.ru'
Vue.component('instant-news', {
  data: function () {
    return {
      title: 'Server is not responsible',
      timestamp: new Date(),
      isLoaded: false
    }
  },
  init: function () {
    fetch(`${BLOG_SERVER_ADDRESS}/api/latest`)
      .then(r => r.json())
      .then(r => {
        const { title, timestamp } = r
        if (title) this.title = title
        if (timestamp) this.timestamp = new Date(timestamp)
        this.isLoaded = true
      })
      .catch(e => console.error(e))
  },
  template: `
    <div class='wrapper wrapper--next news' v-if='isLoaded'>
      <div class='news__header'>Последние новости</div>
      <div class='news__container'>
        <div class='news__title'>
          <a href='${BLOG_SERVER_ADDRESS}' v-html='titleFormatted' target='_blank'></a>
        </div>
        <div class='news__timestamp' v-html='timestampFormatted'></div>
      </div>
    </div>
  `,
  computed: {
    titleFormatted: function () {
      return this.title.length > 45
        ? this.title.slice(0, 45) + '...'
        : this.title
    },
    timestampFormatted: function () {
      return `${this.timestamp.getDate()} ${getMonthShort(this.timestamp)}`
    }
  }
})

Vue.component('money-spender', {
  data: function () {
    return {
      linkInput: '',
      status: ''
    }
  },
  template: `
    <div class='wrapper wrapper--next'>
      Накрутка на конкретную фотку за бабки и быстро
      <input
        class='shop__input'
        placeholder='Вставьте сюда ссылку на фотографию или пост'
        v-model='linkInput'
        v-on:input='throttledChangeHandler'
      />
      <div>
        <div v-if="status === 'invalid'">
          invalid
        </div>
        <div v-if="status === 'valid">

        </div>
      </div>
      <div class='shop__items'>
        <div class='shop__item shop__item--disabled'>
          <div class='shop__emoji'>❤️</div>
          <div class='shop__description'>150 лайков</div>
          <div class='shop__price'>Купить за 50₽</div>
        </div>
        <div class='shop__item'></div>
        <div class='shop__item'></div>
      </div>
      <div class='navigation__button'>Продолжить</div>
    </div>
  `,
  methods: {
    inputChangeHalder: function () {
      const regex = /^https?:\/\/(.{1,10}\.)?vk.com/

      if (!this.linkInput.match(regex)) {
        return false
      }

      console.log(this.linkInput)
      fetch(`${VKABUSER_SERVER}/payments/test`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: this.linkInput
        })
      }).then(r => r.json())
        .then(r => {
          const { type } = r
          if (!type || type === 'undefined') {
            this.status = 'invalid'
          } else {
            this.status = 'valid'
          }
        })
      console.log(this.status)
    }
  },
  computed: {
    throttledChangeHandler: function () {
      return throttle(this.inputChangeHalder, 3000)
    }
  }
})

// https://vk.com/fletcherist?z=photo96170043_456239376%2Fphotos96170043
