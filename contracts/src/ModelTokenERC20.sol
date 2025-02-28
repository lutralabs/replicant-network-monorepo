// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ModelTokenERC20 is ERC20, Ownable {
    error NameTooLong();
    error SymbolTooLong();

    constructor(string memory name, string memory symbol) ERC20(name, symbol) Ownable(msg.sender) {
        _validateTokenInput(name, symbol);
    }

    function _validateTokenInput(string memory name, string memory symbol) internal pure {
        if (bytes(name).length > 32) revert NameTooLong();
        if (bytes(symbol).length > 10) revert SymbolTooLong();
    }
}
