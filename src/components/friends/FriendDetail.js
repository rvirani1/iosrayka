import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Icon, CheckBox, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import { addFriend, acceptFriend, declineFriend } from '../../services/apiActions';

export class FriendDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      showActivityIndicator: false,
      friendAdded: false
    };

    this.addFriendToDatabase = this.addFriendToDatabase.bind(this);
    this.denyFriendRequest = this.denyFriendRequest.bind(this);
    this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
    this.addToGroup = this.addToGroup.bind(this);
  }

  addFriendToDatabase(friend) {
    this.setState({showActivityIndicator: true})
    addFriend(friend)
      .then((resp) => {
        this.setState({friendAdded:true, showActivityIndicator: false})
      })
      .catch((err) => console.error('NO ADD FRIEND', err));
  }

  goToProfile(friend) {
    Actions.profile({person: friend});
  }

  acceptFriendRequest(friend) {
    this.setState({showActivityIndicator: true})
    acceptFriend(friend)
      .then((yay) => {
        this.setState({friendAdded:true, showActivityIndicator: false})
      })
      .catch(err => console.log('nOOOOO ', err))
  }

  denyFriendRequest(friend) {
    this.setState({showActivityIndicator: true})
    declineFriend(friend)
      .then((yay) => {
        this.setState({friendAdded:true, showActivityIndicator: false})
      })
      .catch(err => console.log('nOOOOO ', err))
  }

  renderCheckBox(friend) {
    return (
        <CheckBox
          containerStyle={styles.checkboxContainer}
          checked={this.state.checked}
          onPress={ () => {
            friend.invited = !this.state.checked
            this.setState({
              checked: !this.state.checked
            })
          }}
        />
    );
  }

  addToGroup(friend) {
    return (

        <CheckBox
          center
          containerStyle={styles.checkboxContainer}
          checked={this.state.checked}
          onPress={ () => {
            friend.invited = !this.state.checked
            this.setState({
              checked: !this.state.checked
            })
            console.log("ON CHECK", friend)
          }}
        />
    );
  }

  render() {
    const friend = this.props.friend;
    const { showActivityIndicator, friendAdded } = this.state;
    return (
      <View style={styles.friendItem}>
        <Image source={{ uri: friend.photo_url || null }} style={styles.photo} />
        <View style={styles.textContainer}>
          <TouchableOpacity onPress={() => this.goToProfile(friend)}>
            <Text style={styles.text}>
              {`${friend.first_name} ${friend.last_name}`}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.addFriend}>
            {
              friend.search && !showActivityIndicator && !friendAdded && <Button
                  title='Follow'
                  color='#4296CC'
                  backgroundColor='#FFF'
                  borderRadius={1}
                  raised
                  borderColor='#4296CC'
                  onPress={() => this.addFriendToDatabase(friend)}
                />
            }
            {
              friend.search && showActivityIndicator && !friendAdded && <ActivityIndicator
                animating={showActivityIndicator}
                size="large"
              />
            }
            {
              friend.search && !showActivityIndicator && friendAdded && <Text style={styles.requestSent}>Following!</Text>
            }
          </View>

          { this.props.isGroup && this.renderCheckBox(friend) }
          { friend.isGroup && this.addToGroup(friend) }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  friendItem: {
    height: 45,
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 7,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    alignItems: 'flex-start'
  },
  photo: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  textContainer: {
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
  checkboxContainer: {
    alignItems: 'flex-end',
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 0,
  },
  acceptFriend: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  acceptJoinGroupRequestButton: {
    borderWidth: 1,
    borderColor: '#4296CC',
    alignSelf: 'flex-end',
    flex: 1,
  },
  acceptJoinPlus: {
    color: '#4296CC',
    backgroundColor: '#4296CC',
    alignSelf: 'flex-end',
    flex: 1
  },
  addFriend: {
    alignSelf: 'flex-end',
    flexDirection: 'row'
  },
  iconStyle: {
    marginRight: 10
  },
  requestSent: {
    marginRight: 20,
    fontWeight: 'bold',
    color: '#4296CC'
  }
});
