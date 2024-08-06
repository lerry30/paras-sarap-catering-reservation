import { NextResponse } from 'next/server';
import { toNumber } from '@/utils/number';
import Policy from '@/models/Policies';

export const GET = async () => {
    try {
        const policyData = await Policy.findOne({}); // just get the first one
        const durationOfServiceInHours = policyData?.timelimitedserviceinhours || 4;
        const additionalServiceTimeCostPerHour = policyData?.additionalservicetimecostperhour || 1000;
        const noOfPreparationDays = policyData?.noofpreparationdays || 3;

        const data = { durationOfServiceInHours, additionalServiceTimeCostPerHour, noOfPreparationDays };
        return NextResponse.json({ message: '', data }, { status: 200 });
    } catch(error) {
        console.log('Fetch limited time for service error: \n', error);
        return NextResponse.json({ message: 'There\'s something wrong.' }, { status: 400 });
    }
}

export const PUT = async (request) => {
    try {
        const form = await request.formData();
        const duration = toNumber(form.get('service-duration'));
        const extraTimeCost = toNumber(form.get('additional-time-cost'));
        const preparationDays = toNumber(form.get('reservation-preparation'));

        const policyData = await Policy.findOne({}); // just get the first one
        await Policy.findByIdAndUpdate(String(policyData?._id), 
            { 
                timelimitedserviceinhours: duration, 
                additionalservicetimecostperhour: extraTimeCost, 
                noofpreparationdays: preparationDays 
            });

        return NextResponse.json({ message: '', success: true }, { status: 200 });
    } catch(error) {
        console.log('Changing reservation settings failed: ', error);
        return NextResponse.json({ message: 'There\'s something wrong.' }, { status: 400 });
    }
}

//timelimitedserviceinhours
//additionalServiceTimeCostPerHour
//noofpreparationdays
