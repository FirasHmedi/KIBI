import _ from 'lodash';
import { flexRowStyle, violet } from '../styles/Style';
import { DeckSlot, Slot } from './Slots';

export const PowerGraveyard = ({ cardsIds }: { cardsIds: string[] }) => (
	<Graveyard name={'Power graveyard'} cardsIds={cardsIds} />
);

export const AnimalGraveyard = ({
	cardsIds,
	selectCards,
	selectedIds,
}: {
	cardsIds: string[];
	selectCards?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
	selectedIds?: string[];
}) => <Graveyard name={'Animal graveyard'} cardsIds={cardsIds} selectCards={selectCards} selectedIds={selectedIds} />;

export const Graveyard = ({
	name,
	cardsIds = [],
	selectCards,
	selectedIds = [],
}: {
	name: string;
	cardsIds: string[];
	selectCards?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
	selectedIds?: string[];
}) => {
	const selectCardsPolished = (cardId: string) => {
		if (!selectCards) return;
		selectedIds.includes(cardId)
			? selectCards(ids => ids?.filter(id => cardId != id))
			: selectCards(ids => [...(ids ?? []), cardId]);
	};

	return (
		<div style={{ width: '17vw', color: violet }}>
			<h5 style={{ marginBottom: 4 }}>
				{name} #{cardsIds.length}
				<br />
				{!_.isEmpty(selectedIds) && <h5>{selectedIds.length} selected</h5>}
			</h5>
			{cardsIds.length > 0 ? (
				<div style={{ ...flexRowStyle, overflowY: 'auto', justifyContent: 'center' }}>
					{cardsIds.map((cardId, index) => (
						<div style={{ marginRight: 8 }} key={index} onClick={() => selectCardsPolished(cardId)}>
							<DeckSlot cardId={cardId} selected={selectedIds.includes(cardId)} />
						</div>
					))}
				</div>
			) : (
				<div style={{ height: '15vh' }} />
			)}
		</div>
	);
};
