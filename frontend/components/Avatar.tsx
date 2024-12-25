import { View, ImageBackground, StyleSheet} from 'react-native';
import yaks from '../assets/data/yaks';

const yak = yaks[0];

const Avatar = () => {
    return(
        <View>
            <ImageBackground
                source={yak.user.image}
                style={styles.userImage}
            >
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    userImage: {
        marginTop: 175,
        width: 150,
        height: 150,
        borderRadius: 50,
        alignSelf: 'flex-start', // Moves avatar to the left
    },
});

export default Avatar;