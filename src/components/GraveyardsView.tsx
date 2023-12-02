import { useState } from 'react';
import { MdCancel } from 'react-icons/md';
import {
	closeButtonStyle,
	deckSlotStyle,
	graveyardPopupContainer,
	graveyardPopupContent,
	topCardStyle,
	violet,
} from '../styles/Style';
import { DeckSlot } from './Slots';

export const PowerGraveyard = ({ cardsIds }: { cardsIds: string[] }) => {
	return <Graveyard name={'Power graveyard'} cardsIds={cardsIds} />;
};

export const AnimalGraveyard = ({ cardsIds }: { cardsIds: string[] }) => {
	return <Graveyard name={'Animal graveyard'} cardsIds={cardsIds} />;
};

export const Graveyard = ({ name, cardsIds = [] }: { name: string; cardsIds: string[] }) => {
	const [isPopupOpen, setPopupOpen] = useState(false);

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
				{name} ({cardsIds.length})
			</h5>
			{cardsIds.length > 0 ? (
				<div onClick={openCardSelectionPopup} style={topCardStyle}>
					<DeckSlot cardId={cardsIds[cardsIds?.length - 1]} />
				</div>
			) : (
				<div
					style={{
						...deckSlotStyle,
						border: `solid 2px ${violet}`,
						justifyContent: 'center',
					}}></div>
			)}
			{isPopupOpen && (
				<CardsPopup cardsIds={cardsIds} closeCardSelectionPopup={closeCardSelectionPopup} />
			)}
		</div>
	);
};

export const CardsPopup = ({
	cardsIds = [],
	selectedIds = [],
	selectCardsPolished,
	closeCardSelectionPopup,
	dropClose = true,
}: {
	cardsIds: string[];
	selectedIds?: string[];
	selectCardsPolished?: (cardId: string) => void;
	closeCardSelectionPopup?: any;
	dropClose?: boolean;
}) => {
	return (
		<div
			style={graveyardPopupContainer}
			onClick={() => {
				if (dropClose) closeCardSelectionPopup();
			}}>
			<button style={closeButtonStyle} onClick={closeCardSelectionPopup}>
				<MdCancel style={{ color: 'white', width: '3vw', height: 'auto' }} />
			</button>
			<div style={graveyardPopupContent}>
				{cardsIds.map((cardId, index) => (
					<div
						key={index}
						onClick={e => {
							e.stopPropagation();
							if (!!selectCardsPolished) {
								selectCardsPolished(cardId);
							}
						}}>
						<DeckSlot cardId={cardId} selected={selectedIds?.includes(cardId)} />
					</div>
				))}
			</div>
		</div>
	);
};
