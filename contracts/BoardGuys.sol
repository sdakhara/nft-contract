// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/utils/Strings.sol";

contract BoardGuys {
    using Strings for uint256;
    // Token details
    string private _name;
    string private _symbol;
    string private _tokenURI;

    // Minting price for NFTs
    uint256 private _mintPrice = 0;

    // Owner of the contract
    address private _owner;

    // Mapping from token ID to the holder's address
    mapping(uint256 => address) private _holders;

    // Mapping from address to balance (number of NFTs held)
    mapping(address => uint256) private _balances;

    // Mapping from token ID to approved address
    mapping(uint256 => address) private _allowances;

    // Counter for tracking the number of NFTs minted
    uint256 private _nftCounter = 0;

    // Events for logging actions
    event Transfer(address from, address to, uint256 tokenId);
    event Approved(address owner, address spender, uint256 tokenId);
    event Mint(address to, uint256 tokenId);

    // Constructor to initialize the contract with name, symbol, and token URI
    constructor(
        string memory name_,
        string memory symbol_,
        string memory tokenUri_
    ) {
        _name = name_;
        _symbol = symbol_;
        _tokenURI = tokenUri_;
        _owner = msg.sender;
    }

    // Modifier to restrict functions to only the owner
    modifier onlyOwner() {
        require(msg.sender == _owner, "Caller is not the owner");
        _;
    }

    // Function to get the token name
    function name() public view returns (string memory) {
        return _name;
    }

    // Function to get the token symbol
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    // Function to get the contract owner
    function owner() public view returns (address) {
        return _owner;
    }

    // Function to get the balance of a specific address
    function balanceOf(address holder) public view returns (uint256) {
        require(holder != address(0), "owner can't be zero");
        return _balances[holder];
    }

    // Function to get the owner of a specific token ID
    function ownerOf(uint256 tokenId) public view returns (address) {
        return _holders[tokenId];
    }

    // Function to get the URI for a specific token ID
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(tokenId <= _nftCounter, "NFT not Minted Yet!");
        return string(abi.encodePacked(_tokenURI, tokenId.toString(), ".json"));
    }

    // Function to get the current mint price
    function mintPrice() public view returns (uint256) {
        return _mintPrice;
    }

    // Function to get the approved spender for a specific token ID
    function getSpender(uint256 tokenId) public view returns (address) {
        return _allowances[tokenId];
    }

    // Setter function to update the mint price, restricted to owner
    function setMintPrice(uint256 price) external onlyOwner {
        _mintPrice = price;
    }

    // Function to mint a new NFT, requires payment of the mint price
    function mint() external payable {
        require(msg.value == mintPrice(), "Insufficient Mint Value Provided");

        uint256 newNftCounter;

        unchecked {
            newNftCounter = _nftCounter + 1;
            _nftCounter = newNftCounter;
        }

        _holders[_nftCounter] = msg.sender;
        _balances[msg.sender] = _balances[msg.sender] + 1;

        emit Mint(msg.sender, _nftCounter);
    }

    // Function to approve a spender for a specific token ID
    function approve(address spender, uint256 tokenId) external {
        require(
            msg.sender == ownerOf(tokenId),
            "You are not the owner of token"
        );

        _allowances[tokenId] = spender;

        emit Approved(msg.sender, spender, tokenId);
    }

    // Function to transfer a token to a new address
    function transfer(address to, uint256 tokenId) external {
        require(
            msg.sender == ownerOf(tokenId),
            "You are not the owner of token"
        );

        _transfer(msg.sender, to, tokenId);
    }

    // Function to transfer a token from one address to another, requires approval
    function transferFrom(address from, address to, uint256 tokenId) external {
        require(
            msg.sender == getSpender(tokenId),
            "You are not spender of token"
        );

        _transfer(from, to, tokenId);
    }

    // Internal function to handle the transfer of a token
    function _transfer(address from, address to, uint256 tokenId) private {
        // loading variables to memory to save gas
        uint256 fromBalance = _balances[from];
        uint256 toBalance = _balances[to];

        // Update balances
        _balances[from] = fromBalance - 1;
        _balances[to] = toBalance + 1;

        _holders[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }
}
