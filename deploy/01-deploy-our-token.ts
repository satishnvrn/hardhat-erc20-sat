import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { INITIAL_SUPPLY, developmentChains, networkConfig } from "../helper-hardhat-config";
import { verify } from "../utils/verify";

const deployOurToken: DeployFunction = async ({
  getNamedAccounts,
  deployments: { deploy },
  network,
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts();
  const chainId: number = network.config.chainId || 0;

  const args = [INITIAL_SUPPLY];
  const ourToken = await deploy("OurToken", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: networkConfig[chainId]?.blockConfirmations || 1,
  });
  console.log('OurToken deployed at ', ourToken.address);

  if (!developmentChains.includes(network.name)) {
    await verify(ourToken.address, args);
  }
};

export default deployOurToken;
deployOurToken.tags = ['all', 'ourToken'];
