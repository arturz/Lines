import React from "react";
import { ButtonThatOpensModal } from "../../../components/organisms";
import { MenuScreenNavigationProp } from "../../../navigations";
import { Paragraph } from "../../../components/atoms";
import { ModalButton } from "../../../components/molecules";
import { Share } from "react-native";
import { getInviteLink } from "../../../constants";

export default ({ navigation }: { navigation: MenuScreenNavigationProp }) => {
  const shareInviteLink = () => {
    const id = Math.random().toString(36).slice(2);
    Share.share({
      message: `Join me in Lines game: ${getInviteLink(id)}`,
    });
  };

  return (
    <ButtonThatOpensModal
      buttonTitle={"play with friend\nonline"}
      modalTitle="Room created"
    >
      <Paragraph>Send link to your friend, so they can join you.</Paragraph>
      <ModalButton onPress={shareInviteLink}>Send link</ModalButton>
    </ButtonThatOpensModal>
  );
};
