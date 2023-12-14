import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { PrimaryButton } from "../../components/PrimaryButton";

export function TagButton(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return <PrimaryButton {...props} type="button" />;
}
