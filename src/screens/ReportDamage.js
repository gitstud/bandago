import React, { Component } from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  StatusBar,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { ImagePicker } from 'expo';
import firebase from '../../lib/firebase';

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
  header: {
    backgroundColor: 'black',
    color: 'white',
    fontSize: 20,
    padding: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  available: {
    borderColor: 'green',
    borderWidth: 1,
    height: 300,
    marginBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    marginLeft: 16,
    marginRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 20,
  },
  title: {
    marginLeft: 16,
    marginRight: 16,
    fontSize: 25,
  }
});

export default class ReportDamage extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Report Damage',
    header: <Text style={styles.header}>Report Damage</Text>,
    showIcon: true,
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../../assets/wrench.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  state = {
    images: [],
    text: '',
    showModal: false,
    reservationNumber: null,
    urls: [],
    numberOfImages: 0,
    uploading: false,
    folderName: '',
  }

  componentDidUpdate() {
    const { numberOfImages, urls, uploading, text, folderName } = this.state;
    if (numberOfImages === urls.length && uploading === true) {
      console.log('all urls have been uploaded', urls, text);
      const user = firebase.auth().currentUser;
      const reservationNumber = this.state.reservationNumber;
      let update = {};
      firebase.database().ref(`users/${user.uid}/reports/${folderName}`).update({ urls, text });
      this.setState({ urls: [], uploading: false, numberOfImages: 0, folderName: '', text: '' });
    }
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    const reservationNumberRef = firebase.database().ref(`users/${user.uid}/reservation_number`);
    reservationNumberRef.once('value', (snap) => {
      if (snap.exists()) {
        this.setState({ reservationNumber: snap });
      }
    });
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4,3],
      base64: true,
    });

    if (!result.cancelled) {
      result.byteArray = this.convertToByteArray(result.base64)
      let images = [...this.state.images, result]
      this.setState({
        images,
      });
    }
  }
  //convert base64 image to byte array
  convertToByteArray = (input) => {
    var binary_string = this.atob(input);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes
  }
  // convert base64 to binary_string
  atob = (input) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let str = input.replace(/(\r\n|\n|\r)/gm, '');
    str = input.replace(/=+$/, '');
    console.log('android result: ', str);
    let output = '';
    for (let bc = 0, bs = 0, buffer, i = 0;
      buffer = str.charAt(i++);

      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  }
  // Upload images to firebase
  _uploadAsByteArray = async (pickerResultAsByteArray, folderName, fileName, progressCallback) => {
    const user = firebase.auth().currentUser;
    const storageRef = firebase.storage().ref();
    const metadata = {
      contentType: 'image/jpeg',
    };
    const ref = storageRef.child(`${user.uid}/reports/${folderName}/${fileName}.jpg`);
    try {
      let self = this;
      let uploadTask = ref.put(pickerResultAsByteArray, metadata);
      uploadTask.on('state_changed', function (snapshot) {

        progressCallback && progressCallback(snapshot.bytesTransferred / snapshot.totalBytes);

      }, function (error) {
        console.log("in _uploadAsByteArray ", error);
      }, function () {
        var downloadURL = uploadTask.snapshot.downloadURL;
        const urls = [...self.state.urls, downloadURL];
        self.setState({ urls });
        let remainingImages = [...self.state.images];
        remainingImages.pop();
        self.setState({ images: remainingImages });
        console.log('upload completed');
      });


    } catch (ee) {
      console.log("when trying to load _uploadAsByteArray ", ee)
    }
  }

  uploadReportToDatabase() {
    console.log('upload report to database function: state: ', this.state.urls);
  }

  renderModal() {
    const { error, showModal } = this.state;
    return (
      <Modal
        animationType={'slide'}
        visible={showModal}
        onRequestClose={() => this.setState({ showModal: false })}
      >
        <View style={{ flex: 1, marginTop: 22 }}>
          <View style={styles.container}>
            <Text style={styles.title}>Write a description for this report</Text>
            <TextInput
              style={styles.available}
              onChangeText={(value: string) => {
                this.setState({ text: value });
              }}
              value={this.state.text}
              autoCapitalize="none"
              multiline={true}
              autoFocus
            />
            { error && <ErrorLabel error={error} /> }
            <Button
              title="Save"
              onPress={() => this.setState({ showModal: false })}
              color="#841584"
              accessibilityLabel="Save description"
            />
            <Button
              title="Delete"
              onPress={() => this.setState({ showModal: false, text: '' })}
              color="#841584"
              accessibilityLabel="Delete description"
            />
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    const { images } = this.state;

    return (
      <ScrollView>
        <View>
          <StatusBar hidden={true} />
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity onPress={this.state.images.length >= 1 ? null : this._pickImage}>
              <View style={{padding: 2}}>
                {!images[0] && <Image source={require('../../assets/photo-camera.png')} style={{width: 200, height: 200}} />}
                {images[0] && <Image source={{uri: images[0].uri}} style={{width: 200, height: 200}} />}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.state.images.length >= 2 ? null : this._pickImage}>
              <View style={{padding: 2}}>
              {!images[1] && <Image source={require('../../assets/photo-camera.png')} style={{width: 200, height: 200}} />}
              {images[1] && <Image source={{uri: images[1].uri}} style={{width: 200, height: 200}} />}
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity onPress={this.state.images.length >= 3 ? null : this._pickImage}>
              <View style={{padding: 2}}>
              {!images[2] && <Image source={require('../../assets/photo-camera.png')} style={{width: 200, height: 200}} />}
              {images[2] && <Image source={{uri: images[2].uri}} style={{width: 200, height: 200}} />}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.state.images.length === 4 ? null : this._pickImage}>
              <View style={{padding: 2}}>
              {!images[3] && <Image source={require('../../assets/photo-camera.png')} style={{width: 200, height: 200}} />}
              {images[3] && <Image source={{uri: images[3].uri}} style={{width: 200, height: 200}} />}
              </View>
            </TouchableOpacity>
          </View>
          {this.state.text.length > 0 && (
            <View style={{alignItems: 'center'}}>
              <Text>{this.state.text}</Text>
            </View>
          )}
          <Button
            onPress={() => this.setState({ showModal: true })}
            title={this.state.text.length < 1 ? 'Add description' : 'Edit description'}
            color="#841584"
            accessibilityLabel="Add description"
          />
          {this.state.showModal && this.renderModal()}
          <Button
            onPress={() => this.setState({ images: [] })}
            title="Clear Images"
            color="#841584"
            accessibilityLabel="Clear images"
            disabled={this.state.images.length < 1}
          />
          <Button
            onPress={() => {
              const images = [...this.state.images];
              const folderName = Date.now();
              this.setState({ numberOfImages: images.length, uploading: true, folderName });
              var responses = 0;
              for (let i = images.length - 1; i >= 0; i--) {
                const fileName = Date.now();
                this._uploadAsByteArray(this.state.images[i].byteArray, folderName, fileName, (progress, index) => {
                  if (progress === 1) {
                    responses++;
                    console.log(`image ${responses} uploaded`);
                  }
                  if (responses === images.length) {
                    this.uploadReportToDatabase();
                  }
                });
              }
            }}
            title="Upload Report"
            color="#841584"
            accessibilityLabel="Upload Report"
            disabled={this.state.images.length < 1 && this.state.text.length < 1}
          />
        </View>
      </ScrollView>
    );
  }
}
