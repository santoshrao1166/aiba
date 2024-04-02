import React from 'react';
import {
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Linking,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import aibaLogo from '../assets/aibaLogo.png';

const {height, width} = Dimensions.get('window');

function Footer({navigation}) {
  const user = useSelector(state => state.user);

  return (
    <>
      <View
        style={{
          width: width,
          backgroundColor: 'white',
          borderTopColor: '#787885',
          borderTopWidth: 0.5,
          paddingTop: 20,
        }}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row'}}>
            {/* aiba logo  */}
            <View>
              <Image
                style={{width: width * 0.5, height: 80}}
                source={aibaLogo}
              />
            </View>
          </View>

          {/* quick link part  */}
          <Text
            style={{
              fontSize: 15,
              color: '#787885',
              fontWeight: '700',
              marginTop: 20,
            }}>
            QUICK LINKS
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Home');
            }}
            style={styles.quickLinkTouchableOpacity}>
            <Text style={styles.quickLinkText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AboutUs');
            }}
            style={styles.quickLinkTouchableOpacity}>
            <Text style={styles.quickLinkText}>About Us</Text>
          </TouchableOpacity>
          {user ? null : (
            <>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Login');
                }}
                style={styles.quickLinkTouchableOpacity}>
                <Text style={styles.quickLinkText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Vendor Registration');
                }}
                style={styles.quickLinkTouchableOpacity}>
                <Text style={styles.quickLinkText}>Register</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Disclamer');
            }}
            style={styles.quickLinkTouchableOpacity}>
            <Text style={styles.quickLinkText}>Disclaimer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Terms', {
                fromRegistration: false,
              });
            }}
            style={styles.quickLinkTouchableOpacity}>
            <Text style={styles.quickLinkText}>Term of Use</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Refund');
            }}
            style={styles.quickLinkTouchableOpacity}>
            <Text style={styles.quickLinkText}>Refunds and Cancellations</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Grevience');
            }}
            style={styles.quickLinkTouchableOpacity}>
            <Text style={styles.quickLinkText}>Grievance</Text>
          </TouchableOpacity>
          {/* follow us part  */}
          <Text
            style={{
              fontSize: 15,
              color: '#787885',
              fontWeight: '700',
              marginTop: 20,
            }}>
            FOLLOW US ON
          </Text>
          <View
            style={{
              marginTop: 10,
              width: width * 0.25,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  'https://www.facebook.com/groups/shoppers.darbar/?ref=share',
                );
              }}>
              <EvilIcons name="sc-facebook" size={40} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('https://instagram.com/we.aiba/');
              }}>
              <AntDesign name="instagram" size={33} color="black" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginTop: 20,
              width: width,
              borderTopColor: '#787885',
              borderTopWidth: 0.5,
            }}>
            <Text
              style={{
                fontSize: 10,
                color: '#787885',
                textAlign: 'center',
                lineHeight: 40,
              }}>
              © 2021 aibaonline.in All rights reserved
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  quickLinkTouchableOpacity: {
    marginTop: 12,
  },
  quickLinkText: {
    color: '#787885',
  },
});

export default Footer;
