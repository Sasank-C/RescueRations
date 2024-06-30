import { updateConfig, config } from '@repo/config-contract';
import { ethers } from 'hardhat';
import EcoEarnABI from '../artifacts/contracts/EcoEarn.sol/EcoEarn.json';
import TokenABI from '../artifacts/contracts/Token.sol/Token.json';

async function initContracts() {
    const [owner] = await ethers.getSigners();

    console.log('Token address:', config.TOKEN_ADDRESS);
    console.log('Contract address:', config.CONTRACT_ADDRESS);

    const tokenInstance = await ethers.getContractAt(TokenABI.abi, config.TOKEN_ADDRESS, owner);
    const ecoEarnInstance = await ethers.getContractAt(EcoEarnABI.abi, config.CONTRACT_ADDRESS, owner);

    // approve EcoEarn to spend tokens
    const approveTx = await tokenInstance.approve(config.CONTRACT_ADDRESS, ethers.parseEther('1000000000000000000'));
    await approveTx.wait();

    console.log('Approved EcoEarn to spend tokens');

    // mint tokens to ecoEarn
    const mintTx = await tokenInstance.mint(owner, ethers.parseEther('1000000000'));
    await mintTx.wait();

    console.log('Minted tokens to EcoEarn');

    // claim allocation on EcoEarn
    const claimAllocationTx = await ecoEarnInstance.claimAllocation(ethers.parseEther('1000000000'));
    await claimAllocationTx.wait();

    console.log('Claimed allocation on EcoEarn');

    // wait for next cycle and trigger it
    const nextCycleBlock = await ecoEarnInstance.getNextCycleBlock();
    const currentBlock = await ethers.provider.getBlockNumber();

    if (Number(nextCycleBlock) > currentBlock) {
        const blocksToMove = Number(nextCycleBlock) - currentBlock;
        console.log(`Waiting for ${blocksToMove} blocks to reach next cycle`);
        await ethers.provider.send('evm_mine', []);
    }

    // triggerCycle on EcoEarn
    const triggerCycleTx = await ecoEarnInstance.triggerCycle();
    await triggerCycleTx.wait();

    console.log('Contracts initialized');
}

initContracts()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
