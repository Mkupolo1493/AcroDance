# AcroDance (WORK IN PROGRESS)

AcroDance is a grid-based multiplayer game where the objective is getting a ball into your goal.
A cannon is located on the outside of the grid, pointing inwards. (If in a corner, the cannon points in the clockwise direction) The goals are located in random grid positions not occupied by another object.
Every time a round completes (When all players make their turn) the ball starts at the position of the cannon and travels in the direction of the cannon, one grid space each game tick.
Once the ball goes out of bounds, the simulation resets and a new round begins.
If the ball reaches a goal, the player associated to the respective goal wins.

## Shapes
There are 3 (technically 4) shapes that can manipulate the movement of the ball.
1. The circle, which is a version of the ball that does not score any points. It starts out stationary, however when the ball or another circle pushes it, the direction of the push is permanently assigned as the circle's direction and **any further pushes no longer change direction permanently when pushed, although a force in the direction of the push is still applied.**
2. The square, which is simply a stationary obstacle that bounces back any object.
3. The triangle, which rotates any orthogonally adjacent circles/balls, however the triangle is also solid therefore any objects that face it after being rotated will simply stay stationary until freed again. The direction of rotation depends on the color of the triangle; A red triangle rotates clockwise while a blue triangle rotates counterclockwise. (*Note: The fourth shape, the blue triangle, is inaccessible without the use of a double/triple card*)

## Cards
At the start of each new round, players each pick a card dictating the rules of their next move.
The cards consist of the following:

- Place: A common card. Has a type restriction and an amount of moves. The type restriction is what kind of shapes you will be able to place next round (squares only, triangles only, circles only, or any shapes), while the amount of moves is the amount of shapes to be dragged. It can be 0, 1, 2, or 3. In order to place a shape, drag and drop shapes from the shapes bar. The orange ⤺ button allows to undo your move and start over while the ✓ button, which turns green when you complete the required amount of moves, submits your moves and continues on to the next player.
- Remove: Also common, has a parameter dictating the amount of shapes that can be removed (1, 2, 3, 🗑️). If it happens to be 🗑️, the screen is automatically cleared of all shapes. Otherwise, click to remove a shape. When done removing shapes, the ✓ button lights up, allowing you to end your move.
- Move: Another common card, allows to move an existing shape. Unlike Place or Remove, Move does not have an amount of moves, instead, you can only move one shape each time you pull a Move card.
- Skip: An uncommon card. When drawn, draw another card and play accordingly, when submitted, the next player's move is skipped. If the next card is also a skip card, you are no longer able to draw any cards and skip your own move. The next player's move is still skipped.
- Replace: A rare card. After drawing, you have to drag and drop a shape from the shapes bar onto an existing shape **of a different type**. If identical, the move does not count.
- Double: A rare card. Allows you to double any shape type. Click on a shape to double all shapes of its type. The clone shapes are placed in random grid positions not already occupied. If a red triangle is selected, blue triangles will spawn instead of red ones, and vice versa.
- Triple: The rarest card in the game. Functions just like Double but creates two clones instead of one.

**Note: If at any point it is impossible to make a move, a Remove(🗑️) card is drawn instead.**
