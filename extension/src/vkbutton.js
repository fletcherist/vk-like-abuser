(function () {
  const API = 'https://api.vk.com/method'
  const env = 'DEBUG'
  // const env = 'PRODUCTION'

  // chrome.storage.local.get(null, function (storage) {

  //   const { user_id, access_token, username,
  //
  //     timeForGettingTasks,
  //     timeForNextTask,
  //     tasks,
  //
  //     _tabsCount
  //
  //   } = storage
  //
  //   if (!timeForNextTask || !timeForGettingTasks) {
  //     if (!timeForGettingTasks) {
  //       setTimeForGettingTasks()
  //     }
  //
  //     if (!timeForNextTask) {
  //       setTimeForNextTask()
  //     }
  //   } else {
  //     // Everything is ok
  //     if (isReadyForGettingTasks(timeForGettingTasks)) {
  //       let time = Date.now() + 1000 * 120
  //
  //       // getTasks({user_id, access_token})
  //       //   .then(tasks => {
  //       //     console.log(tasks)
  //       //   })
  //       //   .catch(e => {
  //       //     console.log(e)
  //       //   })
  //
  //       setTimeForGettingTasks(time)
  //     }
  //
  //     if (isReadyForNewTask(timeForNextTask)) {
  //       // setTimeout(() => {
  //       //   getTasks({user_id, access_token})
  //       //     .then(tasks => {
  //       //       if (tasks.length === 0) {
  //       //         return setTimeForNextTask(Date.now() + 1000 * 120)
  //       //       }
  //       //       const task = tasks[0]
  //       //       Tasks.doTask(task).then(r => {
  //       //         console.log(tasks)
  //       //         tasks = tasks.shift()
  //       //         Tasks.save(tasks)
  //       //         Tasks.markAsDone(task)
  //
  //       //         return setTimeForNextTask(Date.now() + 1000 * 60)
  //       //       })
  //       //     })
  //       // }, 1000)
  //     }
  //   }
  // })

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
