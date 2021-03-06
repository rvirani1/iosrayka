import React, { Component } from 'react';
import { AsyncStorage, ListView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { text } from 'react-native-communications';

export class InviteFriendsList extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      contacts: ds.cloneWithRows([]),
      message: undefined
    }
    this.renderContacts = this.renderContacts.bind(this);
  }

componentWillMount() {
  AsyncStorage.getItem('user')
    .then(user => {
      let parsedUser = JSON.parse(user);
      let name = `${parsedUser.first_name} ${parsedUser.last_name}`;
      this.setState({
        message: `${name} wants you to join them in Rayka!`
      });
    });
  this.setState({contacts: this.state.contacts.cloneWithRows(this.props.contacts)});
}

  renderContacts(contact) {
    let phoneNumber = contact.phoneNumbers.filter(number => { return number.label === 'mobile' || number.label === 'home' })[0];
    return (
      <View style={styles.listItem}>
        <TouchableOpacity onPress={() => {text(phoneNumber.number)}}>
            <Text style={styles.name}>{`${contact.firstName} ${contact.lastName}`}</Text>
            {phoneNumber &&
            <Text style={styles.number}>{phoneNumber.number}</Text>
            }
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <ListView
       style={styles.scrollView}
       dataSource={this.state.contacts}
       renderRow={this.renderContacts}
       enableEmptySections={true}
       renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
      />
    );
  }

}

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    marginLeft: 15,
    paddingTop: 10,
    paddingBottom: 10
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  scrollView: {
    flex: 1,
    alignSelf: 'stretch',
    marginTop: 75
  },
});