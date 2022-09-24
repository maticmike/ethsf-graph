import { BigInt, Address } from '@graphprotocol/graph-ts';
import { Fund } from '../generated/schema';
import { ZERO_ADDRESS } from '../constants';

export function loadOrCreateFund(fundAddress: string): Fund {
    let fund = Fund.load(fundAddress);

    if (fund == null) {
        fund = new Fund(fundAddress);
        fund.id = fundAddress;
        fund.address = fundAddress;
        fund.grantor = fund.beneficiaries = new Array<string>();
        fund.tokens = new Array<string>();
        fund.merits = new Array<string>();
        fund.vestingDate = BigInt.fromI32(0);
    }
    fund.save();
    return fund as Fund;
}

// event NewSoulFundTokenDeployed(
//     address indexed tokenAddress,
//     address indexed beneficiary,
//     uint256 vestingDate,
//     uint256 depositedAmount
// );
