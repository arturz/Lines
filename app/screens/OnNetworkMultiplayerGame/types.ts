import { ReactElement } from "react";
import { NetworkGuestProp, NetworkHostProp } from "../../navigations";

export function checkHost(
  prop: NetworkGuestProp | NetworkHostProp
): prop is NetworkHostProp {
  return (prop as NetworkHostProp).isHost;
}

type ComponentProps = {
  isOpen: boolean;
  key: string | number;
};

export type AlertData = {
  isOpen: boolean;
  component: (props: ComponentProps) => ReactElement<ComponentProps>;
};
