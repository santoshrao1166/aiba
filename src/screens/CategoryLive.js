import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {axiosGet} from '../axios';
import {Toumbnail} from '../components/Card';
import Header from '../components/Header';

const {height, width} = Dimensions.get('window');

function CategoryLive({navigation, route}) {
  const {ctgId} = route.params;
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [ctgData, setctgData] = useState({});
  const [curLive, setcurLive] = useState([]);
  const [preLive, setpreLive] = useState([]);
  const [pageNum, setpageNum] = useState(0);

  useEffect(() => {
    axiosGet(
      'user/category?id=' + ctgId + '&only_lives=true',
      data => {
        setcurLive(data?.current_lives);
        setctgData(data?.category_data);
      },
      null,
      navigation,
      dispatch,
    );

    return () => {
      setcurLive([]);
    };
  }, [ctgId]);
  useEffect(() => {
    axiosGet(
      `user/category_previous_lives?cat_id=${ctgId}&start=${pageNum}`,
      data => {
        // console.log(data, 'jfksdjf');
        setpreLive(pre => {
          // console.log(pre);
          pre = [...pre, ...data];
          // console.log(pre.length);
          return pre;
        });
      },
      null,
      navigation,
      dispatch,
    );

    return () => {
      // setpreLive([]);
    };
  }, [ctgId, pageNum]);

  return (
    <ScrollView style={{backgroundColor: '#F2F2F2'}}>
      {/* back and hambuger */}
      <Header isAuth navigation={navigation} />

      {/* remaining body is in this view  */}
      <View
        style={{
          width: width * 0.9,
          marginLeft: width * 0.05,
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 15, fontWeight: '700'}}> Category Lives </Text>

        {/* profile pic and edit btn */}

        <Text style={styles.userName}>{ctgData?.name}</Text>
        <View style={styles.hr}></View>
        {/* bel ow card and diffrent data  */}
      </View>

      <View style={styles.card}>
        <Text style={styles.liveTitle}>Current Livestreams</Text>

        <View style={styles.liveContainer}>
          {curLive?.length ? (
            curLive?.map((live, i) => (
              <TouchableOpacity
                key={i}
                style={{marginBottom: 20}}
                onPress={() => {
                  if (live?.live_link)
                    navigation.navigate('Live', {
                      liveLink: live?.live_link,
                      vendorId: live?.user_id,
                      vendorName: live?.vendor_name,
                      groupName: live?.group_name,
                    });
                  else {
                    // Alert.alert('Heya', 'No live link added yet.');
                    return;
                  }
                }}>
                <Toumbnail live={live} />
              </TouchableOpacity>
            ))
          ) : (
            <>
              <Text style={styles.noDataMessage}>No current lives</Text>
            </>
          )}
        </View>

        <Text style={styles.liveTitle}>Previous Lives</Text>
        <View style={styles.hr}></View>

        <View style={styles.liveContainer}>
          {preLive?.length ? (
            preLive?.map((live, i) => (
              <TouchableOpacity
                key={i}
                style={{marginBottom: 20}}
                onPress={() => {
                  if (live?.live_link)
                    navigation.navigate('Live', {
                      liveLink: live?.live_link,
                      vendorId: live?.user_id,
                      vendorName: live?.name,
                      groupName: live?.group_name,
                    });
                  else {
                    // Alert.alert('Heya', 'No live link added yet.');
                    return;
                  }
                }}>
                <Toumbnail live={live} previous />
              </TouchableOpacity>
            ))
          ) : (
            <>
              <Text style={styles.noDataMessage}>No previous lives</Text>
            </>
          )}

          {preLive.length >= 6 * (pageNum + 1) ? (
            <TouchableOpacity
              style={{
                padding: 10,
                marginTop: 20,
                backgroundColor: 'orange',
                borderRadius: 10,
              }}
              onPress={() => setpageNum(pre => pre + 1)}>
              <Text style={{color: 'white'}}>Load More</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

export default CategoryLive;

const styles = StyleSheet.create({
  hr: {borderColor: 'black', borderWidth: 0.5, width: '100%'},
  liveContainer: {
    marginHorizontal: width * 0.05,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  userName: {fontSize: 19, marginVertical: 8, fontWeight: '700'},
  noDataMessage: {
    textAlign: 'center',
    fontSize: 25,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  liveTitle: {
    marginLeft: width * 0.05,
    fontSize: 17,
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
