import { BigInt } from "@graphprotocol/graph-ts";
import {
  Transfer,
  NewWhitelistedNFT,
  VestedFundsClaimedEarly
} from "../generated/SoulFund/SoulFund";

export function handleTransfer(event: Transfer): void {}

export function handleNewWhitelistedNFT(event: NewWhitelistedNFT): void {}

export function handleVestedFundsClaimedEarly(event: VestedFundsClaimedEarly): void {}
