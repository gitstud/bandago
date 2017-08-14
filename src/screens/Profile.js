import React from 'react';
import { View, Text, Button, Image, StyleSheet, StatusBar } from 'react-native';
import firebase from '../../lib/firebase';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'black',
    flex: 1,
  },
  icon: {
    width: 26,
    height: 26,
  },
  header: {
    backgroundColor: 'black',
    color: 'white',
    fontSize: 20,
    padding: 15,
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 15,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  label: {
    padding: 15,
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  value: {
    padding: 15,
    fontSize: 20,
    color: 'white',
  }
});

export default class Profile extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Profile',
    header: <Text style={styles.header}>Reservation Info</Text>,
    showIcon: true,
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../../assets/info.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  state = {
    reservationNumber: null,
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    const reservationNumberRef = firebase.database().ref(`users/${user.uid}/reservation_number`);
    reservationNumberRef.once('value', (snap) => {
      if (snap.exists()) {
        this.setState({ reservationNumber: snap.val() });
      }
    });
    const startDateRef = firebase.database().ref(`users/${user.uid}/start_date`);
    startDateRef.once('value', (snap) => {
      if (snap.exists()) {
        this.setState({ startDate: snap.val() });
      }
    });
    const endDateRef = firebase.database().ref(`users/${user.uid}/end_date`);
    endDateRef.once('value', (snap) => {
      if (snap.exists()) {
        this.setState({ endDate: snap.val() });
      }
    });
  }

  getDays(a, b) {
    // milliseconds per day
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // a and b are javascript Date objects
    // Discard the time and time-zone information.
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  render() {
    const startDate = new Date(this.state.startDate);
    const endDate = new Date(this.state.endDate);
    const numberOfDays = this.getDays(startDate, endDate);
    const freeMiles = 250 * numberOfDays;
    const milesDriven = 253;
    const milesOver = milesDriven - freeMiles < 0 ? 0 : milesDriven - freeMiles;
    const milesCost = milesOver > 0 ? parseFloat(milesOver * 0.12).toFixed(2) : 0;
    const data = [
      {
        label: 'Reservation Number:',
        value: `#${this.state.reservationNumber}`,
      },
      {
        label: 'Start Date:',
        value: `${months[startDate.getUTCMonth()]} ${startDate.getUTCDate()}, ${startDate.getUTCFullYear()}`,
      },
      {
        label: 'End Date:',
        value: `${months[endDate.getUTCMonth()]} ${endDate.getUTCDate()}, ${endDate.getUTCFullYear()}`,
      },
      {
        label: 'Contact Bandago:',
        value: '1-866-868-7826',
      },
      {
        label: 'Number of Free Miles:',
        value: freeMiles,
      },
      {
        label: 'Approx. Miles Driven:',
        value: milesDriven,
      },
      {
        label: 'Approx. Miles Over:',
        value: milesOver,
      },
      {
        label: 'Approx. Mileage Charges:',
        value: `$${milesCost}`,
      }
    ]
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={true}
        />
      {data.map((obj, i) => (
        <View style={{flexDirection: 'row'}} key={obj.label}>
          <View style={styles.infoContainer} >
            <Text style={styles.label}>{obj.label}</Text>
          </View>
          <View style={styles.infoContainer} >
            <Text style={styles.value}>{obj.value}</Text>
          </View>
        </View>
      ))}
      </View>
    );
  }
}
