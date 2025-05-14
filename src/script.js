import "./styles.css";
import "./domLogic";
import { Ship } from "./Ship";
import { Gameboard } from "./Gameboard";
import { Player } from "./Player";
import { displayBoards, placeShips } from "./domLogic";

const body = document.querySelector("body");
const main = document.querySelector("main");
const startBtn = document.querySelector("#start-btn");

const player = new Player();
const enemy = new Player();

startBtn.addEventListener("click", (e) => {
  main.innerHTML = "";
  main.setAttribute("id", "in-game");

  main.innerHTML = `<div id="main-inner">
        <div id="player">
            <div class="board-header player-board-header">Your ships</div>
            <div class="player board"></div>
        </div>
        <div id="Attack">
            <div class="board-header enemy-board-header">Attack enemy</div>
            <div class="enemy board"></div>
        </div>
    </div>`;
  displayBoards(player.board.board, enemy.board.board);
  placeShips(player.board, enemy.board);
});

export { Ship, Gameboard, Player, player, enemy };
