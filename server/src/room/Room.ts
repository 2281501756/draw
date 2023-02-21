export type user = {
  scoketID: string;
  name: string;
  photo: string;
  winNumber: number;
  boutScore: boolean;
};

interface IRoom {
  roomName: string;
  size: number;
  current_person_num: number;
  image: string;
  userList: user[];
  activeUser: number;
  answer: string;
  start: boolean;
  hint: number;
}

export default class Room implements IRoom {
  constructor(
    public roomName: string,
    public size: number,
    public current_person_num: number,
    public image: string,
    public userList: user[] = [],
    public activeUser: number = 0,
    public answer: string = '',
    public start: boolean = false,
    public hint: number = 0,
  ) {}
}
