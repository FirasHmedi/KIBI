import React, { useState } from "react";
import {
  centerStyle,
  closeButtonStyle,
  graveyardPopup,
  graveyardPopup2,
  topCardStyle,
  violet,
} from "../styles/Style";
import { DeckSlot } from "./Slots";
import { Player, PlayerType } from "../utils/interface";
const ALLOWED_REVIVE_CARDS_IDS = [
  "one-2-anim-gy",
  "one-rev-any-anim-1hp",
  "one-rev-any-pow-1hp",
  "two-2-anim-gy",
  "two-rev-any-anim-1hp",
  "two-rev-any-pow-1hp",
];

export const PowerGraveyard = ({
  cardsIds,
  selectedIds,
  selectIds,
  round,
  currentPlayer,
}: {
  cardsIds: string[];
  selectedIds?: string[];
  selectIds?: React.Dispatch<React.SetStateAction<string[]>>;
  round: any;
  currentPlayer: Player;
}) => {
  return (
    <Graveyard
      name={"Power graveyard"}
      cardsIds={cardsIds}
      selectIds={selectIds}
      selectedIds={selectedIds}
      singleSelect={true}
      round={round}
      currentPlayer={currentPlayer}
    />
  );
};

export const AnimalGraveyard = ({
  cardsIds,
  selectIds,
  selectedIds,
  round,
  currentPlayer,
}: {
  cardsIds: string[];
  selectIds?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIds?: string[];
  round: any;
  currentPlayer: Player;
}) => {
  return (
    <Graveyard
      name={"Animal graveyard"}
      cardsIds={cardsIds}
      selectIds={selectIds}
      selectedIds={selectedIds}
      round={round}
      currentPlayer={currentPlayer}
    />
  );
};

export const Graveyard = ({
  name,
  cardsIds = [],
  round,
  selectIds,
  selectedIds = [],
  singleSelect = false,
  currentPlayer,
}: {
  name: string;
  cardsIds: string[];
  round: any;
  selectIds?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIds?: string[];
  singleSelect?: boolean;
  currentPlayer: Player;
}) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const isMyRound = currentPlayer.playerType === round?.player;
  const canReviveCards = currentPlayer.cardsIds.some((cardId) => ALLOWED_REVIVE_CARDS_IDS.includes(cardId))
    

  const selectCardsPolished = async (cardId: string) => {
    if (!selectIds) return;
    if (!isMyRound) return;
    if (!canReviveCards) {
      console.warn(
        "You don't have the required card to revive from the graveyard."
      );
      return;
    }
    if (selectedIds.includes(cardId)) {
      selectIds((ids) => ids?.filter((id) => cardId !== id));
    } else {
      if (singleSelect) {
        selectIds([cardId]);
      } else {
        if (selectedIds.length < 2) {
          selectIds((ids) => [...(ids ?? []), cardId]);
        } else {
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        }
      }
    }
  };

  const openCardSelectionPopup = () => {
    setPopupOpen(true);
  };

  const closeCardSelectionPopup = () => {
    setPopupOpen(false);
  };

  const alertStyle = {
    position: "fixed",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "red",
    color: "white",
    padding: "1rem",
    borderRadius: "5px",
    zIndex: 10,
    display: showAlert ? "block" : "none",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: violet,
      }}
    >
      <h5 style={{ marginBottom: 4 }}>
        {name} #{cardsIds.length}
      </h5>
      {cardsIds.length > 0 && (
        <div
          onClick={openCardSelectionPopup}
          style={{ ...topCardStyle, alignSelf: "center" }}
        >
          <DeckSlot
            cardId={cardsIds[0]}
            selected={selectedIds.includes(cardsIds[0])}
          />
        </div>
      )}
      {isPopupOpen && (
        <div style={graveyardPopup2} onClick={closeCardSelectionPopup}>
          <button style={closeButtonStyle} onClick={closeCardSelectionPopup}>
            X
          </button>
          <div style={graveyardPopup}>
            {cardsIds.map((cardId, index) => (
              <div
                key={index}
                style={{ width: "7vw", height: "7vw", ...centerStyle }}
                onClick={(e) => {
                  e.stopPropagation();
                  selectCardsPolished(cardId);
                }}
              >
                <DeckSlot
                  cardId={cardId}
                  selected={selectedIds.includes(cardId)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={alertStyle}>You are allowed to choose only two cards.</div>
    </div>
  );
};
