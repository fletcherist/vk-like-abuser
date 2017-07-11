const getMonth = time => {
    if (!time) return false
    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель',
        'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ]
    time = new Date(time)
    return months[time.getMonth() + 1]
}

const getMonthShort = time => {
    if (!time) return false
    const months = [
        'янв', 'фев', 'мар', 'апр',
        'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
    ]
    time = new Date(time)
    return months[time.getMonth()]
}

/*
  Ex. 1994293 → 1 994 293
      431943 → 431 943 etc.
*/
function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")
}