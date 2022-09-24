import { Address, log } from "@graphprotocol/graph-ts";
import {
  Transfer,
  NewWhitelistedNFT,
  VestedFundsClaimedEarly
} from "../generated/SoulFund/SoulFund";
import { Account, Token, MeritToken } from "../generated/schema";

export function handleTransfer(event: Transfer): void {
  
  log.warning("Transfer hash: {}", [event.transaction.hash.toHex()]);
  
  // assume soulbound
  const id = event.params.tokenId;
  let token = new Token(id.toString());
  
  token.fund = event.address;
  
  // receiver of token is the beneficiary
  token.beneficiary = loadOrCreateAccount(event.params.to).id;
  
  // granter is whoever called the contract
  token.grantor = loadOrCreateAccount(event.transaction.from).id;
  
  token.save()
  
}

export function handleNewWhitelistedNFT(event: NewWhitelistedNFT): void {
  log.warning("Transfer hash: {}", [event.transaction.hash.toHex()]);

  const id = event.params.newNftAddress;
  let nft = new MeritToken(id.toHexString());
  nft.address = id
  // nft.tokenId = event.params.tokenId


  nft.save()
}

export function handleVestedFundsClaimedEarly(event: VestedFundsClaimedEarly): void {}

export function loadOrCreateAccount(address: Address): Account {
  let account = Account.load(address.toHexString());
  if (account == null) {
    account = new Account(address.toHexString());
  }
  account.save()
  return account;
}