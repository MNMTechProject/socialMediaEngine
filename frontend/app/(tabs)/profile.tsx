import { useState } from 'react';
import { Text, ScrollView, View, StyleSheet, Button, FlatList, Pressable, ImageBackground, TouchableOpacity, Image } from 'react-native';
import Avatar from '../../components/Avatar';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';


type UserProfileProps = {
  username: string;
  handle: string;
  bio: string;
  followers: number;
  following: number;
  //profileImage: string;
};

export default function TabTwoScreen() {
  
  // Example user data - you can replace this with actual data from your application
  const userData: UserProfileProps = {
    username: 'JohnDoe123',
    handle: '@Johnthedon',
    bio: 'Just a traveler exploring the world of code and coffee.',
    followers: 1200,
    following: 755,
    //profileImage: 'https://example.com/profile.jpg',  // Placeholder image URL
  };

  return (
    <ScrollView>
      <View style={styles.container}>
          <ImageBackground 
            source={require('../../assets/images/ErieNature.jpg')}
            resizeMode='cover' 
            style={styles.bannerImage}>
          </ImageBackground>
          
          <Avatar style={styles.avatar}>
            
          </Avatar>

          <TouchableOpacity >
              <Image 
                source={require('../../assets/images/react-logo.png')}
                resizeMode='contain'
                style={styles.settingsButton}>
              </Image>
          </TouchableOpacity>

          <Text style={styles.username}>{userData.username}</Text>
          
          <Text>{userData.handle} </Text>

          <Text style={styles.bio}>{userData.bio}</Text>

          <View style={styles.statsContainer}>
          <Text style={styles.stat}>{userData.followers} Followers</Text>
          <Text style={styles.stat}>{userData.following} Following</Text>
          </View>
        
        </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
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
  bio: {
    padding: 10,
    fontSize: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 5,
  },
  stat: {
    fontSize: 15,
    fontWeight: '600',
    padding: 20,
  },
  settingsButton: {
    alignItems: 'flex-end',
    width: 40,
    height: 40,
    padding: 5,
  },
});
