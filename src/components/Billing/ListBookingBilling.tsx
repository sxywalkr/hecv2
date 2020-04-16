import dayjs from 'dayjs';
import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ScrollView } from 'react-native';
import {
  Avatar,
  Caption,
  FAB,
  Headline,
  Subheading,
  Theme,
  Title,
  Text,
  withTheme,
  Button,
  ActivityIndicator,
  Paragraph,
} from 'react-native-paper';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationParams } from 'react-navigation';
import { UserContext } from '../../App';
import Hero from '../Hero';
import { getProviders } from '../../util/helpers';
import ListBookingBillingCountByDay from './ListBookingBillingCountByDay'

interface Props {
  theme: Theme;
  navigation: NavigationParams;
}

function ListBooking({ theme, navigation }: Props) {
  const user = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  // const [userRole, setUserRole] = useState('')

  if (!user) {
    return null;
  }

  function renderFields() {
    const noGuest = 7;
    const fields = [];
    for (let i = 0; i < noGuest; i++) {
      // Try avoiding the use of index as a key, it has to be unique!
      fields.push(
        // <Field key={"guest_"+i} data={i} />
        <View style={styles.lists} key={i}>
          <View>
            <Title>{dayjs().add(i, 'day').format("YYYY-MM-DD")}</Title>
            <ListBookingBillingCountByDay datex={dayjs().add(i, 'day').format("YYYY-MM-DD")} />
          </View>
          <Button onPress={() => navigation.navigate('BillingListBookingByDay', { q: dayjs().add(i, 'day').format("YYYY-MM-DD") })}>Detail</Button>
        </View>
      );
    }
    return fields;
  }

  if (loading) {
    return <ActivityIndicator style={styles.container} animating={true} />;
  }

  return (
    <View style={styles.container} >
      {renderFields()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  content: {
    marginHorizontal: -20,
  },
  profile: {
    marginTop: -50,
    paddingVertical: 10,
  },
  avatar: {
    borderColor: '#fff',
    borderWidth: 5,
    elevation: 4,
  },
  lists: {
    backgroundColor: '#F6F7F8',
    elevation: 4,
    flexDirection: 'column',
    // justifyContent: 'space-evenly',
    marginVertical: 4,
    paddingHorizontal: 3,
  },
  providers: {
    backgroundColor: '#F6F7F8',
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 30,
    padding: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  button: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  center: {
    width: '100%',
    alignItems: 'center',
  },
});

export default withTheme(ListBooking);
