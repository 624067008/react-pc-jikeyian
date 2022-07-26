import LoginStore from "./loginStore";
import UserStore from "./user.store";
import ChannelStore from './channel.store'
import React from "react";
class RootStore {
  constructor() {

    this.userStore = new UserStore()
    this.loginStore = new LoginStore()
    this.channelStore = new ChannelStore()
  }
}

const rootStore = new RootStore()
const context = React.createContext(rootStore)
const useStore = () => React.useContext(context)

export { useStore }