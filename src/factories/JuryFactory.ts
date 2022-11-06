import { BigInt, Address } from '@graphprotocol/graph-ts';
import { Jury } from '../../generated/schema';

export function loadOrCreateJury(juryId: string): Jury {
    let jury = Jury.load(juryId);

    if (jury == null) {
        jury = new Jury(juryId);
        jury.id = juryId;
        jury.juryMembers = new Array<string>();
        jury.disputesHandled = new Array<string>();
        jury.onCallStartDate = BigInt.fromI32(0);
        jury.onCallEndDate = BigInt.fromI32(0);
        jury.ongoing = false;
    }

    jury.save();
    return jury as Jury;
}
