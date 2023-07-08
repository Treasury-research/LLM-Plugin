import { CopyIcon } from "@chakra-ui/icons";
import {
	useBoolean,
	Icon,
	Tooltip,
	useClipboard,
	HStack,
} from "@chakra-ui/react";
import { BiCopy } from "react-icons/bi";

export const Copy = ({
	text,
	boxSize,
	color,
}: {
	text: string;
	boxSize?: number;
	color?: string;
}) => {
	const { onCopy, value, setValue, hasCopied } = useClipboard("");
	const [isMouseOver, setIsMouseOver] = useBoolean(false);

	return (
		<Tooltip
			placement="top"
			fontSize="xs"
			isOpen={hasCopied || isMouseOver}
			label={hasCopied ? "Copied!" : "Copy"}
			hasArrow
		>
			<HStack
				ml={1}
				onMouseOver={setIsMouseOver.on}
				onMouseLeave={setIsMouseOver.off}
				cursor="pointer"
			>
				<Icon
					as={BiCopy}
					color={color || "text.blue"}
					boxSize={boxSize || 4}
					onClick={() => {
						setValue(text);
						onCopy();
					}}
				/>
			</HStack>
		</Tooltip>
	);
};
