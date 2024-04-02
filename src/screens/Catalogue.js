import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
  Modal,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useDispatch} from 'react-redux';
import {axiosGet, axiosPost} from '../axios';
import {serverEndPoint} from '../config';
import DocumentPicker from 'react-native-document-picker';

const {height, width} = Dimensions.get('window');

function Catalogue({navigation}) {
  const dispatch = useDispatch();

  const [catalogue, setcatalogue] = useState(null);
  // const user = useSelector(state => state.user);
  const [catalog, setcatalog] = useState(null);
  const [featuredImage, setfeaturedImage] = useState(null);
  const [catalogImages, setcatalogImages] = useState([null]);
  const [isSubmitting, setisSubmitting] = useState(false);

  /////////////////////////////////////////////////////////////////
  useEffect(() => {
    axiosGet(
      'user/catalog',
      data => {
        console.log(data?.catalog_images, '====>38');
        setcatalogue(data);
      },
      null,
      navigation,
      dispatch,
    );
    return () => {
      setcatalogue([]);
    };
  }, []);

  const validateForm = newCtImages => {
    if (!catalog && newCtImages.length == 0) {
      Alert.alert('Please check', 'Please add catalog first.');
      return false;
    }

    if (
      // !catalogue?.catalog &&
      !catalog
    ) {
      Alert.alert('Please check', 'Catalog file is required');
      return false;
    }

    if (!catalogue?.catalog_images && newCtImages.length == 0) {
      Alert.alert('Please check', 'Atleast one catalog image is required');
      return false;
    }

    return true;
  };

  const submitCatalogue = async () => {
    let newCtImages = [];
    catalogImages.forEach(ctImage => {
      if (ctImage) newCtImages.push(ctImage);
    });
    if (!validateForm(newCtImages)) return;
    const data = new FormData();
    data.append('catalog_file', catalog);
    data.append('featured_image', featuredImage);
    newCtImages.forEach(img => {
      if (img) data.append('catalog_images[]', img);
    });
    setisSubmitting(true);
    console.log(data, newCtImages, catalogImages);
    try {
      axiosPost(
        'user/update_catalog',
        data,
        data => {
          Alert.alert('Success', 'Catalog added successfully.');
          setcatalog(null);
          setcatalogImages([null]);
          setisSubmitting(false);
        },
        null,
        null,
        navigation,
        dispatch,
      );
    } catch (error) {
      setisSubmitting(false);
      console.log(error);
    }

    setTimeout(() => setisSubmitting(false), 10000);
  };

  return (
    <ScrollView style={{backgroundColor: '#F2F2F2'}}>
      {/* back and hambuger */}

      <View style={styles.mainView}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <MaterialIcons name="arrow-back-ios" size={25} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.toggleDrawer();
          }}>
          <FontAwesome5 name="bars" size={25} style={{marginLeft: 24}} />
        </TouchableOpacity>
      </View>

      {/* remaining body is in this view  */}
      <View style={styles.remainingBodyMain}>
        <Text style={{fontSize: 30, fontWeight: '700'}}> My Catalog </Text>

        {/* profile pic and edit btn */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            marginTop: 20,
          }}>
          {catalogue?.catalog?.file || catalog?.uri ? (
            <TouchableOpacity
              onPress={() => {
                if (catalogue?.catalog?.file.split('.').pop() == 'pdf') {
                  Linking.openURL(
                    serverEndPoint +
                      '/uploads/catalogs/' +
                      catalogue?.catalog?.file,
                  );
                }
              }}>
              <Image
                resizeMode="contain"
                style={{width: 90, height: 90}}
                source={{
                  uri:
                    catalogue?.catalog?.file.split('.').pop() == 'pdf'
                      ? 'https://www.aibaonline.in/api/assets/images/pdf.png'
                      : serverEndPoint +
                        '/uploads/catalogs/' +
                        catalogue?.catalog?.file,
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* below card and diffrent data  */}

        <View style={styles.card}>
          <SelectImage
            image={catalog}
            setImage={setcatalog}
            btnText="Select Catalog File"
          />
          <View style={styles.hr}></View>
          <Text style={styles.catalogImage}>Catalog Images</Text>

          {/* show catalog images here  */}
          <ViewCatalog catalogue={catalogue} />
          {/* show catalog images here  */}
          {catalogImages.map((img, i) => (
            <SelectImage
              key={i}
              image={img}
              setImage={doc => {
                setcatalogImages(pre => {
                  return pre.map((oneImage, j) => {
                    if (i == j) {
                      return doc;
                    } else return oneImage;
                  });
                });
              }}
              btnText="Select Catalog Image"
            />
          ))}

          <TouchableOpacity
            style={styles.plusBtn}
            onPress={() => {
              if (catalogImages.length < 10)
                setcatalogImages(pre => {
                  return [...pre, null];
                });
            }}>
            <FontAwesome5 name="plus" size={15} color="white" />
          </TouchableOpacity>

          {catalogue?.catalog?.featured_image ? (
            <Image
              resizeMode="contain"
              style={{
                width: 90,
                height: 90,
                marginLeft: width * 0.45 - 45,
              }}
              source={{
                uri:
                  serverEndPoint +
                  'uploads/catalogs/' +
                  catalogue?.catalog?.featured_image,
              }}
            />
          ) : null}
          <SelectImage
            image={featuredImage}
            setImage={setfeaturedImage}
            btnText="Select Featured Image"
          />

          <View style={styles.submitBtnView}>
            <TouchableOpacity
              disabled={isSubmitting}
              style={styles.submitBtn}
              onPress={submitCatalogue}>
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitBtnText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* copyright  */}

      <View style={{height: height * 0.2}}>
        <Text style={styles.copyright}>copyright © AIBA</Text>
      </View>
    </ScrollView>
  );
}

