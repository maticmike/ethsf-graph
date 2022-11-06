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

export function handleProposalPassed(event: ProposalPassed): void {
    log.info('New proposal passed event: {}', [event.transaction.hash.toHex()]);
    const id = event.params.proposalId;
    let disputeProposal = loadOrCreateDispute(id);
    if (disputeProposal != null) {
        disputeProposal.ongoing = true;
        disputeProposal.approved = true;
        let jury = loadOrCreateJury(event.params.juryId);
        // TODO review if jury can be assigned before proposal submitted
        disputeProposal.jury = jury;
        jury.save();
    }
    disputeProposal.save();
}
