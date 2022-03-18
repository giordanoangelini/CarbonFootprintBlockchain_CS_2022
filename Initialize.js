const Web3 = require("web3");
const fs = require("fs");
const compiler = require("./Utils/Compiler.js");
const myString = require("./Assets/string.js");
let web3 = new Web3(myString.web3);
let web3_2 = new Web3(myString.web3_2);
let web3_3 = new Web3(myString.web3_3);

var myAccountAddress = null;

web3.eth.getAccounts().then((value) => {
	myAccountAddress = value
	console.log(myString.node1_string + value);
	fs.writeFileSync('./Assets/wallets.json', '[\n"' + value + '",\n');
	web3_2.eth.getAccounts().then((value) => {
		console.log(myString.node2_string + value);
		fs.appendFileSync('./Assets/wallets.json', '"' + value + '",\n');
		web3_3.eth.getAccounts().then((value) => {
			console.log(myString.node3_string + value);
			fs.appendFileSync('./Assets/wallets.json', '"' + value + '"\n]');
			deploy(myAccountAddress[0]);
		});
	});
});

function deploy(address) {
	console.log(myString.usedAccount_string + address);

	// CarbonFootprint
	var values1 = compiler.compile("./Contracts/CarbonFootprint/CarbonFootprint.sol");
	var contract1 = new web3.eth.Contract(values1[0]);
	var wallets = JSON.parse(fs.readFileSync('./Assets/wallets.json'));
	contract1.deploy({ data: "0x" + values1[1], arguments: wallets}).send({ from: address }).then(function(newContractInstance){
		console.log(values1[2] + ' - ' + myString.deployCompleted_string);
		console.log(values1[2] + ' - ' + myString.addressContract_string + newContractInstance.options.address);
		fs.writeFileSync('./Contracts/CarbonFootprint/address.json', '[\n"' + newContractInstance.options.address + '"\n]');	
	});

	// NFT_Footprint
	var values2 = compiler.compile("./Contracts/NFT_Footprint/NFT_Footprint.sol");
	var contract2 = new web3.eth.Contract(values2[0]);
	contract2.deploy({ data: "0x" + values2[1]}).send({ from: address }).then(function(newContractInstance){
		console.log(values2[2] + ' - ' + myString.deployCompleted_string);
		console.log(values2[2] + ' - ' + myString.addressContract_string + newContractInstance.options.address);
		fs.writeFileSync('./Contracts/NFT_Footprint/address.json', '[\n"' + newContractInstance.options.address + '"\n]');
	});

}