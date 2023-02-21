function check(num: number) {
  if (num < 10) {
    return '0' + num
  } else {
    return num
  }
}

export const formatDate = (s: string): { timeText: string; week: string } => {
  // 格式化时间为 YYYY-MM-DD HH:MM:SS
  const date = new Date(s)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const timeText = `${check(month)}月${check(day)}  ${check(hours)}:${check(minutes)}`
  const nowDay = date.getDay()
  const weeks = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六')
  const week = weeks[nowDay]
  return { timeText, week }
}
