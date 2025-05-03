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

  displayBoards(player.board.board, enemy.board.board);
  placeShips(player.board, enemy.board);
});

export { Ship, Gameboard, Player, player, enemy };
