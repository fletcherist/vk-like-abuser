(function () {
  const API = 'https://api.vk.com/method'
  const env = 'DEBUG'
  // const env = 'PRODUCTION'

  const likes = document.querySelectorAll('.post_full_like_wrap')
  likes.forEach(like => {
    const abuserLike = document.createElement('div')
    abuserLike.innerHTML = `
      <div class="post_full_like">
        <a href="#" class="post_like _like_wrap" onmouseover="Wall.likesShow(this, '96170043_2978')" onclick="return Wall.likeIt(this, '96170043_2978', '021bd792e087413206', event);">
        <i class="post_like_icon _icon"></i>
        <span class="post_like_link _link">Накрутить</span>
        </a>
      </div>
    `

    const postLikes = like.querySelector('.post_full_like')
    like.appendChild(abuserLike)
  })
})()
