import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import { Facebook } from 'expo';
import firebase from '../../lib/firebase';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    padding: 32,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  textInput: {
    height: 60,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderColor: '#222',
    borderWidth: 1,
    marginBottom: 16,
  },
});

type State = {
  email: string,
  password: string
};

type SignInAuthError = {
  message: string,
  code: 'auth/invalid-email' | 'auth/user-not-found' | 'auth/wrong-password' | 'auth/user-disabled'
};

type FacebookLoginResponse = {
  type: string,
  token: string
};

export default class SignIn extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state: State = {
    email: '',
    password: '',
  };

  signIn = () => {
    const { email, password } = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password)
    .catch((error: SignInAuthError) => {
      switch (error.code) {
        case 'auth/invalid-email':
        case 'auth/user-not-found':
          Alert.alert(
            'Invalid Email',
            'The email address you entered doesn\'t appear to registered. Please check your email and try again.',
          );
          break;
        case 'auth/wrong-password':
          Alert.alert(
            'Incorrect Password',
            'The password you entered is incorrect.  Please try again.',
          );
          break;
        case 'auth/user-disabled':
          Alert.alert(
            'Account Locked',
            'We\'re sorry.  Your account has been disabled. Please contact help@youniverse.com',
          );
          break;
        default:
          Alert.alert(
            'Error',
            [
              'Something went wrong. Please try again.',
              '',
              `[${error.code}]:`,
              `${error.message}`,
            ].join('\n'),
          );
      }
    });
  }

  signInWithFacebook = () => {
    Facebook.logInWithReadPermissionsAsync('109004536389072', {
      behavior: 'browser',
    }).then(({ type, token }: FacebookLoginResponse) => {
      if (type === 'success') {
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        firebase.auth.signInWithCredential(credential).catch((error: Error) => {
          Alert.alert('Something went wrong', error.message);
        });
      }
    }).catch(() => {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bandago Support App</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(value: string) => this.setState({ email: value })}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
        />
        <TextInput
          style={styles.textInput}
          onChangeText={(value: string) => this.setState({ password: value })}
          onSubmitEditing={this.signIn}
          placeholder="Password"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
          clearButtonMode="always"
          secureTextEntry
        />
        <Button
          title="Sign In"
          onPress={this.signIn}
        />
      <Text>New User?</Text>
        <View>
          <Button
            title="Sign Up"
            onPress={() => navigate('SignUpEmailAndPassword')}
          />
        </View>
      </View>
    );
  }
}
