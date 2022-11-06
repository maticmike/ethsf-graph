import { BigInt, Address } from '@graphprotocol/graph-ts';
import { Dispute } from '../generated/schema';
import { ZERO_ADDRESS } from '../constants';

export function loadOrCreateDispute(disputeId: BigInt): Dispute {
    let dispute = Dispute.load(disputeId);

    if (dispute == null) {
        dispute = new Dispute(disputeId);
        dispute.id = disputeId;
        dispute.address = disputeId;
        dispute.juryMembers = new Array<string>();
        dispute.ongoing = false;
        dispute.plaintiff = ZERO_ADDRESS;
        dispute.defendent = ZERO_ADDRESS;
        dispute.associatedProject = ZERO_ADDRESS;
        dispute.verdict = false;
        dispute.approved = false;
    }
    dispute.save();
    return dispute as Dispute;
}
