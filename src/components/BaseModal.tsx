import {
	Modal,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalContent,
	ModalOverlay,
} from "@chakra-ui/react";
import type React from "react";

export type BaseModalProps = {
	isOpen: boolean;
	onClose: VoidFunction;
	isCentered?: boolean;
	children?: React.ReactElement | React.ReactElement[];
	maxW?: number | string;
	title?: string | React.ReactElement;
};

export const BaseModal: React.FC<BaseModalProps> = (props) => {
	const { isOpen, onClose, maxW, children, isCentered, title } = props;

	return (
		<Modal
			isOpen={isOpen}
			isCentered={isCentered !== undefined ? isCentered : true}
			motionPreset="slideInBottom"
			onClose={onClose}
		>
			<ModalOverlay className="transition" />
			<ModalContent
				maxW={maxW}
				w="auto"
				borderRadius="md"
				bg="spxGray.900"
				color="text.black"
			>
				{title ? (
					<ModalHeader
						maxW="calc(100% - 60px)"
						whiteSpace="nowrap"
						textOverflow="ellipsis"
						overflow="hidden"
						fontSize="md"
						fontWeight="semibold"
						pb={1}
					>
						{title}
					</ModalHeader>
				) : null}
				<ModalCloseButton
					color="text.black"
					borderRadius="0"
					w="20px"
					h="20px"
					fontSize="12px"
				/>
				<ModalBody pb={6}>{children}</ModalBody>
			</ModalContent>
		</Modal>
	);
};
