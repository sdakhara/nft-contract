const BoardGuys = artifacts.require("BoardGuys");

module.exports = function (deployer) {
	const name = "BoardGuys";
	const symbol = "BG";
	const tokenURI = "ipfs://QmYVSh8qwHH9XanDkWbaT71aAip7w6h3t4QAbCa6HkCrpU/";

	deployer.deploy(BoardGuys, name, symbol, tokenURI);
};
