import React from 'react';
import ChipInput from 'material-ui-chip-input';
import { useInput } from 'react-admin';

const TagsInput = props => {
    const {
        input: { value, onChange, ...rest},
        meta: { touched, error }
    } = useInput(props);
    
    return (
        <ChipInput
            source="tags"
            value={ value || [] }
            onAdd={ (tag) => onChange((value || []).concat(tag)) }
            onDelete={ (tag) => onChange((value || []).filter(v => v !== tag)) }
            {...rest}
        />
    );
};
export default TagsInput;
