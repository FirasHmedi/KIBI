import { centerStyle, flexColumnStyle, violet } from '../../styles/Style';

function WalkThrough() {
	return (
		<div
			style={{
				...flexColumnStyle,
				...centerStyle,
				color: violet,
				overflowY: 'auto',
				height: '90vh',
			}}>
			<h2>Game Explanation</h2>
			<ul style={{ textAlign: 'left' }}>
				<li>
					<h6>The game contains animals and power cards</h6>
				</li>
				<li>
					<h6>
						Animal cards divided into 4 clans (earth, fire, air and water), each clan contains 4
						animals (king, attacker ,tank and joker), each animal has a specific ability
					</h6>
				</li>
				<li>
					<h6>
						The Power card has a specific ability that can influence the game and the Animal cards
					</h6>
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
						The board divided into 5 elements: 6 slots, animal graveyard, power graveyard, element
						slot and the main deck
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
					<h6>
						Element slot indicate which clan element is activated, at the start of the game is
						neutral
					</h6>
				</li>
				<li>
					<h6>The main deck contains power cards, each round every player get one power card</h6>
				</li>
				<li>
					<h6>Each player has 8hp, the game ends when one of the players reaches 0 hp</h6>
				</li>
				<li>
					<h6>
						Each round, the player get a power card from the main deck, he can play 2 cards (3 in
						the first round), he can also set the element and attack the opponent.
					</h6>
				</li>
				<li>
					<h6>
						To change the element, your element must be charged, it takes 3 round to charged(at the
						start of the element is charge it) or use the power card "Charge the element"
					</h6>
				</li>
				<li>
					<h5>Animals abilities:</h5>
					<ul>
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
					</ul>
				</li>
			</ul>
			<h1>Scenario</h1>
			<p>in this scenario, the player one choose to:</p>
			<ul style={{ textAlign: 'left' }}>
				<li>
					<h6>play the power card revive any animal for 1 hp and revive the BEE</h6>
				</li>
				<li>
					<h6>
						play the power card revive block all attacks to stop the opponent from attacking in next
						turn
					</h6>
				</li>
				<li>
					<h6>finally change the element and attack directly the player with the EAGLE</h6>
				</li>
			</ul>
		</div>
	);
}
export default WalkThrough;
