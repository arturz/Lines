import React, { memo } from "react";
import { ColorSchemeProvider } from "react-native-dynamic";
import { connect } from "react-redux";
import { RootState } from "../../redux";

type ComponentProps = ComponentStoreProps;
type ComponentStoreProps = ReturnType<typeof mapStateToProps>;

const mapStateToProps = ({ ui: { darkMode } }: RootState) => ({
  darkMode,
});

const DarkModeProvider: React.FC<ComponentProps> = memo(
  ({ children, darkMode }) => (
    <ColorSchemeProvider mode={darkMode ? "dark" : "light"}>
      {children}
    </ColorSchemeProvider>
  )
);

export default connect(mapStateToProps)(DarkModeProvider);
