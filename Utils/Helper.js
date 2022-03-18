const inquirer = require('inquirer');
const table_printer = require('console-table-printer');
const Model = require('../Utils/Model.js');
const myString = require("../Assets/string.js");

function search_name(myAccountAddress, menu_function) {
	var question = [
		{ 
			type: 'input', 
			name: 'nome', 
			message: myString.insertNameRawMaterial_string 
		}
	];
	inquirer.prompt(question).then((answer) => {
		Model.searchByName(answer.nome).then((result) => {
			if (result) if (!print_lots(result, true, false, myAccountAddress)) console.log(myString.unavailableLot_string);
			console.log();
			if (menu_function) menu_function(myAccountAddress);
		})
	});
}

function search_lot(myAccountAddress, menu_function) {
	
	var question = [
		{ 
			type: 'input', 
			name: 'lotto', 
			message: myString.insertLotId_string,
			validate: (answer) => {
				if (isNaN(parseInt(answer))) return myString.errorInvalidLotId_string;
				else return true;
			} 
		}
	]

	inquirer.prompt(question).then((answer) => {
		Model.searchByLot(answer.lotto).then((result) => {
			if (result) {
				console.log();
				var table = [{ LOTTO: result.id, MATERIA: result.name, FOOTPRINTxUNITA: result.carbonfootprint, QUANTITA: result.amount, RESIDUO: result.residual_amount, VENDUTO: result.sold }];
				table_printer.printTable(table);
			}
			console.log();
			if (menu_function) menu_function(myAccountAddress);
		});
	});
}

function check_lots(myAccountAddress, menu_function) {
    Model.checkMyLots(myAccountAddress).then((result) => {
        if (result) if (!print_lots(result, false, false, myAccountAddress)) console.log(myString.noneLotPurchase_string);
		console.log();
		if (menu_function) menu_function(myAccountAddress);
    });
}

function print_lots(array, check_availability, check_owner, address) {
    console.log();
    var table = [];
    array.forEach(element => {
        if ((!element.sold && element.residual_amount > 0 || !check_availability) && (element.owner != address || !check_owner) && element.id != 0) {
            var new_row = { LOTTO: element.id, MATERIA: element.name, FOOTPRINTxUNITA: element.carbonfootprint, QUANTITA: element.amount, RESIDUO: element.residual_amount };
            table.push(new_row);
        }
    });
    if (table.length == 0) return false;
    table_printer.printTable(table);
    return true;
}


exports.search_name = search_name;
exports.search_lot = search_lot;
exports.check_lots = check_lots;
exports.print_lots = print_lots;