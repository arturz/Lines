import React, { useState } from "react";
import { ButtonThatOpensModal } from "../../../components/organisms";
import { MenuScreenNavigationProp } from "../../../navigations";
import { Paragraph } from "../../../components/atoms";
import { ModalButton } from "../../../components/molecules";
import { Share } from "react-native";
import { getInviteLink } from "../../../constants";
import { createRoom, deleteRoom } from "../../../firebase";

export default ({ navigation }: { navigation: MenuScreenNavigationProp }) => {
  const [roomId, setRoomId] = useState<string>(null);

  async function shareInviteLink() {
    console.log("shareInviteLink");
    const id = await createRoom();
    Share.share({
      message: `Join me in Lines game: ${getInviteLink(id)}`,
    });
    setRoomId(id);
  }

  async function deleteLink() {
    if (roomId !== null) await deleteRoom(roomId);
    console.log("deleteLink");
  }

  return (
    <ButtonThatOpensModal
      buttonTitle={"two players\nonline"}
      modalTitle="Waiting for join..."
      onCloseModal={deleteLink}
    >
      <Paragraph>Send link to your friend, so they can join you.</Paragraph>
      <ModalButton onPress={shareInviteLink}>Send link</ModalButton>
    </ButtonThatOpensModal>
  );
};
