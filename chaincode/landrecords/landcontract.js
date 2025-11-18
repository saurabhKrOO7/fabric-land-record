'use strict';

const { Contract } = require('fabric-contract-api');

class LandRecordContract extends Contract {
    async Init(ctx) {
        console.info('Smart contract instantiated');
    }

    async createLandRequest(ctx, receipt_number, dataJson) {
        const exists = await ctx.stub.getState(receipt_number);
        if (exists && exists.length > 0) {
            throw new Error(`Land request with receipt number ${receipt_number} already exists`);
        }

        const data = JSON.parse(dataJson);
        data.history = [];
        await ctx.stub.putState(receipt_number, Buffer.from(JSON.stringify(data)));
        return `Land request ${receipt_number} created successfully`;
    }

    async readLandRequest(ctx, receipt_number) {
        const buffer = await ctx.stub.getState(receipt_number);
        if (!buffer || buffer.length === 0) {
            throw new Error(`Land request ${receipt_number} does not exist`);
        }
        return buffer.toString();
    }

    async updateLandStatus(ctx, receipt_number, newStatus, assignedTo, remarks, fromUser, timestamp) {
        const buffer = await ctx.stub.getState(receipt_number);
        if (!buffer || buffer.length === 0) {
            throw new Error(`Land request ${receipt_number} does not exist`);
        }
    
        const land = JSON.parse(buffer.toString());
        land.status = newStatus;
        land.currently_with = assignedTo;
    
        const entry = {
            timestamp: timestamp, // ✅ passed from client
            from_user: fromUser,
            to_user: assignedTo,
            action: newStatus,
            remarks: remarks,
            ipfsHash: "randomIPFSHashxxxxxxxxxxxxxxxx",
            transactionId: "ranomTfrftgyuhi57689678900"
        };
    
        if (!land.history) {
            land.history = [];
        }
        land.history.push(entry);
        land.ipfsHash = entry.ipfsHash;
        land.transactionId = entry.transactionId;
    
        await ctx.stub.putState(receipt_number, Buffer.from(JSON.stringify(land)));
        return `Land request ${receipt_number} updated with status ${newStatus}`;
    }
    

    async getAllLandRequests(ctx) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const results = [];

        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                const record = JSON.parse(res.value.value.toString());
                results.push(record);
            }
            if (res.done) break;
        }

        return JSON.stringify(results);
    }
}

module.exports = LandRecordContract;
