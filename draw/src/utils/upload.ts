import request from './request'

function dataURLtoBlob(dataurl: any) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

export default function upload(dataurl: string, userName: string, photo: string): Promise<any> {
  return new Promise((resolve) => {
    let blob = dataURLtoBlob(dataurl)
    let form = new FormData()
    form.append('file', blob, 'img.png')
    form.append('userName', userName)
    form.append('photo', photo)
    request
      .post('/file/upload', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        resolve(res)
      })
  })
}
