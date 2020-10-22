import { AlertData } from "./types";

export const renderAlerts = (alerts: AlertData[]) =>
  alerts.reduce<{
    components: JSX.Element[];
    isAnyOpened: boolean;
  }>(
    ({ components, isAnyOpened }, alert, index) => {
      //only one alert can be opened
      if (alert.isOpen && !isAnyOpened) {
        return {
          components: components.concat(
            alert.component({ isOpen: true, key: index })
          ),
          isAnyOpened: true,
        };
      }

      return {
        components: components.concat(
          alert.component({ isOpen: false, key: index })
        ),
        isAnyOpened,
      };
    },
    { components: [], isAnyOpened: false }
  ).components;
