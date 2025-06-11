import React from "react";
import DynamicInput from "../AppDynamicInput";
import { Controller, useForm } from "react-hook-form";
type AppFormType = {
    items: any;
    onSubmit: (e: any) => void;
    cols?: number;
    btnText?: string;
};
const AppForm = ({ items, onSubmit, cols = 2, btnText }: AppFormType) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={`grid gap-4 grid-cols-${cols}`}
        >
            {items.map((item: any) => (
                <Controller
                    key={item.name}
                    name={item.name}
                    control={control}
                    rules={item.rules || {}}
                    defaultValue={item.defaultValue || ""}
                    render={({ field }) => (
                        <div className="flex flex-col">
                            <DynamicInput
                                key={item.name}
                                fieldType={item.fieldType}
                                placeholder={item.placeholder}
                                options={item.options}
                                {...field}
                            />
                            {!!errors[item.name] && (
                                <span className="text-red-500 text-sm mt-1">
                                    This field is required
                                </span>
                            )}
                        </div>
                    )}
                />
            ))}

            <div className={`col-span-${cols}`}>
                <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                    {btnText ? btnText : 'Submit'}
                </button>
            </div>
        </form>
    );
};

export default AppForm;
