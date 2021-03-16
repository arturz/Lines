import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { compose, Dispatch } from "redux";
import { StyleSheet, View } from "react-native";
import { GameSize, GameStatus } from "../../constants";
import { initializeAndStartGame, RootState } from "../../redux";
import { generateMapSeed } from "../../utils";
import { GameLogic, GameRenderer } from "../gameRenderer";
import { LayoutWrapper } from "../wrappers";
import { useNavigation } from "@react-navigation/native";

type ComponentProps = ComponentStoreProps & ComponentDispatchProps;

type ComponentStoreProps = ReturnType<typeof mapStateToProps>;
type ComponentDispatchProps = ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = ({ game: { status } }: RootState) => ({
  status,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatchInitializeAndStartGame: compose(dispatch, initializeAndStartGame),
});

const opacity = {
  opacity: 0.8,
};

const MenuGameShowcase: React.FC<ComponentProps> = ({
  dispatchInitializeAndStartGame,
  status,
}) => {
  function initialize() {
    dispatchInitializeAndStartGame(
      generateMapSeed(GameSize.MEDIUM),
      GameSize.MEDIUM
    );
  }
  useEffect(initialize, []);

  //react-navigation leaves screens rendered
  const [visible, setVisible] = useState(true);

  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribeOnBlur = navigation.addListener("blur", () =>
      setVisible(false)
    );
    const unsubscribeOnFocus = navigation.addListener("focus", () => {
      setVisible(true);
      initialize();
    });
    return compose(unsubscribeOnFocus, unsubscribeOnBlur);
  }, [navigation, visible]);

  if (!visible) return null;

  return (
    <View style={[StyleSheet.absoluteFill, opacity]}>
      {(status === GameStatus.Playing || status === GameStatus.Finish) && (
        <GameLogic>
          <LayoutWrapper
            render={({ widthPx, heightPx, x, y }) => (
              <>
                <GameRenderer
                  widthPx={widthPx}
                  heightPx={heightPx}
                  x={x}
                  y={y}
                  allowTakingLine={false}
                  onTakeLine={() => void 0}
                />
              </>
            )}
          />
        </GameLogic>
      )}
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuGameShowcase);
