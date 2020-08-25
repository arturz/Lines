import React, { useEffect } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { connect } from "react-redux";
import { LayoutWrapper } from "../../components/wrappers";
import { CellLineProps } from "../../types";
import { GameStatus } from "../../constants/GameStatus";
import { startGame, takeLine } from "../../redux";
import { GameMap, Pointer } from "../../classes";
import { Direction } from "../../constants";
import FinishAlert from "./FinishAlert";
import { LocalMultiplayerGameScreenNavigationProp } from "../../navigations";
import { GameRenderer, GameLogic } from "../../components/gameRenderer";

const mapStateToProps = ({ game: { status, pointer } }) => ({
  status,
  pointer,
});

const mapDispatchToProps = (dispatch) => ({
  startGame: (width, height) => dispatch(startGame(width, height)),
  takeLine: (y, x, direction, backwards) =>
    dispatch(takeLine(y, x, direction, backwards)),
});

const LocalMultiplayerGame = ({
  status,
  startGame: dispatchStartGame,
  takeLine,
  route,
  navigation,
}: {
  status: GameStatus;
  pointer: Pointer;
  startGame: (width: number, height: number) => void;
  takeLine: (
    y: number,
    x: number,
    direction: Direction,
    backwards: boolean
  ) => void;
  route: any;
  navigation: LocalMultiplayerGameScreenNavigationProp;
}) => {
  //start game automatically
  useEffect(() => {
    dispatchStartGame(route?.params?.width ?? 6, route?.params?.height ?? 10);
  }, []);

  //dispatch to store
  const onTakeLine = (cellLineProps: CellLineProps) => {
    takeLine(
      cellLineProps.y,
      cellLineProps.x,
      cellLineProps.direction,
      cellLineProps.backwards
    );
  };

  const goToMenu = () => navigation.navigate("Menu");

  useEffect(() => {
    const backAction = () => {
      goToMenu();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  if (status === GameStatus.Playing || status === GameStatus.Finish)
    return (
      <View style={StyleSheet.absoluteFill}>
        <GameLogic>
          <LayoutWrapper
            render={({ widthPx, heightPx, x, y }) => (
              <GameRenderer
                widthPx={widthPx}
                heightPx={heightPx}
                x={x}
                y={y}
                //on the same device always Player.A or Player.B can take line
                allowTakingLine={status === GameStatus.Playing}
                onTakeLine={onTakeLine}
              />
            )}
          />
          <FinishAlert goToMenu={goToMenu} />
        </GameLogic>
      </View>
    );

  return null;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalMultiplayerGame);
