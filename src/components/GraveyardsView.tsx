import React, { useState } from 'react';
import { centerStyle, violet } from '../styles/Style';
import { DeckSlot } from './Slots';

export const PowerGraveyard = ({
    cardsIds,
    selectedIds,
    selectIds,
}: {
    cardsIds: string[];
    selectedIds?: string[];
    selectIds?: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
    return (
        <Graveyard 
            name={'Power graveyard'} 
            cardsIds={cardsIds} 
            selectIds={selectIds} 
            selectedIds={selectedIds} 
            singleSelect={true} 
        />
    );
};

export const AnimalGraveyard = ({
    cardsIds,
    selectIds,
    selectedIds,
}: {
    cardsIds: string[];
    selectIds?: React.Dispatch<React.SetStateAction<string[]>>;
    selectedIds?: string[];
}) => {
    return (
        <Graveyard 
            name={'Animal graveyard'} 
            cardsIds={cardsIds} 
            selectIds={selectIds} 
            selectedIds={selectedIds} 
        />
    );
};

export const Graveyard = ({
    name,
    cardsIds = [],
    selectIds,
    selectedIds = [],
    singleSelect = false,
}: {
    name: string;
    cardsIds: string[];
    selectIds?: React.Dispatch<React.SetStateAction<string[]>>;
    selectedIds?: string[];
    singleSelect?: boolean;
}) => {
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const selectCardsPolished = (cardId: string) => {
        if (!selectIds) return;

        if (selectedIds.includes(cardId)) {
            selectIds(ids => ids?.filter(id => cardId !== id));
        } else {
            if (singleSelect) {
                selectIds([cardId]);
            } else {
                if (selectedIds.length < 2) {
                    selectIds(ids => [...(ids ?? []), cardId]);
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

    const topCardStyle = {
        boxShadow: '3px 3px 0px 0px gray, 6px 6px 0px 0px gray',
    };

    const closeButtonStyle = {
        position: 'absolute',
        top: '0.5vw',
        right: '0.5vw',
        backgroundColor: '#eee',
        border: 'none',
        borderRadius: '50%',
        width: '2.5vw',
        height: '2.5vw',
        textAlign: 'center',
        lineHeight: '2.5vw',
        cursor: 'pointer',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
    };

    const alertStyle = {
        position: 'fixed',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'red',
        color: 'white',
        padding: '1rem',
        borderRadius: '5px',
        zIndex: 10,
        display: showAlert ? 'block' : 'none'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: violet }}>
            <h5 style={{ marginBottom: 4 }}>
                {name} #{cardsIds.length}
            </h5>
            {cardsIds.length > 0 && (
                <div onClick={openCardSelectionPopup} style={{  ...topCardStyle, alignSelf: 'center' }}>
                    <DeckSlot cardId={cardsIds[0]} selected={selectedIds.includes(cardsIds[0])} />
                </div>
            )}
            {isPopupOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        zIndex: 1,
                    }}
                    onClick={closeCardSelectionPopup}
                >
                    <button style={closeButtonStyle} onClick={closeCardSelectionPopup}>X</button>
                    <div
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '32vw',
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '1vw',
                            backgroundColor: 'transparent',
                            padding: '1vw',
                            borderRadius: '1vw',
                        }}
                    >
                        {cardsIds.map((cardId, index) => (
                            <div
                                key={index}
                                style={{ width: '7vw', height: '7vw', ...centerStyle }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    selectCardsPolished(cardId);
                                }}
                            >
                                <DeckSlot cardId={cardId} selected={selectedIds.includes(cardId)} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div style={alertStyle}>You are allowed to choose only two cards.</div>
        </div>
    );
};
