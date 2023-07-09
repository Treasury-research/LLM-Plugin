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
			<Text fontSize="sm" color="gray.500" fontWeight="semibold" mt={1}>
				{message || "No Data"}
			</Text>
		</VStack>
	);
};

export default Empty;
