import React, { useState } from "react";
import DynamicInput from "../AppDynamicInput";
import { Button } from "@/components/ui/button";
interface AppFilterFormProps {
    filterItems?: any[];
    onSubmit?: any;
    content?: any;
    col?: number;
}
const AppFilterForm = ({
    filterItems = [],
    onSubmit = () => {},
    content = "",
    col = 3,
}: AppFilterFormProps) => {
    const [formValues, setFormValues] = useState<any>({});
    const handleChange = (nameOrValue: string | undefined, value?: any) => {
        if (typeof nameOrValue === "undefined") {
            setFormValues(() => value);
        } else {
            setFormValues((prev: any) => ({ ...prev, [nameOrValue]: value }));
        }
    };
    const handleFilter = () => {
        if (onSubmit) {
            onSubmit(formValues);
        }
    };
    return (
        <>
            <div className={`grid grid-cols-${col} gap-4`}>
                {filterItems &&
                    filterItems.map((item, index) => {
                        return (
                            <React.Fragment key={index}>
                                <DynamicInput
                                    name={item.name}
                                    fieldType={item.fieldType}
                                    placeholder={item.placeholder}
                                    value={formValues[item.name]}
                                    onChange={handleChange}
                                    options={item.options}
                                />
                            </React.Fragment>
                        );
                    })}
            </div>
            <Button className="my-4" onClick={handleFilter}>
                {content}
            </Button>
        </>
    );
};

export default AppFilterForm;
