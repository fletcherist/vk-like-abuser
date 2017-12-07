const APP_VERSION = '0.4.0'
// const ENV = 'debug'
const VKABUSER_SERVER = 'https://vkabuser.fletcherist.com:8080'
// const VKABUSER_SERVER = 'http://localhost:8080'
const TELEGRAM_CHANNEL = 'https://t.me/joinchat/AAAAAEN_IDZdpjLdsWIaDg'
const YANDEX_MONEY_WALLET_ID = '410014627089651'
// const ENV = 'production'

Vue.component('preloader', {
  template: `
    <div class="vk-like-preloader">
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="75" width="75" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" stroke-width="8"/></svg>
    </div>
  `
})

Vue.component('yandex-money-logo', {
  template: `
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><title>22-ym</title><g fill="none" fill-rule="evenodd"><path d="M19.419 9.152H4.583C3.712 9.152 3 9.864 3 10.735v9.574c0 .87.712 1.582 1.583 1.582h14.836V9.152z" fill="#FAC514"/><path d="M3 20.309v-9.574c0-.87.712-1.583 1.583-1.583h12.23v7.642L4.75 20.719 3 20.309z" fill="#D7AB05"/><path d="M14.353 0v13.98L4.359 20.79 3 20.012V10.71c0-1.212.102-1.982 2.612-3.856C7.691 5.303 14.352 0 14.352 0" fill="#FAC514"/><path d="M10.506 8.694c.545-.65 1.34-.878 1.777-.511.436.366.349 1.189-.195 1.838-.545.648-1.34.878-1.776.51-.437-.365-.35-1.189.194-1.837" fill="#020202"/></g></svg>
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
      <div class='help__right'>
        <span class='text-grey'>
          <a class='text-grey' href='https://vk.com/fletcherist' target='_blank'>
            Филипп Романов
          </a>
          © 2017
        </span>
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

Vue.component('progress-bar', {
  props: ['progress'],

  template: `
    <div class='progress-bar' v-bind:style="{
      width: (progress > 100 ? 100 : progress) + '%',
    }"></div>
  `
})

Vue.component('payments-realtime-likes', {
  template: `
    <div class='realtime-likes'>
      <div v-if='isLoaded'>
        <div v-for='like in getLikes' class="realtime-likes__like realtime-likes__like--payments">
          <div :key='like.item' class="realtime-likes__container realtime-likes__container--payments">
            <a href='https://vk.com/id{{like.object.id}}' target='_blank' class='no-underline'>
              <img :src='like.object.photo_100' class='realtime-likes__photo realtime-likes__photo--payments'/>
            </a>
            <svg class="realtime-likes__arrow realtime-likes__arrow--payments" fill="#55677d" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
            <a href='https://vk.com/id{{like.target.id}}' target='_blank'>
              <img :src='like.target.photo_100' class='realtime-likes__photo realtime-likes__photo--payments' />
            </a>
          </div>
        </div>
      </div>
      <div v-else class="realtime-likes__preloader">
        <preloader></preloader>
      </div>
      </div>
    </div>`,
  props: ['realtimeLikes', 'data'],
  computed: {
    getLikes: function () {
      console.log(this.data)
      if (this.data && this.data.length > 0) {
        let likes = this.data.reverse()
        return likes
      }
      return []
    },
    isLoaded: function () {
      return (this.data && this.data.length > 0)
    }
  }
})

const STATUSES = Object.freeze({
  CREATED: 'created',
  WAITING_PAYMENT: 'waitingPayment',
  IN_PROGRESS: 'inProgress',
  DONE: 'done',
  FAILED: 'failed'
})

Vue.component('money-spender', {
  data: function () {
    return {
      types: [
        { amount: 50, price: 19, signature: '01' },
        { amount: 100, price: 39, signature: '02' },
        { amount: 500, price: 149, signature: '03' }
      ],
      linkInput: '',
      status: null,
      selectedType: -1,
      progressPercents: 1,
      progress: 0,
      STATUSES: STATUSES,
      payLink: '',
      realtimeLikes: []
    }
  },
  template: `
    <div class='wrapper wrapper--next'>
      <div>Мгновенные лайки ⚡️  поддержать разработку</div>
      <div class='text-grey'>(Накрутим меньше, чем за минуту)</div>
      <input
        class='shop__input'
        v-bind:class="{
            'shop__input--valid': this.status === 'valid',
            'shop__input--invalid': this.status === 'invalid'
          }"
        placeholder='Вставьте сюда ссылку на фотографию или пост'
        v-model='linkInput'
        v-on:input='throttledChangeHandler'
      />
      <div v-if="this.status === 'invalid'" class='text-grey' style='padding: 5px 0px;'>
        Неправильная ссылка. Вы точно не ошиблись?
      </div>
      <div class='shop__items'>
        <div class='shop__item shop__item--disabled' v-on:click='selectType(0)' v-bind:class="{
            'shop__item--selected': this.selectedType === 0,
            'shop__item--disabled': !this.status || !(this.status === 'invalid')
          }">
          <div class='shop__emoji'>❤️</div>
          <div class='shop__description'>{{{types[0].amount}}} лайков</div>
          <div class='shop__price'>Купить за {{{types[0].price}}}₽</div>
        </div>
        <div class='shop__item' v-on:click='selectType(1)' v-bind:class="{
            'shop__item--selected': this.selectedType === 1,
            'shop__item--disabled': !this.status || !(this.status === 'invalid')
          }">
          <div class='shop__emoji'>💗</div>
          <div class='shop__description'>{{{types[1].amount}}} лайков</div>
          <div class='shop__price'>Купить за {{{types[1].price}}}₽</div>
        </div>
        <div class='shop__item' v-on:click='selectType(2)' v-bind:class="{
            'shop__item--selected': this.selectedType === 2,
            'shop__item--disabled': !this.status || !(this.status === 'invalid')
          }">
          <div class='shop__emoji'>💎</div>
          <div class='shop__description'>{{{types[2].amount}}} лайков</div>
          <div class='shop__price'>Купить за {{{types[2].price}}}₽</div>
        </div>
      </div>
      <div>
        <div v-if="status === 'valid' && selectedType > -1" class='navigation__button navigation__button-full-width' v-on:click='handlePressContinue'>Продолжить</div>
        <div v-if='status === STATUSES.IN_PROGRESS'>
          <div class='navigation__button navigation__button-full-width navigation__button--not-selected' v-on:click='handlePressCancel'>Отменить</div>
          <div>Накрутка началась. Смотрите, как быстро!</div>
          <progress-bar v-bind:progress='progressPercents'></progress-bar>
          <div class='progress-counter'>{{{progress}}}/{{{types[selectedType].amount}}}</div>
          <payments-realtime-likes :data='realtimeLikes'></payments-realtime-likes>
        </div>
        <div v-if='status === STATUSES.DONE'>
          <div>Готово. Лайки поставлены!</div>
          <progress-bar v-bind:progress='progressPercents'></progress-bar>
          <div class='progress-counter'>{{{progress}}}/{{{types[selectedType].amount}}}</div>
        </div>
        <div v-if='status === STATUSES.WAITING_PAYMENT'>
          Отлично! Ваш заказ в ожидании оплаты. Накрутка начнётся сразу сразу после оплаты.
          <a href={{{payLink}}} target='_blank' class='no-underline'>
            <div class='navigation__button navigation__button-full-width navigation__button--not-selected' style='display: flex; align-items: center;
               margin-top: 10px;'>
              <yandex-money-logo></yandex-money-logo>
              <div style='width: 100%'>Оплатить Яндекс.Деньгами или картой</div>
            </div>
          </a>
        </div>
      </div>
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
      }).then(res => res.json())
        .then(res => {
          console.log(res)
          const { type } = res
          if (!type || type === 'undefined') {
            this.status = 'invalid'
          } else {
            this.status = 'valid'
          }
        })
      console.log(this.status)
    },
    handlePressContinue: function () {
      var self = this
      fetch(`${VKABUSER_SERVER}/payments/create`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: this.linkInput,
          taskSignature: this.types[this.selectedType].signature,
          ownerUserId: fromCache.user_id.get()
        })
      }).then(res => res.json())
        .then(res => {
          const { status, paymentTaskId } = res
          if (status === 'error') {
            alert('Извините, ошибка!')
            return false
          }
          self.connectToPaymentsFirebase(paymentTaskId)
          this.payLink = `https://money.yandex.ru/quickpay/confirm.xml?receiver=${YANDEX_MONEY_WALLET_ID}&` +
            `formcomment=${encodeURIComponent(`VK Like Abuser — ${this.types[this.selectedType].amount} лайков`)}` +
            `&short-dest=@RobotCashBot&quickpay-form=donate&targets=Пополнение%20баланса&label=${paymentTaskId}&sum=1&paymentType=PC`
          // window.open(payLink)
        })
    },
    handlePressCancel: function () {

    },
    selectType: function (type) {
      if ([STATUSES.CREATED, STATUSES.WAITING_PAYMENT, STATUSES.IN_PROGRESS, STATUSES.DONE].includes(this.status)) {
        return false
      }
      this.selectedType = type
    },
    connectToPaymentsFirebase: function (paymentTaskId) {
      let self = this
      console.log(paymentTaskId)
      const paymentTask = db.ref(`/payments/${paymentTaskId}`)
      paymentTask.once('value')
      paymentTask.on('value', _task => {
        const task = _task.val()
        if (!task) {
          console.error('No task')
          return false
        }
        console.log(task)
        self.progress = task.progress
        self.progressPercents = (self.progress / self.types[self.selectedType].amount) * 100
        self.status = task.status
        self.realtimeLikes = task.realtime_likes ? Object.values(task.realtime_likes) : []
        console.log(self.realtimeLikes)
      })
    }
  },
  computed: {
    throttledChangeHandler: function () {
      return throttle(this.inputChangeHalder, 3000)
    }
  }
})

// https://vk.com/fletcherist?z=photo96170043_456239376%2Fphotos96170043
