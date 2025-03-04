// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./interfaces/IModelTokenERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ModelTokenERC20 is IModelTokenERC20, ERC20, Ownable {

    constructor(string memory name, string memory symbol, address owner) ERC20(name, symbol) Ownable(owner) {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

}
