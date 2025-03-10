// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

interface IModelTokenERC20 is IERC20, IERC20Metadata {

    function mint(address to, uint256 amount) external;

    function burn(address account, uint256 amount) external;

}
