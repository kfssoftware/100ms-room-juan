import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

import type { PeerTrackNode } from '../utils/types';
import { useRTCStatsListeners } from '../utils/hooks';
import {
  clearPendingModalTasks,
  useAutoPip,
  useBackButtonPress,
  useFetchHMSRoles,
  useHMSMessages,
  useHMSNetworkQualityUpdate,
  useHMSPIPRoomLeave,
  useHMSReconnection,
  useHMSRemovedFromRoomUpdate,
  useHMSRoomStyle,
  useIsHLSViewer,
  useLandscapeImmersiveMode,
  usePIPListener,
  useSetDefaultChatRecipient,
} from '../hooks-util';
import { MeetingScreenContent } from './MeetingScreenContent';
import { HMSHLSStreamLoading } from './HMSHLSStreamLoading';
import type { RootState } from '../redux';
import { HLSViewerScreenContent } from './HLSViewerScreenContent';

interface MeetingProps {
  peerTrackNodes: Array<PeerTrackNode>;
  leaveDescription: any;
  leaveTitle: any;
}

export const Meeting: React.FC<MeetingProps> = ({ peerTrackNodes, leaveDescription, leaveTitle }) => {
  const startingHLSStream = useSelector(
    (state: RootState) => state.app.startingHLSStream
  );

  const isHLSViewer = useIsHLSViewer();

  // TODO: Fetch latest Room and localPeer on mount of this component?

  useFetchHMSRoles();

  // Handle selected (default) Chat Recipient as per dashboard config
  useSetDefaultChatRecipient();

  useHMSMessages();

  useHMSReconnection();

  useHMSRemovedFromRoomUpdate();

  // Handle when user press leave button visible on PIP Window
  useHMSPIPRoomLeave();

  // Handle state change to reset layout when App is focused from PIP Window
  usePIPListener();

  // Handle rendering RTC stats on Tiles and inside RTC stats modal
  useRTCStatsListeners();

  // Subscribe to Peers Network quality updates
  useHMSNetworkQualityUpdate();

  useAutoPip(peerTrackNodes.length === 1);

  // Handle Back button press and show leave room modal
  useBackButtonPress();

  useLandscapeImmersiveMode();

  // Clearing any pending modal opening tasks
  React.useEffect(() => {
    return () => {
      clearPendingModalTasks();
    };
  }, []);

  const containerStyles = useHMSRoomStyle((theme) => ({
    backgroundColor: theme.palette.background_dim,
  }));

  if (startingHLSStream) {
    return <HMSHLSStreamLoading />;
  }

  return (
    <View style={[styles.container, containerStyles]}>
      {isHLSViewer ? (
        <HLSViewerScreenContent />
      ) : (
        <MeetingScreenContent leaveDescription={leaveDescription} leaveTitle={leaveTitle} peerTrackNodes={peerTrackNodes} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
});
