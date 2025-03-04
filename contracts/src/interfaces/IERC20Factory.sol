// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IERC20Factory {

    function deployERC20(string memory name, string memory symbol) external returns (address);

}
