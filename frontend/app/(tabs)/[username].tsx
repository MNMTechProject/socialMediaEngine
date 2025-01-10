import { useState, useEffect } from 'react';
import { Text, ScrollView, View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import Avatar from '../../components/Avatar';
import LogoutButton from '../../components/logoutButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthProvider, useAuth } from '../(auth)/authContext';
import { useLocalSearchParams } from 'expo-router';

type UserProfileProps = {
  username: string;
  handle: string;
  bio: string;
  followers: number;
  following: number;
  //profileImage: string;
};

export default function TabTwoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { isAuthenticated } = useAuth();

  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { username } = useLocalSearchParams();
  const { user } = useAuth();

  // Example user data - you can replace this with actual data from your application
  // const userData: UserProfileProps = {
  //   username: 'JohnDoe123',
  //   handle: '@Johnthedon',
  //   bio: 'Just a traveler exploring the world of code and coffee.',
  //   followers: 1200,
  //   following: 755,
  //   //profileImage: 'https://example.com/profile.jpg',  // Placeholder image URL
  // };

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate('login');
      return;
    }

    if (!username) {
      setError('No username provided');
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8000/api/user/${username}/profile/`)  // Adjust the API URL based on your setup
      .then(response => response.json())
      .then(data => setUserData(data))
      .catch(error => console.error('Error fetching data: ', error));
  }, []);

  console.log(userData);

  return (
    <ScrollView>
      <View style={styles.container}>
          <ImageBackground 
            source={require('../../assets/images/ErieNature.jpg')}
            resizeMode='cover' 
            style={styles.bannerImage}>
          </ImageBackground>
          
          <View style={styles.webContainer}>
            
            <Avatar style={styles.avatar}></Avatar>

            <Text style={styles.username}>{userData.username}</Text>
            
            <Text>{userData.handle}</Text>

            <Text style={styles.bio}>{userData.bio}</Text>

            <View style={styles.statsContainer}>
              <Text style={styles.stat}>{userData.follower_count} Posts</Text>
              <Text style={styles.stat}>{userData.follower_count} Followers</Text>
              <Text style={styles.stat}>{userData.following} Following</Text>
              <Text style={styles.stat}>{userData.following} Notifications</Text>
            </View>
          
            <TouchableOpacity >
              < LogoutButton />
            </TouchableOpacity>

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
  webContainer: {
    justifyContent: 'center',
    paddingLeft: 15,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 10,
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
