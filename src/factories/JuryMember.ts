import { BigInt, Address } from '@graphprotocol/graph-ts';
import { JuryMember } from '../generated/schema';

export function loadOrCreateJuryMember(juryMemberId: BigInt): juryMember {
    let juryMember = JuryMember.load(juryMemberId);

    if (juryMember == null) {
        juryMember = new JuryMember(juryMemberId);
        juryMember.id = juryMemberId;
        juryMember.address = juryMemberId;
        juryMember.disputesParticipated = BigInt.fromI32(0);
        juryMember.reputationScore = BigInt.fromI32(0);
        juryMember.onCall = false;
        juryMember.vote = false;
    }

    juryMember.save();
    return juryMember as JuryMember;
}
