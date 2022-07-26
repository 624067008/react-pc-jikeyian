import { makeAutoObservable } from "mobx";
import { http } from "@/utils";

class ChannelStore {
  ChannelList = []
  constructor() {
    makeAutoObservable(this)
  }

  getChannelList = async () => {
    const res = await http.get('/channels')
    this.ChannelList = res.data.channels
  }
}

export default ChannelStore