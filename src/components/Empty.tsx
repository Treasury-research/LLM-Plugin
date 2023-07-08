import { VStack, Image, Text } from "@chakra-ui/react";

const Empty = ({
	message,
	height,
}: {
	message?: string;
	height?: string | number;
}) => {
	return (
		<VStack h={height || "90%"} justifyContent="center">
			<Image src="/images/empty.png" opacity={0.4} width="48px" />
			<Text fontSize="sm" color="spxGrayText.500" fontWeight="semibold">
				{message || "No Data"}
			</Text>
		</VStack>
	);
};

export default Empty;
