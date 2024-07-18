const BoardGuys = artifacts.require("BoardGuys");

contract("BoardGuys", (accounts) => {
	let boardGuys;
	const owner = accounts[0];
	const user1 = accounts[1];
	const user2 = accounts[2];
	const mintPrice = web3.utils.toWei("0.1", "ether");

	before(async () => {
		boardGuys = await BoardGuys.new(
			"BoardGuys",
			"BG",
			"ipfs://QmYVSh8qwHH9XanDkWbaT71aAip7w6h3t4QAbCa6HkCrpU/"
		);
	});

	it("should initialize with correct name, symbol, and tokenURI", async () => {
		const name = await boardGuys.name();
		const symbol = await boardGuys.symbol();

		assert.equal(name, "BoardGuys");
		assert.equal(symbol, "BG");
	});

	it("should set the mint price by the owner", async () => {
		try {
			await boardGuys.setMintPrice(mintPrice, { from: owner });
			const price = await boardGuys.mintPrice();

			assert.equal(price.toString(), mintPrice);
		} catch (error) {
			console.log(error);
		}
	});

	it("should not allow non-owner to set mint price", async () => {
		try {
			await boardGuys.setMintPrice(mintPrice, { from: user1 });
			assert.fail("Non-owner was able to set the mint price");
		} catch (error) {
			assert.equal(error.reason, "Caller is not the owner");
		}
	});

	it("should mint a new NFT when mint price is paid", async () => {
		const result = await boardGuys.mint({ from: user1, value: mintPrice });
		const tokenId = 1;

		const holder = await boardGuys.ownerOf(tokenId);
		const balance = await boardGuys.balanceOf(user1);

		assert.equal(holder, user1);
		assert.equal(balance.toNumber(), 1);

		const event = result.logs.find((log) => log.event === "Mint");
		assert.equal(event.args.to, user1);
		assert.equal(event.args.tokenId.toNumber(), tokenId);
	});

	it("should fail to mint a new NFT if incorrect mint price is paid", async () => {
		try {
			await boardGuys.mint({
				from: user1,
				value: web3.utils.toWei("0.05", "ether"),
			});
			assert.fail("Minting succeeded with incorrect price");
		} catch (error) {
			assert(error.message.includes("Insufficient Mint Value Provided"));
		}
	});

	it("should allow the owner of a token to approve a spender", async () => {
		const tokenId = 1;

		await boardGuys.approve(user2, tokenId, { from: user1 });
		const spender = await boardGuys.getSpender(tokenId);

		assert.equal(spender, user2);
	});

	it("should not allow non-owner to approve a spender", async () => {
		const tokenId = 1;

		try {
			await boardGuys.approve(user2, tokenId, { from: user2 });
			assert.fail("Approval succeeded by non-owner");
		} catch (error) {
			assert(error.message.includes("You are not the owner of token"));
		}
	});

	it("should transfer a token to a new address", async () => {
		const tokenId = 1;

		await boardGuys.transfer(user2, tokenId, { from: user1 });

		const newHolder = await boardGuys.ownerOf(tokenId);
		const user1Balance = await boardGuys.balanceOf(user1);
		const user2Balance = await boardGuys.balanceOf(user2);

		assert.equal(newHolder, user2);
		assert.equal(user1Balance.toNumber(), 0);
		assert.equal(user2Balance.toNumber(), 1);
	});

	it("should not allow non-owner to transfer a token", async () => {
		const tokenId = 1;

		try {
			await boardGuys.transfer(user1, tokenId, { from: user1 });
			assert.fail("Transfer succeeded by non-owner");
		} catch (error) {
			assert(error.message.includes("You are not the owner of token"));
		}
	});

	it("should transfer a token from one address to another with approval", async () => {
		const tokenId = 1;

		await boardGuys.approve(user1, tokenId, { from: user2 });
		await boardGuys.transferFrom(user2, user1, tokenId, { from: user1 });

		const newHolder = await boardGuys.ownerOf(tokenId);
		const user1Balance = await boardGuys.balanceOf(user1);
		const user2Balance = await boardGuys.balanceOf(user2);

		assert.equal(newHolder, user1);
		assert.equal(user1Balance.toNumber(), 1);
		assert.equal(user2Balance.toNumber(), 0);
	});

	it("should not allow transferFrom without approval", async () => {
		const tokenId = 1;

		try {
			await boardGuys.transferFrom(user1, user2, tokenId, {
				from: user2,
			});
			assert.fail("TransferFrom succeeded without approval");
		} catch (error) {
			assert(error.message.includes("You are not spender of token"));
		}
	});
});
