var solc = require("solc");
var fs = require("fs");

function compile(filepath) { 
    
    var input = {
    	  language: 'Solidity',
    	  sources: { },
    	  settings: {
    		      outputSelection: {
    			            '*': {
    					            '*': ['*']
    					          }
    			          }
    		    }
    };
    
    input.sources[filepath] = {
    	content: fs.readFileSync(filepath).toString()
    };
    
    var output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
    
    let bytecode = null;
    let abi = null;
    let name = ''

    for (var contractName in output.contracts[filepath]) {
    	bytecode = output.contracts[filepath][contractName].evm.bytecode.object;
    	abi = output.contracts[filepath][contractName].abi;
      name = contractName;  
    }
 
    return [abi, bytecode, name];

}

function findImports(path) {
  return {
      'contents': fs.readFileSync(path).toString()
  }
}

exports.compile = compile;
