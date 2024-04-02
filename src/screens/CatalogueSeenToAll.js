import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {axiosGet} from '../axios';
import Header from '../components/Header';
import {serverEndPoint} from '../config';

const {height, width} = Dimensions.get('window');

function CatalogueSeenToAll({navigation, route}) {
  const {vendorId, catalogId, feturedImage} = route.params;
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [vendorData, setvendorData] = useState({});
  const [catalogImages, setcatalogImages] = useState({});

  useEffect(() => {
    axiosGet(
      'user/vendor_profile?vendor_id=' + vendorId,
      data => {
        setvendorData(data?.vendor_data);
      },
      null,
      navigation,
      dispatch,
    );

    return () => {
      setvendorData({});
    };
  }, [vendorId]);
  useEffect(() => {
    axiosGet(
      `https://www.aibaonline.in/api/user/getCatalogImage?catalog_id=${catalogId}`,
      data => {
        setcatalogImages(data);
      },
      null,
      navigation,
      dispatch,
    );

    return () => {
      // setpreLive([]);
    };
  }, [vendorId]);

  return (
    <ScrollView style={{backgroundColor: '#F2F2F2'}}>
      {/* back and hambuger */}
      <Header isAuth={user ? true : false} navigation={navigation} />

      {/* remaining body is in this view  */}
      <View
        style={{
          width: width * 0.9,
          marginLeft: width * 0.05,
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        {/* profile pic and edit btn */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            marginTop: 20,
          }}>
          <Image
            resizeMode="contain"
            style={{width: 90, height: 90}}
            source={{
              uri: vendorData?.profile_image
                ? serverEndPoint + 'uploads/docs/' + vendorData?.profile_image
                : 'https://ui-avatars.com/api/?name=' + vendorData?.name,
            }}
          />
        </View>
        <Text style={styles.userName}>{vendorData?.name}</Text>
        {/* <Text style={styles.userOtherData}>{vendorData?.current_address}</Text> */}

        <View>
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${vendorData?.calling_no}`)}>
            <Text style={styles.userOtherData}>
              Phone Number :{' '}
              <Text style={{color: 'blue'}}> {vendorData?.calling_no}</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(`https://wa.me/+91${vendorData?.whatsapp_no}`)
            }>
            <Text style={styles.userOtherData}>
              Whatsapp Number :{' '}
              <Text style={{color: 'blue'}}>{vendorData?.whatsapp_no}</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              if (vendorData?.insta_link)
                try {
                  await Linking.openURL(vendorData?.insta_link);
                } catch (error) {
                  console.log(error);
                }
            }}>
            {vendorData?.insta_link ? (
              <Text numberOfLines={1}>
                instagram Link :
                <Text style={{color: 'blue'}}>
                  {' ' + vendorData?.insta_link}
                </Text>
              </Text>
            ) : null}
          </TouchableOpacity>
        </View>
        <View style={styles.hr}></View>
        {/* below card and diffrent data  */}
      </View>

      <View style={styles.card}>
        <Text style={styles.liveTitle}>Featured Image</Text>

        <View style={styles.liveContainer}>
          <Image
            resizeMode="contain"
            style={{width: 90, height: 90}}
            source={{
              uri:
                serverEndPoint +
                '/uploads/catalogs/' +
                feturedImage?.featured_image,
            }}
          />
        </View>

        <Text style={styles.liveTitle}>Catalog File</Text>

        <View style={styles.liveContainer}>
          <TouchableOpacity
            onPress={() => {
              if (feturedImage?.file.split('.').pop() == 'pdf') {
                Linking.openURL(
                  serverEndPoint + '/uploads/catalogs/' + feturedImage?.file,
                );
              }
            }}>
            <Image
              resizeMode="contain"
              style={{width: 90, height: 90}}
              source={{
                uri:
                  feturedImage?.file.split('.').pop() == 'pdf'
                    ? 'https://www.aibaonline.in/api/assets/images/pdf.png'
                    : serverEndPoint +
                      '/uploads/catalogs/' +
                      feturedImage?.file,
              }}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.liveTitle}>Catalog Images</Text>
        <View style={styles.hr}></View>

        <View style={styles.liveContainer}>
          {catalogImages?.length ? (
            catalogImages?.map((image, i) => (
              <Image
                key={i}
                resizeMode="contain"
                style={{width: 150, height: 150}}
                source={{
                  uri: serverEndPoint + '/uploads/catalogs/' + image?.file,
                }}
              />
            ))
          ) : (
            <>
              <Text style={styles.noDataMessage}>No catalog images found</Text>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hr: {
    borderColor: 'black',
    borderWidth: 0.5,
    width: '100%',
    marginVertical: 10,
  },

  liveContainer: {
    marginHorizontal: width * 0.05,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  userName: {fontSize: 18, marginVertical: 8},
  userOtherData: {marginVertical: 5},
  noDataMessage: {
    textAlign: 'center',
    fontSize: 18,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  liveTitle: {
    marginLeft: width * 0.05,
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 15,
  },
  card: {
    backgroundColor: 'white',
    width: width * 0.94,
    marginLeft: width * 0.03,
    marginTop: 10,
    paddingVertical: 20,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 3, height: 4},
    shadowRadius: 10,
    elevation: 15,
  },
  inputAndEditView: {
    marginHorizontal: 15,
    paddingHorizontal: 10,
    borderBottomColor: '#F2F2F2',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    color: 'black',
    opacity: 0.5,
    flex: 1,
  },
});

export default CatalogueSeenToAll;
