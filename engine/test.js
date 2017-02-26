const VKApi = require('node-vkapi')
const vk = new VKApi({
  token: '65dba8b4894bcaa7be638447bae9750b94551bde59f30ecf949a3fec634455127db5b68e0865d69ea33a8'
})
vk.call('likes.add', {
  type: 'photo',
  owner_id: '96170043',
  item_id: '456239077'
}).then(r => {
  console.log(r)
}).catch(e => {
  console.log(e)
})