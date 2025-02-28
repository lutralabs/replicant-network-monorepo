// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {RepNetManager} from "../src/RepNetManager.sol";
import {Test, console} from "forge-std/Test.sol";

contract RepNetManagerTest is Test {

    RepNetManager public repNetManager;

    function setUp() public {
        repNetManager = new RepNetManager();
    }

    function test_CrowdfundingCreation() public pure {
        console.log("test_CrowdfundingCreation");
    }

}
