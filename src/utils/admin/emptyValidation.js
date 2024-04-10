export const emptyDishFields = (name, description, image) => {
    const fields = {
        ['Dish Name']: name, 
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

export const emptyDrinkFields = (name, description, image) => {
    const fields = {
        ['Drink Name']: name, 
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

export const emptyVenueFields = (name, description, image, region, province, municipality, barangay, street) => {
    const fields = {
        ['Venue Name']: name, 
        ['Description']: description,
        ['Image']: image,
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