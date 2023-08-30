const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
const moment = require('moment')
module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: (a) => dayjs(a).fromNow(),
  hourTime: (a) => dayjs(a).format('A HH:mm'),
  dateTime: (a) => dayjs(a).format('YYYY/MM/DD'),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  },
  rawHelper: (options) => {
    return options.fn();
  },
  moment: function (a) {
    moment.locale('zh-tw')
    return moment(a).fromNow()
  },
  momentA: function (a) {
    return moment(a).format("YYYY-MM-DD LT")
  },
  thousandComma: function (num) {

    let result = '', counter = 0

    num = (num || 0).toString()
    for (let i = num.length - 1; i >= 0; i--) {
      counter++
      result = num.charAt(i) + result
      if (!(counter % 3) && i !== 0) { result = ',' + result }
    }
    return result
  },
  momentDetailTime: function (a) {
    moment.locale('zh-tw')
    return moment(a).format('a h:mm')
  },
  momentDetailDate: function (a) {
    moment.locale('zh-tw')
    return moment(a).format("LL")
  }
};
