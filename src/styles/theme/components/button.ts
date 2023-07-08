import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Button: ComponentStyleConfig = {
	baseStyle: {
		color: "white",
	},
	variants: {
		bluePrimary: {
			bg: "#6959EA",
			color: "white",
			borderRadius: "4px",
			fontWeight: "400",
			_hover: {
				opacity: 0.8,
				bg: "#6959EA",
			},
			_disabled: {
				bg: "#6959EA",
				opacity: 0.4,
				color: "whiteAlpha.600",
				_hover: {
					opacity: 0.5,
					bg: "#6959EA!",
				},
			},
			_active: {
				bg: "#6959EA",
			},
		},
	},
};
