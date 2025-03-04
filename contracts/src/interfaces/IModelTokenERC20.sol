// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IModelTokenERC20 is IERC20 {

    function mint(address to, uint256 amount) external;

}
