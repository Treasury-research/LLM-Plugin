import {
	Box,
	Flex,
	Text,
	useToast,
	Input,
	VStack,
	HStack,
	Button,
	Icon,
	Container,
	InputGroup,
	InputLeftAddon,
	InputRightElement,
	useDisclosure,
	useBoolean,
	Spinner,
	FormErrorIcon,
} from "@chakra-ui/react";
import Head from "next/head";
import { MdSend } from "react-icons/md";
import { BaseModal } from "components/BaseModal";
import { useEffect, useState } from "react";
import axios from "axios";
import { deepClone } from "utils/common";
import { VSEditor } from "components/VSEditor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BeatLoader from "react-spinners/BeatLoader";
import Empty from "components/Empty";
import { WarningIcon } from "@chakra-ui/icons";

// const url = "https://knn3-gateway.knn3.xyz/nl/api/chat";
const url = "http://54.203.56.186:30018/api/chat";
const list: any = [];

export default function Home() {
	const toast = useToast();
	const [chat_id, setChat_id] = useState("001");

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [chatList, setChatList] = useState<any>([]);
	const [nl_input, setNl_input] = useState(
		"give me the top 50 LENS engagers order by score"
	);
	const [isLoading, setIsLoading] = useBoolean(false);
	const [chatCode, setChatCode] = useState("");

	console.log(chatCode, chatList);

	const addChat = () => {
		const code = new Date().getTime().toString();
		setChatCode(code);
		list.push({
			input: nl_input.trim(),
			chatId: chat_id.trim(),
			chatCode: code,
		});
	};

	const onSend = async () => {
		setIsLoading.on();

		try {
			const result = await axios.get(url, {
				params: { chat_id: chat_id.trim(), nl_input: nl_input.trim() },
				headers: {
					"auth-key": "44a6a613-4e21-478b-a909-ab653c9d39df",
				},
			});

			if (result.status === 200) {
				list.push(result.data);
			}

			setIsLoading.off();
		} catch (error: any) {
			list.push({ error: error.message || "Send message error!" });
			setIsLoading.off();
			toast({
				title: "Send Failed!",
				position: "top-right",
				description: error.message || "Send message error!",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}

		// console.log(result);
	};

	useEffect(() => {
		setChatList(list);
	}, [list]);

	return (
		<Flex w="full" h="full" justify="center">
			<Head>
				<title>LLM Plugin</title>
				<meta name="description" content="KNN3 Network" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
				/>
				<link rel="icon" href="/favicon.png" />
			</Head>

			<Flex
				flexDir="column"
				alignItems="center"
				w="900px"
				h="full"
				pos="relative"
				py={5}
			>
				{chatList.length === 0 && (
					<Box h="calc(100% - 80px)" w="full">
						<Empty message="No chat content" />
					</Box>
				)}

				<VStack
					h="calc(100% - 80px)"
					w="full"
					overflowY="scroll"
					justify="flex-start"
					alignItems="flex-end"
					spacing={3}
				>
					{chatList &&
						chatList.map((item: any, index: number) => {
							return (
								<>
									{item.chatId ? (
										<>
											<Box
												key={index}
												bg="gray.100"
												px={4}
												py={2}
												borderRadius={3}
												maxW="500px"
											>
												<Text>{item.input}</Text>
											</Box>

											{chatCode === item.chatCode && isLoading && (
												<HStack w="full" h="30px" justify="center" mt={-3}>
													<BeatLoader size={8} />
												</HStack>
											)}
										</>
									) : item.error ? (
										<Flex w="full" justify="flex-start">
											<Box
												key={index}
												bg="red.200"
												px={4}
												py={2}
												borderRadius={3}
												maxW="500px"
											>
												<HStack>
													<WarningIcon />
													<Text>{item.error}</Text>
												</HStack>
											</Box>
										</Flex>
									) : (
										<Box key={index} w="full" px={4} py={2} borderRadius={3}>
											<VStack
												bg="gray.100"
												key={index}
												w="calc(100% - 60px)"
												px={4}
												py={4}
												alignItems="flex-start"
												spacing={3}
											>
												<Box
													w="100%"
													overflowX="scroll"
													border="solid 1px #ccc"
													borderRadius={3}
													px={0}
													className="md"
												>
													<ReactMarkdown remarkPlugins={[remarkGfm]}>
														{item.content}
													</ReactMarkdown>
												</Box>

												<Box w="full" h="300px">
													<VSEditor
														code={item.sql}
														width="100%"
														height="260px"
														fontSize={14}
														language="sql"
														readOnly={false}
														lineNumbers="off"
													/>
												</Box>
											</VStack>
										</Box>
									)}
								</>
							);
						})}
				</VStack>
				<Box w="800px" pos="fixed" bottom="20px">
					<InputGroup lineHeight="50px" cursor="pointer">
						<InputLeftAddon h="50px" onClick={onOpen}>
							<Text
								color="spxGray.200"
								width="100px"
								overflow="hidden"
								whiteSpace="nowrap"
								textOverflow="ellipsis"
								fontWeight="semibold"
							>
								{`ChatID: ${chat_id}`}
							</Text>
						</InputLeftAddon>
						<Input
							placeholder="What data do you need"
							h="50px"
							value={nl_input}
							onChange={(e) => {
								setNl_input(e.target.value);
							}}
							onKeyDown={(e) => {
								if (!e.shiftKey && e.key === "Enter") {
									e.preventDefault();
									if (nl_input) {
										addChat();
										onSend();
									}
								}
							}}
						/>
						<InputRightElement h="50px">
							{isLoading ? (
								<Spinner size="sm" />
							) : (
								<Icon
									as={MdSend}
									color="blue.500"
									boxSize={6}
									onClick={() => {
										addChat();
										onSend();
									}}
								/>
							)}
						</InputRightElement>
					</InputGroup>
				</Box>
			</Flex>
			<BaseModal isOpen={isOpen} onClose={onClose} title="Chat ID">
				<p className="text-sm mt-2">
					<Input
						placeholder="Enter Chat ID"
						value={chat_id}
						onChange={(e) => {
							setChat_id(e.target.value.trim());
						}}
					/>
				</p>
				<Box mt={5} textAlign="right" width="350px">
					<Button variant="bluePrimary" size="sm" onClick={() => onClose()}>
						Continue
					</Button>
				</Box>
			</BaseModal>
		</Flex>
	);
}
