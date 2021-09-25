import { StoreOptions } from 'vuex'

interface State {
  farms: any[]
}

export default <StoreOptions<any>>({
  state: <State>({
    farms: [],
  }),
})