const SelectImage = ({image, setImage, btnText}) => {
  // pick document from phone
  const pickImage = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles],
      });
      // Setting the state to show single file attributes
      let doc = res[0];
      setImage(doc);
    } catch (err) {
      // Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        // alert('Canceled');
      } else {
        // For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
  return (
    <>
      <View style={styles.imagePickerView}>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          <Text style={styles.imagePickerText}>{btnText}</Text>
        </TouchableOpacity>
        {image ? (
          <Text style={styles.imageName} numberOfLines={1}>
            {image?.name}
          </Text>
        ) : null}
      </View>
    </>
  );
};

const ViewCatalog = ({catalogue}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageOnModal, setimageOnModal] = useState({});

  return (
    <>
      <ScrollView horizontal>
        {catalogue?.catalog_images?.map((image, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              setModalVisible(true);
              setimageOnModal(image);
            }}>
            <Image
              resizeMode="contain"
              style={{
                width: 90,
                height: 90,
                margin: 5,
              }}
              source={{
                uri: serverEndPoint + 'uploads/catalogs/' + image?.file,
              }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              resizeMode="contain"
              style={{
                width: width * 0.7,
                height: width * 0.7,
                margin: 10,
              }}
              source={{
                uri: serverEndPoint + 'uploads/catalogs/' + imageOnModal?.file,
              }}
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  catalogImage: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 2,
    marginLeft: 10,
  },
  submitBtnView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  submitBtn: {
    backgroundColor: '#ffb800',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  submitBtnText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
  },
  plusBtn: {
    backgroundColor: '#ffb800',
    padding: 10,
    width: 35,
    margin: 20,
    borderRadius: 5,
  },
  imagePickerView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 15,
  },
  imagePicker: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    backgroundColor: '#EEECF1',
    borderRadius: 20,
  },
  imagePickerText: {
    textAlign: 'center',
  },

  imageName: {
    marginLeft: 10,
    width: 150,
  },
  mainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: height * 0.1,
    alignItems: 'center',
    marginHorizontal: width * 0.05,
  },
  remainingBodyMain: {
    width: width * 0.9,
    marginLeft: width * 0.05,
    minHeight: height * 0.65,
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    width: width * 0.9,
    marginTop: 30,
    paddingVertical: 20,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 3, height: 4},
    shadowRadius: 10,
    elevation: 15,
  },
  hr: {
    borderBottomColor: 'black',
    borderBottomWidth: 0.4,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  copyright: {
    color: '#4E4957',
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // modal style
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
export default Catalogue;
