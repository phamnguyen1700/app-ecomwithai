import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReusableDialogFormProps } from "@/types/appMeta";
import React, { FormEvent } from "react";

const App = ({
    triggerText,
    trigger,
    title,
    description,
    fields,
    onSubmit,
}: ReusableDialogFormProps) => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data: Record<string, string> = {};
        fields.forEach((field) => {
            data[field.name] = formData.get(field.name)?.toString() || "";
        });
        onSubmit(data);
    };
    return (
        <Dialog modal={false}>
            <DialogTrigger asChild>
                <span>
                    {trigger ?? (
                        <Button variant="outline">
                            {triggerText ?? "Open"}
                        </Button>
                    )}
                </span>
            </DialogTrigger>
                    
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        {fields.map((field) => (
                            <div className="grid gap-3" key={field.name}>
                                <Label htmlFor={field.name}>
                                    {field.label}
                                </Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    defaultValue={field.defaultValue}
                                    type={field.type || "text"}
                                />
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="mt-2">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit">Submit</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default App;
