import React, { useState } from 'react';
import {
	alertStyle,
	closeButtonStyle,
	graveyardPopupContainer,
	graveyardPopupContent,
	topCardStyle,
	violet,
} from '../styles/Style';
import { DeckSlot } from './Slots';
import CancelIcon from '@mui/icons-material/Cancel';

export const PowerGraveyard = ({
	cardsIds,
	selectedIds,
	selectIds,
	isMyRound,
}: {
	cardsIds: string[];
	selectedIds?: string[];
	selectIds?: React.Dispatch<React.SetStateAction<string[]>>;
	isMyRound: boolean;
}) => {
	return (
		<Graveyard
			name={'Power graveyard'}
			cardsIds={cardsIds}
			selectIds={selectIds}
			selectedIds={selectedIds}
			singleSelect={true}
			isMyRound={isMyRound}
		/>
	);
};

export const AnimalGraveyard = ({
	cardsIds,
	selectIds,
	selectedIds,
	isMyRound,
}: {
	cardsIds: string[];
	selectIds?: React.Dispatch<React.SetStateAction<string[]>>;
	selectedIds?: string[];
	isMyRound: boolean;
}) => {
	return (
		<Graveyard
			name={'Animal graveyard'}
			cardsIds={cardsIds}
			selectIds={selectIds}
			selectedIds={selectedIds}
			isMyRound={isMyRound}
		/>
	);
};

export const Graveyard = ({
	name,
	cardsIds = [],
	selectIds,
	selectedIds = [],
	singleSelect = false,
	isMyRound,
}: {
	name: string;
	cardsIds: string[];
	isMyRound: boolean;
	selectIds?: React.Dispatch<React.SetStateAction<string[]>>;
	selectedIds?: string[];
	singleSelect?: boolean;
}) => {
	const [isPopupOpen, setPopupOpen] = useState(false);
	const [showAlert, setShowAlert] = useState(false);

	const selectCardsPolished = async (cardId: string) => {
		if (!selectIds || !isMyRound) return;

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

	const openCardSelectionPopup = () => setPopupOpen(true);
	const closeCardSelectionPopup = () => setPopupOpen(false);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				color: violet,
			}}>
			<h5 style={{ marginBottom: 4 }}>
				{name} #{cardsIds.length}
			</h5>
			{cardsIds.length > 0 ? (
				<div onClick={openCardSelectionPopup} style={topCardStyle}>
					<DeckSlot
						cardId={cardsIds[cardsIds?.length - 1]}
						selected={selectedIds.includes(cardsIds[cardsIds?.length - 1])}
					/>
				</div>
			) : (
				<div style={{ height: '15vh' }} />
			)}
			{isPopupOpen && (
				<div style={graveyardPopupContainer} onClick={() => closeCardSelectionPopup()}>
					<button style={closeButtonStyle} onClick={closeCardSelectionPopup}>
						<CancelIcon style={{ color: 'white', width: '3vw', height: 'auto' }} />
					</button>
					<div style={graveyardPopupContent}>
						{cardsIds.map((cardId, index) => (
							<div
								key={index}
								onClick={e => {
									e.stopPropagation();
									selectCardsPolished(cardId);
								}}>
								<DeckSlot cardId={cardId} selected={selectedIds.includes(cardId)} />
							</div>
						))}
					</div>
				</div>
			)}
			<div style={{ ...alertStyle, display: showAlert ? 'block' : 'none' }}>
				You are allowed to choose only two cards.
			</div>
		</div>
	);
};
