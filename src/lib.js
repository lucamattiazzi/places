import { ACCESS_TOKEN, randomSeed, italy, bbox, MIN_DIST } from './constants'
import * as inside from 'point-in-geopolygon'
import * as seedrandom from 'seedrandom'

function fuggiDaFoggia() {
  const CENTER = [15.63678, 41.713932]
  const point = [CENTER[0] + 0.005 - Math.random() / 100, CENTER[1] + 0.005 - Math.random() / 100]
  return point
}

function accurat() {
  return [9.215831, 45.488379]
}

function randomPointInGeojson(randomGenerator, usedPoints) {
  if (randomSeed === 'doc') return fuggiDaFoggia()
  if (randomSeed === 'accurat') return accurat()
  const point = [
    bbox[0] + randomGenerator() * (bbox[2] - bbox[0]),
    bbox[1] + randomGenerator() * (bbox[3] - bbox[1]),
  ]
  const isInside = inside.feature(italy, point)
  if (isInside === -1) return randomPointInGeojson(randomGenerator, usedPoints)
  const sqDist = findClosestManhDist(point, usedPoints)
  if (sqDist < MIN_DIST) return randomPointInGeojson(randomGenerator, usedPoints)
  return point
}

function findClosestManhDist(point, points) {
  let minDist = Infinity
  for (const dest of points) {
    const dist = Math.abs(point[0] - dest[0]) + Math.abs(point[1] - dest[1])
    minDist = Math.min(minDist, dist)
  }
  return minDist
}

export async function getRandomAddress(person, usedAddresses, randomGenerator) {
  const random = randomGenerator || seedrandom(`${randomSeed}-${person}`)
  const randomPoint = randomPointInGeojson(random, usedAddresses)
  const coords = randomPoint.join(',')
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords}.json?access_token=${ACCESS_TOKEN}`
  const response = await window.fetch(url).then(res => res.json())
  const { features } = response
  if (features.length === 0) return getRandomAddress(person, usedAddresses, random)
  const point = features.find(f => f.place_type.includes('country'))
  if (!point) return getRandomAddress(person, usedAddresses, random)
  const isItaly = point.properties.short_code === 'it'
  if (!isItaly) return getRandomAddress(person, usedAddresses, random)
  const address = features.find(f => f.place_type.includes('address'))
  if (!address) return getRandomAddress(person, usedAddresses, random)
  return address
}
