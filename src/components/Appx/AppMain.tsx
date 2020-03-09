import dayjs from 'dayjs';
import React, { useContext } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
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
    <ScrollView style={styles.container}>
      {userRole === 'ROLELESS' ? <ActivityIndicator animating={true} /> :
        <View style={styles.container}>
          <Hero
            height={180}
            colors={['rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.1)']}
            image={'https://firebasestorage.googleapis.com/v0/b/fbhecc.appspot.com/o/appAssets%2Flogo_s250.png?alt=media&token=8b40e34a-d39d-4c01-8037-e8e3d83a9e3f'}
            
          />
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
              <Title>List Pasien BPJS</Title>
              <Paragraph>
                List Pasien BPJS
              </Paragraph>
              <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('ResepsionisListItemBpjs')}>Lihat</Button>
              <Divider />
              <Title>List Pasien Umum</Title>
              <Paragraph>
                List Pasien Umum
              </Paragraph>
              <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('ResepsionisListItemUmum')}>Lihat</Button>
              <Divider />
              <Title>List User Booking Kamar Operasi:</Title>
              <Paragraph>
                Menampilkan list user yang booking kamar operasi.
              </Paragraph>
              <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('DokterListBookingOka', { q: dayjs().add(0, 'day').format("YYYY-MM-DD") })}>Lihat</Button>
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
          }
          {userRole === 'Dokter' &&
            <View style={styles.content}>
              <Title>List User Booking:</Title>
              <Paragraph>
                Menampilkan list user yang booking.
              </Paragraph>
              <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('DokterListBookingByDay', { q: dayjs().add(0, 'day').format("YYYY-MM-DD") })}>Lihat</Button>
              <Title>List User Booking Kamar Operasi:</Title>
              <Paragraph>
                Menampilkan list user yang booking kamar operasi.
              </Paragraph>
              <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('DokterListBookingOka', { q: dayjs().add(0, 'day').format("YYYY-MM-DD") })}>Lihat</Button>
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
          {userRole === 'Billing' &&
            <View style={styles.content}>
              <Title>List Antri Billing:</Title>
              {/* <Paragraph>
                Menampilkan list user aplikasi.
              </Paragraph> */}
              <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('BillingListBooking')}>Lihat</Button>
            </View>
          }
          {userRole === 'Oka' &&
            <View style={styles.content}>
              <Title>List Antri Oka:</Title>
              {/* <Paragraph>
                Menampilkan list user aplikasi.
              </Paragraph> */}
              <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('OkaListBookingByDay', { q: dayjs().add(0, 'day').format("YYYY-MM-DD") })}>Lihat</Button>
              {/* <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('OkaListBooking')}>Lihat</Button> */}
            </View>
          }
        </View>
        
      }
      
    </ScrollView>
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
  spaceV10: {
    margin: 10,
  },
});

export default withTheme(AppMain);
