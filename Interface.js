const fs = require("fs");
const inquirer = require('inquirer');
const Fornitore = require('./Utenti/Fornitore.js');
const Trasformatore = require('./Utenti/Trasformatore.js');
const Cliente = require('./Utenti/Cliente.js');
const wallets = JSON.parse(fs.readFileSync('./Assets/wallets.json'));
const myString = require("./Assets/string.js");

interface();

function interface() {
	var question = {
			type: 'list',
			name: 'wallet',
			message: myString.selectWallet_string,
			choices: [...wallets, ...[myString.exit_string]]
	}
	inquirer.prompt(question).then((answer) => {
		switch(answer.wallet) {
			case question.choices[0]: Fornitore.fornitore(wallets[0]); break;
			case question.choices[1]: Trasformatore.trasformatore(wallets[1]); break;
			case question.choices[2]: Cliente.cliente(wallets[2]); break;
			default: console.log(); return;
		}
	});
}

exports.interface = interface;