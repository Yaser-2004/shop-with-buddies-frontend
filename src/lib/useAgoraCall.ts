// // src/lib/useAgoraCall.ts
// import AgoraRTC from "agora-rtc-sdk-ng";

// // Create a new Agora client per user/session
// export const createAgoraClient = () => {
//   return AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
// };

// export const joinCall = async ({
//   client,
//   appId,
//   channel,
//   token,
//   uid,
//   onRemoteUsersUpdated,
// }: {
//   client: any;
//   appId: string;
//   channel: string;
//   token: string;
//   uid: string;
//   onRemoteUsersUpdated: (user: any) => void;
// }) => {
//   client.on("user-published", async (user, mediaType) => {
//     await client.subscribe(user, mediaType);
//     if (mediaType === "audio") {
//       user.audioTrack?.play();
//       onRemoteUsersUpdated(user);
//     }
//   });

//   await client.join(appId, channel, token, uid);

//   const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
//   await client.publish([localAudioTrack]);

//   return { localTrack: localAudioTrack };
// };

// export const leaveCall = async (client: any, localTrack: any) => {
//   if (localTrack) {
//     localTrack.stop();
//     localTrack.close();
//   }

//   if (client) {
//     await client.unpublish([localTrack]);
//     await client.leave();
//   }
// };

// export const toggleMute = (localTrack: any, mute: boolean) => {
//   if (localTrack) {
//     localTrack.setEnabled(!mute);
//   }
// };




// src/lib/useAgoraCall.ts
// src/lib/useAgoraCall.ts
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  IRemoteAudioTrack,
} from "agora-rtc-sdk-ng";

// Create a client instance (you'll call this in CallContext)
export const createAgoraClient = (): IAgoraRTCClient => {
  return AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
};

// Join the channel
export const joinCall = async ({
  client,
  appId,
  channel,
  token,
  uid,
  onRemoteUsersUpdated,
}: {
  client: IAgoraRTCClient;
  appId: string;
  channel: string;
  token: string;
  uid: string;
  onRemoteUsersUpdated: (user: any) => void;
}): Promise<{ localTrack: ILocalAudioTrack }> => {
  client.on("user-published", async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    if (mediaType === "audio") {
      const remoteTrack = user.audioTrack as IRemoteAudioTrack;
      remoteTrack.play();
      onRemoteUsersUpdated(user);
      console.log("🎧 Playing remote audio for", user.uid);
    }
  });

  client.on("user-unpublished", (user) => {
    console.log("🛑 User unpublished:", user.uid);
  });

  await client.join(appId, channel, token, uid);

  const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  await client.publish([localAudioTrack]);

  console.log("✅ Local audio published");

  return { localTrack: localAudioTrack };
};

// Leave the channel
export const leaveCall = async (
  client: IAgoraRTCClient,
  localTrack: ILocalAudioTrack
) => {
  if (localTrack) {
    localTrack.stop();
    localTrack.close();
  }

  await client.unpublish([localTrack]);
  await client.leave();
  client.removeAllListeners();

  console.log("👋 Left call and cleaned up");
};

// Toggle mute
export const toggleMute = (localTrack: ILocalAudioTrack, mute: boolean) => {
  if (localTrack) {
    localTrack.setEnabled(!mute);
    console.log(mute ? "🔇 Muted" : "🎙️ Unmuted");
  }
};
