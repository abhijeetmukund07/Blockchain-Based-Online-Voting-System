async function main() {
  // Get the contract to deploy
  const VotingSystem = await ethers.getContractFactory("VotingSystem");

  // Deploy the contract
  const votingSystem = await VotingSystem.deploy();

  await votingSystem.deployed();

  console.log("VotingSystem deployed to:", votingSystem.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
