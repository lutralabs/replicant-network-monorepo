// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {RepNetManager} from "../src/RepNetManager.sol";

contract RepNetManagerScript is Script {
    RepNetManager public repNetManager;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        repNetManager = new RepNetManager();

        vm.stopBroadcast();
    }
}
