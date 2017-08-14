import React from 'react';
import { MapView, PROVIDER_GOOGLE } from 'expo';

export default class CustomMap extends React.Component {

  state = {
    region: {
      latitude: this.props.location.coords.latitude,
      longitude: this.props.location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  }

  onRegionChange(region) {
    this.setState({ region })
  }

  render() {
    const userMarker = {
      latlng: {
        latitude: this.props.location.coords.latitude,
        longitude: this.props.location.coords.longitude,
      },
      title: 'ME :)',
      subtitle: '5536 Sierra Vista Ave Los Angeles, CA',
    }
    const officeMarkers = [
      {
        latlng: {
          latitude: 30.23754,
          longitude: -97.68458620000001,
        },
        title: 'Bandago Austin, TX',
        subtitle: '515 Thompson Lane Austin, TX, 78742',
      },
      {
        latlng: {
          latitude: 41.9275695,
          longitude: -87.88546529999996,
        },
        title: 'Bandago Chicago, IL',
        subtitle: '10410 Schubert Ave. Melrose Park, IL, 60164'
      },
      {
        latlng: {
          latitude: 34.087354,
          longitude: -118.322809
        },
        title: 'Bandago Los Angeles, CA',
        subtitle: '5811 Willoughby Ave, Los Angeles, CA 90038, USA'
      },
      {
        latlng: {
          latitude: 25.8016902,
          longitude: -80.2620369,
        },
        title: 'Bandago Miami, FL',
        subtitle: '2850 NW 40th Ave. Miami, FL, 33142'
      },
      {
        latlng: {
          latitude: 36.1525833,
          longitude: -86.7297254,
        },
        title: 'Bandago Nashville, TN',
        subtitle: '1231 Lebanon Pike Nashville, TN, 37210'
      },
      {
        latlng: {
          latitude: 40.7127837,
          longitude: -74.00594130000002,
        },
        title: 'Bandago New York (Meadowlands, NJ)',
        subtitle: '23 Terminal Rd. Lyndhurst, NJ, 07071 (behind Courtyard Hotel)'
      },
      {
        latlng: {
          latitude: 37.7135629,
          longitude: -122.17355299999997,
        },
        title: 'Bandago Oakland, CA',
        subtitle: '1773 Timothy Drive San Leandro, CA, 94577'
      },
      {
        latlng: {
          latitude: 28.4759778,
          longitude: -81.3108674,
        },
        title: 'Bandago Orlando, FL',
        subtitle: '6050 South Semoran Blvd. #101 Orlando, FL, 32822 (At Park, Bark & Fly)'
      },
      {
        latlng: {
          latitude: 45.5584176,
          longitude: -122.55285409999999,
        },
        title: 'Bandago Portland, OR',
        subtitle: '4835 NE 107th #41 Portland, OR, 97220'
      },
      {
        latlng: {
          latitude: 37.750049,
          longitude: -122.39967200000001,
        },
        title: 'Bandago San Francisco, CA',
        subtitle: '2200 Cesar Chavez #16 San Francisco, CA 94124'
      }
    ]
    return (
      <MapView
        region={this.state.region}
        onRegionChange={(region) => this.onRegionChange(region)}
        style={{flex: 1}}
      >
        <MapView.Marker
          coordinate={userMarker.latlng}
          title={userMarker.title}
          description={userMarker.subtitle}
          image={require('../../assets/pin2.png')}
        />
        {officeMarkers.map((marker, i) => (
          <MapView.Marker
            key={i}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.subtitle}
          />
        ))}
      </MapView>
    );
  }
}
