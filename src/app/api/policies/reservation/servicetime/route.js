import { NextResponse } from 'next/server';
import Policy from '@/models/Policies';

export const GET = async () => {
    try {
        const policyData = await Policy.findOne({}); // just get the first one
        const durationOfServiceInHours = policyData?.timelimitedserviceinhours || 4;
        const additionalServiceTimeCostPerHour = policyData?.additionalServiceTimeCostPerHour || 1000;
        const data = { durationOfServiceInHours, additionalServiceTimeCostPerHour };
        return NextResponse.json({ message: '', data }, { status: 200 });
    } catch(error) {
        console.log('Fetch limited time for service error: \n', error);
        return NextResponse.json({ message: 'There\'s something wrong.' }, { status: 400 });
    }
}
