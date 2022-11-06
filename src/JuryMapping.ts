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

export function handleJuryDutyCompleted(event: JuryDutyCompleted): void {
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
    const id = event.params.jurorId;
    let juryMember = loadOrCreateJuryMember(id);
    if (juryMember != null) {
        juryMember.numberOfTimesVoted = juryMember.numberOfTimesVoted.plus(BigInt.fromI32(1));
        juryMember.vote = event.params.decision;
    }
    juryMember.save();
}

export function handleNewDisputeProposal(event: NewDisputeProposal): void {
    log.info('New dispute proposal event: {}', [event.transaction.hash.toHex()]);
    const id = event.params.proposedId;
    let disputeProposal = loadOrCreateDispute(id);
    if (disputeProposal != null) {
        disputeProposal.deadline = event.params.deadline;

        disputeProposal.proposer = event.params.proposer;
        disputeProposal.approved = event.params.isApproved;
    }
    disputeProposal.save();
}

export function handleNewDispute(event: handleNewDispute): void {
    log.info('New dispute created event: {}', [event.transaction.hash.toHex()]);
    const id = event.params.disputeId;
    let dispute = loadOrCreateDispute(id);
    if (dispute != null) {
        dispute.ongoing = true;
        dispute.approved = true;
        dispute.deadline = event.params.deadline;
        let jury = loadOrCreateJury(event.params.juryId);
        let juryDisputesHandled = jury.disputesHandled;
        juryDisputesHandled.push(dispute);
        jury.disputesHandled = juryDisputesHandled;
        dispute.jury = jury;
        jury.save();

        let juryMembers = jury.juryMembers;
        for (let i = 0; i < juryMembers.length; i++) {
            let juryMemberDisputes = juryMembers[i].disputes;
            juryMemberDisputes.disputes.push(dispute);
            juryMembers[i].disputes = juryMemberDisputes;
        }
    }
    dispute.save();
}

export function handleDisputeDeadlinePostponed(event: DisputeDeadlinePostponed): void {
    log.info('Dispute deadline postponed event: {}', [event.transaction.hash.toHex()]);
    const id = event.params.disputeId;
    let dispute = loadOrCreateDispute(id);
    if (dispute != null) {
        dispute.deadline = event.params.newDeadline;
    }
    dispute.save();
}

export function handleDisputeResolved(event: DisputeResolved): void {
    log.info('Dispute resolved event: {}', [event.transaction.hash.toHex()]);
    const id = event.params.disputeId;
    let dispute = loadOrCreateDispute(id);
    if (dispute != null) {
        dispute.verdict = event.params.verdict;
        dispute.ongoing = false;
        let jury = dispute.jury;
        let juryMembers = jury.juryMembers;
        for (let i = 0; i < juryMembers.length; i++) {
            juryMembers[i].disputesParticipated = juryMembers[i].disputesParticipated.add(BigInt.fromI32(1));
        }
    }
}
