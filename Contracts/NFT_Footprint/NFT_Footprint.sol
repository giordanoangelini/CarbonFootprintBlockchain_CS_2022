// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract NFT_Footprint is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(uint => Product) public attributes;

    struct Product {
        string name;
        uint footprint;
        uint product_lot;
    }

    constructor() ERC721("NFT_Footprint", "NFTFP") {}

    function mint(address _to, string memory _name, uint _footprint, uint _product_lot) public returns(uint) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_to, tokenId);
        attributes[tokenId] = Product(_name, _footprint, _product_lot);
        return tokenId;
    }

    function tokenURI(uint256 tokenId) override(ERC721) public view returns (string memory) {
        string memory json = string(
            abi.encodePacked(
                '{',
                ' "id" : "', uint2str(tokenId), '",',
                ' "attributes" : [',
                ' { "name" : "', attributes[tokenId].name, '" },',
                ' { "footprint" : "', uint2str(attributes[tokenId].footprint), '" },',
                ' { "product_lot" : "', uint2str(attributes[tokenId].product_lot), '" }',
                ']',             
                '}'
            )
        );
        return json;
    }   

    // toString()
    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
