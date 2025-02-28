// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {RepNetManager} from "../src/RepNetManager.sol";

contract RepNetManagerTest is Test {
    RepNetManager public repNetManager;

    function setUp() public {
        repNetManager = new RepNetManager();
    }

    function test_CrowdfundingCreation() public pure {
        console.log("test_CrowdfundingCreation");
    }
}
