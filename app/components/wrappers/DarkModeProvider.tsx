import React, { memo, useEffect, useState } from "react";
import { Appearance } from "react-native";
import { ColorSchemeProvider } from "react-native-dynamic";
import { connect } from "react-redux";
import { compose, Dispatch } from "redux";
import usePrevious from "use-previous";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootState } from "../../redux";
import { setDarkMode } from "../../redux/ui/actions";

type ComponentProps = ComponentStoreProps & ComponentDispatchProps;
type ComponentStoreProps = ReturnType<typeof mapStateToProps>;
type ComponentDispatchProps = ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = ({ ui: { darkMode } }: RootState) => ({
  darkMode,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatchSetDarkMode: compose(dispatch, setDarkMode),
});

const DARK_MODE_KEY = "@dark_mode_key";

async function getInitialDarkMode() {
  let value = null;
  try {
    value = await AsyncStorage.getItem(DARK_MODE_KEY);
  } catch (error) {
    console.log(`Can't get AsyncStorage item ${DARK_MODE_KEY}`);
  }

  if (value !== null) {
    if (value === "1") return true;
    else if (value === "0") return false;
    else throw new Error(`Unknown ${DARK_MODE_KEY} value: ${value}`);
  }

  return Appearance.getColorScheme() === "dark";
}

const DarkModeProvider: React.FC<ComponentProps> = memo(
  ({ children, darkMode, dispatchSetDarkMode }) => {
    //initialize dark mode
    useEffect(() => {
      getInitialDarkMode().then((darkMode) => dispatchSetDarkMode(darkMode));
    }, []);

    //save updates of dark mode
    const previousDarkMode = usePrevious(darkMode);
    useEffect(() => {
      if (previousDarkMode !== undefined) {
        if (darkMode) AsyncStorage.setItem(DARK_MODE_KEY, "1");
        else AsyncStorage.setItem(DARK_MODE_KEY, "0");
      }
    }, [darkMode]);

    return (
      <ColorSchemeProvider mode={darkMode ? "dark" : "light"}>
        {children}
      </ColorSchemeProvider>
    );
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(DarkModeProvider);
