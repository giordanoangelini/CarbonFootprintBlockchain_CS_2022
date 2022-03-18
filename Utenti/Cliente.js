const inquirer = require('inquirer');
const table_printer = require('console-table-printer');
const Interface = require('../Interface.js');
const Model = require('../Utils/Model.js');
const Helper = require('../Utils/Helper.js');
const myString = require("../Assets/string.js");

var myAccountAddress = null;

function cliente(address) {

	myAccountAddress = address;

    var question = {
            type: 'list',
            name: 'action',
            message: myString.menuCliente_string,
            choices: [
                myString.purchaseMaterial,
                myString.checkPurchasedNFT_string,
                myString.back_string,
                myString.exit_string
            ]
    }
    
    inquirer.prompt(question).then((answer) => {
        switch(answer.action) {
            case question.choices[0]: purchase_product(); break;
            case question.choices[1]: check_NFT(); break;
            case question.choices[2]: Interface.interface(); break;
            case question.choices[3]: default: return;
        }
    });
}

function purchase_product() {
    var question = [
		{ 
            type: 'input', 
            name: 'nome', 
            message: myString.whichRawMaterial_string
        }
	];
	inquirer.prompt(question).then((answer) => {
        Model.searchByName(answer.nome).then((result) => {
			if (result) {
                var id = [];
                result.forEach(element => { if (!element.sold && element.residual_amount > 0) id.push(element.id) });
                if (!Helper.print_lots(result, true, false, myAccountAddress)) {
                    console.log(myString.unavailableLot_string + '\n');
                    cliente(myAccountAddress);
                } else {
                    console.log();
                    var question = [
                        {
                            type: 'list',
                            name: 'lotti',
                            message: myString.selectLotsToPuschase_string,
                            choices: [...id, ...[myString.cancel_string]]
                        }
                    ]
                    var question2 = [
                        {
                            type: 'confirm',
                            name: 'confirm',
                            message: myString.confirm_string
                        }
                    ]
                    inquirer.prompt(question).then((answer) => {
                        if (answer.lotti != myString.cancel_string) {
                            inquirer.prompt(question2).then((answer2) => {
                                if (answer2.confirm) {
                                    Model.buyProduct(answer.lotti, myAccountAddress).then((result) => {
                                        if (result) {
                                            console.log('\n' + myString.transactionPerformed_string + '\n');
                                            Model.getTokenArray(myAccountAddress).then((result) => {
                                                if (result) {
                                                    Model.getTokenURI(result[result.length-1]).then((result) => {
                                                        if (result) {
                                                            console.log('--- NFT ---\n');
                                                            console.log(JSON.parse(result));
                                                            console.log();
                                                            cliente(myAccountAddress);
                                                        } else {
                                                            console.log();
                                                            cliente(myAccountAddress);
                                                        }
                                                    })
                                                } else {
                                                    console.log();
                                                    cliente(myAccountAddress);
                                                }
                                            })
                                        } else {
                                            console.log();
                                            cliente(myAccountAddress);
                                        }
                                    })
                                } else {
                                    console.log('\n' + myString.transactionCanceled_string + '\n');
                                    cliente(myAccountAddress);
                                }
                            })
                        } else {
                            console.log('\n' + myString.transactionCanceled_string + '\n');
                            cliente(myAccountAddress);
                        }
                    });
                }
            } else {
                console.log();
                cliente(myAccountAddress);
            }
		});
    });		
}

function check_NFT() {
    Model.getURIsByAddress(myAccountAddress).then((result) => {
        if (result) {
            if (!result.length) {
                console.log('\n' + myString.notPurchasedNFT_string + '\n');
                cliente(myAccountAddress);
            }
            else {
                console.log('\n--- NFT ---\n');
                result.forEach(element => {
                    console.log(JSON.parse(element));
                });
                console.log();
                cliente(myAccountAddress);
            }
        } else {
            console.log();
            cliente(myAccountAddress);
        }
    });
}

exports.cliente = cliente;
