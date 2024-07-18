# BoardGuys NFT Project

This project uses the Truffle framework and the Solidity programming language to construct an NFT (Non-Fungible Token) contract from scratch. Users are able to mint, transfer, and authorize NFTs through the contract. Every NFT has a distinct token ID and matching metadata URI assigned to it.

## Project Structure

-   `contracts/`: includes the files for the Solidity contract.
-   `migrations/`: includes the scripts for migrating the contracts.
-   `test/`: includes the contract's test scripts.
-   `truffle-config.js`: Truffle configuration file for network settings.

## How the NFT Contract Works

The `BoardGuys` contract allows for the following functionalities:

1. **Minting NFTs**: Users can mint new NFTs by paying the minting price.
2. **Transferring NFTs**: Owners can transfer their NFTs to another address.
3. **Approving NFTs**: Owners can approve a spender to transfer a specific NFT on their behalf.
4. **Getting Token Details**: Functions to get the name, symbol, owner, and URI of tokens.

## Running the Test Scripts

To run the test scripts for the NFT contract, follow these steps:

1. Install the required dependencies:

    ```bash
    npm install
    ```

2. Compile the contracts:

    ```bash
    truffle compile
    ```

3. Run the tests:
    ```bash
    truffle test
    ```

## Deploying to a Testnet

Note: Ropsten and Rinkeby network is closed so i'm using Goerli testnet

1. Change the `INFURA_API_KEY` and `PRIVATE_KEY` in the .env file to deploy it on goerli network

2. Deploy the contract:
    ```bash
    truffle migrate --network goerli
    ```

## License

This project is licensed under the MIT License.
