import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  Alert,
  StyleSheet,
  ErrorLabel,
  Platform,
  Image,
  StatusBar,
} from 'react-native';
import { Constants, Location, Permissions, MapView } from 'expo';
import firebase from '../../lib/firebase';
import DatePicker from '../Components/DatePicker';
import AndroidDatePicker from '../Components/AndroidDatePicker';
import CustomMap from '../Components/CustomMap';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'black',
    flex: 1,
  },
  modalContainer: {
    alignItems: 'center',
    flex: 1,
  },
  header: {
    backgroundColor: 'black',
    color: 'white',
    fontSize: 20,
    padding: 15,
    textAlign: 'center',
    fontWeight: '600',

  },
  title: {
    fontSize: 18,
    marginBottom: 16,
  },
  available: {
    borderColor: 'green',
    borderWidth: 1,
    height: 60,
    marginBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  unAvailable: {
    borderColor: 'red',
    borderWidth: 1,
    height: 60,
    marginBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  icon: {
    width: 26,
    height: 26,
  },
});

export default class Feed extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Home',
    header: <Text style={styles.header}>Bandago Support App</Text>,
    showIcon: true,
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../../assets/home.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  state: State = {
    reservationNumber: '',
    reservationNumberExists: false,
    error: null,
    showModal: false,
    dateType: 'start',
    startDate: null,
    endDate: null,
    showDateModal: false,
    showAndroidDateModal: false,
    location: null,
    errorMessage: null,
  };

  componentWillMount() {
    const user = firebase.auth().currentUser;
    const reservationNumberRef = firebase.database().ref(`users/${user.uid}/reservation_number`);
    reservationNumberRef.once('value', (snap) => {
      if (!snap.exists()) {
        this.setState({ showModal: true });
      } else if (snap.exists()) {
        this.setState({ reservationNumber: snap.val()});
      }
    });
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  watchId = (null: ?number)

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
      Alert.alert('Please enable location for Bandago Support in your settings.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
    const user = firebase.auth().currentUser;
    let self = this;
    this.watchId = Location.watchPositionAsync({
      enableHighAccuracy: false,
      distanceInterval: 1,
      timeInterval: 10,
    }, local => {
      console.log('update');
      const currentLocationRef = firebase.database().ref(`users/${user.uid}/current_location`);
      currentLocationRef.once('value', (snap) => {
        if (snap.exists()) {
          firebase.database().ref(`users/${user.uid}`).update({
            current_location: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            previous_location: {
              latitude: snap.val().latitude,
              longitude: snap.val().longitude,
            }
          });
        } else if (!snap.exists()) {
          firebase.database().ref(`users/${user.uid}`).update({
            current_location: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            previous_location: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          });
        }
      });
    });
  }

  setNewReservationNumber = () => {
    const user = firebase.auth().currentUser;
    const reservationNumber = this.state.reservationNumber;
    const usersTableRef = firebase.database().ref('users');
    usersTableRef.orderByChild('reservation_number').equalTo(reservationNumber).on('value', (snap) => {
      if (snap.exists()) {
        this.setState({ reservationNumberExists: true });
      } else {
        firebase.database().ref(`users/${user.uid}`).update({reservation_number: reservationNumber});
        if (Platform.OS === 'android') {
          this.setState({ showModal: false, showAndroidDateModal: true });
        } else {
          this.setState({ showModal: false, showDateModal: true });
        }
      }
    });
  }

  findExistingReservationNumber(value) {
    const usersRef = firebase.database().ref('users');
    usersRef.orderByChild('reservation_number').equalTo(value).on('value', (snap) => {
      if (snap.exists()) {
        this.setState({ reservationNumberExists: true });
      } else {
        this.setState({ reservationNumberExists: false });
      }
    });
  }

  signOut = () => {
    Alert.alert(
      'End Rental',
      'Ending your rental now will \ndiscontinue location updates.\nAre you sure you would like to \nend this rental?',
      [
        {text: 'Yes', onPress: () => {
          firebase.auth().signOut().then(function() {
            console.log('Signed Out');
          }, function(error) {
            console.error('Sign Out Error', error);
          });
        }},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ],
    )
  }

  onDateChange(date) {
    const { dateType } = this.state;
    if (dateType === 'start') {
      this.setState({ startDate: date });
    } else if (dateType === 'end') {
      this.setState({ endDate: date });
    }
  }

  submitDate() {

    const { startDate, endDate, dateType } = this.state;
    const user = firebase.auth().currentUser;

    if (dateType === 'start') {
      firebase.database().ref(`users/${user.uid}`).update({start_date: startDate});
      this.setState({ dateType: 'end'});
      return;
    } else if (dateType === 'end') {
      firebase.database().ref(`users/${user.uid}`).update({end_date: endDate});
      this.setState({ showDateModal: false });
    }
  }

  renderDateModal() {
    const { error, showModal, startDate, dateType } = this.state;
    const disable = dateType === 'start' ? this.state.startDate === null : this.state.endDate === null;
    return (
      <Modal
        animationType={'slide'}
        visible={this.state.showDateModal}
        onRequestClose={() => Alert.alert('modal has been closed.')}
      >
        <View style={{ flex: 1, marginTop: 22 }}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>{`Choose your ${dateType} rental date and time.`}</Text>
            <View style={{height: 50}}>
              <DatePicker
                date={new Date()}
                timeZoneOffsetInHours={(-1) * (new Date()).getTimezoneOffset() / 60}
                onDateChange={(date) => this.onDateChange(date)}
              />
            </View>
            { error && <ErrorLabel error={error} /> }
            <View style={{marginTop: 230}}>
              <Button
                title="Next"
                onPress={() => {this.submitDate()}}
                color="#841584"
                accessibilityLabel="Proceed to password screen"
                disabled={disable}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  renderAndroidDateModal() {
    const { error, showModal, startDate, dateType } = this.state;
    const disable = dateType === 'start' ? this.state.startDate === null : this.state.endDate === null;
    return (
      <Modal
        animationType={'slide'}
        visible={this.state.showAndroidDateModal}
        onRequestClose={() => Alert.alert('modal has been closed.')}
      >
        <View style={{ flex: 1, marginTop: 22 }}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>{`Choose your ${dateType} rental date and time.`}</Text>
            <View style={{height: 50}}>
              <AndroidDatePicker
                date={new Date()}
                timeZoneOffsetInHours={(-1) * (new Date()).getTimezoneOffset() / 60}
                onDateChange={(date) => this.onDateChange(date)}
              />
            </View>
            { error && <ErrorLabel error={error} /> }
            <View style={{marginTop: 230}}>
              <Button
                title="Next"
                onPress={() => {this.submitDate()}}
                color="#841584"
                accessibilityLabel="Proceed to password screen"
                disabled={disable}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  renderModal() {
    const { reservationNumber, error, showModal } = this.state;
    var disableButton = this.state.reservationNumberExists || reservationNumber.length === 0;
    return (
      <Modal
        animationType={'slide'}
        visible={showModal}
        onRequestClose={() => Alert.alert('modal has been closed.')}
      >
        <View style={{ flex: 1, marginTop: 22 }}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Enter your Reservation Number</Text>
            <TextInput
              style={this.state.reservationNumberExists ? styles.unAvailable : styles.available}
              onChangeText={(value: string) => {
                this.setState({ reservationNumber: value });
                this.findExistingReservationNumber(value);
              }}
              value={reservationNumber}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />
            { error && <ErrorLabel error={error} /> }
            <Button
              title="Next"
              onPress={this.setNewReservationNumber}
              color="#841584"
              accessibilityLabel="Proceed to password screen"
              disabled={disableButton}
              backgroundColor="green"
            />
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        {this.state.showModal && this.renderModal()}
        {this.renderDateModal()}
        {this.renderAndroidDateModal()}
        <View style={{
            height: 500,
            width: '100%',
            backgroundColor: 'green',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {this.state.location !== null && <CustomMap location={this.state.location} />}
        </View>
        <View style={{marginTop: 30}}>
          <Button title="End Rental" onPress={this.signOut} color="red" />
        </View>
      </View>
    );
  }
}
