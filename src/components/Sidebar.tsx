import { violet } from '../styles/Style';

function Sidebar() {
	return (
		<div style={{ width: '15vw', color: violet, backgroundColor: '#ecf0f1', padding: 4 }}>
			<div>
				<h5>Game explanation</h5>
				<ul style={{}}>
					<li>
						<h6>The game contains animals and power cards</h6>
					</li>
					<li>
						<h6>
							Animal cards divided into 4 clans (earth, fire, air and water), each clan contains 4 animals (king,
							attacker ,tank and joker), each animal has a specific ability
						</h6>
					</li>
					<li>
						<h6>The Power card has a specific ability that can influence the game and the Animal cards</h6>
					</li>
					<li>
						<h6>Before the start of the game, each player chooses 8 animals and one power card</h6>
					</li>
					<li>
						<h6>The game contains 2 major elements player Deck and the board</h6>
					</li>
					<li>
						<h6>Player deck contains animal and power cards</h6>
					</li>
					<li>
						<h6>
							The board divided into 5 elements: 6 slots, animal graveyard, power graveyard, environment slot and the
							main deck
						</h6>
					</li>
					<li>
						<h6>the 6 slots: each player has 3 where he can place his animals</h6>
					</li>
					<li>
						<h6>Animal graveyard contains the animals that are killed</h6>
					</li>
					<li>
						<h6>Power graveyard contains the power card that are used</h6>
					</li>
					<li>
						<h6>Environment slot indicate which clan environment is activated, at the start of the game is neutral</h6>
					</li>
					<li>
						<h6>The main deck contains power cards, each round every player get one power card</h6>
					</li>
					<li>
						<h6>Each player has 8hp, the game ends when one of the players reaches 0 hp</h6>
					</li>
					<li>
						<h6>
							Each round, the player get a power card from the main deck, he can play 2 cards (3 in the first round), he
							can also set the environment if it's charged and attack the opponent.
						</h6>
					</li>
					<li>
						<h6>The animals abilities can be used only if their clan's environment is activated</h6>
					</li>
					<li>
						<h6>King ability is to attack opponent player</h6>
					</li>
					<li>
						<h6>Attacker ability is to return to deck when sacrificed</h6>
					</li>
					<li>
						<h6>Tank ability is to add +1hp to owner when it attacks</h6>
					</li>
					<li>
						<h6>Crow(joker) ability is to return random dead animal to deck</h6>
					</li>
					<li>
						<h6>Fox(joker) ability is to return random power card</h6>
					</li>
					<li>
						<h6>Fox(Jellyfish) ability is to Draw 1 card from the main deck</h6>
					</li>
					<li>
						<h6>Fox(Snake) ability is to send random card from opponent deck to graveyard</h6>
					</li>
					<li>
						<h6>3 Animals in board defend their player from being attacked</h6>
					</li>
					<li>
						<h6>Player is attackable if no animal defends him</h6>
					</li>
					<li>
						<h6>Animals defend their king from being attacked</h6>
					</li>
				</ul>
			</div>
		</div>
	);
}

export default Sidebar;
