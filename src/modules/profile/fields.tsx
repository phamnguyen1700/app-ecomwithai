import { FormInputType } from "@/enum/FormInputType"

export const Fields = () => {
    return [
        {
            name: 'full_name',
            fieldType: FormInputType.TEXT,
            placeholder: 'Enter name',            
        },
        {
            name: 'email',
            fieldType: FormInputType.TEXT,
            placeholder: 'Enter email',            
            rules: {
                required: 'Email is invalid'
            }            
        },
        {
            name: 'gender',
            fieldType: FormInputType.SELECT,
            placeholder: 'Choose gender',            
            options: [
                {label: 'Male', value: 'male'},
                {label: 'Female', value: 'female'},
            ],
            rules: {
                required:'Gender is required'
            }
        },
    ]
}