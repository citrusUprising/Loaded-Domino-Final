/*
 * Final Game? (2020)
 * 
 * Single player infinite-dropper
 * by Camellia Shea, Sean Noelle, and Josepheng Xiong
 * 
 * Visual Art by Josepheng Xiong
 * Sound Effects by Camellia Shea
 * 
 * To put a spin on endless runners, we wanted to make keeping up with the screen an actual
 * part of the gameplay. Unlike most endless runners, where the character essentially moves
 * with the scrolling screen, ours forces player to constantly try to keep up. Addiotionally,
 * threats are thrown at the player from both top and bottom instead of just one side. These
 * two features together are an attempt to make players frantic and panic, as they not only
 * have to deal with several different things at once, but are sometimes forced to deal with
 * them by not doing anything (waiting for a platform).
 * 
 * */

let config = {
	type: Phaser.AUTO,
	width: 1280,
	height: 720,
	scene: [ Preload, Menu, Tutorial, Play, Credits, Settings ],
	physics: {
		default: "arcade",
		arcade: {
			gravity: {
				y: 700
			},
			debug: false 
		}
    },
};

let game = new Phaser.Game(config);

game.settings = {
	// speed ooze drops at
	oozeSpeed: 50,
	// time ooze drops for (ms)
	oozeDrop: 1000,
	tutorOpen: false,
	playing: false,
	trained: false, //reorganizes menu depending on if tutorial was played
	bgm: null,
	musicVolume: 0.5,
	effectVolume: 0.5,
}

// define key constants
let keyLEFT, keyRIGHT,  keyUP, keyDOWN, keyJUMP, keyINTERACT, keySELECT, keyBACK, keySPACE;