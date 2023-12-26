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
			1V1 game, each player has cards and health, The first player that reaches 0hp loses. The cards
			are divided into 2 types: Animal cards and Power cards. It is played round by round, the first
			player plays his cards, may attack, then the second player gets the turn and do the same.
			Player health decreases when he gets a direct hit from an animal. Animal cards Divided into 4
			colors (Red, Blue, Yellow and Green) Each color contains 4 animals (KING, ATTACKER, TANK and
			JOKER) Each Animal has Attack points (AP) and defense points (DP) Each animal has AP and DP,
			an animal can attack an animal if his AP more than DP King (2AP, 2DP) / Attacker (2AP, 1DP) /
			Tank (1AP, 2DP) / Joker (1AP, 1DP) Power cards There are 12 power cards that have an ability
			that can influence the game At the start each player has 2 power cards and in each round he
			gets a random power card from the main Deck Element: activates all animals abilities in board,
			each player can change it in his round and it affects all animals board. To change element,
			player needs to sacrifice 2hp Animals abilities: Lion ability is to attack two animals Eagle
			ability is to attack opponent player Whale ability is to add +1hp to owner each round Monkey
			ability is to steal a card from the opponent deck Animal can attack and kill an animal with
			same or less DP than his AP. Rules You can only attack once in a round 3 animals defend player
			(you can’t attack player if he has 3 animals on board) The animals abilities can be used only
			if their element is activated Player can play 2 cards each round (first round 3 cards) If the
			player has 3 animals of the same color and the element is activated, each animal AP is
			doubled. Gameplay Before the start of the game, each player has 8 animals and 2 power card
			(randomly) The game contains player Decks, the board and graveyards Player deck contains
			animal and power cards The board divided into 5 elements: 6 slots, animal graveyard, power
			graveyard, element slot and the main deck The 6 slots: each player has 3 where he can place
			his animals Animal graveyard contains the animals that are killed Power graveyard contains the
			power card that are used Element slot indicate which element is activated, at the start of the
			game, it is neutral The main deck contains power cards, each round the player to play get one
			power card Each player has 9HP, the game ends when one of the players reaches 0 hp Each round,
			the player gets a power card from the main deck, he can play 2 cards except in first round, he
			can play 3 To change the element, you must sacrifice 2 hp You can attack the opponent’s placed
			animals or the opponent directly if he doesn't have any animal to defend
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
