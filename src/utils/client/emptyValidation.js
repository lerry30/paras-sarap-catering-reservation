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


export const emptyMenuFields = (dishes, drinks) => {
    const fields = {
        ['dishes']: dishes,
        ['drinks']: drinks,
    };

    const invalidFields = {};
    for(const [ field, value ] of Object.entries(fields)) {
        const collectionType = { object: true, array: true }
        if(collectionType[typeof value]) {
            if(value.length === 0) {
                const message = `No ${field} found.`;
                const invalidField = field?.replace(/\s/g, '');
                invalidFields[invalidField] = message;
            }
        }

    }

    return invalidFields;
}

export const emptyThemeFields = (name, description, image) => {
    const fields = {
        ['Theme Name']: name, 
        ['Description']: description,
        ['Image']: image
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
