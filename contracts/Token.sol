// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Token {
    string public name;
    string public symbol;
    uint256 public decimals = 18;
    uint256 public totalSupply;

    // Track Balances
    // Address is the key, the balance of the address of the value. state variable is balanceOf
    mapping(address => uint256) public balanceOf;

    // Send Tokens


    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10 ** decimals); // 1,000,000 x 10^18;
        balanceOf[msg.sender] = totalSupply; // msg.sender is an address. msg is a global variable in solidity.
    }
}
