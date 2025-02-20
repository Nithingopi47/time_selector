import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

// Font Awesome imports
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faCalendarDay,
  faCalendar,
  faCalendarWeek,
  faTrash,
  faPlus,
  faSave
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Add icons to library
library.add(
  faCalendarDay,
  faCalendar,
  faCalendarWeek,
  faTrash,
  faPlus,
  faSave
)

// Register FontAwesome component
Vue.component('vue-fontawesome', FontAwesomeIcon)

// Configure Buefy
Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas'
})

import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
