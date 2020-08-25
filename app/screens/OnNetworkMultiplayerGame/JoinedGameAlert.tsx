import React from "react";
import { Alert } from "../../components/organisms";
import { Paragraph } from "../../components/atoms";

export default ({ isOpen }: { isOpen: boolean }) => (
  <Alert title="Joined game!" isOpen={isOpen}>
    <Paragraph>Game starts soon</Paragraph>
  </Alert>
);
