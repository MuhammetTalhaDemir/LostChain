import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployLostChain: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("LostChain", {
    from: deployer,
    args: [], // Kontrat parametre istemediği için boş bıraktık
    log: true,
    autoMine: true,
  });

  const LostChain = await hre.ethers.getContract<Contract>("LostChain", deployer);
  console.log("👋 Şeffaf Kantin kontratı başarıyla dağıtıldı!");
};

export default deployLostChain;
deployLostChain.tags = ["LostChain"];
