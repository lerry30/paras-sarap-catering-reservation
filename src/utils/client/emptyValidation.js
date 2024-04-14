export const emptyVenueFields = (region, province, municipality, barangay, street) => {
    const fields = {
        ['Region']: region,
        ['Province']: province,
        ['Municipality']: municipality,
        ['Barangay']: barangay,
        ['Street/Building Name']: street,
    };

    const invalidFields = {};
    for(const [ field, value ] of Object.entries(fields)) {
        if(!value) {
            const message = `${field} is empty`;
            const invalidField = field.toLowerCase()?.replace(/\s/g, '');
            invalidFields[invalidField] = message;
        }
    }

    return invalidFields;
}