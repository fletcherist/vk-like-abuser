# vk-free-likes

const paymentTask = {
  // Id of the task (generates automatically)
  id: String,

  // One of the following types
  type: ['photo', 'post', 'groupPost'],
  // Id of the item to like
  itemId: Number,
  // Id of the user, who owns that item
  userId: Number,
  // User, who created this task
  ownerUserId: Number,

  // There's a timestamp for each status
  timestamps: {
    created: String,
    waitingPayment: String,
    inProgress: String,
    done: String,
    failed: String
  },

  // One of the following
  status: [
    'created',
    'waitingPayment',
    'inProgress',
    'done',
    'failed'
  ]
}