// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./ModelTokenERC20.sol";
import "./interfaces/IERC20Factory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Factory is IERC20Factory, Ownable {

    event ERC20Deployed(address tokenAddress, string name, string symbol);

    constructor() Ownable(msg.sender) {}

    function deployERC20(string memory name, string memory symbol) public returns (address) {
        ModelTokenERC20 token = new ModelTokenERC20(name, symbol, msg.sender);
        emit ERC20Deployed(address(token), name, symbol);
        return address(token);
    }

}
