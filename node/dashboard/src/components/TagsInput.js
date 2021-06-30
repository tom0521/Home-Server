import React from 'react';
import ChipInput from 'material-ui-chip-input';
import { useInput } from 'react-admin';

const keys = [
    'Tab',
    'Comma'
];

const TagsInput = props => {
    const {
        input: { value, onChange, ...rest},
        meta: { touched, error }
    } = useInput(props);
   
    return (
        <ChipInput
            value={ value || [] }
            onAdd={ (tag) => onChange((value || []).concat(tag)) }
            onDelete={ (tag) => onChange((value || []).filter(v => v !== tag)) }
            newChipKeys={ keys }
            error={ !!(touched && error) }
            helperText={ touched && error }
            {...rest}
        />
    );
};
export default TagsInput;
