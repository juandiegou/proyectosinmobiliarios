import PhoneInput, { type Value } from 'react-phone-number-input'
interface Props {
    id: string;
    label: string;
    placeholder: string;
    value: Value |undefined;
    onChange: (value: Value | undefined) => void;
    onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
}

export function Phone({
    id,
    label,
    placeholder,
    value,
    onChange,
    onBlur,
}: Props) {
    return (
        <div>
            <label
                htmlFor={id}
                className='block mb-2 text-sm font-medium text-white'
            >
                {label}
            </label>

            <PhoneInput
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className='bg-background
                border 
                text-white text-sm 
                rounded-lg
                block w-full p-3
                focus:border focus:border-blue-700 focus:outline-none 
                focus:ring-blue-700
                phone-input'
            />
        </div>
    );
}
