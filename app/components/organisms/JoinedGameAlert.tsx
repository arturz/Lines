import React from "react";
import Alert from "./Alert";
import { Paragraph } from "../atoms";

export default ({ isOpen }: { isOpen: boolean }) => (
  <Alert title="Joined game!" isOpen={isOpen}>
    <Paragraph>Game starts soon</Paragraph>
  </Alert>
);
