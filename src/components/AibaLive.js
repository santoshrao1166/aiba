import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Toumbnail} from './Card';
const AibaLive = ({
  bgImage,
  navigation,
  name,
  vendor,
  view,
  timeAgo,
  live_link,
}) => {
  return (
    <TouchableOpacity
      style={{
        borderRadius: 15,
        overflow: 'hidden',
        marginTop: 15,
      }}
      onPress={() => {
        navigation.navigate('Live', {
          liveLink: live_link,
        });
      }}>
      <View style={{flexDirection: 'row', borderRadius: 15}}>
        <Toumbnail bgImage={bgImage} />
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginLeft: 10,
            paddingVertical: 5,
          }}>
          <Text style={{fontSize: 16, fontWeight: '700'}}>{name}</Text>
          <View>
            <Text style={{color: 'black', opacity: 0.5}}>{vendor}</Text>
            <Text style={{color: 'black', opacity: 0.5}}>
              {view} views . {timeAgo}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AibaLive;
