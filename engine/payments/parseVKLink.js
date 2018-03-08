function parseVKLink (link) {
  const photoRegex = /=photo([0-9]{1,18})_([0-9]{1,40})%/
  const postRegex = /=wall([0-9]{1,18})_([0-9]{1,40})/
  const groupPostRegex = /=wall(-[0-9]{1,30})_([0-9]{1,40})/

  /*
    This matches any photo (not wallpost)
  */
  if (link.match(photoRegex)) {
    const [result, userId, photoId] = link.match(photoRegex)
    return {
      type: 'photo',
      userId,
      itemId: photoId
    }
  }

  /*
    This matches any wallpost on userpage (not in public page)
  */
  if (link.match(postRegex)) {
    const [result, userId, postId] = link.match(postRegex)
    return {
      type: 'post',
      userId,
      itemId: postId
    }
  }

  /*
    This matches any wallpost on public page (not in userpage)
  */
  if (link.match(groupPostRegex)) {
    const [result, userId, postId] = link.match(groupPostRegex)
    return {
      type: 'post',
      userId,
      itemId: postId
    }
  }

  return {
    type: 'undefined',
    userId: 'undefined',
    itemId: 'undefined'
  }
}

module.exports = parseVKLink