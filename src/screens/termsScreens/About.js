import React from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Text,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const {height, width} = Dimensions.get('window');

const About = ({navigation}) => {
  return (
    <ScrollView style={{backgroundColor: '#F2F2F2', height: height}}>
      {/* <StatusBar backgroundColor="#F2F2F2" /> */}
      {/* back and hambuger */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: height * 0.1,
          alignItems: 'center',
          marginHorizontal: width * 0.05,
        }}>
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
      <View
        style={{
          width: width * 0.9,
          marginLeft: width * 0.05,

          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: height * 0.04, fontWeight: '700'}}>
          ABOUT US
        </Text>

        <Text
          style={{
            fontSize: height * 0.02,
            fontWeight: '700',
            marginVertical: 16,
          }}>
          AIBA (ALL INDIA BUSINESSWOMEN’S ASSOCIATION)
        </Text>
{/* 
        <Text
          style={{
            fontSize: height * 0.02,
            fontWeight: '700',
            marginVertical: 15,
          }}>
          ABOUT US
        </Text> */}
        {/* <Text>
          “The secret to getting ahead is getting started” – Sally Berger{'\n'}
          All India Business Women’s Association is a virtual consortium of
          working women and women business owners who want to connect, learn and
          grow together with fellow businesswomen. AIBA welcomes women at all
          stages of their careers and businesses - from start-up entrepreneurs,
          established business owners, resellers, artisans and all other
          newcomers who have launched or are planning to launch their business
          ventures in different fields.{'\n'}
          {'\n'}
          The primary aim of AIBA is to educate, empower and inspire the AIBA
          women to succeed in all spheres of their professional as well as their
          personal life. It is the only authentic women’s business association
          that brings together thousands of businesswomen, mentors and experts
          from various walks of life together on one platform. AIBA provides
          advisory services, training, opportunities for development, and
          lucrative networking opportunities in online business.{'\n'}
          {'\n'}
          Women Entrepreneurs often face complex challenges in the e-commerce
          domain. We strive to educate, train, support and motivate women
          entrepreneurs through innovative business ideas, financial advisory,
          social media marketing support and mentor connects, thereby upscaling
          their existing business. AIBA has alliances with able mentors,
          facilitators and marketing professionals, to make sure that AIBA
          members achieve all their entrepreneurial dreams. {'\n'}
          {'\n'}
        </Text> */}
        <Text style={{textAlign:'justify'}}>
        AIBA is an elite online business community of women entrepreneurs connected via Facebook. AIBA is placed amongst the topmost e-commerce portals on Facebook and is continuing its upward climb unwaveringly. This online shopping portal ab initio enjoys the support of refined and genuine customer base and impeccable reputation. Our team has taken special efforts to bring various manufacturers, sellers and resellers under one roof to ease out the online shopping for the customers and also to aid the vendors in combating the aftermath of the pandemic.
        </Text>

        {/* <Text
          style={{
            fontSize: height * 0.02,
            fontWeight: '700',
            marginVertical: 15,
          }}>
          OUR VISION
        </Text>

        <Text>
          For every business owner, it is important to build connections with
          like-minded professionals. If you don’t have a solid network of fellow
          female entrepreneurs, your growth remains stunted or you don’t achieve
          your full potential. {'\n'}We invite you to join us so that your
          transformation from yet another online entrepreneur to a dynamic
          businesswoman can be facilitated.{'\n'}
          {'\n'}
          Our vision is -{'\n'}
          {'\n'}# To augment the power of women entrepreneurs, while providing a
          structured and supportive network for expanding business{'\n'}
          {'\n'}# Showcase their myriad of talents and strengths{'\n'}
          {'\n'}# Provide new business opportunities and resources to grow as an
          individual and as an online entrepreneur{'\n'}
          {'\n'}# Offer mentoring services to enhance businesswomen’s
          entrepreneurial skills
          {'\n'}
          {'\n'}
        </Text>

        <Text
          style={{
            fontSize: height * 0.02,
            fontWeight: '700',
            marginVertical: 15,
          }}>
          OUR MISSION
        </Text>

        <Text>
          The mission of All India Business Women’s Association is to bring
          together business women of diverse occupations and to provide them
          with a host of opportunities to help them grow personally and
          professionally through leadership, education, networking support and
          country-wide recognition.
          {'\n'}
          {'\n'}
          AIBA is committed to creating accessible, affordable and innovative
          business solutions that would prepare the businesswomen to respond to
          the challenges and opportunities lurking in today’s dynamic world of
          online business.
          {'\n'}
          {'\n'}
          The AIBA women would connect and interact on a regular basis to
          exchange best practices, new ideas so as to widen their areas of
          opportunities and pool in resources. The main objective of AIBA is to
          emerge as the largest and strongest professionally woven system of
          women entrepreneurs in India. {'\n'}
          {'\n'}
          AIBA dreams of giving a voice and recognition to all women in online
          business, inspiring them to dream big in life. Be part of an engaging
          platform of enthusiastic, passionate and confident women entrepreneurs
          to be inspired empowered constantly. Access the wealth of knowledge
          and information disseminated through an awesome squad of educators and
          mentors, and allow your business to bloom and prosper online. {'\n'}
          {'\n'}
        </Text> */}
      </View>
    </ScrollView>
  );
};

export default About;
