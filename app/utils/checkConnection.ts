import NetInfo from "@react-native-community/netinfo";

export default async function () {
  const state = await NetInfo.fetch();
  return state.isConnected;
}
