// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./ModelTokenERC20.sol";

contract ERC20Factory is Ownable {
    event ERC20Deployed(address tokenAddress, string name, string symbol);

    constructor() Ownable(msg.sender) {}

    function deployERC20(string memory name, string memory symbol) public returns (address) {
        ModelTokenERC20 token = new ModelTokenERC20(name, symbol);
        emit ERC20Deployed(address(token), name, symbol);
        return address(token);
    }
}
