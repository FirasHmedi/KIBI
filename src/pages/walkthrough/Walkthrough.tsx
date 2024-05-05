import { flexColumnStyle, violet } from '../../styles/Style';

function WalkThrough() {
	return (
		<div
			style={{
				...flexColumnStyle,
				color: violet,
				overflowY: 'scroll',
				height: '100%',
				paddingLeft: '4vw',
				paddingRight: '4vw',
				alignItems: 'flex-start',
				textAlign: 'left',
			}}>
			<h4>Overview of the Game</h4>
			<p style={{ fontSize: '0.9rem' }}>
				1 vs 1 card game where each player has a set of cards and a health total. The goal is to
				reduce the opponent's health to zero to win the game. The game is played in rounds, and each
				player takes turns playing cards and making moves.
			</p>

			<h4>Card Types</h4>
			<p style={{ fontSize: '0.9rem' }}>
				Animal Cards: <br />
				contains Attack Points (AP) and Defense Points (DP). There are four types of animals in four
				colors: King (2AP, 2DP) Attacker (2AP, 1DP) Tank (1AP, 2DP) Joker (1AP, 1DP) <br />
				Power Cards: <br />
				These are special cards that affect gameplay, offering various abilities. Players start with
				two power cards and draw an additional one each round.
			</p>

			<h4>Game Setup</h4>
			<p style={{ fontSize: '0.9rem' }}>
				Each player begins with 7 health points (HP). Players start with a hand of 8 animal cards
				and 2 power cards, drawn at random. The game board features 6 slots for animal cards (3 for
				each player), a main deck for drawing power cards, and separate graveyards for animal and
				power cards.
			</p>

			<h4>Gameplay</h4>
			<p style={{ fontSize: '0.9rem' }}>
				Round Structure: On their turn, a player can play up to two cards (three on the first
				round). <br />
				Combat: Players can use their animal cards to attack either the opponent’s animals or the
				opponent directly if it’s possible. <br />
				Element Slot: An element slot on the board determines the active element. Players have the
				option to change the current element at the cost of sacrificing 1 HP. Once an element is
				activated, it enables the abilities of any animal of that element.
			</p>

			<h4>Animal Abilities (Activated by Element)</h4>
			<p style={{ fontSize: '0.9rem' }}>
				Lion: Extra attack for another animal. <br />
				Eagle: Can attack the opponent player directly.
				<br />
				Whale: Adds +1 HP to the owner each round. <br />
				Monkey: return animal from the graveyard.
			</p>

			<h4>End of Game</h4>
			<p style={{ fontSize: '0.9rem' }}>The game ends when one player's health reaches zero. </p>
			<p style={{ fontSize: '0.9rem' }}>
				Each round involves strategic decision-making about which cards to play, whether to attack
				or defend, and how best to use power cards to influence the game. <br />
				The dynamic of changing elements and leveraging animal abilities based on these elements
				adds a layer of depth to the strategy.
			</p>
		</div>
	);
}
export default WalkThrough;
