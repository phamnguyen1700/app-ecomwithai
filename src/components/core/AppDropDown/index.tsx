import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
    title?: any;
    items?: any;
};

const AppDropDown = ({ title = "", items = [] }: Props) => {
    const router = useRouter();
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="link">{title}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit" align="start">
                <DropdownMenuGroup>
                    {items.map((item: any, index: number) => {
                        if ("component" in item) {
                            return (
                                <DropdownMenuItem
                                    key={item.id || index}
                                    asChild
                                >
                                    {item.component}
                                </DropdownMenuItem>
                            );
                        }

                        if (item.name === "divider") {
                            return (
                                <div
                                    key={item.id || index}
                                    className="border-t border-gray-200 my-1"
                                />
                            );
                        }

                        return (
                            <DropdownMenuItem
                                key={item.id || index}
                                onClick={() => {
                                    if ("route" in item && item.route) {
                                        router.push(item.route);
                                    } else if (
                                        "onClick" in item &&
                                        item.onClick
                                    ) {
                                        item.onClick();
                                    }
                                }}
                            >
                                {item.name}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AppDropDown;
