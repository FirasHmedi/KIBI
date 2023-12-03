import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AnimalBoardSlot, PowerBoardSlot } from '../../components/Slots';
import { centerStyle, flexColumnStyle, violet } from '../../styles/Style';
import { ANIMALS_CARDS, POWER_CARDS } from '../../utils/data';

function Cards() {
	return (
		<DndProvider backend={HTML5Backend}>
			<div
				style={{
					...flexColumnStyle,
					...centerStyle,
					color: violet,
					height: '90vh',
					overflowY: 'auto',
				}}>
				<h3>Animal Cards</h3>
				<div style={{ display: 'flex', flexWrap: 'wrap', ...centerStyle }}>
					{ANIMALS_CARDS.map((animal, index) => (
						<div style={{ padding: '10px' }}>
							<AnimalBoardSlot key={index} cardId={animal.id} select={() => {}} />
							<h6>
								{animal.name} ({animal.clan})
							</h6>
						</div>
					))}
				</div>
				<h3>Power Cards</h3>
				<div style={{ display: 'flex', flexWrap: 'wrap', ...centerStyle }}>
					{POWER_CARDS.map((card, index) => (
						<div style={{ padding: '10px' }}>
							<PowerBoardSlot key={index} cardId={'one-' + card.id} select={() => {}} />
						</div>
					))}
				</div>
			</div>
		</DndProvider>
	);
}

export default Cards;
