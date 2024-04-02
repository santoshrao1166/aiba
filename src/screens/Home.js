import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Linking,
} from 'react-native';
import Card from '../components/Card';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CtgLive, {CategoryBtn} from '../components/CtgLive';
import {useSelector, useDispatch} from 'react-redux';
import {login} from '../redux/action/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {axiosGet} from '../axios';
import banner2 from '../assets/banner2.png';
import {serverEndPoint} from '../config';

const {height, width} = Dimensions.get('window');

function Home({navigation}) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [categories, setcategories] = useState([]);
  useEffect(() => {
    axiosGet(
      'user/all_categories_master',
      categories => {
        setcategories(categories);
      },
      null,
      navigation,
      dispatch,
    );
    return () => {
      setcategories([]);
    };
  }, []);
  ////////////// check if user is already logined or not
  useEffect(() => {
    const getUser = navigation.addListener('focus', async () => {
      let u = await AsyncStorage.getItem('aibaUser');
      u = await JSON.parse(u);
      if (u === undefined) {
        u = null;
      }
      //check if user session is on in server or not
      try {
        let userInServer = await (await axios.get('/user/profile')).data;
        if (userInServer.status == 1) {
          dispatch(login(u));
        } else {
          if (u == null) {
            //user is not loginned and no session in server hence make user
            //null
            AsyncStorage.removeItem('aibaUser');
            AsyncStorage.removeItem('aibaPass');
            dispatch(login(null));
            return;
          }
          //beacause user logined in phone and in server his/her session
          // expired it must created again
          let userPass = await AsyncStorage.getItem('aibaPass');
          if (userPass?.length < 8) {
            AsyncStorage.removeItem('aibaUser');
            AsyncStorage.removeItem('aibaPass');
            dispatch(login(null));
          } else {
            let data = new FormData();
            data.append('email_id', u?.email_id);
            data.append('password', userPass);

            try {
              let loginRes = await axios.post('/auth/vendor_login', data, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
              loginRes = await loginRes.data;

              if (loginRes.status === -2) {
                let validationData = loginRes.validation_array;
                for (let key in validationData) {
                  AsyncStorage.removeItem('aibaUser');
                  AsyncStorage.removeItem('aibaPass');
                  dispatch(login(null));
                  return;
                }
              }
              if (loginRes.status === 0) {
                AsyncStorage.removeItem('aibaUser');
                AsyncStorage.removeItem('aibaPass');
                dispatch(login(null));
              }
              if (loginRes.status === 1) {
                dispatch(login(u));
              }
            } catch (error) {
              console.log(error);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
    return getUser;
  }, [dispatch, navigation]);
  /////////////////////////////////////////////////////////////////

  return (
    <View>
      <ScrollView backgroundColor="white" showsVerticalScrollIndicator={false}>
        {/* header  */}
        <Header
          isAuth={user ? true : false}
          navigation={navigation}
          showLoginBtn
        />

        {/* currnet live  */}
        {/* <CurrentLives navigation={navigation} /> */}

        {/* first banner  */}
        <Image
          resizeMode="contain"
          style={{width: width, height: width * 0.5}}
          source={banner2}
        />

        <FeaturedLive navigation={navigation} />

        {/* second horizontal scrollview Platforms Live*/}
        <CategoriLive navigation={navigation} categories={categories} />

        <Products navigation={navigation} categories={categories} />

        {/* banner 2 start your selling journey only for unAuthrised user */}
        {user ? null : (
          <ImageBackground
            source={{
              uri: 'https://lh3.googleusercontent.com/-T6s0yF4UwXo/YUwdg30otwI/AAAAAAAAAdk/GC-eytQtrCwWA_p5vMXMPqKij5ArQpQ_ACLcBGAsYHQ/BANNER-02%2B1.png',
            }}
            resizeMode="cover"
            style={styles.registerBgImage}>
            <View style={styles.registerBgView}>
              <View style={{marginTop: 50}}>
                <Text style={styles.shoppingRedefineText}>
                  Online Shopping Redefined
                </Text>
              </View>

              <View style={{marginBottom: 35}}>
                <TouchableOpacity
                  style={styles.registerBtn}
                  onPress={() => {
                    navigation.navigate('Vendor Registration');
                  }}>
                  <Text style={{fontSize: 17, fontWeight: '600'}}>
                    Register Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        )}
        {/* footer is here  */}
        <Footer navigation={navigation} />
      </ScrollView>
    </View>
  );
}

const Products = ({navigation, categories}) => {
  const [ejournals, setejournals] = useState([]);
  const [products, setproducts] = useState([]);
  const dispatch = useDispatch();
  const [curCtg, setcurCtg] = useState(1);

  useEffect(() => {
    // here code for products
    if (curCtg) {
      // console.log(curCtg);
      axiosGet(
        'user/CatalogFeaturedImage?id=' + curCtg,
        data => {
          setproducts(data?.featuredImage || []);
          // console.log(data);
        },
        error => console.log(error),
        navigation,
        dispatch,
      );
    }
  }, [curCtg]);
  useEffect(() => {
    // console.log(categories)
    setcurCtg(categories[0]?.id);
    axiosGet(
      'user/all_magazines',
      data => {
        setejournals(data);
        // console.log(data);
      },
      null,
      navigation,
      dispatch,
    );
    return () => {
      setejournals([]);
      setcurCtg(null);
    };
  }, [categories.length]);
  return (
    <>
      <View>
        {/* products  */}
        <Text
          style={{fontSize: 20, fontWeight: '700', marginLeft: width * 0.05}}>
          Products
        </Text>
        <ScrollView
          style={styles.productsHoriScroll}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {categories.map(ctg => (
            <CategoryBtn
              key={ctg?.id}
              id={ctg?.id}
              setcurCtg={setcurCtg}
              category={ctg?.name}
              active={curCtg == ctg?.id}
            />
          ))}
        </ScrollView>

        <ScrollView
          style={{
            paddingLeft: width * 0.03,
            marginVertical: 20,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {products.length ? (
            products.map((product, i) => {
              if (product?.featured_image)
                return (
                  <TouchableOpacity
                    key={product?.id}
                    onPress={() => {
                      navigation.navigate('CatalogueSeenToAll', {
                        vendorId: product?.vendor_id,
                        catalogId: product?.id,
                        feturedImage: product,
                      });
                    }}>
                    <Image
                      style={{
                        width: 70,
                        height: 100,
                        marginLeft: width * 0.15,
                      }}
                      source={{
                        uri:
                          serverEndPoint +
                          'uploads/catalogs/' +
                          product?.featured_image,
                      }}
                    />
                  </TouchableOpacity>
                );
              else return null;
            })
          ) : (
            <Text style={{marginLeft: 40, fontWeight: '700'}}>
              No products found in this category.
            </Text>
          )}
        </ScrollView>

        {/* products ends here   */}

        {ejournals?.current_month ? (
          <>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                textAlign: 'center',
                marginVertical: 10,
              }}>
              Magazine Of The Month
            </Text>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <Magazine
                id={ejournals?.current_month?.id}
                jounral={ejournals?.current_month}
              />
            </View>
          </>
        ) : null}

        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            paddingLeft: width * 0.03,
            marginVertical: 10,
          }}>
          Previous Months
        </Text>

        <ScrollView
          style={{
            paddingLeft: width * 0.03,
            marginBottom: 20,
            marginTop: 10,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {ejournals?.old_months?.map((jounral, i) => (
            <Magazine key={jounral?.id} id={jounral?.id} jounral={jounral} />
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const Magazine = ({jounral}) => {
  return (
    <View
      style={{
        padding: 5,
        marginHorizontal: 5,
        borderColor: 'black',
        borderWidth: 0.4,
        height: null,
        width: width * 0.7 + 10,
      }}>
      <View style={{flexDirection: 'column', alignItems: 'center'}}>
        <Text>{jounral?.title}</Text>
        <Image
          style={{
            width: width * 0.7,
            height: width,
            // marginLeft: width * 0.15,
          }}
          source={{
            uri: serverEndPoint + 'uploads/magazines/images/' + jounral?.image,
            // cache: 'only-if-cached',
          }}
        />
        <TouchableOpacity
          style={{
            padding: 10,
            marginVertical: 10,
            backgroundColor: '#FF9432',
          }}
          onPress={() => {
            Linking.openURL(
              serverEndPoint + 'magazines/' + jounral?.file,
            );
          }}>
          <Text style={{color: 'white', fontSize: 16}}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CurrentLives = ({navigation}) => {
  const [lives, setlives] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    //get request for get current lives
    axiosGet(
      'user/current_live_bookings',
      data => {
        // console.log(data, ' =====> current live');
        setlives(data);
      },
      null,
      navigation,
      dispatch,
    );
  }, []);
  return (
    <>
      <View>
        {/* current live  */}
        {lives.length ? (
          <>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                marginLeft: width * 0.05,
              }}>
              Current Lives
            </Text>
            <ScrollView
              style={{
                paddingLeft: width * 0.03,
                marginVertical: 20,
              }}
              horizontal
              showsHorizontalScrollIndicator={false}>
              {lives.map((live, i) => (
                <Card
                  key={i}
                  navigation={navigation}
                  liveLink={live?.live_link}
                  vendorId={live?.user_id}
                  Live={live}
                />
              ))}
            </ScrollView>
          </>
        ) : null}
      </View>
    </>
  );
};

const CategoriLive = ({navigation, categories}) => {
  const [curCtg, setcurCtg] = useState(null);
  const [ctgLives, setctgLives] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (curCtg) {
      setisLoading(true);
      axiosGet(
        'user/category?id=' + curCtg,
        res => {
          setctgLives(res?.current_lives);
          // console.log(res);
          setisLoading(false);
        },
        res => {
          console.log(res);
          setisLoading(false);
        },
        dispatch,
      );
      setTimeout(() => {
        setisLoading(false);
      }, 10000);
    }
    return () => {
      setctgLives([]);
    };
  }, [curCtg]);

  useEffect(() => {
    setcurCtg(categories[0]?.id);
    return () => {
      setcurCtg(null);
    };
  }, [categories?.length]);
  return (
    <>
      {/* home decore and all categories  */}
      <Text style={{fontSize: 20, fontWeight: '700', marginLeft: width * 0.05}}>
        Category Lives
      </Text>
      <ScrollView
        style={{
          paddingLeft: width * 0.03,
          marginVertical: 20,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {categories.map(ctg => (
          <CategoryBtn
            key={ctg?.id}
            id={ctg?.id}
            setcurCtg={setcurCtg}
            category={ctg?.name}
            active={curCtg == ctg?.id}
          />
        ))}
      </ScrollView>

      <ScrollView
        style={{
          minWidth: width * 0.9,
          paddingLeft: width * 0.03,
          marginTop: ctgLives.length ? 20 : 0,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator color="black" style={{marginLeft: width / 2}} />
        ) : ctgLives.length ? (
          ctgLives?.map((live, i) => (
            <CtgLive key={i} navigation={navigation} live={live} />
          ))
        ) : (
          <Text
            style={{
              textAlign: 'center',
              marginVertical: 15,
              fontSize: 16,
              fontWeight: '700',
              marginLeft: 60,
            }}>
            No Current live in this category
          </Text>
        )}
        {/* <CtgLive navigation={navigation} live={{}} /> */}
      </ScrollView>
    </>
  );
};

const FeaturedLive = ({navigation}) => {
  const [featureLive, setfeatureLive] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    setisLoading(true);
    axiosGet(
      'user/featured_lives',
      data => {
        // setfeatureLive(false);
        setfeatureLive(data);
        setisLoading(false);
      },
      res => {
        setisLoading(false);
      },
      navigation,
      dispatch,
    );
    setTimeout(() => {
      setisLoading(false);
    }, 10000);
    return () => {
      setfeatureLive([]);
    };
  }, []);

  return (
    <>
      {/* Aiba lives are here  */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: '700',
          marginLeft: width * 0.05,
          marginVertical: 10,
        }}>
        Featured Lives
      </Text>
      <ScrollView
        style={{
          paddingLeft: width * 0.03,
          marginTop: 20,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator
            color="black"
            style={{marginLeft: width * 0.45}}
            size="large"
          />
        ) : featureLive.length ? (
          featureLive.map((live, i) => (
            <Card
              key={i}
              navigation={navigation}
              liveLink={live?.live_link}
              vendorId={live?.vendor_id}
              Live={live}
            />
          ))
        ) : (
          <View style={{width: width}}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '700',
                fontSize: 18,
                marginBottom: 10,
              }}>
              No featured lives
            </Text>
          </View>
        )}
        {/* {featureLive.length ? (
          featureLive.map((live, i) => (
            <Card
              key={i}
              navigation={navigation}
              liveLink={live?.live_link}
              vendorId={live?.vendor_id}
              Live={live}
            />
          ))
        ) : isLoading ? (
          <>
            <ActivityIndicator
              color="black"
              style={{marginLeft: width * 0.45}}
              size="large"
            />
          </>
        ) : (
          <View style={{width: width}}>
            <Text
              style={{textAlign: 'center', fontWeight: '700', fontSize: 18}}>
              No featured lives
            </Text>
          </View>
        )} */}
      </ScrollView>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  registerBgImage: {
    width: width,
    height: 550,
  },
  registerBgView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shoppingRedefineText: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '800',
  },
  registerBtn: {
    backgroundColor: '#FFB800',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  productsHoriScroll: {
    paddingLeft: width * 0.03,
    marginVertical: 20,
  },
});
