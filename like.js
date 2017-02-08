const VKApi = require('node-vkapi');
const ACCESS_TOKEN = 'bd7026f0b47f6ed7212ccc4f5d56f54b20d26d10c617731ddcfc7c8007b9bd5ea634806e064bf87b5a754'

'https://oauth.vk.com/authorize?client_id=5855244&scope=wall,friends,offline&redirect_uri=https://oauth.vk.com/blank.html&display=popup&v=5.17&response_type=token'

const VK = new VKApi({
  token: ACCESS_TOKEN
})

VK.call('likes.add', {
  type: 'post',
  owner_id: 142395293,
  item_id: 318
}).then(res => {
  console.log(res)
})