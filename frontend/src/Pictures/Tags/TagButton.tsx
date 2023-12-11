import { Button } from "../../components/Button";
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export function TagButton(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return <Button {...props} type="button" />;
}
