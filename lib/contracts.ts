import {
  callReadOnlyFunction,
  makeContractCall,
  AnchorMode,
  PostConditionMode,
  principalCV,
  uintCV,
  stringAsciiCV,
  listCV,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import { FACTORY_CONTRACT, TREASURY_CONTRACT } from './stacks';

export interface CreateCircleParams {
  name: string;
  creatorNickname: string;
  network: StacksNetwork;
  senderAddress: string;
}

export interface AddExpenseParams {
  circleId: number;
  description: string;
  amount: number;
  participants: string[];
  network: StacksNetwork;
  senderAddress: string;
}

export interface SettleDebtParams {
  circleId: number;
  creditor: string;
  amount: number;
  network: StacksNetwork;
  senderAddress: string;
}

// Factory Contract Calls
export async function createCircle(params: CreateCircleParams) {
  const { name, creatorNickname, network, senderAddress } = params;

  const txOptions = {
    contractAddress: FACTORY_CONTRACT.split('.')[0],
    contractName: FACTORY_CONTRACT.split('.')[1],
    functionName: 'create-circle',
    functionArgs: [
      stringAsciiCV(name),
      stringAsciiCV(creatorNickname),
    ],
    senderKey: '', // Will be signed by wallet
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
  };

  return makeContractCall(txOptions);
}

export async function getCircleInfo(circleId: number, network: StacksNetwork) {
  const [contractAddress, contractName] = FACTORY_CONTRACT.split('.');
  
  return callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: 'get-circle-info',
    functionArgs: [uintCV(circleId)],
    network,
    senderAddress: contractAddress,
  });
}

export async function getUserCircles(userAddress: string, network: StacksNetwork) {
  const [contractAddress, contractName] = FACTORY_CONTRACT.split('.');
  
  return callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: 'get-user-active-circles',
    functionArgs: [principalCV(userAddress)],
    network,
    senderAddress: contractAddress,
  });
}

// Treasury Contract Calls
export async function addExpense(params: AddExpenseParams) {
  const { circleId, description, amount, participants, network } = params;

  const txOptions = {
    contractAddress: TREASURY_CONTRACT.split('.')[0],
    contractName: TREASURY_CONTRACT.split('.')[1],
    functionName: 'add-expense',
    functionArgs: [
      uintCV(circleId),
      stringAsciiCV(description),
      uintCV(amount),
      listCV(participants.map(p => principalCV(p))),
    ],
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
  };

  return makeContractCall(txOptions);
}

export async function settleDebt(params: SettleDebtParams) {
  const { circleId, creditor, amount, network } = params;

  const txOptions = {
    contractAddress: TREASURY_CONTRACT.split('.')[0],
    contractName: TREASURY_CONTRACT.split('.')[1],
    functionName: 'settle-debt-stx',
    functionArgs: [
      uintCV(circleId),
      principalCV(creditor),
      uintCV(amount),
    ],
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
  };

  return makeContractCall(txOptions);
}

export async function getMemberInfo(
  circleId: number,
  memberAddress: string,
  network: StacksNetwork
) {
  const [contractAddress, contractName] = TREASURY_CONTRACT.split('.');
  
  return callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: 'get-member-info',
    functionArgs: [uintCV(circleId), principalCV(memberAddress)],
    network,
    senderAddress: contractAddress,
  });
}

export async function getCircleStats(circleId: number, network: StacksNetwork) {
  const [contractAddress, contractName] = TREASURY_CONTRACT.split('.');
  
  return callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: 'get-circle-stats',
    functionArgs: [uintCV(circleId)],
    network,
    senderAddress: contractAddress,
  });
}