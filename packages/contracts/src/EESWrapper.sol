// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/**
 * @dev Example of a simple contract
 * For template purposes
 */
contract EESWrapper {

    uint256 private counter;

    function initialize(uint256 _counter) public {
        counter = _counter;
    }

    function getCounter() public view returns (uint256) {
        return counter;
    }

}
