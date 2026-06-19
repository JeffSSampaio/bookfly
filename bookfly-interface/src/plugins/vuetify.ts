/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
// Styles
import '@mdi/font/css/materialdesignicons.css'
import { pt } from 'vuetify/locale'
import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
const root = {
    dark: false,
    colors:{
     'darkGreen': '#1B3A2D',
    'midGreen': '#2E5C44',
    'brightGreen': '#4E7C52',
    'brightGreen2': '#70b175',
    'ivory': '#F5EDD8',
    'golden': '#C9A836',
    'brown': '#7a5b2a',
    'offWhite': '#f9f9f9',
    'wine': '#4A1521',
    'wine2': '#5C1D24',
    'blueDark': '#1A3644',
    'blueNaive': '#1B263B',
    'badgeYellow': '#FFF3C4',
    'badgeGreen': '#D6F0E0',
    'badgeRed': '#FAD4D4',


    background: '#F5EDD8', 
    surface: '#ffffff',    
    primary: '#1B3A2D',   
    error: '#974040',
    }
}


export default createVuetify({
  theme: {
    defaultTheme: 'root',
    themes:{
      root
    }
  },
  locale:{
    locale:'pt',
    fallback:'en',
    messages:{pt}
  }
})
