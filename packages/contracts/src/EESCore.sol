// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/**
 * @dev Example of a simple contract
 * For template purposes
 */
contract EESCore {

    uint256 private counter;

    constructor(uint256 _counter) {
        counter = _counter;
    }

    function getCounter() public view returns (uint256) {
        return counter;
    }

}
