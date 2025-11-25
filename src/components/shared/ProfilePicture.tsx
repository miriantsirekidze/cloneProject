import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from '@react-native-vector-icons/ionicons';

const { width, height } = Dimensions.get('window');

interface Props {
  imageUri: string;
  onImagePicked: (value: string) => void;
}

const ProfilePicture = ({ imageUri, onImagePicked }: Props) => {
  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      console.log('ImagePicker Error: ', result.errorMessage);
    } else if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;

      if (uri) {
        onImagePicked(uri);
      }
    }
  };

  return (
    <View style={styles.imageContainer}>
      <TouchableOpacity
        style={styles.imageView}
        activeOpacity={0.5}
        onPress={handlePickImage}
      >
        {imageUri ? (
          <>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <View style={styles.overlay}>
              <Ionicons name="pencil" size={24} color="white" />
              <Text style={styles.chosenImageTitle}>Edit</Text>
            </View>
          </>
        ) : (
          <>
            <Ionicons
              name="camera-outline"
              size={width * 0.15}
              color={'black'}
            />
            <Text style={styles.imageTitle}>Upload a Picture</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ProfilePicture;

const styles = StyleSheet.create({
  imageView: {
    height: width * 0.3,
    width: width * 0.3,
    backgroundColor: '#ccc',
    borderRadius: (width * 0.3) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
    height: width * 0.35,
    width: width * 0.35,
    backgroundColor: 'transparent',
    borderWidth: 5,
    borderColor: 'black',
    justifyContent: 'center',
    borderRadius: (width * 0.35) / 2,
    alignSelf: 'center',
  },
  imageTitle: {
    fontSize: 10,
    fontWeight: '500',
  },
  chosenImageTitle: {
    fontSize: 12,
    fontWeight: '500',
    top: 5, 
    color: 'white'
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
