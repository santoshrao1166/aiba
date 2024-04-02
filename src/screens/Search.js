import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {useDispatch} from 'react-redux';
import {axiosGet} from '../axios';
const {height, width} = Dimensions.get('window');

const Search = ({navigation}) => {
  const inputRef = useRef(null);
  const [serachTerm, setserachTerm] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [searchResults, setsearchResults] = useState([]);
  const [categories, setcategories] = useState([]);
  const dispatch = useDispatch();

  const getcategory = async () => {
    axiosGet(
      'user/all_categories_master',
      categories => {
        setcategories(categories);
      },
      null,
      navigation,
      dispatch,
    );
  };

  async function getSearchResult(term) {
    if (!term) return;
    setisLoading(true);
    axiosGet(
      'user/search_vendors?query=' + term,
      result => {
        setsearchResults(result);
        // console.log(result);
        setisLoading(false);
      },
      null,
      navigation,
      dispatch,
    );
  }
  useEffect(() => {
    let ismounted = true;
    if (ismounted) getcategory();
    return () => {
      ismounted = false;
      setcategories([]);
    };
  }, []);

  useEffect(() => {
    const reload = navigation.addListener('focus', () => {
      setsearchResults([]);
      setserachTerm('');
      inputRef.current.focus();
    });
    return reload;
  }, [navigation, inputRef]);
  return (
    <ScrollView
      style={{backgroundColor: 'white', minHeight: height}}
      showsVerticalScrollIndicator={false}>
      {/* all header part left arrow input and cross icon  */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: width * 0.05,
          marginTop: height * 0.03,
          marginBottom: height * 0.01,
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <AntDesign name="arrowleft" size={30} />
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          placeholder="Type for search"
          returnKeyType="search"
          onSubmitEditing={() => {
            console.log(serachTerm);
          }}
          value={serachTerm}
          style={{
            color: 'rgba(0,0,0,0.5)',
            flex: 1,
          }}
          placeholderTextColor="rgba(0,0,0,0.3)"
          onChangeText={val => {
            setserachTerm(val);
            getSearchResult(val);
          }}
        />
        {serachTerm == '' ? null : (
          <TouchableOpacity
            style={{marginLeft: 'auto'}}
            onPress={() => {
              setserachTerm('');
              inputRef.current.focus();
            }}>
            <Entypo name="cross" size={30} />
          </TouchableOpacity>
        )}
      </View>

      {/* search results  */}
      {serachTerm == '' ? (
        <View style={styles.container}>
          <Text style={styles.heading}>Recommended Categories</Text>
          {categories?.map((ctg, i) => (
            <Result
              key={i}
              label={ctg?.name}
              onPress={() =>
                navigation.navigate('CategoryLive', {ctgId: ctg?.id})
              }
            />
          ))}
        </View>
      ) : isLoading ? (
        <ActivityIndicator color="black" size="large" style={{marginTop: 50}} />
      ) : (
        <View style={styles.container}>
          <Text style={styles.heading}>Vendors</Text>

          {searchResults.map((result, i) => (
            <Result
              key={i}
              label={result?.name}
              onPress={() =>
                navigation.navigate('vendorLive', {vendorId: result?.id})
              }
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const Result = ({label, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.touchableOpacity}>
      <Text style={styles.touchableOpacityText}> {label}</Text>
    </TouchableOpacity>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    marginLeft: width * 0.05,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
  },
  touchableOpacity: {
    marginVertical: 5,
    paddingVertical: 4,
  },
  touchableOpacityText: {
    fontSize: 17,
  },
});
