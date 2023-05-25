import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  PhotoAction,
  TrendingPhotoAction,
  TrendingEventAction,
  TrendedEventAction,
  TrendedPhotoAction,
  TrendEventAction,
  TrendPhotoAction,
  AlbumAction,
  AlbumListAction,
  PhotoAlbumAction,
  EventAction,
} from '../../actions';
import NetInfo from '@react-native-community/netinfo';
import {Image} from 'react-native';

import TopTabs from '../../components/TopTabs';
import TopTab from '../../components/TopTab';
import TabOnImg from '../../assets/trendtON.jpg';
import TabOffImg from '../../assets/trendtOFF.png';
import ScreenLayout from '../../components/ScreenLayout';
import AuthenticationHandler from '../../navigation/AuthenticationHandler';
import {logRender} from '../../debugging/logging';
import {LatestAlbumsContainer} from '../../components/album/albumList';
import {TrendingPhotosContainer} from '../../components/photos';

const TrendingListing = () => {
  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = useState('trending');
  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        dispatch(PhotoAction.resetData());
        dispatch(EventAction.resetData());
        dispatch(TrendingEventAction.fetchData());
        dispatch(TrendingPhotoAction.fetchData());
        dispatch(TrendedEventAction.reset());
        dispatch(TrendedPhotoAction.reset());
        dispatch(TrendEventAction.reset());
        dispatch(TrendPhotoAction.reset());
        dispatch(AlbumListAction.resetData());
        dispatch(AlbumAction.resetData());
        dispatch(PhotoAlbumAction.resetData());
      }
    });
  }, [dispatch]);


  logRender('TrendingListing Screen');

  return (
    <AuthenticationHandler>
      <ScreenLayout>
        <TopTabs>
          <TopTab
            isTabSelected={selectedTab === 'trending'}
            select={() => setSelectedTab('trending')}
            label={'Trending'}
          />
          <TopTab
            isTabSelected={selectedTab === 'albums'}
            select={() => setSelectedTab('albums')}
            label={'Albums'}
          />
        </TopTabs>

        {selectedTab === 'trending' && <TrendingPhotosContainer />}

        {selectedTab === 'albums' && <LatestAlbumsContainer />}
      </ScreenLayout>
    </AuthenticationHandler>
  );
};

TrendingListing.navigationOptions = ({navigation}) => ({
  tabBarIcon: ({focused}) => {
    if (focused && navigation.state.routeName === 'TrendTapp') {
      return <Image source={TabOnImg} style={{width: 50, height: 45}} />;
    } else {
      return <Image source={TabOffImg} style={{width: 50, height: 45}} />;
    }
  },
  tabBarOnPress: ({defaultHandler}) => {
    defaultHandler();
  },
});
export default TrendingListing;
