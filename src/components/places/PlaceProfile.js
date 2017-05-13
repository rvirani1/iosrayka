import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ListView, ActivityIndicator } from 'react-native';
import { ImagePicker } from 'expo';
import MapView from 'react-native-maps';
import { getPlace } from '../../services/apiActions';
import { Feed } from '../feed/Feed';
import { ImageFeed } from '../feed/ImageFeed';
import { Map } from '../map/Map';
import { CameraRollPicker } from './CameraRollPicker';
import ProfileStats from '../profile/ProfileStats';


import { postImageToPlace } from '../../services/apiActions';

export class PlaceProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feed: [],
      markers: [],
      favorites: [],
      photos: [],
      place: undefined,
      selectedFilter: 'feed',
      image: undefined,
      addPhotoScreen: false,
      showActivityIndicator: false,
      region: new MapView.AnimatedRegion({
        latitude: props.place.lat || 32.8039917,
        longitude: props.place.lng || -79.9525327,
        latitudeDelta: 0.00922*6.5,
        longitudeDelta: 0.00421*6.5
      }),
    };

    this.getPlace = this.getPlace.bind(this);
    this.pickImage = this.pickImage.bind(this);
    this.handlePhotoUpload = this.handlePhotoUpload.bind(this);
  }

  componentDidMount() {
    this.getPlace();
  }

  selectedFilterChange(val) {
    this.setState({
      selectedFilter: val,
      feedType: val
    });
  }

  getPlace() {
    getPlace(this.props.place)
      .then(data => {
        const list = data.favorites.map(favorite => {
          favorite['person'] = favorite.user;
          favorite['place'] = data.place;
          return favorite;
        });
        const feed = data.feed.map(item => {
          item['place'] = data.place;
          item['person'] = item.user;
          return item;
        })
        this.setState({
          markers: [data.place],
          favorites: list,
          feed: feed,
          place: data.place,
          photos: data.images,
          feedType: 'feed'
        });
      })
      .catch((err) => console.log('fuck balls: ', err));
  }

  pickImage() {
    ImagePicker.launchImageLibraryAsync({})
      .then((response) => {
        this.setState({image: response.uri, addPhotoScreen: true, feedType: undefined})
      })
      .catch(error => {
        console.error(error);
      })
  }

  handlePhotoUpload(imageUri) {
    const photo = {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    };
    const data = {
      photo: photo,
      place: this.props.place
    };
    this.setState({addPhotoScreen: false, showActivityIndicator: true})
    postImageToPlace(data)
      .then((res) => {
        this.state.photos.push(photo)
        this.setState({showActivityIndicator: false, feedType: 'photos'})
      })
      .catch((err) => {
        this.setState({showActivityIndicator: false, feedType: 'feed'})
      })
  }

  render() {
    const { favorites, favoritesList, feed, feedType, markers, place, photos, selectedFilter, region, image, addPhotoScreen, showActivityIndicator } = this.state;
    return (
      <View style={styles.container}>
        <Map markers={markers} styles={styles.mapContainer} region={region} />
        <View style={styles.detailsContainer}>
          { place && <View style={styles.profileDetailsContainer}>
            <View style={styles.profileTextContainer}>
              <View style={styles.profileText}>
                <Text style={styles.name}>{place.name}</Text>
              </View>
              <ProfileStats style={styles.favorites} label="Favorites" icon="star-o" data={favorites.length} />
            </View>
          </View> }
          <View style={styles.listContainer}>
            <View style={styles.filtersContainer}>
              <TouchableOpacity style={styles.privatePress} onPress={() => this.selectedFilterChange('feed')}>
                <Text style={selectedFilter === 'feed' ? styles.selectedFilter : styles.filters}>FEED</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.privatePress} onPress={() => this.selectedFilterChange('favorites')}>
                <Text style={selectedFilter === 'favorites' ? styles.selectedFilter : styles.filters}>FAVORITES</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.privatePress} onPress={() => this.selectedFilterChange('photos')}>
                <Text style={selectedFilter === 'photos' ? styles.selectedFilter : styles.filters}>PHOTOS</Text>
              </TouchableOpacity>
              { selectedFilter === 'photos' &&
                <TouchableOpacity style={styles.privatePress} onPress={() => addPhotoScreen ? this.handlePhotoUpload(image) : this.pickImage()}>
                  <Text style={selectedFilter === 'photos' ? styles.selectedFilter : styles.filters}> {addPhotoScreen ? "POST PHOTO" : "ADD PHOTO"}</Text>
                </TouchableOpacity>
              }
            </View>
            <View style={styles.feed}>
              {(feedType === 'feed') && <Feed showButtons={true} feed={feed} />}
              {(feedType === 'favorites') && <Feed showButtons={false} feed={favorites} />}
              {(feedType === 'photos') && <ImageFeed images={photos} />}
              {addPhotoScreen && <CameraRollPicker pickImage={() => console.log()} image={image}/>}
              {showActivityIndicator && <View style={styles.activityIndicator}>
                <ActivityIndicator
                  animating={showActivityIndicator}
                  size="large"
                />
              </View>}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column'
  },
  detailsContainer: {
    flex: 1,
    position: 'relative'
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: 45,
    borderBottomWidth: 0.4,
    borderBottomColor: '#8D8F90',
  },
  filters: {
    marginRight: 10,
    marginLeft: 15,
    alignSelf: 'center',
    color: '#8D8F90',
    paddingTop: 12
  },
  selectedFilter: {
    color: '#4296CC',
    borderBottomWidth: 1,
    borderBottomColor: '#4296CC',
    paddingTop: 12,
    marginRight: 10,
    marginLeft: 15,
  },
  selectedFilterButton: {
    color: '#4296CC',
    borderBottomWidth: 1,
    borderBottomColor: '#4296CC',
    marginRight: 10,
    marginLeft: 25,
  },
  filterButton: {
    alignSelf: 'center',
    position: 'absolute',
    right: 15,
    top: 12
  },
  filterButtonText: {
    color: '#8D8F90',
  },
  listContainer: {
    flex: 3
  },
  mapContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  name: {
    fontSize: 24
  },
  profileText: {
    alignSelf: 'flex-start',
    paddingTop: 15,
    width: '75%'
  },
  favorites: {
    alignSelf: 'flex-end'
  },
  profileDetailsContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f4f4f4'
  },
  profileImageContainer: {
    flex: 1
  },
  profileTextContainer: {
    flex: 1,
    height: 45,
    marginLeft: 10,
    flexDirection: 'row'
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    paddingBottom: 0
  },
  feed: {
    flex: 1
  },
  activityIndicator: {
    marginTop: '25%'
  }
});
