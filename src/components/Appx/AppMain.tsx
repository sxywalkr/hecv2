import dayjs from 'dayjs';
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Avatar,
  Caption,
  FAB,
  Headline,
  Subheading,
  Theme,
  Title,
  withTheme,
  Divider,
  ActivityIndicator,
  Paragraph,
  Button,
} from 'react-native-paper';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationParams } from 'react-navigation';
import { UserContext, UserRoleContext } from '../../App';
import Hero from '../Hero';
import PasienBooking from '../Pasien/Booking';

interface Props {
  theme: Theme;
  navigation: NavigationParams;
}

function AppMain({ theme, navigation }: Props) {
  const user = useContext(UserContext);
  const userRole = useContext(UserRoleContext)

  if (!user) {
    return null;
  }

  // Array of providers the the user is linked with
  // const providers = getProviders(user);

  return (
    <View style={styles.container}>
      {userRole === 'ROLELESS' ? <ActivityIndicator animating={true} /> :
        <View style={styles.container}>
          <Hero height={120} colors={['#15212B', '#15212B']} />
          {/* <View style={styles.content}> */}
          {/* <Headline>
              {user.uid}
            </Headline> */}
          <Divider />
          {userRole === 'System Admin' &&
            <View style={styles.content}>
              <Title>List App User:</Title>
              <Paragraph>
                Menampilkan list user aplikasi.
              </Paragraph>
              <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('SAListUser')}>Lihat</Button>
            </View>
          }
          {userRole === 'Pasien' &&
            <PasienBooking navigation={navigation} />
          }
          {userRole === 'Resepsionis' &&
            <View style={styles.content}>
              <Title>List User Booking:</Title>
              <Paragraph>
                Menampilkan list user yang booking.
              </Paragraph>
              <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('ResepsionisListBooking')}>Lihat</Button>
              <Divider />
              <Title>List Obat:</Title>
              <Paragraph>
                List daftar Obat.
              </Paragraph>
              <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('ResepsionisListItem')}>Lihat</Button>
              <Divider />
              <Title>List Diagnosa:</Title>
              <Paragraph>
                List daftar Diagnosa.
              </Paragraph>
              <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('ResepsionisListDiagnosa')}>Lihat</Button>
            </View>
            // <ResepsionisListBooking navigation={navigation}/>
          }
          {userRole === 'Dokter' &&
            <View style={styles.content}>
              <Title>List User Booking:</Title>
              <Paragraph>
                Menampilkan list user yang booking.
              </Paragraph>
              <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('DokterListBookingByDay', { q: dayjs().add(0, 'day').format("YYYY-MM-DD") })}>Lihat</Button>
            </View>
          }
          {userRole === 'Apotek' &&
            <View style={styles.content}>
              <Title>List Antri Apotek:</Title>
              {/* <Paragraph>
                Menampilkan list user aplikasi.
              </Paragraph> */}
              <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('ApotekListBooking')}>Lihat</Button>
            </View>
          }
        </View>
        // </View>
      }
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
    paddingHorizontal: 20,
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
  center: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    alignSelf: 'center',
    marginVertical: 20,
  },

});

export default withTheme(AppMain);
