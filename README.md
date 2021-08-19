Saboteur - Card Game
====================

### Demo:
[Demo on Heroku](https://sabetour.herokuapp.com/)
### How to use:
This project uses the following tools. Go check them out if you don't have them locally installed.
- [node、npm](https://nodejs.org/en/)

```
git clone https://github.com/annsonn/saboteur.git
cd saboteur
npm install
npm start
```

### Game Setup:
* Launch the app on a desktop to create a game/room for you and your friends. The desktop will act as the table top.
* Launch the app on any webkit mobile browser, enter the code and start playing!

### How it's played:
Players are assigned either a "Miner" or a "Saboteur" role, and given a mixed hand of path and action cards, and take turns in succession playing one card from their hand (or discarding it) and collecting a new one from the draw pile. Miners may play a path card in order to progress in building a tunnel from a special card which represents the mine start to one of the three special cards that represent possible gold locations (only one of which is effectively gold, but the players do not know which when the game begins as they are placed face down), while Saboteurs try to play path cards which actually hinder such progress (for example by ending paths or making them turn in opposite directions). Either player can instead play an action card, which have varying effects such as blocking other players from building paths (breaking their tools, in the game's analogy) or unblocking themselves or other players (usually the ones they believe to share the same role of either Miner or Saboteur).</p>

### How to win:
A round ends either when a path is established from the start card to the gold card (in which case the miners win) or there are no more cards in the players' hands and no successful path was established (in which case the victory is awarded to the Saboteurs).

