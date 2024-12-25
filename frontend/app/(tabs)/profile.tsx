import { useState } from 'react';
import { Text, ScrollView, View, StyleSheet, Button, FlatList, Pressable, ImageBackground } from 'react-native';
import Avatar from '../../components/Avatar';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export default function TabTwoScreen() {
  return (
    <View>
      <View style={styles.container}>
          <ImageBackground 
            source={require('../../assets/images/ErieNature.jpg')}
            resizeMode='cover' 
            style={styles.bannerImage}>
          </ImageBackground>
          <Avatar style={styles.avatar}/>
          <Text style={styles.title}>User Name</Text>
          <Text>@userhandle </Text>

        <View style={styles.crossbar}>
          <Text>Following </Text>
          <Text>Followers </Text>
          <Text>Block/Settings </Text>
        </View>

        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  bannerImage: {
    flex: 1,
    justifyContent: 'center',
    height: 250,
    width: '100%',
  },
  avatar: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: 'white', // Optional: border for better visual
  },
  crossbar: {
    flex: 1,
    marginVertical: 15,
    flexDirection: 'row',
  }
});
