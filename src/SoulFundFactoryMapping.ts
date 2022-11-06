import { Address, log } from '@graphprotocol/graph-ts';
import { NewSoulFundTokenDeployed } from '../generated/SoulFundFactory/SoulFundFactory';
import { SoulFund } from '../generated/templates';
import { loadOrCreateDispute } from './factories/DisputeFactory';
import { loadOrCreateJury } from './factories/JuryFactory';
import { loadOrCreateJuryMember } from './factories/JuryMember';

export function handleNewLiveJury(event: NewLiveJury): void {
    log.warning('New live jury event: {}', [event.transaction.hash.toHex()]);

    const id = event.params.juryId;
    let jury = loadOrCreateJury(id);
    if (jury != null) {
        jury.juryMembers = event.params.juryMembers;
        jury.onCallStartDate = event.block.timestamp;
        jury.ongoing = true;
    }
    jury.save();
}

export function handleJuryDutyCompleted(event: JuryDutyCompleted): void {
    log.warning('New jury duty completed event: {}', [event.transaction.hash.toHex()]);
    const id = event.params.juryId;
    let jury = loadOrCreateJury(id);
    if (jury != null) {
        jury.onCallEndDate = event.block.timestamp;
        jury.ongoing = false;
    }
    jury.save();
}

export function handleNewJuryPoolMember(event: NewJuryPoolMember): void {
    log.warning('New jury pool member event: {}', [event.transaction.hash.toHex()]);
    const id = event.params.juryId;
    let juryMember = loadOrCreateJuryMember(event.params.juryMember);
    juryMember.save();
}

export function handleJurryDutyCompleted(event: JuryDutyCompleted): void {
    log.warning('New jury duty completed event: {}', [event.transaction.hash.toHex()]);
    const id = event.params.juryId;
    let juryMember = loadOrCreateJuryMember(event.params.juryMember);
    if (juryMember != null) {
        juryMember.onCall = false;
        juryMember.reputationScore = juryMember.reputationScore + 1;
    }
    juryMember.save();
    let jury = loadOrCreateJury(event.params.)
}
