import { Address, BigInt, log } from '@graphprotocol/graph-ts';
import { NewSoulFundTokenDeployed } from '../generated/SoulFundFactory/SoulFundFactory';
import { SoulFund } from '../generated/templates';
import { loadOrCreateDispute } from './factories/DisputeFactory';
import { loadOrCreateJury } from './factories/JuryFactory';
import { loadOrCreateJuryMember } from './factories/JuryMember';

export function handleNewLiveJury(event: NewLiveJury): void {
    log.info('New live jury event: {}', [event.transaction.hash.toHex()]);

    const id = event.params.juryId;
    let jury = loadOrCreateJury(id);
    if (jury != null) {
        jury.juryMembers = event.params.juryMembers;
        jury.onCallStartDate = event.block.timestamp;
        jury.ongoing = true;
    }
    jury.save();
}

export function handleNewJuryPoolMember(event: NewJuryPoolMember): void {
    log.info('New jury pool member event: {}', [event.transaction.hash.toHex()]);
    const id = event.params.jurorId;
    let juryMember = loadOrCreateJuryMember(id);
    juryMember.address = event.params.juryMember;
    juryMember.save();
}

export function handleJurryDutyCompleted(event: JuryDutyCompleted): void {
    log.info('New jury duty completed event: {}', [event.transaction.hash.toHex()]);
    const id = event.params.juryId;

    let jury = loadOrCreateJury(id);
    if (jury != null) {
        jury.ongoing = false;
        jury.onCallEndDate = event.block.timestamp;
        let juryMembers = jury.juryMembers;
        for (let i = 0; i < juryMembers.length; i++) {
            const juryMember = juryMembers[i];
            juryMember.onCall = false;
            juryMember.onCallEndDate = event.block.timestamp;
            juryMember.ongoing = false;
            juryMember.reputationScore = juryMember.reputationScore + 1;
            juryMember.save();
        }
    }
    jury.save();
}

export function handleVoted(event: Voted): void {
    log.info('New jury member voted event: {}', [event.transaction.hash.toHex()]);
    const id = event.param.jurorId;
    let juryMember = loadOrCreateJuryMember(id);
    if (juryMember != null) {
        juryMember.numberOfTimesVoted = juryMember.numberOfTimesVoted.plus(BigInt.fromI32(1));
        juryMember.vote = event.params.decision;
    }
}
