import _ from 'lodash'
import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import { collection, getDocs } from 'firebase/firestore'
import dayjs from '@/plugins/dayjs'
import { db } from '@/plugins/firebase'
import { Elements } from './farm'

export enum Seasons {
  Spring = 'Spring',
  Summer = 'Summer',
  Autumn = 'Autumn',
  Winter = 'Winter',
}

export enum WeatherEvents {
  Cloudy = 'Cloudy',
  ColdWave = 'Cold Wave',
  CoronalMassEjection = 'Coronal Mass Ejection',
  Earthquake = 'Earthquake',
  Flood = 'Flood',
  HeatWave = 'Heat Wave',
  Hurricanes = 'Hurricanes',
  IronRain = 'Iron Rain',
  LocustsSwarm = 'Locusts Swarm',
  MagneticReconnection = 'Magnetic Reconnection',
  Malaria = 'Malaria',
  Moonlight = 'Moonlight',
  ProtonStorm = 'Proton Storm',
  Rainy = 'Rainy',
  RatsSwarm = 'Rats Swarm',
  Snowy = 'Snowy',
  SolarFlares = 'Solar Flares',
  SolarMaxima = 'Solar Maxima',
  Sunny = 'Sunny',
  Thunderstorm = 'Thunderstorm',
  Tornado = 'Tornado',
  Tsunami = 'Tsunami',
  Volcano = 'Volcano',
  Windy = 'Windy',
  WinterStorm = 'Winter Storm',
}

export type Effects = {
  [element in Elements]?: number
}

export type DateEvents = {
  [date: string]: WeatherEvents
}

export interface State {
  dateEvents: DateEvents

  readonly weatherEvents: {
    [event in WeatherEvents]: Effects
  }
}

export const useWeatherStore = defineStore('weather', {
  state: () =>
    <State>{
      dateEvents: {},

      weatherEvents: {
        [WeatherEvents.Cloudy]: {
          [Elements.Light]: -0.1,
          [Elements.Wind]: -0.5,
        },
        [WeatherEvents.ColdWave]: {
          [Elements.Fire]: -0.6,
          [Elements.Ice]: 1.2,
        },
        [WeatherEvents.CoronalMassEjection]: {
          [Elements.Fire]: 0.4,
          [Elements.Light]: 1,
        },
        [WeatherEvents.Earthquake]: {
          [Elements.Metal]: 1,
          [Elements.Wind]: 0.5,
        },
        [WeatherEvents.Flood]: {
          [Elements.Metal]: -1,
          [Elements.Water]: 1,
        },
        [WeatherEvents.HeatWave]: {
          [Elements.Dark]: 0.1,
          [Elements.Fire]: 1,
          [Elements.Ice]: -0.6,
          [Elements.Light]: 0.2,
          [Elements.Water]: -0.3,
        },
        [WeatherEvents.Hurricanes]: {
          [Elements.Dark]: 0.4,
          [Elements.Electro]: 0.5,
          [Elements.Fire]: -0.4,
          [Elements.Ice]: 0.4,
          [Elements.Light]: -0.2,
          [Elements.Water]: 0.5,
          [Elements.Wind]: 0.5,
        },
        [WeatherEvents.IronRain]: {
          [Elements.Metal]: 1.2,
          [Elements.Water]: 0.4,
        },
        [WeatherEvents.LocustsSwarm]: {
          [Elements.Parasite]: 1,
        },
        [WeatherEvents.MagneticReconnection]: {
          [Elements.Electro]: 0.5,
          [Elements.Metal]: 0.5,
        },
        [WeatherEvents.Malaria]: {
          [Elements.Parasite]: 1,
        },
        [WeatherEvents.Moonlight]: {
          [Elements.Dark]: 4,
        },
        [WeatherEvents.ProtonStorm]: {
          [Elements.Light]: 2,
        },
        [WeatherEvents.Rainy]: {
          [Elements.Fire]: -0.3,
          [Elements.Water]: 1,
          [Elements.Metal]: -0.3,
        },
        [WeatherEvents.RatsSwarm]: {
          [Elements.Parasite]: 1,
        },
        [WeatherEvents.Snowy]: {
          [Elements.Fire]: -0.4,
          [Elements.Ice]: 1,
          [Elements.Water]: 0.6,
        },
        [WeatherEvents.SolarFlares]: {
          [Elements.Fire]: 0.8,
          [Elements.Light]: 0.8,
        },
        [WeatherEvents.SolarMaxima]: {
          [Elements.Fire]: 0.4,
          [Elements.Light]: 1,
        },
        [WeatherEvents.Sunny]: {
          [Elements.Fire]: 0.6,
          [Elements.Water]: -0.3,
        },
        [WeatherEvents.Thunderstorm]: {
          [Elements.Dark]: 1,
          [Elements.Electro]: 1,
          [Elements.Light]: -0.2,
          [Elements.Metal]: -0.2,
          [Elements.Water]: 0.1,
        },
        [WeatherEvents.Tornado]: {
          [Elements.Dark]: 0.5,
          [Elements.Electro]: 0.5,
          [Elements.Light]: -0.4,
          [Elements.Water]: 0.2,
          [Elements.Wind]: 1,
        },
        [WeatherEvents.Tsunami]: {
          [Elements.Dark]: 0.2,
          [Elements.Fire]: -0.4,
          [Elements.Ice]: 0.3,
          [Elements.Light]: -0.2,
          [Elements.Water]: 0.6,
        },
        [WeatherEvents.Volcano]: {
          [Elements.Fire]: 1,
          [Elements.Ice]: -0.4,
          [Elements.Metal]: 0.4,
          [Elements.Water]: -0.2,
        },
        [WeatherEvents.Windy]: {
          [Elements.Wind]: 0.5,
          [Elements.Light]: 0.2,
        },
        [WeatherEvents.WinterStorm]: {
          [Elements.Electro]: 0.5,
          [Elements.Fire]: -0.4,
          [Elements.Ice]: 0.6,
          [Elements.Light]: -0.2,
          [Elements.Wind]: 0.1,
        },
      },
    },

  getters: {
    getEffectsOnDate:
      (state) =>
      (date: string): Effects => {
        const event = state.dateEvents[date]

        return event ? state.weatherEvents[event] : {}
      },

    hasEventToday: (state) => {
      return dayjs.utc().format('YYYY-MM-DD') in state.dateEvents
    },
  },

  actions: {
    async fetchDateEvents() {
      const dateEventsCollection = collection(db, 'date_events')
      const snapshot = await getDocs(dateEventsCollection)

      const dateEvents = _.chain(snapshot.docs)
        .keyBy((document) => {
          return document.id
        })
        .mapValues((document) => {
          return document.get('weather_event')
        })
        .value()

      this.setDateEvents(dateEvents)
    },

    getDateEventsFromStorage() {
      this.dateEvents =
        LocalStorage.getItem<DateEvents>('Pvu-Date-Events') || {}
    },

    setDateEvents(events: Record<string, WeatherEvents>) {
      this.dateEvents = events

      LocalStorage.set('Pvu-Date-Events', this.dateEvents)
    },
  },
})
