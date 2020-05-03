/*
 * WIP Name: Shelving Crisis
 * 
 * Single player infinite-dropper
 * by Camellia Shea, Sean Noelle, and Josepheng Xiong
 * Completed 5/3/2020
 * 
 * Visual Art by Josepheng Xiong
 * Sound Effects by Camellia Shea
 * To put a spin on endless runners, we wanted to make keeping up with the screen an actual part of the gameplay
 * Unlike most endless runners, where the character essentially moves with the scrolling screen, ours forces player to constantly try to keep up
 * Addiotionally, Threats are thrown at the player from both top and bottom instead of just one side.
 * These two features together are an attempt to make players frantic and panic, as they not only have to deal with several different things at once,
 * but are sometimes forced to deal with them by not doing anything (waiting for a platform).
 * 
 * */


let config = {
	type: Phaser.CANVAS, /*Loads 2d web renderer*/
	width: 960, /*game width (adjustable)*/
	height: 540, /*game height (adjustable)*/
	scene: [ Menu, Tutorial, Play, Credits ],
	physics: {
		default: "arcade",
		arcade: {
			gravity: {
				y: 700
			}
		}
    },
};

let game = new Phaser.Game(config);

game.settings = {
	// ooze settings
	oozeSpeed: 0,
	tutorOpen: false,
	playing: false,
	bgm: null,
}

// define key constants
let keyLEFT, keyRIGHT, keySPACE, keyUP, keyDOWN;