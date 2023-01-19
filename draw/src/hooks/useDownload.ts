export const useDownload = (uri: string) => {
  const link: HTMLAnchorElement = document.createElement('a')
  link.download = '你画我猜image'
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
