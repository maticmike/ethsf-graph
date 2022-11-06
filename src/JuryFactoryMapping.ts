import { Address, log } from '@graphprotocol/graph-ts';
import { JuryDeployed } from '../generated/JuryFactory/JuryFactory';
import { ProtocolJury } from '../generated/schema';

export function handleJuryDeployed(event: JuryDeployed): void {
    log.warning('Jury Deployed hash: {}', [event.transaction.hash.toHex()]);

    // assume soulbound
    const id = event.params.juryContract;
    let protocolJury = new ProtocolJury(id.toString());

    protocolJury.swapInterval = event.params.swapInterval;
    protocolJury.jurySize = event.params.jurySize;
    // TODO get dapp this jury is for

    protocolJury.save();
}
