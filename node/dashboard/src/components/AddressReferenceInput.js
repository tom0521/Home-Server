import React, { useState, useCallback } from 'react';
// import { useFormState } from 'react-final-form';
import { ReferenceInput, SelectInput } from 'react-admin';

import AddressQuickCreateButton from './AddressQuickCreateButton';

// const spySubscription = { values: true };

const AddressReferenceInput = props => {
    const [version, setVersion] = useState(0);
    // const { values } = useFormState({ subscription: spySubscription });
    const handleChange = useCallback(() => setVersion(version + 1), [version]);

    return (
        <div>
            <ReferenceInput key={version} {...props}>
                <SelectInput optionText={choice => (
                    choice.city && choice.state_province ? `${choice.city}, ${choice.state_province}` : `${choice.url}`
                )}/>
            </ReferenceInput>

            <AddressQuickCreateButton onChange={handleChange} />
        </div>
    );
};

export default AddressReferenceInput;
