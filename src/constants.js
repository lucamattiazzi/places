const existingSeed = window.location.hash

if (existingSeed.length < 2) {
  const seed = Math.random()
    .toString(36)
    .split('.')[1]
  window.location.hash = `#${seed}`
}

export const randomSeed = window.location.hash.slice(1)
export const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN
export const CENTER = {
  latitude: 41.61269,
  longitude: 12.164794,
}
export const MIN_DIST = 0.7

const RAW_PEOPLE = [
  'AMIN AL HAZWANI',
  'ARIANNA MERONI',
  'BENEDETTA BELPASSO',
  'CESARE SOLDINI',
  'DAVIDE GRIMOLDI',
  'EDOARDO GUIDO',
  'ELISA SPIGAI',
  'GIOVANNI MAGNI',
  'GIOVANNI MARCHI',
  'ILARIA VENTURINI',
  'IRENE TROTTA',
  'IVAN ROSSI',
  'LUCA FALASCO',
  'LUCA MATTIAZZI',
  'ALESSIO IZZO',
  'MARCO FUGARO',
  'MARCO MEZZADRA',
  'MARIANO VIOLA',
  'FLAVIO BERNASCONI',
  'OTHO MANTEGAZZA',
  'PIETRO GUINEA MONTALVO',
  'RUGGERO CASTAGNOLA',
  'TOMMASO POLETTI',
  'SERENA GIRARDI',
  'STEFANIA GUERRA',
  'STEFANO GALLO',
  'VITO LATROFA',
  'ALESSANDRO ZOTTA',
  'TOMMASO RENZINI',
  'ANDREA BIGGIO',
  'MARCO BERNARDI',
  'SARA CONFALONIERI',
  'DAVIDE CIUFFI',
  'MARTA PALMISANO',
  'SIMONE QUADRI',
  'MATTEO FABBRI',
].sort((a, b) => (a > b ? 1 : -1))

export const PEOPLE = RAW_PEOPLE.map(p =>
  p
    .split(' ')
    .map(w => `${w[0].toUpperCase()}${w.slice(1).toLowerCase()}`)
    .join(' ')
)
export const BASE_SCALE = 0.25
export const italy = require('./italy.json')
export const bbox = [6.749955, 36.619987, 18.480247, 47.115393]
