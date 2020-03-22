import * as React from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import { getRandomAddress } from './lib'
import { ACCESS_TOKEN, CENTER, PEOPLE, BASE_SCALE } from './constants'

mapboxgl.accessToken = ACCESS_TOKEN

class Application extends React.Component {
  mapRef = React.createRef()
  map = null
  markers = {}

  constructor(props) {
    super(props)
    this.state = {
      people: [],
    }
  }

  async componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [CENTER.longitude, CENTER.latitude],
      zoom: 5.1,
    })
    this.map.once('load', this.generateMarkers)
  }

  generateMarkers = async () => {
    const usedAddresses = []
    for (const person of PEOPLE) {
      const position = await getRandomAddress(person, usedAddresses)
      usedAddresses.push(position.center)
      const { center, place_name } = position
      const container = document.createElement('div')
      container.className = 'marker'
      const element = document.createElement('div')
      container.appendChild(element)

      const personImageName = person
        .toLowerCase()
        .split(' ')
        .join('_')

      const image = `https://www.accurat.it/about/team/${personImageName}.png`
      const fallbackImage = `/${personImageName}.png`

      element.style.backgroundImage = `url(${image}), url(${fallbackImage})`
      element.style.transform = `scale(${BASE_SCALE})`

      new mapboxgl.Marker(container).setLngLat(center).addTo(this.map)

      const newPerson = {
        name: person,
        address: place_name.replace(', Italy', ''),
        marker: element,
        text: React.createRef(),
      }
      this.setState({ people: [...this.state.people, newPerson] })
    }
  }

  handleMouseEnter = person => () => {
    person.marker.style.transform = 'scale(1)'
    person.marker.parentElement.style.zIndex = '100'
    person.text.current.style.fontWeight = 'bold'
  }

  handleMouseLeave = person => () => {
    person.marker.style.transform = `scale(${BASE_SCALE})`
    person.text.current.style.fontWeight = 'normal'
    setTimeout(() => {
      person.marker.parentElement.style.zIndex = '1'
    }, 1000)
  }

  refresh = () => {
    window.location.hash = ''
    window.location.reload()
  }

  clipboard = () => {
    const tempElement = document.createElement('input')
    document.body.appendChild(tempElement)

    tempElement.value = window.location.href
    tempElement.select()
    document.execCommand('copy')
    document.body.removeChild(tempElement)
  }

  render() {
    return (
      <div className="w-100 h-100 flex flex-row">
        <div ref={this.mapRef} className="h-100 w-70" />
        <div className="h-100 w-30 flex flex-column">
          <div className="f3 ma3">Indirizzi</div>
          <div className="ma3 flex-auto overflow-auto">
            {this.state.people.map(person => (
              <div
                className="pb2 flex flex-column"
                onMouseEnter={this.handleMouseEnter(person)}
                onMouseLeave={this.handleMouseLeave(person)}
                key={person.name}
                ref={person.text}
              >
                <div className="f5">{person.name}</div>
                <div className="f7">{person.address}</div>
              </div>
            ))}
          </div>
          <hr className="bt1 b1 b--black w-80" />
          <div className="f4 ma3 flex flex-row items-center justify-around">
            <div className="pointer" onClick={this.refresh}>
              Rigenera
            </div>
            <div className="pointer" onClick={this.clipboard}>
              Copia link
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Application />, document.getElementById('app'))
