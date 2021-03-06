import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

export class PlaceDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.goToPlace = this.goToPlace.bind(this);
  }

  goToPlace(place) {
    Actions.placeProfile({place: place});
  }

  render() {
    const place = this.props.place;
    return (
      <View style={styles.placeItem}>
        <View style={styles.textContainer}>
          <TouchableOpacity onPress={() => this.goToPlace(place)}>
            <Text style={styles.text}>
              {`${place.name}`}
            </Text>
            <View style={styles.starContainer}>
              <Icon name="star" color="gold" />
              <Text style={styles.favoriteCount}>{place.favorites_count}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  placeItem: {
    height: 55,
    flexDirection: 'row',
    marginTop: 7,
    marginBottom: 5,
    alignItems: 'stretch',
    justifyContent: 'space-between'
  },
  textContainer: {
    flex: 1,
    marginLeft: 5,
    marginTop: 10,
    flexDirection: 'row',
    alignSelf: 'flex-start'
  },
  text: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4296CC',
    fontWeight: '500'
  },
  locationText: {
    color: "gray",
    marginLeft: 8,
    fontSize: 12,
  },
  starContainer: {
    flexDirection: 'row',
    marginLeft: '5%',
    alignItems: 'center'
  },
  favoriteCount: {
    color: '#4296CC',
    paddingTop: '1%'
  }
});
