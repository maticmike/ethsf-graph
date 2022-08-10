import { Address } from "@graphprotocol/graph-ts";
import {
  Transfer,
  NewWhitelistedNFT,
  VestedFundsClaimedEarly
} from "../generated/SoulFund/SoulFund";
import { Account, Token } from "../generated/schema";

export function handleTransfer(event: Transfer): void {

  // assume soulbound
  const id = event.params.tokenId;
  let token = new Token(id.toString());

  token.fund = event.address;

  // receiver of token is the beneficiary
  token.beneficiary = loadOrCreateAccount(event.params.to).id;

  // granter is whoever called the contract
  token.grantor = loadOrCreateAccount(event.transaction.from).id;

}

export function handleNewWhitelistedNFT(event: NewWhitelistedNFT): void {

}

export function handleVestedFundsClaimedEarly(event: VestedFundsClaimedEarly): void {


}

export function loadOrCreateAccount(address: Address): Account {
  let account = Account.load(address.toHexString());
  if (account == null) {
    account = new Account(address.toHexString());
  }
  return account;
}