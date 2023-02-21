export type user = {
  scoketID: string
  name: string
  photo: string
  winNumber: number
}

export interface IRoom {
  roomName: string
  size: number
  current_person_num: number
  image: string
  userList: user[]
  activeUser: number
  answer: string
  start: boolean
  hint: number
}
