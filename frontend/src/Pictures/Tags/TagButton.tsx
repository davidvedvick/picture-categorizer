import React, { ButtonHTMLAttributes } from "react";
import { PrimaryButton } from "../../components/PrimaryButton";

export function TagButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    return <PrimaryButton {...props} type="button" />;
}
