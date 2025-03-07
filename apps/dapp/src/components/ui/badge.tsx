import { Slot } from "@radix-ui/react-slot";
import type * as React from "react";
import { type VariantProps, tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

const badgeVariants = tv({
	base: "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-auto",
	variants: {
		variant: {
			default:
				"border-transparent bg-purple-600 text-primary-foreground [a&]:hover:bg-primary/90",
			secondary:
				"border-transparent bg-green-500 text-white [a&]:hover:bg-green-500/90",
				tertiary:
				"border-transparent bg-yellow-500 text-white [a&]:hover:bg-green-500/90",
				blue:
				"border-transparent bg-blue-500 text-white [a&]:hover:bg-green-500/90",	
				orange:
				"border-transparent bg-orange-500 text-white [a&]:hover:bg-green-500/90",	
				destructive:
				"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
			outline:
				"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

function Badge({
	className,
	variant,
	asChild = false,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "span";

	return (
		<Comp
			className={cn(badgeVariants({ variant }), className)}
			data-slot="badge"
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
