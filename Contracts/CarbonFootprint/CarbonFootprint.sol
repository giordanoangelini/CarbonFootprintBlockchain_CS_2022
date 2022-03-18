// SPDX-License-Identifier: GPL-3.0 

pragma solidity ^0.8.4;

import "../NFT_Footprint/NFT_Footprint.sol";

contract CarbonFootprint is NFT_Footprint {

    // LOTTI DI MATERIE PRIME E DI PRODOTTI
    struct Lot {
        uint id;
        string name;
        uint carbonfootprint;
        uint amount;
        uint residual_amount;
        bool sold;
        address owner;
    }

    // MEMORIZZAZIONE LOTTI PER ID E PER MATERIA PRIMA
    mapping(uint => Lot) private getLotByID;
    mapping(string => uint[]) private getLotByRawMaterialName;

    mapping(uint => bool) private existLot;
    mapping(string => bool) private existRawMaterial;

    // MEMORIZZAZIONE LOTTI PER PROPRIETARIO (TRASFORMATORE)
    mapping(address => uint[]) private getLotByAddress;

    // MEMORIZZAZIONE ID NFT
    mapping(address => uint[]) private getTokenIDByAddress;

    // COSTRUTTORE
    address supplier;
    address transformer;
    address customer;

    uint id_lot;
    
    constructor (address _supplier, address _transformer, address _customer) {
        supplier = _supplier;
        transformer = _transformer;
        customer = _customer;
        id_lot = 1;

        addRawMaterial(id_lot, 'FARINA', 5, 90);
        addRawMaterial(id_lot, 'SALE', 1, 10);
        addRawMaterial(id_lot, 'PEPE', 2, 50);
        addRawMaterial(id_lot, 'POMODORI', 3, 30);
        addRawMaterial(id_lot, 'FARINA', 5, 20);
        addRawMaterial(id_lot, 'GRANO', 4, 20);
        addRawMaterial(id_lot, 'UOVA', 6, 100);
        addRawMaterial(id_lot, 'FARINA', 5, 80);
        addRawMaterial(id_lot, 'UOVA', 6, 90);
        addRawMaterial(id_lot, 'PEPE', 2, 20);
    }

    // INSERIMENTO NUOVA MATERIA PRIMA (FORNITORE)
    function addRawMaterial (uint _id, string memory _name, uint  _carbonfootprint, uint  _amount) public {
        require (msg.sender == supplier, "ERRORE - SOLO I FORNITORI POSSONO ESEGUIRE QUESTA FUNZIONE");
        addLot(_id, _name, _carbonfootprint, _amount);
    }

    // INSERIMENTO NUOVO LOTTO (FORNITORE-TRASFORMATORE)
    function getLastID() public view returns (uint256 id) {
        return id_lot;
    }  
    function addLot(uint _id, string memory _name, uint  _carbonfootprint, uint  _amount) private {

        id_lot = _id + 1;

        Lot memory new_lot = Lot({
            id: _id,
            name: _name,
            carbonfootprint: _carbonfootprint, 
            amount: _amount,
            residual_amount: _amount,
            sold: false,
            owner: msg.sender
        });

        getLotByID[new_lot.id] = new_lot;
        getLotByRawMaterialName[_name].push(_id);

        existLot[new_lot.id] = true;
        existRawMaterial[_name] = true;
        getLotByAddress[msg.sender].push(_id);
    }

    function searchInfoLot(uint _lot) public view returns (Lot memory) {
         require (existLot[_lot], "LOTTO NON ESISTENTE");
         return getLotByID[_lot] ;
    }

    function searchLotsByRawMaterialName(string memory _name) public view returns (Lot[] memory) {
        require (existRawMaterial[_name], "NESSUN LOTTO CONTIENE QUESTA MATERIA PRIMA");
        uint size = getLotByRawMaterialName[_name].length;
        Lot[] memory temp = new Lot[](size);
        for (uint i = 0; i < size; i++) {
            temp[i] = getLotByID[getLotByRawMaterialName[_name][i]];
        }
        return temp;
    }

    // ACQUISTO UNO O PIU' LOTTI (TRASFORMATORE)
    function purchaseLot(uint[] memory _id) public {
        require (msg.sender == transformer, "ERRORE - SOLO I TRASFORMATORI POSSONO ESEGUIRE QUESTA FUNZIONE");
        for (uint i = 0; i < _id.length; i++) {

            //ID LOTTO 0: UTENTE NON HA PIU' IN POSSESSO QUEL LOTTO
            uint size = getLotByAddress[getLotByID[_id[i]].owner].length;
            for (uint j = 0; j < size; j++) {
                if (getLotByAddress[getLotByID[_id[i]].owner][j] == _id[i])
                    delete getLotByAddress[getLotByID[_id[i]].owner][j];
            }

            getLotByID[_id[i]].sold = true;
            getLotByID[_id[i]].owner = msg.sender;
            getLotByAddress[msg.sender].push(_id[i]);
        }      
    }

    function checkMyLots(address _add) public view returns (Lot[] memory) {
        require (_add == transformer || _add == supplier , "ERRORE - SOLO I TRASFORMATORI/FORNITORI POSSONO ESEGUIRE QUESTA FUNZIONE");
        uint size = getLotByAddress[_add].length;
        Lot[] memory temp = new Lot[](size);
        for (uint i = 0; i < size ; i++) {
            temp[i] = getLotByID[getLotByAddress[_add][i]];
        }
        return temp;
    }

    //INSERIMENTO NUOVO PRODOTTO (TRASFORMATORE)
    function addProduct(uint _id, string memory _name, uint[][] memory _lot_amount, uint  _amount, uint _footprint) public {
        require (msg.sender == transformer, "ERRORE - SOLO I TRASFORMATORI POSSONO ESEGUIRE QUESTA FUNZIONE");

        uint256 _total_carbonfootprint = 0;

        /* 
        MATRICE _lot_amount
        Ogni colonna corrisponde ad un lotto
        Nella prima riga sono memorizzati gli ID
        Nella seconda riga sono memorizzate le quantità usate dei lotti
        */

        for(uint i = 0; i < _lot_amount[0].length; i++){ 
            Lot memory lot = getLotByID[_lot_amount[0][i]];
            uint lot_carbonfootprint = lot.carbonfootprint;
            uint amount_used = _lot_amount[1][i];
            _total_carbonfootprint += lot_carbonfootprint * amount_used + _footprint;
            getLotByID[_lot_amount[0][i]].residual_amount -= _lot_amount[1][i];
        }

        addLot(_id, _name, _total_carbonfootprint, _amount);
    }

    // ACQUISTO PRODOTTO FINITO (CLIENTE)
    function buyProduct(uint _id) public {
        require (msg.sender == customer, "ERRORE - SOLO I CLIENTI POSSONO ESEGUIRE QUESTA FUNZIONE");
        getLotByID[_id].residual_amount -= 1;
        uint new_id = mint(msg.sender, getLotByID[_id].name, getLotByID[_id].carbonfootprint, _id);
        getTokenIDByAddress[msg.sender].push(new_id);
    }

    function getTokenArray(address _add) public view returns (uint[] memory) {
        return getTokenIDByAddress[_add];
    }

    function getTokenURI(uint _tokenID) public view returns (string memory) {
        return tokenURI(_tokenID);
    }

    function getURIsByAddress(address _add) public view returns (string[] memory) {
        uint size = getTokenIDByAddress[_add].length;
        string[] memory nft_string = new string[](size);
        for (uint i = 0; i < size; i++) {
            nft_string[i] = tokenURI(getTokenIDByAddress[_add][i]);
        }
        return nft_string;
    }
}

