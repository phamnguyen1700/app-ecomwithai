import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FormInputType } from "@/enum/FormInputType";
import React from "react";

export interface DynamicInputProps {
    fieldType: FormInputType;
    value?: any;
    onChange?: (name: any, value: any) => void;
    placeholder?: string;
    options?: { label: string; value: string }[];
    [x: string]: any;
}

const DynamicInput = ({
    fieldType,
    value,
    onChange = () => {},
    placeholder,
    options = [],
    name,
    ...props
}: DynamicInputProps) => {
    switch (fieldType) {
        case FormInputType.TEXT:
            return (
                <Input
                    type="text"
                    {...props}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(name, e.target.value)}
                />
            );
        case FormInputType.NUMBER:
            return (
                <Input
                    type="number"
                    {...props}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(name, e.target.value)}
                />
            );
        case FormInputType.DATE:
            return (
                <Input
                    type="date"
                    {...props}
                    value={value}
                    onChange={(e) => onChange(name, e.target.value)}
                    placeholder={placeholder}
                />
            );
        case FormInputType.SELECT:
            return (
                <Select
                    onValueChange={(val) => onChange(name, val)}
                    value={value}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {options?.map((option: any) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );

        default:
            return (
                <Input
                    value={value}
                    onChange={(e) => onChange(name, e.target.value)}
                    placeholder={placeholder}
                />
            );
    }
};

export default DynamicInput;
