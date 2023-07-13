import {BigDecimal, BigInt, log} from "@graphprotocol/graph-ts";

import {
    FeeRouterDaily
} from "../../generated/schema";
import {
    TransferOut as TransferOutEvent,
} from "../../generated/FeeRouter/FeeRouterAbi";

import {getIntervalIdentifier, getIntervalId, getAccountGroupId, intervalUnixTime} from "../interval";
import {zkTest_locker_map as lockerMap} from "../../config";

export function handleTransferOut(event: TransferOutEvent): void {
    let dailyId = getIntervalId(intervalUnixTime.HR24, event);
    let plpAddress = lockerMap.get('plp')
    if(event.params.receiver.toHexString() == plpAddress.toLowerCase()){

        let dailyRecorderId = getIntervalIdentifier(event, "daily", intervalUnixTime.HR24);
        let feeRouterDaily = FeeRouterDaily.load(dailyRecorderId);
        if(feeRouterDaily == null){
            feeRouterDaily = new FeeRouterDaily(dailyRecorderId);
            feeRouterDaily.plp = BigInt.fromI32(0);
            feeRouterDaily.duration = "daily";
            feeRouterDaily.durationId = dailyId.toString()
            feeRouterDaily.lastUpdateTimeStamp = event.block.timestamp
        }

        feeRouterDaily.plp = feeRouterDaily.plp.plus(event.params.amount)
        feeRouterDaily.save()


    }

}