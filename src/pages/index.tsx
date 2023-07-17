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
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { deepClone } from "utils/common";
import { VSEditor } from "components/VSEditor";
import MarkdownRenderer from 'components/MarkdownRenderer';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BeatLoader from "react-spinners/BeatLoader";
import Empty from "components/Empty";
import { WarningIcon } from "@chakra-ui/icons";
import { v4 as uuidv4 } from 'uuid';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { GrClearOption } from 'react-icons/gr'

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

let list: any = [];
export default function Home() {
	const toast = useToast();
	const pageView = useRef<HTMLDivElement>(null);
	const nl_inputRef = useRef<any>(null);
	const [chat_id, setChat_id] = useState(uuidv4());

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [chatList, setChatList] = useState<any>([]);
	const [nl_input, setNl_input] = useState("");
	const [isLoading, setIsLoading] = useBoolean(false);
	const [chatCode, setChatCode] = useState("");
	const [chatListLength, setChatListLength] = useState(chatList.length);
	const [isComposition, setIsComposition] = useState(false); // 是否合成输入

	const addChat = useCallback(
		() => {
			const code = new Date().getTime().toString();
			setChatCode(code);
			setChatList([
				...chatList,
				{
					input: nl_input.trim(),
					chatId: chat_id.trim(),
					chatCode: code,
				}
			])
		},
		[chatList, chat_id, nl_input],
	)
	
	const visualizeHandler = useCallback(
		async (sqlOri: string, index: number) => {
			console.log(345, chatList);
			try {
				let listClone = deepClone(chatList);
				listClone[index].visualizeLoading = true;
				setChatList(listClone);
				const result: any = await axios.get("https://knn3-gateway.knn3.xyz/nl/api/insight", {
					params: { chat_id, sql: sqlOri }
				});
				listClone = deepClone(chatList);
				listClone[index].visualizeCode = result.data.code;
				listClone[index].visualizeDec = result.data.description;
				listClone[index].visualizeLoading = false;
				setChatList(listClone);
			} catch (error: any) {
				const listClone = deepClone(chatList);
				listClone[index].visualizeError = error.message;
				listClone[index].visualizeLoading = false;
				setChatList(listClone);
			}
		},
		[chatList, chat_id],
	)

	const onSend = useCallback(async() => {
		setIsLoading.on();
		try {
			const result = await axios.get("/api/chat", {
				params: { chat_id: chat_id.trim(), nl_input: chatList[chatList.length-1].input },
			});

			if (result.status === 200) {
				setChatList([
					...chatList,
					{
						...result.data,
						visualizeCode: '',
						visualizeDec: '',
						visualizeError: '',
						visualizeLoading: false
					}
				])
			}
			setIsLoading.off();
		} catch (error: any) {
			setChatList([...chatList, { error: error.message || "Send message error!" }]);
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
	},
	[chatList, chat_id, setIsLoading, toast]
	)

	useEffect(() => {
		if(nl_inputRef.current) nl_inputRef.current.focus();
	}, [nl_inputRef])

	useEffect(() => {
		if(pageView.current) {
			pageView.current.scrollTop = pageView.current.scrollHeight;
		}
		setChatListLength(chatList.length);
	}, [chatList]);

	useEffect(() => {
		if(chatListLength %2 ===1) onSend();
	}, [chatListLength])

	const iframeErrHandle = useCallback(
		(err: any, index: number) => {
			let listClone = deepClone(chatList);
			listClone[index].visualizeError = err;
		},
		[chatList],
	)
	
	
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
				<VStack
					h="calc(100% - 80px)"
					w="full"
					overflowY="scroll"
					justify="flex-start"
					alignItems="flex-end"
					spacing={3}
					backgroundColor="#fff"
					padding={6}
					borderRadius={10}
					ref={pageView}
				>
					{chatList.length === 0 && (
						<Box h="calc(100% - 80px)" w="full" backgroundColor="#fff">
							<Empty message="No chat content" />
						</Box>
					)}
					{chatList &&
						chatList.map((item: any, index: number) => {
							return (
								<>
									{item.chatId ? (
										<>
											<Box
												key={index}
												bg="gray.200"
												px={4}
												py={2}
												borderRadius={5}
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
										<Flex w="full" justify="flex-start" key={index}>
											<Box
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
										<Box key={index} w="full" py={2} borderRadius={3}>
											<VStack
												bg="gray.200"
												w="calc(100% - 60px)"
												px={4}
												py={4}
												alignItems="flex-start"
												spacing={3}
												borderRadius={10}
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

												<Box w="full">
													<div data-color-mode="dark" className="relative bg-white">
														<MDEditor value={item.sql} hideToolbar={true} preview="preview" height={400} className="pt-8 pb-6 box-content" />
														<div className="flex absolute top-2 right-4 text-[14px] font-medium gap-2 items-center">
															<span className="font-normal">sql</span>
															<Button isLoading={item.visualizeLoading} loadingText="visualize" size="xs" onClick={() => {
																if(!item.visualizeCode) {
																	visualizeHandler(item.sqlOri, index)
																}
															}}>visualize</Button>
														</div>
													</div>
													{ item.visualizeDec ? <div className="text-[14px] font-medium py-2">{item.visualizeDec}</div> : null}
													{ item.visualizeCode ? <iframe srcDoc={item.visualizeCode} width="100%" height="480px" onError={(err) => iframeErrHandle(err, index)}></iframe> : null }
													{ item.visualizeLoading ? <HStack w="full" h="30px" justify="center">
															<BeatLoader size={8} />
														</HStack> : null
													}
												</Box>
											</VStack>
										</Box>
									)}
								</>
							);
						})}
				</VStack>
				<Box w="900px" pos="fixed" bottom="20px">
					<InputGroup lineHeight="50px" cursor="pointer">
						<InputLeftAddon h="50px" onClick={() => {
							setChatList([]);
							setChat_id(uuidv4());
						}}>
							<GrClearOption />
						</InputLeftAddon>
						<Input
							ref={nl_inputRef}
							placeholder="What data do you need"
							h="50px"
							value={nl_input}
							onChange={(e) => {
								setNl_input(e.target.value);
							}}
							onCompositionStart={() => setIsComposition(true)}
							onCompositionEnd={() => setIsComposition(false)}
							onKeyDown={(e) => {
								if (!e.shiftKey && e.key === "Enter") {
									e.preventDefault();
									if (nl_input) {
										if(!isComposition) {
											addChat();
											setNl_input('');
										}
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
										if (nl_input) {
											addChat();
											setNl_input('')
										}
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
