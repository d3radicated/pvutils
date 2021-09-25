import { createStore } from 'vuex'
import farm from '@/modules/farm'
import session from '@/modules/session'

export default createStore({
  modules: {
    farm,
    session
  },
});
