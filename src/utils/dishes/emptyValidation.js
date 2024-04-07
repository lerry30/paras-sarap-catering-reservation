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