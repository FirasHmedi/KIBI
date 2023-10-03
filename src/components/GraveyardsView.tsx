import _ from 'lodash';
import { flexRowStyle, violet } from '../styles/Style';
import { DeckSlot } from './Slots';

export const PowerGraveyard = ({
	cardsIds,
	selectedIds,
	selectIds,
}: {
	cardsIds: string[];
	selectedIds?: string[];
	selectIds?: React.Dispatch<React.SetStateAction<string[]>>;
}) => (
	<Graveyard
		name={'Power graveyard'}
		cardsIds={cardsIds}
		selectedIds={selectedIds}
		selectIds={selectIds}
		singleSelect={true}
	/>
);

export const AnimalGraveyard = ({
	cardsIds,
	selectIds,
	selectedIds,
}: {
	cardsIds: string[];
	selectIds?: React.Dispatch<React.SetStateAction<string[]>>;
	selectedIds?: string[];
}) => <Graveyard name={'Animal graveyard'} cardsIds={cardsIds} selectIds={selectIds} selectedIds={selectedIds} />;

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
	const selectCardsPolished = (cardId: string) => {
		if (!selectIds) return;
		selectedIds.includes(cardId)
			? selectIds(ids => ids?.filter(id => cardId != id))
			: singleSelect
			? selectIds([cardId])
			: selectIds(ids => [...(ids ?? []), cardId]);
	};

	return (
		<div style={{ width: '17vw', color: violet }}>
			<h5 style={{ marginBottom: 4 }}>
				{name} #{cardsIds.length}
			</h5>
			{!_.isEmpty(selectedIds) && <h5>{selectedIds.length} selected</h5>}
			{cardsIds.length > 0 ? (
				<div style={{ ...flexRowStyle, overflowY: 'auto' }}>
					{cardsIds.map((cardId, index) => (
						<div style={{ marginRight: 8 }} key={index} onClick={() => selectCardsPolished(cardId)}>
							<DeckSlot cardId={cardId} selected={selectedIds.includes(cardId)} graveyard={true} />
						</div>
					))}
				</div>
			) : (
				<div style={{ height: '15vh' }} />
			)}
		</div>
	);
};
